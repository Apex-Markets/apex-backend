import * as functions from "firebase-functions";
import fetch from "node-fetch";
import admin from "firebase-admin";
import dotenv from "dotenv"; 


dotenv.config();

admin.initializeApp();

export const createApexUser = functions.https.onCall(async (data, context) => {
  const { firstName, lastName, email, password, recaptchaResponse } = data;

  // 1️⃣ Check if token is missing
  if (!recaptchaResponse) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "reCAPTCHA token missing"
    );
  }

  // 2️⃣ Verify the reCAPTCHA token with Google
  const secretKey = process.env.RECAPTCHA_SECRET;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

  const response = await fetch(verifyUrl, { method: "POST" });
  const verification = await response.json();

  console.log("reCAPTCHA verification result:", verification);

  if (!verification.success) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "reCAPTCHA verification failed"
    );
  }

  // 3️⃣ Create user in Firebase Auth
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: `${firstName} ${lastName}`,
  });

  console.log("User created:", userRecord.uid);

  return { uid: userRecord.uid, message: "User created successfully!" };
});
