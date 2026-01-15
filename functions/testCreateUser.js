// 1️⃣ Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

// 2️⃣ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAdIUF9wklnnSfIAeGlA3aw8UVCj0H0Vig",
  authDomain: "the-apex-app.firebaseapp.com",
  projectId: "the-apex-app",
  storageBucket: "the-apex-app.firebasestorage.app",
  messagingSenderId: "908808650183",
  appId: "1:908808650183:web:8112f608dd48c8140e6de2"
};

// 3️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4️⃣ Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// For Callable Functions, we generally get the instance without specifying the host here.
// The connectFunctionsEmulator call below handles the host/port setup.
const functions = getFunctions(app); // <-- FIX 1: Removed hardcoded port from getFunctions

// 5️⃣ Connect to local emulators ONLY for development
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  // Keeping Firestore port at 8080 as per your original config
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  
  // 🔥 FIX 2: Changing Functions port from 5003 to the active port 8783
  connectFunctionsEmulator(functions, "127.0.0.1", 8783); 
  
  console.log("🔥 Connected to Firebase Emulators (Functions on 8783)");
}

// 6️⃣ Define callable functions
const loginApexUserCallable = httpsCallable(functions, "loginApexUser");
const createApexUserCallable = httpsCallable(functions, "createApexUser");

// 7️⃣ Login wrapper
export async function loginUser(email, password) {
  if (!email || !password) throw new Error("Email and password are required.");
  // The backend function is now fixed to correctly extract the email/password
  const result = await loginApexUserCallable({ email: email, password: password });
  return result.data;
}

// 8️⃣ Sign-up wrapper
export async function createUser(firstName, lastName, email, password, recaptchaResponse) {
  if (!email || !password) throw new Error("Email and password are required.");
  const result = await createApexUserCallable({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    recaptchaResponse: recaptchaResponse
  });
  return result.data;
}


// 9️⃣ Export services
export { app, auth, db, functions };
