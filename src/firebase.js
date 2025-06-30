// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUTRpwem3G6aAGObwgXitf9Oqzh2AmS2w",
  authDomain: "car-bike-rental-a5b24.firebaseapp.com",
  projectId: "car-bike-rental-a5b24",
  storageBucket: "car-bike-rental-a5b24.firebasestorage.app",
  messagingSenderId: "781190667572",
  appId: "1:781190667572:web:b72fcf32169820a15dd961",
  measurementId: "G-KCJKTEYP99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); 
const storage = getStorage(app);
const db = getFirestore(app);
export { auth, googleProvider, RecaptchaVerifier,db,storage };