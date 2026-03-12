import { createContext, useContext, useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        setFavorites(snap.docs.map(doc => ({ id: doc.id, bookId: doc.data().bookId })));
      } catch (error) {
        console.error(error);
        toast.error("Error fetching favorites");
      }
    };

    fetchFavorites();
  }, [user]);

  const addFavorite = async (bookId) => {
    if (!user) return toast.error("Login to add favorite");
    try {
      const ref = await addDoc(collection(db, "favorites"), { userId: user.uid, bookId, createdAt: serverTimestamp() });
      setFavorites(prev => [...prev, { id: ref.id, bookId }]);
      toast.success("Added to favorites");
    } catch (error) {
      console.error(error);
      toast.error("Error adding favorite");
    }
  };

  const removeFavorite = async (bookId) => {
    if (!user) return;
    try {
      const fav = favorites.find(f => f.bookId === bookId);
      if (!fav) return;
      await deleteDoc(doc(db, "favorites", fav.id));
      setFavorites(prev => prev.filter(f => f.bookId !== bookId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error(error);
      toast.error("Error removing favorite");
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);