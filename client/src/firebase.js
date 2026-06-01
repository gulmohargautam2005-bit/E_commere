// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxHFZX_p1my6Q5Ox1lB-kERuUKsYIjw_U",
  authDomain: "website-93a2b.firebaseapp.com",
  projectId: "website-93a2b",
  storageBucket: "website-93a2b.firebasestorage.app",
  messagingSenderId: "939668142228",
  appId: "1:939668142228:web:8f66b455ba3878834d1c81",
  measurementId: "G-83C2P80WRJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();