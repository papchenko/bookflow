import { useEffect, useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { toast } from "react-toastify";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const FavoritesModal = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");

    return () => document.body.classList.remove("no-scroll");
  }, [isOpen]);

  useEffect(() => {
    if (!user || !isOpen) return;

    const fetchFavorites = async () => {
      try {
        const favQuery = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid)
        );

        const favSnap = await getDocs(favQuery);

        const favs = favSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setFavorites(favs);

        const bookPromises = favs.map(fav =>
          getDoc(doc(db, "books", fav.bookId))
        );

        const bookSnaps = await Promise.all(bookPromises);

        const books = bookSnaps
          .filter(snap => snap.exists())
          .map(snap => ({
            id: snap.id,
            ...snap.data()
          }));

        setBooksData(books);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching favorites");
      }
    };

    fetchFavorites();
  }, [user, isOpen]);

  const removeFavorite = async (favId, bookId) => {
    try {
      await deleteDoc(doc(db, "favorites", favId));

      setFavorites(prev => prev.filter(f => f.id !== favId));
      setBooksData(prev => prev.filter(b => b.id !== bookId));
    } catch (error) {
      console.error(error);
      toast.error("Error removing favorite");
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleAddToCart = async (book) => {
    if (!user) {
      toast.error("Login first");
      return;
    }

    addToCart({
      ...book,
      type: "book",
      purchaseType: "full",
      quantity: 1
    });

    const fav = favorites.find(f => f.bookId === book.id);

    if (fav) {
      await removeFavorite(fav.id, book.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end md:pt-9"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full h-full h-[100vh] md:h-[90vh] md:my-auto md:mr-6 md:max-w-xl lg:max-w-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {booksData.length > 0 ? "Your Favorites" : "Favorites is Empty"}
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-full"
          >
            <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* CONTENT */}

        <div className="flex-grow overflow-y-auto p-4">

          {booksData.length === 0 ? (

            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You have no favorite books.
              </p>

              <button
                onClick={() => {
                  navigate("/books");
                  setIsOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full"
              >
                Browse Books
              </button>
            </div>

          ) : (

            <div className="space-y-4">

              {booksData.map(book => {

                const fav = favorites.find(f => f.bookId === book.id);

                return (

                  <div
                    key={book.id}
                    className="flex items-center gap-1 p-1 border-b"
                  >

                    <img
                      src={book.images?.[0]}
                      alt={book.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    <div
                      className="flex-grow cursor-pointer"
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/books?bookId=${book.id}`);
                      }}
                    >
                      <h3 className="font-bold text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                        {book.name}
                      </h3>
                      <p className="text-gray-700 dark:text-white font-medium">
                        {book.price} ₴
                      </p>
                      <p className="text-sm text-green-500">
                       <span className="text-gray-700 dark:text-white">Lending Price:</span> {book.priceLending} ₴
                      </p>
                    </div>
                    <div className="flex flex-row gap-3">
                      <button
                        onClick={() => removeFavorite(fav.id, book.id)}
                        className="text-red-500 p-0"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleAddToCart(book)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-full text-sm flex-shrink-0"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;