// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeereh6lZqNSNHGGMIGq7nzBIfGMBu7uw",
  authDomain: "officer-progress-90bfd.firebaseapp.com",
  databaseURL: "https://officer-progress-90bfd-default-rtdb.firebaseio.com",
  projectId: "officer-progress-90bfd",
  storageBucket: "officer-progress-90bfd.firebasestorage.app",
  messagingSenderId: "745097143170",
  appId: "1:745097143170:web:e00a25f702031cae48e59b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);