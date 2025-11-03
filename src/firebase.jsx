// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTJFHv8oiWV0P1aVFY9le7njvpmd4oz0c",
  authDomain: "golfcalendarproj.firebaseapp.com",
  projectId: "golfcalendarproj",
  storageBucket: "golfcalendarproj.firebasestorage.app",
  messagingSenderId: "943513421359",
  appId: "1:943513421359:web:7c0843ab48683bedef68da",
  measurementId: "G-G4RCWN5KBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };