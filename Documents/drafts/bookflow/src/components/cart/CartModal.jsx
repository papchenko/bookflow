import { useEffect } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const CartModal = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    updatePurchaseType,
    cartCount
  } = useCart();

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) =>
    sum + (item.purchaseType === 'full' ? item.price : item.priceLending) * item.quantity
  , 0);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Log in to your account to complete your purchase!");
      return;
    }

    const hasShop = cart.some(item => item.type === "shop");
    const hasBook = cart.some(item => item.type === "book");

    if (hasShop && hasBook) {
      toast.error("You can order either Books or Shop items. Remove one type.");
      return;
    }

    const bookItems = cart.filter(item => item.type === "book");
    if (bookItems.length > 1) {
      toast.error("You can order only one book at a time.");
      return;
    }

    setIsCartOpen(false);
    navigate("/checkout-payment");
  };

  return (
    <div
      // className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        // className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] mx-2 overflow-hidden flex flex-col"
        className="
          bg-white dark:bg-gray-800
          w-full
          h-full
          md:h-[90vh]
          md:my-auto
          md:mr-6
          md:max-w-xl
          lg:max-w-2xl
          shadow-xl
          flex flex-col
          overflow-hidden
          transition-transform duration-300
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {cartCount > 0 ? 'Your Cart' : 'Cart is Empty'}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-white p-2 rounded-full"
          >
            <FaTimes className='w-5 h-5 text-gray-700 dark:text-gray-300' />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-4">
          {cartCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full transition duration-300"
              >
                Continue Order
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 border-b"
                >
                  <img
                    src={item.image || (item.images && item.images[0])}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </h3>
                    <p className="text-green-600 font-bold">
                      {Number(item.purchaseType === 'full' ? item.price : item.priceLending).toFixed(2)} ₴
                    </p>
                  </div>

                  {/* Quantity only for Shop */}
                  {item.type === 'shop' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-gray-700 dark:text-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  )}

                  {/* Book purchase type */}
                  {item.type === 'book' && (
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Select type buying:</label>
                      <div className="flex gap-4 text-gray-700 dark:text-white">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`purchase-type-${item.id}`}
                            checked={item.purchaseType === 'full'}
                            onChange={() => updatePurchaseType(item.id, 'full')}
                          />
                          Buy ({item.price}₴)
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`purchase-type-${item.id}`}
                            checked={item.purchaseType === 'rental'}
                            onChange={() => updatePurchaseType(item.id, 'rental')}
                          />
                          Lending ({item.priceLending}₴)
                        </label>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartCount > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {subtotal.toFixed(2)} ₴
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;