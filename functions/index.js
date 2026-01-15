const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const {
  generateAssertionOptions,
  verifyAssertionResponse,
  generateRegistrationOptions
} = require('@simplewebauthn/server');

functions.setGlobalOptions({ maxInstances: 10 });
admin.initializeApp();
const db = admin.firestore();
// ✅ FIX 1: Explicitly define FieldValue for cleaner and more reliable access
const FieldValue = admin.firestore.FieldValue; 


// Detect emulator
const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

// Add this after isEmulator
const ORIGIN = isEmulator
  ? "http://localhost:5000"   // your local frontend URL
  : "https://www.theapexinvestor.com";

const RPID = isEmulator
  ? "localhost"
  : "theapexinvestor.com";


// Your keys (as you provided)
const RECAPTCHA_SECRET_KEY = "6LcuiuYrAAAAABNQRgpVPq7eH310aVejZaZwpr94";
const FIREBASE_API_KEY = "AIzaSyDj6e5EA4CqNxBkBT4hJpwqnZFUZVjwhUQ";
const SNAPTRADE_CLIENT_ID = "THE-APEX-INVESTOR-TEST-LCWOQ";
const SNAPTRADE_CONSUMER_KEY = "cL3Joma3IF2OygJLOcKvTezOVuVLhMtOPexMkxDrGX0WyZIl3e";
const SNAPTRADE_BASE_URL = "https://api.snaptrade.com/api/v1";

// ----------------- 1. SIGN-UP -----------------
exports.createApexUser = functions.https.onCall(async (data) => {
  const { firstName, lastName, email, password, recaptchaResponse } = data;

  if (!recaptchaResponse && !isEmulator) {
    throw new functions.https.HttpsError("unauthenticated", "reCAPTCHA token missing.");
  }

  if (!isEmulator) {
    const params = new URLSearchParams({ secret: RECAPTCHA_SECRET_KEY, response: recaptchaResponse });
    const { data: recaptchaData } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!recaptchaData.success || (recaptchaData.score && recaptchaData.score < 0.5)) {
      throw new functions.https.HttpsError("permission-denied", "reCAPTCHA verification failed.");
    }
  } else {
    console.log("Emulator: skipping reCAPTCHA verification");
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: `${firstName} ${lastName}` });
    await db.doc(`users/${userRecord.uid}`).set({
      firstName,
      lastName,
      email,
      // Using the explicitly defined FieldValue here too
      createdAt: FieldValue.serverTimestamp()
    });
    return { message: "User created", uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError("invalid-argument", error.message);
  }
});

// ----------------- 2. LOGIN (ADDED DEBUG LOGS) -----------------
exports.loginApexUser = functions.https.onCall(async (data, context) => {
  const payload = data.data || {};
  const email = payload.email;
  const password = payload.password;

  console.log("LOGIN DEBUG: Received data:", data);

  if (!email || !password) {
    throw new functions.https.HttpsError("invalid-argument", "Missing email or password.");
  }

  try {
    let uid;

    if (isEmulator) {
      // Emulator flow
      try {
        const user = await admin.auth().getUserByEmail(email);
        uid = user.uid;
        console.log(`Emulator: Found user ${email} (UID: ${uid})`);
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          const tempUser = await admin.auth().createUser({ email, password });
          uid = tempUser.uid;
          console.log(`Emulator: Created temporary user (UID: ${uid})`);
          await db.doc(`users/${uid}`).set({
            email,
            createdAt: FieldValue.serverTimestamp(),
            isTemporaryEmulatorUser: true
          }, { merge: true });
        } else {
          throw err;
        }
      }
      const customToken = await admin.auth().createCustomToken(uid);
      return { message: "Login successful (emulator)", customToken };
    } else {
      // Production flow: Firebase REST API
      let response;
      try {
        response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
          { email, password, returnSecureToken: true }
        );
      } catch (axiosErr) {
        console.error("Axios login error:", axiosErr.response?.data || axiosErr);
        const errMsg = axiosErr.response?.data?.error?.message;
        if (errMsg === "EMAIL_NOT_FOUND" || errMsg === "INVALID_PASSWORD") {
          throw new functions.https.HttpsError("unauthenticated", "Incorrect email or password.");
        }
        throw new functions.https.HttpsError("internal", `Firebase Auth REST error: ${errMsg || axiosErr.message}`);
      }

      uid = response.data.localId;
      if (!uid) {
        console.error("No UID returned from Firebase Auth REST:", response.data);
        throw new functions.https.HttpsError("internal", "No UID returned from Firebase Auth.");
      }

      const customToken = await admin.auth().createCustomToken(uid);
      return { message: "Login successful", customToken };
    }
  } catch (error) {
    console.error("LoginApexUser final catch:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", `Unexpected server error: ${error.message}`);
  }
});



// ----------------- 3. LINK BROKERAGE -----------------
exports.linkBrokerage = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Must be authenticated.");

  const userId = context.auth.uid;

  try {
    await axios.post(`${SNAPTRADE_BASE_URL}/snaptrade/registerUser`, { userId }, {
      headers: { "client-id": SNAPTRADE_CLIENT_ID, "consumer-key": SNAPTRADE_CONSUMER_KEY }
    });

    const loginResponse = await axios.get(`${SNAPTRADE_BASE_URL}/snaptrade/login`, {
      params: { userId, redirectURI: "https://theapexinvestor.net/linked" },
      headers: { "client-id": SNAPTRADE_CLIENT_ID, "consumer-key": SNAPTRADE_CONSUMER_KEY }
    });

    return { url: loginResponse.data.url, snaptradeUserId: userId };
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new functions.https.HttpsError("internal", "Linking failed.");
  }
});

// ----------------- 4. WEBAUTHN -----------------
exports.getAssertionChallenge = functions.https.onCall(async (data) => {
  const { email } = data;
  if (!email) throw new functions.https.HttpsError("invalid-argument", "Email required.");

  const userDoc = await db.collection("users").doc(email).get();
  if (!userDoc.exists) throw new functions.https.HttpsError("not-found", "User not found.");

  const user = userDoc.data();
  const allowCredentials = (user.credentials || []).map(cred => ({
    id: Buffer.from(cred.id, "base64"),
    type: "public-key",
    transports: cred.transports || ["usb","ble","nfc"]
  }));

  const options = generateAssertionOptions({ allowCredentials, userVerification: "preferred" });
  // Using FieldValue for update as well
  await db.collection("users").doc(email).update({ currentChallenge: options.challenge });

  return { ...options, allowCredentials: options.allowCredentials.map(c => ({ ...c, id: c.id.toString("base64") })) };
});

exports.verifyAssertion = functions.https.onCall(async (data) => {
  const { email, assertion } = data;
  if (!email || !assertion) throw new functions.https.HttpsError("invalid-argument", "Email and assertion required.");

  const userDoc = await db.collection("users").doc(email).get();
  if (!userDoc.exists) throw new functions.https.HttpsError("not-found", "User not found.");

  const user = userDoc.data();
  const credential = {
    id: assertion.id,
    rawId: Buffer.from(assertion.rawId, "base64"),
    response: {
      authenticatorData: Buffer.from(assertion.response.authenticatorData, "base64"),
      clientDataJSON: Buffer.from(assertion.response.clientDataJSON, "base64"),
      signature: Buffer.from(assertion.response.signature, "base64"),
      userHandle: assertion.response.userHandle ? Buffer.from(assertion.response.userHandle, "base64") : null
    },
    type: assertion.type
  };

  const verification = await verifyAssertionResponse({
  credential,
  expectedChallenge: user.currentChallenge,
  expectedOrigin: ORIGIN,
  expectedRPID: RPID,
  authenticator: user.credentials?.[0]
});


  if (!verification.verified) throw new functions.https.HttpsError("permission-denied", "Assertion verification failed.");

  const customToken = await admin.auth().createCustomToken(user.uid);
  return { customToken };
});

exports.generateRegistrationOptions = functions.https.onCall(async (data) => {
  const { email } = data;
  if (!email) throw new functions.https.HttpsError("invalid-argument", "Email required.");

  const userDoc = await db.collection("users").doc(email).get();
  if (!userDoc.exists) throw new functions.https.HttpsError("not-found", "User not found.");

  const user = userDoc.data();
  const userId = user.uid || email;
  const options = generateRegistrationOptions({
  rpName: "The Apex Investor",
  rpID: RPID,
  userID: userId,
  userName: email,
  attestationType: "none",
  authenticatorSelection: { userVerification: "preferred" }
});


  await db.collection("users").doc(email).update({ currentChallenge: options.challenge });
  return { ...options, challenge: options.challenge };
});
// ----------------- 5. SCHWAB OAUTH CALLBACK ENDPOINT -----------------
// This is for Schwab redirect: https://www.theapexinvestor.com/oauth/callback/schwab
exports.schwabOAuthCallback = functions.https.onRequest(async (req, res) => {
  const code = req.query.code;
  console.log("Schwab Callback HIT!");

  if (!code) {
    return res.status(400).send('Missing code parameter from Schwab.');
  }

  // TODO: Exchange code at Schwab's token endpoint, save tokens to Firestore/user profile.
  // Example:
  // const tokenResp = await axios.post('https://api.schwab.com/v1/oauth2/token', {...});
  // await db.doc(`users/${CURRENT_USER_ID}`).set({ schwabTokens: tokenResp.data }, { merge: true });

  // Tell user to return to the app, or trigger frontend polling
  res.send('Schwab account linked! You may now return to the app.');
});