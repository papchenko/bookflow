import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const BuyerNotifications = ({ isOpen }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "orders"),
      where("buyerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => order.buyerNotification?.status);
      setOrders(data);
    });

    return () => unsub();
  }, [user]);

  const markAsRead = async (order) => {
    if (order.buyerNotification?.read) return;
    try {
      await updateDoc(doc(db, "orders", order.id), {
        "buyerNotification.read": true
      });
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
      {orders.length === 0 && <p className="p-2 text-sm text-gray-500">No new messages</p>}
      {orders.map(order => (
        <div
          key={order.id}
          className={`border-b p-2 text-sm ${order.buyerNotification.read ? 'opacity-50' : ''}`}
          onClick={() => markAsRead(order)}
        >
          <p><b>Book:</b> {order.items?.[0]?.name} ({order.items?.[0]?.purchaseType === "rental" ? "Lending" : "Buying"})</p>
          <p><b>Status:</b> {order.buyerNotification.status === "accepted" ? "Accepted" : "Rejected"}</p>
          {order.buyerNotification.status === "accepted" && (
            <>
              <p><b>Seller card number:</b> {order.buyerNotification.cardNumber}</p>
              {order.buyerNotification.bankName && <p><b>Bank:</b> {order.buyerNotification.bankName}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default BuyerNotifications;