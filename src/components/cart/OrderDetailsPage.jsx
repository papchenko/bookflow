import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder(docSnap.data());
        } else {
          toast.error("Order not found");
          navigate("/");
        }
      } catch (e) {
        console.error(e);
        toast.error("Error loading order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (loading) return <p className="p-4">loading...</p>;
  if (!order) return null;

  return (
    <div className="md:py-6 bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] dark:bg-gradient-to-br dark:from-[#111018] dark:via-[#1b1a2b] dark:to-[#1c2a3a] text-gray-600 dark:text-white">
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4">Order details #{orderId}</h2>

      <section className="mb-4">
        <h3 className="font-semibold mb-2">Buyer information</h3>
        <p><b>Name:</b> {order.shipping.fullName}</p>
        <p><b>Email:</b> {order.shipping.email}</p>
        <p><b>Phone:</b> {order.shipping.phone}</p>
        <p><b>City:</b> {order.shipping.city}</p>
        <p><b>Delivery service:</b> {order.shipping.postalService}</p>
        <p><b>Department:</b> {order.shipping.postalOffice}</p>
      </section>

      <section className="mb-4">
        <h3 className="font-semibold mb-2">Books</h3>
        <table className="w-full text-left border border-gray-300 dark:border-gray-600 rounded">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border-b border-gray-300 dark:border-gray-600">Book title</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600">Purchase type</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-2 border-b border-gray-300 dark:border-gray-600">{item.name}</td>
                <td className="p-2 border-b border-gray-300 dark:border-gray-600">{item.purchaseType === "rental" ? "Lending" : "Buying"}</td>
                <td className="p-2 border-b border-gray-300 dark:border-gray-600">
                  {item.purchaseType === "rental" ? item.priceLending + "₴" : item.price + "₴"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-4">
        <p><b>Order amount:</b> {order.total}₴</p>
        <p><b>Status:</b> {order.status === "pending" ? "Awaiting confirmation" : order.status === "accepted" ? "Accepted" : "Rejected"}</p>
        <p><b>Creation date:</b> {order.createdAt?.toDate().toLocaleString()}</p>
      </section>

      <button onClick={() => navigate(-1)} className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded">
        back
      </button>
    </div>
    </div>
  );
};

export default OrderDetailsPage;