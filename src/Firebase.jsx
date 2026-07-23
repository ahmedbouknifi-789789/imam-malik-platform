import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIEH9Qm1t4g3LwKQKJ6M2RzQdZ3otIJ50",
  authDomain: "imam-malik-platform.firebaseapp.com",
  projectId: "imam-malik-platform",
  storageBucket: "imam-malik-platform.firebasestorage.app",
  messagingSenderId: "1027742844161",
  appId: "1:1027742844161:web:aed6bb5e37fe1662af4700",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);