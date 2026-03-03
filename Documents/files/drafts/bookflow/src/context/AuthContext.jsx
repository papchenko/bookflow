import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (firebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      if (data.premiumUntil?.toDate) {
        const expiry = data.premiumUntil.toDate();

        if (expiry < new Date() && data.taker === true) {
          await updateDoc(userRef, {
            taker: false,
            premiumUntil: null,
          });
          data.taker = false;
          data.premiumUntil = null;
        }
      }

      setUserProfile(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            name: firebaseUser.displayName || "",
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || "",
            taker: false,
            premiumUntil: null,
            lastAvatarChange: null,
            lastNicknameChange: null,
            role: "user",
            createdAt: serverTimestamp(),
          });
        }

        await fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userRef = doc(db, "users", res.user.uid);

    await setDoc(userRef, {
      name: name,
      email: email,
      photoURL: "",
      taker: false,
      premiumUntil: null,
      lastAvatarChange: null,
      lastNicknameChange: null,
      role: "user",
      createdAt: serverTimestamp(),
    });

    return res;
  };

  const logout = () => signOut(auth);

  const refreshUser = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};