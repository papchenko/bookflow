import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Takers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), where("taker", "==", true));
      const snapshot = await getDocs(q);
      const usersData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const userSnap = await getDoc(doc(db, "users", docSnap.id));
          const userData = userSnap.exists() ? userSnap.data() : {};
          const booksSnap = await getDocs(
            query(collection(db, "books"), where("sellerId", "==", docSnap.id)),
          );
          const books = booksSnap.docs.map((b) => ({
            id: b.id,
            name: b.data().name,
          }));
          return {
            id: docSnap.id,
            name: userData.name || "Unknown",
            photoURL: userData.photoURL || null,
            wishlist: userData.wishlist || "",
            books,
            sellerStats: userData.sellerStats || {
              completedOrders: 0,
              ratingAverage: 0,
              ratingCount: 0,
            },
          };
        }),
      );
      setUsers(usersData);
    };
    fetchUsers();
  }, []);
  return (
    <div className="py-12 bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] dark:from-[#111018] dark:via-[#1b1a2b] dark:to-[#1c2a3a] text-gray-600 dark:text-white">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          All Takers
        </h2>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-4 md:mx-0">
          {" "}
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/takers/${user.id}`)}
              className="p-4 border rounded-md bg-white dark:bg-gray-900 
                        border-gray-100 dark:border-gray-500 
                        flex flex-col items-center
                        cursor-pointer hover:shadow-lg 
                        hover:scale-[1.02] transition"
            >
              {" "}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-12 h-12 rounded-full mb-2 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-bold text-lg mb-2">
                  {" "}
                  {user.name?.charAt(0)?.toUpperCase()}{" "}
                </div>
              )}{" "}
              <h3 className="font-bold text-lg">{user.name}</h3>{" "}
              <p>Completed Orders: {user.sellerStats.completedOrders}</p>{" "}
              <p className="flex items-center gap-1">
                {" "}
                Rating:{" "}
                {user.sellerStats.ratingCount > 0
                  ? user.sellerStats.ratingAverage.toFixed(0)
                  : 0}{" "}
                <FaStar className="text-[var(--accept-color)]" />{" "}
              </p>{" "}
              <ul className="list-none ml-0 mt-2 text-lg">
                {" "}
                <span className="text-sm">Books:</span>{" "}
                {user.books.map((b) => (
                  <li key={b.id}>{b.name}</li>
                ))}{" "}
              </ul>{" "}
              {user.wishlist && (
                <div className="mt-3 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 text-sm text-gray-700 dark:text-gray-300">
                  {" "}
                  <span className="font-semibold block mb-1">
                    Wishlist:
                  </span>{" "}
                  <p className="whitespace-pre-line">{user.wishlist}</p>{" "}
                </div>
              )}{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Takers;