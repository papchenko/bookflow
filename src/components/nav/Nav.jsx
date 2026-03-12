import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSun,
  FaMoon,
  FaStream,
  FaBell,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import MobileMenu from "./mobilemenu/MobileMenu";
import logoImg from "../../assets/logo.svg";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  increment,
  getDocs,
} from "firebase/firestore";
import AuthModal from "../auth/AuthModal";
import CreatePostForm from "../pages/books/CreatePostForm";
import { FaBookMedical } from "react-icons/fa6";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import GlobalSearch from "../search/GlobalSearch";
import FavoritesModal from "../pages/books/FavoritesModal";

import "./nav.scss";

const Nav = () => {
  const { user, userProfile } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const desktopNotifRef = useRef(null);
  const mobileNotifRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const snap = await getDocs(collection(db, "books"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(data);
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfilePhoto(null);
      return;
    }
    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) setProfilePhoto(docSnap.data().photoURL || null);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const sellerQuery = query(
      collection(db, "orders"),
      where("sellerIds", "array-contains", user.uid),
    );
    const unsubSeller = onSnapshot(sellerQuery, (snap) => {
      const sellerOrders = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data(), type: "seller" }))
        .filter((order) => order.status === "pending");
      setNotifications((prev) => {
        const others = prev.filter((o) => o.type !== "seller");
        return [...others, ...sellerOrders];
      });
    });

    const buyerQuery = query(
      collection(db, "orders"),
      where("buyerId", "==", user.uid),
    );
    const unsubBuyer = onSnapshot(buyerQuery, async (snap) => {
      const buyerOrders = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data(), type: "buyer" };

          if (
            data.status === "accepted" &&
            (!data.buyerNotification?.cardNumber ||
              data.buyerNotification?.totalAmount === undefined)
          ) {
            const sellerId = data.sellerIds?.[0];
            if (sellerId) {
              const sellerSnap = await getDoc(doc(db, "users", sellerId));
              if (sellerSnap.exists()) {
                const sellerData = sellerSnap.data();
                const totalAmount = data.items?.reduce(
                  (sum, item) =>
                    sum +
                    (item.purchaseType === "rental"
                      ? item.priceLending
                      : item.price),
                  0,
                );
                await updateDoc(doc(db, "orders", data.id), {
                  buyerNotification: {
                    status: "accepted",
                    cardNumber: sellerData?.cardNumber || "not specified",
                    bankName: sellerData?.bankName || "",
                    read: false,
                    totalAmount: totalAmount,
                  },
                });
                data.buyerNotification = {
                  status: "accepted",
                  cardNumber: sellerData?.cardNumber || "not specified",
                  bankName: sellerData?.bankName || "",
                  read: false,
                  totalAmount: totalAmount,
                };
              }
            }
          }

          return data;
        }),
      );
      const filtered = buyerOrders.filter(
        (o) =>
          (o.status === "accepted" || o.status === "rejected") &&
          !o.buyerNotification?.read,
      );
      setNotifications((prev) => {
        const others = prev.filter((o) => o.type !== "buyer");
        return [...others, ...filtered];
      });
    });

    return () => {
      unsubSeller();
      unsubBuyer();
    };
  }, [user]);

  const markAsRead = async (order) => {
    if (order.type !== "buyer" || order.buyerNotification?.read) return;
    try {
      await updateDoc(doc(db, "orders", order.id), {
        "buyerNotification.read": true,
      });
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  };

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
          sum +
          (item.purchaseType === "rental" ? item.priceLending : item.price),
        0,
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

  const handleReject = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "rejected",
        buyerNotification: { status: "rejected", read: false },
      });
      toast.info("Order rejected");
    } catch {
      toast.error("Failed to reject order");
    }
  };

  const sellerCount = notifications.filter(
    (n) => n.type === "seller" && n.status === "pending",
  ).length;
  const buyerCount = notifications.filter(
    (n) =>
      n.type === "buyer" &&
      (n.status === "accepted" || n.status === "rejected") &&
      !n.buyerNotification?.read,
  ).length;

  const desktopProfileRef = useRef(null);
  const mobileProfileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNotifOpen &&
        !(
          (desktopNotifRef.current &&
            desktopNotifRef.current.contains(event.target)) ||
          (mobileNotifRef.current &&
            mobileNotifRef.current.contains(event.target))
        )
      ) {
        setIsNotifOpen(false);
      }

      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }

      if (
        isProfileOpen &&
        !(
          (desktopProfileRef.current &&
            desktopProfileRef.current.contains(event.target)) ||
          (mobileProfileRef.current &&
            mobileProfileRef.current.contains(event.target))
        )
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotifOpen, isMobileMenuOpen, isProfileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="mx-2">
            <img
              src={logoImg}
              alt="Logo"
              className="logo-img transition dark:invert"
            />
          </Link>
          <div className="search-bar hidden md:flex">
            <div className="hidden md:flex">
              <GlobalSearch />
            </div>
            <button type="submit" className="px-3 rounded-r">
              <i className="fas fa-search"></i>
            </button>
          </div>
          {/* Desktop nav + icons */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {userProfile?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `font-medium ${isActive ? "text-red-500" : "text-gray-700 dark:text-gray-300 hover:text-red-400"}`
                  }>
                  Admin Panel
                </NavLink>
              )}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-[var(--secondary-color)]" : "text-gray-700 dark:text-gray-300 hover:text-[var(--secondary-color-hover)]"}`
                }>
                Home
              </NavLink>
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-[var(--secondary-color)]" : "text-gray-700 dark:text-gray-300 hover:text-[var(--secondary-color-hover)]"}`
                }>
                Books
              </NavLink>
              <NavLink
                to="/takers"
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-[var(--secondary-color)]" : "text-gray-700 dark:text-gray-300 hover:text-[var(--secondary-color-hover)]"}`
                }>
                Takers
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-[var(--secondary-color)]" : "text-gray-700 dark:text-gray-300 hover:text-[var(--secondary-color-hover)]"}`
                }>
                About
              </NavLink>
            </nav>

            <div className="flex items-center space-x-4">
              {userProfile?.taker && (
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="p-2 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FaBookMedical />
                </button>
              )}

              {/* Notifications */}
              <div className="relative" ref={desktopNotifRef}>
                {user && (
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <FaBell />
                    {sellerCount + buyerCount > 0 && (
                      <span className="absolute -top-0 -right-0 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                        {sellerCount + buyerCount}
                      </span>
                    )}
                  </button>
                )}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                    {notifications.length === 0 && (
                      <p className="p-2 text-sm text-gray-500 dark:text-gray-400">
                        No new notifications
                      </p>
                    )}
                    {notifications.length > 0 &&
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`border-b last:border-b-0 p-2 ${n.type === "buyer" && n.buyerNotification?.read ? "opacity-50 pointer-events-none" : ""}`}
                          onClick={() => {
                            markAsRead(n);
                            setIsNotifOpen(false);
                          }}>
                          <p className="text-base text-start font-medium text-gray-700 dark:text-white">
                            {n.items?.[0]?.name} (
                            {n.items?.[0]?.purchaseType === "rental"
                              ? "Lending"
                              : "Buy"}
                            )
                          </p>
                          {n.type === "seller" ? (
                            <div className="flex flex-row gap-2 mt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/orders/${n.id}`);
                                  setIsNotifOpen(false);
                                }}
                                className="bg-white dark:bg-gray-800 text-[var(--secondary-color)] cursor text-start w-32 py-1 px-2 rounded text-base">
                                More Info
                              </button>

                              <div className="flex gap-2 justify-start">
                                <button
                                  onClick={() => handleAccept(n.id, n)}
                                  className="bg-[var(--accept-color)] hover:[var(--accept-color-hover)] text-white py-1 px-2 rounded text-base">
                                  Accept
                                </button>

                                <button
                                  onClick={() => handleReject(n.id)}
                                  className="bg-[var(--reject-color)] hover:[var(--reject-color-hover)] text-white py-1 px-2 rounded text-base">
                                  Reject
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-base mt-1 text-[var(--accept-color)] cursor">
                                <span className="text-gray-600 dark:text-white">
                                  Status:
                                </span>{" "}
                                {n.buyerNotification?.status === "accepted"
                                  ? "Accepted"
                                  : "Rejected"}
                              </p>
                              {n.buyerNotification?.status === "accepted" && (
                                <>
                                  <p className="text-gray-600 dark:text-white">
                                    <b>Seller card number:</b>{" "}
                                    <span className="text-[var(--secondary-color)]">
                                      {n.buyerNotification?.cardNumber}
                                    </span>
                                  </p>
                                  {n.buyerNotification?.bankName && (
                                    <p className="text-gray-600 dark:text-white">
                                      <b>Bank:</b>{" "}
                                      {n.buyerNotification.bankName}
                                    </p>
                                  )}
                                  {n.buyerNotification?.totalAmount !==
                                    undefined && (
                                    <p className="text-gray-600 dark:text-white">
                                      <b>Total Sum:</b>{" "}
                                      {n.items?.reduce(
                                        (sum, item) =>
                                          sum +
                                          (item.purchaseType === "rental"
                                            ? item.priceLending
                                            : item.price),
                                        0,
                                      )}{" "}
                                      ₴
                                    </p>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                {theme === "light" ? <FaMoon /> : <FaSun />}
              </button>

              {/* Cart */}
              <div
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer p-2 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              {/* Desktop Profile */}
              <div ref={desktopProfileRef} className="hidden md:block relative">
                <div
                  onClick={() => {
                    if (!user) {
                      setAuthOpen(true);
                    } else {
                      setIsProfileOpen((prev) => !prev);
                    }
                  }}
                  className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  {!user ? (
                    <>
                      <button
                        onClick={() => setAuthOpen(true)}
                        className="px-3 py-1 rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-white font-medium transition">
                        Sign In
                      </button>
                    </>
                  ) : profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
                      {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                {isProfileOpen && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsFavoritesOpen(true);
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                      Favorites
                    </button>
                    <button
                      onClick={() => {
                        navigate("/buyer/orders");
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                      Purchase History
                    </button>
                    {userProfile?.taker && (
                      <button
                        onClick={() => {
                          navigate("/seller/orders");
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                        Order History
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile icons & menu */}
          <div className="flex md:hidden items-center space-x-3">
            {userProfile?.taker && (
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="p-1 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <FaBookMedical />
              </button>
            )}

            {/* Mobile Notifications */}
            <div className="relative" ref={mobileNotifRef}>
              {user && (
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FaBell />
                  {sellerCount + buyerCount > 0 && (
                    <span className="absolute -top-0 -right-0 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                      {sellerCount + buyerCount}
                    </span>
                  )}
                </button>
              )}
              {isNotifOpen && (
                <div className="absolute -left-[100px] mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="p-2 text-sm text-gray-500 dark:text-gray-400">
                      No new notifications
                    </p>
                  )}
                  {notifications.length > 0 &&
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`border-b last:border-b-0 p-2 ${n.type === "buyer" && n.buyerNotification?.read ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => {
                          markAsRead(n);
                          setIsNotifOpen(false);
                        }}>
                        <p className="text-base font-medium text-gray-700 dark:text-white">
                          {n.items?.[0]?.name} (
                          {n.items?.[0]?.purchaseType === "rental"
                            ? "Lending"
                            : "Buy"}{" "}
                          —{" "}
                          {n.items?.[0]?.purchaseType === "rental"
                            ? n.items?.[0]?.priceLending
                            : n.items?.[0]?.price}{" "}
                          ₴₴ )
                        </p>
                        {n.type === "seller" ? (
                          <div className="flex flex-row gap-3 mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${n.id}`);
                                setIsNotifOpen(false);
                              }}
                              className="bg-white dark:bg-gray-800 text-[var(--secondary-color)] text-start py-1 px-2 rounded text-base">
                              More Info
                            </button>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(n.id, n)}
                                className="bg-[var(--accept-color)] hover:[var(--accept-color-hover)] text-white py-1 px-2 rounded text-base">
                                Accept
                              </button>

                              <button
                                onClick={() => handleReject(n.id)}
                                className="bg-[var(--reject-color)] hover:[var(--reject-color-hover)] text-white py-1 px-2 rounded text-base">
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-base mt-1 text-[var(--accept-color)] cursor">
                              <span className="text-gray-600 dark:text-white">
                                Status:
                              </span>{" "}
                              {n.buyerNotification?.status === "accepted"
                                ? "Accepted"
                                : "Rejected"}
                            </p>
                            {n.buyerNotification?.status === "accepted" && (
                              <>
                                <p className="text-gray-600 dark:text-white">
                                  <b>Seller card number:</b>{" "}
                                  <span className="text-[var(--secondary-color)]">
                                    {n.buyerNotification?.cardNumber}
                                  </span>
                                </p>
                                {n.buyerNotification?.bankName && (
                                  <p className="text-gray-600 dark:text-white">
                                    <b>Bank:</b> {n.buyerNotification.bankName}
                                  </p>
                                )}
                                {n.buyerNotification?.totalAmount !==
                                  undefined && (
                                  <p className="text-gray-600 dark:text-white">
                                    <b>Total Sum:</b>{" "}
                                    {n.items?.reduce(
                                      (sum, item) =>
                                        sum +
                                        (item.purchaseType === "rental"
                                          ? item.priceLending
                                          : item.price),
                                      0,
                                    )}{" "}
                                    ₴
                                  </p>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <div
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div ref={mobileProfileRef} className="md:hidden relative">
              <div
                onClick={() => {
                  if (!user) {
                    setAuthOpen(true);
                  } else {
                    setIsProfileOpen((prev) => !prev);
                  }
                }}
                className="p-1 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                {!user ? (
                  <>
                    <button
                      onClick={() => setAuthOpen(true)}
                      className="px-2 py-1 rounded-lg bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-white font-medium transition">
                      Sign In
                    </button>
                  </>
                ) : profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
                    {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {isProfileOpen && user && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg z-50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsFavoritesOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                    Favorites
                  </button>
                  <button
                    onClick={() => {
                      navigate("/buyer/orders");
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                    Purchase History
                  </button>
                  {userProfile?.taker && (
                    <button
                      onClick={() => {
                        navigate("/seller/orders");
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
                      Order History
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaStream />
            </button>
          </div>
        </div>
        {/* Mobile search */}
        <div className="md:hidden mt-2">
          <div className="search-bar">
            <div className="flex md:hidden relative w-full md:w-64">
              <GlobalSearch />
            </div>
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div ref={mobileMenuRef}>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {isPostModalOpen && (
        <CreatePostForm onClose={() => setIsPostModalOpen(false)} />
      )}
      <FavoritesModal isOpen={isFavoritesOpen} setIsOpen={setIsFavoritesOpen} />
    </header>
  );
};

export default Nav;