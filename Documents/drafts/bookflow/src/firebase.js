import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrvEC-110evUFkvEeRYO0FnqpzVinxNDc",
  authDomain: "bookflow-c00db.firebaseapp.com",
  projectId: "bookflow-c00db",
  storageBucket: "bookflow-c00db.firebasestorage.app",
  messagingSenderId: "547402091853",
  appId: "1:547402091853:web:b8cfc3dde0a5aeda94fb04"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();