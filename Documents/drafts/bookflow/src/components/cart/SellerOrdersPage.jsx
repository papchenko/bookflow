import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SellerOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("sellerIds", "array-contains", user.uid),
      where("status", "==", "accepted")
    );

    const unsub = onSnapshot(q, (snap) => {
      const sellerOrders = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(sellerOrders);
    });

    return () => unsub();
  }, [user]);

  if (!user) return <p className="p-4">Login required</p>;

  return (
    <div className="md:py-6 bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] dark:bg-gradient-to-br dark:from-[#111018] dark:via-[#1b1a2b] dark:to-[#1c2a3a] text-gray-600 dark:text-white">
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your accepted orders</h2>

      {orders.length === 0 ? (
        <p>No orders accepted</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="border p-3 rounded hover:shadow cursor-pointer"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <p><b>Order number:</b> {order.id}</p>
              <p><b>Buyer:</b> {order.shipping?.fullName}</p>
              <p><b>Sum:</b> {order.total}₴</p>
              <p><b>Status:</b> Accepted</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default SellerOrdersPage;