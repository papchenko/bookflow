import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, increment } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const SellerNotifications = ({ isOpen }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "orders"),
      where("sellerIds", "array-contains", user.uid),
      where("status", "==", "pending")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(data);
    });

    return () => unsub();
  }, [user]);

  const handleAccept = async (orderId, orderData) => {
    try {
      if (orderData.status === "accepted") return;

      await updateDoc(doc(db, "orders", orderId), {
        status: "accepted",
        buyerNotification: {
          message: "Seller accepted your order",
          createdAt: new Date(),
        },
      });

      const totalAmount = orderData.items?.reduce(
        (sum, item) =>
          sum + (item.purchaseType === "rental" ? item.priceLending : item.price),
        0
      );

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        completedOrders: increment(1),
        totalSalesAmount: increment(totalAmount),
        salesRating: increment(1),
        ratingCount: increment(1),
        ratingAverage: increment(1),
        "sellerStats.completedOrders": increment(1),
        "sellerStats.totalSalesAmount": increment(totalAmount),
        "sellerStats.salesRating": increment(1),
        "sellerStats.ratingCount": increment(1),
        "sellerStats.ratingAverage": increment(1),
        "sellerStats.lastSale": new Date(),
        "sellerStats.lastSaleAmount": totalAmount,
      });

    } catch (error) {
      console.error("Accept error:", error);
    }
  };

  const handleReject = async (order) => {
    try {
      await updateDoc(doc(db, "orders", order.id), {
        status: "rejected",
        buyerNotification: { status: "rejected", read: false }
      });
      toast.info("Order rejected");
    } catch (error) {
      console.error(error);
      toast.error("Error rejecting order");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
      {notifications.length === 0 && <p className="p-2 text-sm text-gray-500">No new orders</p>}
      {notifications.map(order => (
        <div key={order.id} className="border-b p-2">
          <p className="text-sm font-medium">{order.items?.[0]?.name} ({order.items?.[0]?.purchaseType === "rental" ? "Lending" : "Buying"})</p>
          <div className="flex gap-2 mt-1">
            <button onClick={() => handleAccept(order)} className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs">Accept</button>
            <button onClick={() => handleReject(order)} className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerNotifications;