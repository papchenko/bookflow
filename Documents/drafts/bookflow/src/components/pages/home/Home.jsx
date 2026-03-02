import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../cart/ProductCard";
import { shop } from "../../../Data/shop";
import { useCart } from "../../../context/CartContext";
import { db } from "../../../firebase";
import ProductModal from "../../cart/ProductModal";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

const Home = () => {
  
  const [latestBooks, setLatestBooks] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(4);
  const [selectedBook, setSelectedBook] = useState(null);

  const { addToCart } = useCart();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const q = query(
          collection(db, "books"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const snap = await getDocs(q);

        const books = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLatestBooks(books);
      } catch (error) {
        console.error("Error fetching latest books:", error);
      }
    };

    fetchLatestBooks();
  }, []);

  useEffect(() => {
    if (!swiperRef.current || !prevRef.current || !nextRef.current) return;

    const swiper = swiperRef.current;
    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;
    swiper.navigation.init();
    swiper.navigation.update();
  }, [swiperRef.current]);

    useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <section className="relative w-full min-h-[70vh] sm:h-screen flex flex-col justify-center items-center text-white bg-gradient-to-br
                from-[#e0f2fe]
                via-[#bae6fd]
                to-[#7dd3fc]

                dark:bg-gradient-to-br
                dark:from-[#111018]
                dark:via-[#1b1a2b]
                dark:to-[#1c2a3a] overflow-hidden">
        <div className="absolute inset-0 flex">
        </div>
        <div className="w-full px-4 text-center max-w-7xl z-10">
          {/* <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800 dark:text-white"> */}
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-gray-800 dark:text-white">
            Share Knowledge, Inspire Others
          </h1>
          {/* <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto text-gray-800 dark:text-white"> */}
          <p className="text-xl sm:text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto text-gray-800 dark:text-white">
            Here you can sell books, lend them for free, or use them as
                  collateral — instead of letting them gather dust on your shelf.
          </p>
          <Link to="/books" className="bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] py-4 px-9 sm:py-4 sm:px-10 rounded-full font-bold transition duration-300 text-sm sm:text-base md:text-lg">
            Explore Library
          </Link>
        </div>
      </section>
      {/* Most New Section */}
      <section className="py-12 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Most New
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestBooks.slice(0, itemsToShow).map((book) => (
              <div key={book.id}>
               <ProductCard 
                  product={{ ...book, type: "book" }} 
                  onClick={() => setSelectedBook(book)} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="py-12 bg-gradient-to-br
        from-[#e0f2fe]
        via-[#bae6fd]
        to-[#7dd3fc]

        dark:bg-gradient-to-br
        dark:from-[#111018]
        dark:via-[#1b1a2b]
        dark:to-[#1c2a3a] 
        
        text-gray-600 dark:text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Taker</h2>
          <p className="text-2xl mb-6">
            Want to sell or to lend a book for a certain period of time books?
            Complete the full user registration, purchase premium, and get the most out of our platform!
          </p>
          <Link
            to="/takers-premium"
            // bg-yellow-400 hover:bg-yellow-500
            className="inline-block bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-white font-bold py-2 px-6 rounded-full transition duration-300">
            View Details
          </Link>
        </div>
      </section>

      {/* Shop Section with Navigation */}
      <section className="py-12 bg-slate-100 dark:bg-gray-800 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Our Shop
          </h2>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3 },
            }}>
            {shop.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="
                    bg-white
                    dark:bg-gray-700

                    border border-slate-200
                    dark:border-gray-600

                    shadow-sm
                    hover:shadow-xl

                    hover:-translate-y-1
                    transition-all duration-300

                    p-5
                    rounded-2xl
                    flex flex-col items-center text-center
                  ">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-36 object-contain mb-4"
                  />
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-400 font-bold mb-1">
                    UAH {item.price}
                  </p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mb-3">
                    {item.description}
                  </p>
                  <button
                    onClick={() => addToCart(item, "shop")}
                    className="bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-white px-4 py-2 rounded-full transition duration-300">
                    Buy
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={prevRef}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <FaArrowLeft />
          </button>
          <button
            ref={nextRef}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <FaArrowRight />
          </button>
        </div>
      </section>
      {selectedBook && (
        <ProductModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default Home;