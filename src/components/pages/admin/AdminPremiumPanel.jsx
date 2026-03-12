import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const AdminPremiumPanel = () => {
  const { userProfile } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userProfile?.role !== "admin") return;

    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "orders"));
      const pending = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => order.status === "pending");

      setOrders(pending);
    };

    fetchOrders();
  }, [userProfile]);

  const handleActivatePremium = async (order) => {
    const userRef = doc(db, "users", order.userId);
    const orderRef = doc(db, "orders", order.id);

    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const now = new Date();
    let baseDate = now;

    if (userData.premiumUntil?.toDate) {
      const current = userData.premiumUntil.toDate();
      if (current > now) baseDate = current;
    }

    const newPremium = new Date(
      baseDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    await updateDoc(userRef, {
      taker: true,
      premiumUntil: Timestamp.fromDate(newPremium),
    });

    await updateDoc(orderRef, {
      status: "completed",
    });

    setOrders(prev => prev.filter(o => o.id !== order.id));
    toast.success("Premium activated");
  };

  if (userProfile?.role !== "admin") {
    return <h2 style={{ padding: "40px" }}>Access denied</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Premium Panel</h1>

      {orders.length === 0 && <p>No pending orders</p>}

      {orders.map(order => (
        <div key={order.id} style={{ border: "1px solid #ccc", padding: 20, marginBottom: 20 }}>
          <p>User ID: {order.userId}</p>
          <p>Order: {order.orderNumber}</p>
          <p>Total: {order.total}</p>

          <button onClick={() => handleActivatePremium(order)} className="font-bold bg-green-600 rounded my-2 p-2 text-white">
            Activate Premium
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPremiumPanel;