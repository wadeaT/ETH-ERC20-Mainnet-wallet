import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQZDg6WbYiNppGnvUN78D3EU_2doPkoVs",
  authDomain: "eth-wallet-62568.firebaseapp.com",
  projectId: "eth-wallet-62568",
  storageBucket: "eth-wallet-62568.appspot.com",
  messagingSenderId: "723772664008",
  appId: "1:723772664008:web:9ea21cfb6a6659ab9addfd",
  measurementId: "G-M8FYEQ2HG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
