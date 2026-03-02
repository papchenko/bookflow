import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const saveCart = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

const addToCart = (product, type = 'book') => {
  const exists = cart.find(item => item.id === product.id && item.purchaseType === 'full');
  if (exists) {
    toast.error('Item already in cart');
    return;
  }

  const newItem = {
    id: product.id,
    name: product.name,
    type,
    quantity: 1,
    price: Number(product.price || 0),
    priceLending: Number(product.priceLending || 0),
    image: type === 'book' ? product.images?.[0] : product.image,
    purchaseType: 'full',
    sellerId: product.sellerId || null,
    sellerName: product.sellerName || null,
    sellerPhoto: product.sellerPhoto || null
  };

  saveCart([...cart, newItem]);
  toast.success('Added to cart');
};


  const removeFromCart = (id) => {
    saveCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    const item = cart.find(item => item.id === id);
    if (!item || item.type === 'book' || quantity < 1) return;

    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const updatePurchaseType = (id, type) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, purchaseType: type } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cart.length;

  const openProductModal = (product) => {
    setCurrentProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      updatePurchaseType,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isProductModalOpen,
      setIsProductModalOpen,
      currentProduct,
      openProductModal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);