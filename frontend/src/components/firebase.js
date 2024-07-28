// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, getMultiFactorResolver} from "firebase/auth" 
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsYxKylIL47oWcKv2WqewUzw5kDpmBH4I",
  authDomain: "sidham-76538.firebaseapp.com",
  projectId: "sidham-76538",
  storageBucket: "sidham-76538.appspot.com",
  messagingSenderId: "468235000802",
  appId: "1:468235000802:web:35ba30e8bcc1780d07b7bb",
  measurementId: "G-6MQFWP2JXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;