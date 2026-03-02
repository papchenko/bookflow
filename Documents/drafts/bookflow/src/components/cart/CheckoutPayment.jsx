import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import { FaRegCopy } from "react-icons/fa";

export const CheckoutPayment = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shopItems = cart.filter(item => item.type === "shop");
  const bookItems = cart.filter(item => item.type === "book");

  const [step, setStep] = useState(1);

  const [orderNumber] = useState(() => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${Date.now()}-${random}`;
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "+380",
    city: "",
    postalService: "novaPoshta",
    postalOffice: ""
  });

  const totalShopAmount = shopItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const totalBookAmount = bookItems.reduce((acc, item) => {
    const price =
      item.purchaseType === "rental" ? item.priceLending : item.price;
    return acc + Number(price);
  }, 0);

  const totalAmount = totalShopAmount + totalBookAmount;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You are not authorized.");
      return;
    }

    if (shopItems.length > 0 && bookItems.length > 0) {
      toast.error("Remove books or shop items. You can order only one type at a time.");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 12) {
      toast.error("Phone number must be exactly 9 digits after +380");
      return;
    }

    if (shopItems.length > 0) {
      setStep(2);
      return;
    }

    if (bookItems.length > 0) {
      await handleBookOrders();
    }
  };

  const handleBookOrders = async () => {
    try {
      const sellerIds = bookItems.map(item => item.sellerId).filter(Boolean);

      await addDoc(collection(db, "orders"), {
        type: "book",
        buyerId: user.uid,
        orderNumber,
        items: bookItems,
        sellerIds,
        shipping: formData,
        total: totalBookAmount,
        status: "pending",
        createdAt: serverTimestamp()
      });

      toast.success("Book order created!");
      clearCart();
      navigate("/");
    } catch (error) {
      toast.error("Book order error");
    }
  };

const handleShopConfirm = async () => {
  try {
    const itemsDetailed = shopItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: Number(item.price) * (item.quantity || 1)
    }));

    const message = `
      🧾 SHOP ORDER

      Order: ${orderNumber}

      Customer: ${formData.fullName}
      Email: ${formData.email}
      Phone: ${formData.phone}
      City: ${formData.city}
      Postal Service: ${formData.postalService}
      Department: ${formData.postalOffice}

      Items:
      ${itemsDetailed
        .map(i => `${i.name} x${i.quantity} = ${i.total}₴`)
        .join("\n")}

      TOTAL: ${totalShopAmount}₴
    `;

    await emailjs.send(
      "service_hllb7p1",
      "template_gdn6fcv",
      { message },
      "v13Oo-YtABqCO9JLF"
    );

    await addDoc(collection(db, "orders"), {
        type: "shop",
        buyerId: user.uid,
        orderNumber,
        items: shopItems,
        shipping: formData,
        total: totalShopAmount,
        status: "pending",
        createdAt: serverTimestamp()
      });

      setStep(3);
      setFinalTotal(totalShopAmount);
      setFinalItems(shopItems);
      clearCart();
      toast.success("Order received!");
    } catch (error) {
      console.error(error);
      toast.error("Shop order error");
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("receipt").innerHTML;
    const newWin = window.open("", "_blank");
    newWin.document.write(
      `<html><head><title>Receipt</title></head><body>${printContent}</body></html>`
    );
    newWin.document.close();
    newWin.print();
    newWin.close();
  };

  const [finalTotal, setFinalTotal] = useState(0);
  const [finalItems, setFinalItems] = useState([]);

  return (
    <div className="py-12 bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] dark:from-[#111018] dark:via-[#1b1a2b] dark:to-[#1c2a3a] text-gray-700 dark:text-white">
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">

        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--secondary-color)]">
          {step === 1 ? "Step 1: Shipping Details"
            : step === 2 ? "Step 2: Payment Instructions"
            : "Step 3: Receipt"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              * Be sure to enter your account nickname that you registered on the site to place an order.
            </div>
            <input type="text" name="fullName" placeholder="Full Name"
              value={formData.fullName} onChange={handleChange}
              className="p-2 rounded border text-black" required />
            <div>
                * Be sure to enter the email address of the account you registered on the site to place an order.
            </div>
            <input type="email" name="email" placeholder="Email"
              value={formData.email} onChange={handleChange}
              className="p-2 rounded border text-black" required />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value;
                  if (!value.startsWith("+380")) value = "+380";
                  const digits = value.replace(/\D/g, "");
                  if (digits.length > 12) return;
                  setFormData({ ...formData, phone: value });
                }}
                required
                className="p-2 rounded border text-black"
              />

            <input type="text" name="city" placeholder="City"
              value={formData.city} onChange={handleChange}
              className="p-2 rounded border text-black" required />

            <select name="postalService"
              value={formData.postalService}
              onChange={handleChange}
              className="p-2 rounded border text-black">
              <option value="novaPoshta">Nova Poshta</option>
              <option value="ukrPoshta">Ukrposhta</option>
            </select>

            <input type="text" name="postalOffice" placeholder="Department"
              value={formData.postalOffice} onChange={handleChange}
              className="p-2 rounded border text-black" required />

            <button type="submit"
              className="py-3 bg-[var(--secondary-color)] text-white rounded">
              {/* Proceed to Checkout */}
              Order & Next
            </button>
          </form>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center gap-2">
              <p><b>Order:</b> {orderNumber}</p>
              <FaRegCopy
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(orderNumber);
                  toast.success("Order number copied!");
                }}
              />
            </div>

            <p><b>Total:</b> {totalShopAmount}₴</p>

            <div className="bg-black text-white p-4 rounded flex justify-between items-center w-full">
              <span style={{ letterSpacing: "2px", fontSize: "1.2rem" }}>
                4790 7299 2893 6954
              </span>
              <FaRegCopy
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText("4790729928936954");
                  toast.success("Card copied!");
                }}
              />
            </div>

            <p className="text-red-500 font-semibold text-center">
              IMPORTANT: Enter order number in payment description
            </p>

            <button
              onClick={handleShopConfirm}
              className="py-3 bg-green-600 text-white rounded w-full">
              I Paid, Confirm Order
            </button>
          </div>
        )}
        {step === 3 && (
          <div id="receipt" className="text-black bg-white p-6 rounded shadow">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Payment Receipt
            </h3>

            <div className="border p-4 mb-4 rounded text-center bg-gray-100">
              <p className="font-bold text-lg">Payment Instructions</p>
              <p>Total: {finalTotal}₴</p>
              <p className="text-lg font-bold">4790 7299 2893 6954</p>
            </div>

            <p><b>Order:</b> {orderNumber}</p>
            <p><b>Name:</b> {formData.fullName}</p>
            <p><b>Email:</b> {formData.email}</p>
            <p><b>Phone:</b> {formData.phone}</p>
            <p><b>City:</b> {formData.city}</p>
            <p><b>Postal Service:</b> {formData.postalService}</p>
            <p><b>Department:</b> {formData.postalOffice}</p>

            <div className="mt-4">
              <b>Items:</b>
              {finalItems.map((i, idx) => (
                <p key={idx}>
                  {i.name} x{i.quantity || 1} = {i.purchaseType === "rental" ? i.priceLending : i.price}₴
                </p>
              ))}
            </div>

            <p className="mt-4 font-bold text-lg">
              Total: {finalTotal}₴
            </p>

            <div className="flex gap-3 mt-6">
              <button onClick={handlePrint}
                className="px-4 py-2 bg-[var(--secondary-color)] text-white rounded w-full">
                Print
              </button>
              <button onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-500 text-white rounded w-full">
                Back Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPayment;