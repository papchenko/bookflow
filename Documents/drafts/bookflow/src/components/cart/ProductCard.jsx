import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { FaStar } from "react-icons/fa6";

const ProductCard = ({ product, onClick }) => {
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      if (!product?.sellerId) return;

      const sellerSnap = await getDoc(doc(db, "users", product.sellerId));
      if (sellerSnap.exists()) {
        const data = sellerSnap.data();
        setSeller({
          name: data.name || "Unknown",
          photoURL: data.photoURL || null,
          sellerStats: data.sellerStats || { completedOrders: 0, ratingAverage: 0, ratingCount: 0 },
        })
      }
    }

    fetchSeller();
  }, [product]);

  return (
    <div
      className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="h-80 overflow-hidden rounded-t-lg">
        <img
          src={product.images?.[0] || ""}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{product.name}</h3>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Genre: {product.genre}</p>
        <p className="text-base font-bold text-gray-800 dark:text-white mb-1">UAH {product.price}</p>

        {product.priceLending && (
          <>
            <span className="text-xs text-gray-800 dark:text-white">Lending price:</span>
            <p className="text-green-600 dark:text-green-500 font-bold">
              UAH {Number(product.priceLending).toFixed(2)}
              {product.unit && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{product.unit}</span>}
            </p>
          </>
        )}

        {seller && (
          <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
            {seller.photoURL ? (
              <img src={seller.photoURL} alt={seller.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-white">
                {seller.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-gray-800 dark:text-white">{seller.name}</p>
              <p className="text-sm flex items-center gap-1 text-gray-700 dark:text-white">
                Rating: {seller.sellerStats?.ratingCount > 0
                  ? seller.sellerStats.ratingAverage.toFixed(0)
                  : 0} <FaStar className='text-[var(--accept-color)]' />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;