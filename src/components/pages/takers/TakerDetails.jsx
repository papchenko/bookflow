import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const TakerDetails = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const sellerSnap = await getDoc(doc(db, "users", id));
      if (sellerSnap.exists()) {
        setSeller(sellerSnap.data());
      }

      const booksSnap = await getDocs(
        query(collection(db, "books"), where("sellerId", "==", id))
      );

      setBooks(booksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, [id]);

  if (!seller) return <p>Loading...</p>;

  return (
    <div className="bg-gradient-to-br
        from-[#e0f2fe]
        via-[#bae6fd]
        to-[#7dd3fc]

        dark:bg-gradient-to-br
        dark:from-[#111018]
        dark:via-[#1b1a2b]
        dark:to-[#1c2a3a] 
        
        text-gray-600 dark:text-white">
    <div className="md:py-12 px-4 py-4 container mx-auto">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-gray-700 dark:text-white">

        <div className="flex items-center gap-4">
          {seller.photoURL ? (
            <img src={seller.photoURL} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl">
              {seller.name?.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{seller.name}</h2>
            <p>Completed Orders: {seller.sellerStats?.completedOrders}</p>
          </div>
        </div>

        {seller.wishlist && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h3 className="font-semibold mb-2">Wishlist:</h3>
            <p className="whitespace-pre-line">{seller.wishlist}</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Books</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {books.map(book => (
              <div key={book.id} className="border p-3 rounded-md">
                {book.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    </div>
  );
};

export default TakerDetails;