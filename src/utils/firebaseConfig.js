// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0jNyG6PActG1HYUakgkWNEhz0VFwFmXA",
  authDomain: "practica8-f4be4.firebaseapp.com",
  databaseURL: "https://practica8-f4be4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "practica8-f4be4",
  storageBucket: "practica8-f4be4.firebasestorage.app",
  messagingSenderId: "931970918543",
  appId: "1:931970918543:web:09403c4a1c82e0d9f768fa",
  measurementId: "G-H5QDF1FDMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
