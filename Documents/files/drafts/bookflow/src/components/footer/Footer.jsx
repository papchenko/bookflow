import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import logoImg from "../../assets/logo.svg";

const Footer = () => {
  const { theme } = useTheme();

  const textColor =
    theme === "light" ? "text-gray-600" : "text-gray-400";
  const bgColor =
    theme === "light"
      ? "bg-gray-50 border-gray-200"
      : "bg-gray-900 border-gray-800";
  const hoverColor =
    theme === "light" ? "hover:text-gray-900" : "hover:text-white";

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Books", path: "/books" },
    { label: "Takers", path: "/takers" },
    { label: "About", path: "/about" },
  ];

  const legalLinks = [
    { label: "Terms of Use", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Cookie Policy", path: "/cookies" },
  ];

  const socialLinks = [
    { icon: <FaYoutube />, url: "https://youtube.com" },
    { icon: <FaLinkedin />, url: "https://linkedin.com" },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim().toLowerCase();

    try {
      const q = query(
        collection(db, "subscribers"),
        where("email", "==", email)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        toast.info("You are already subscribed.");
        return;
      }

      await addDoc(collection(db, "subscribers"), {
        email,
        createdAt: serverTimestamp(),
      });

      toast.success("Subscribed successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error("Subscription failed. Try again.");
    }
  };

  return (
    <footer className={`pt-14 pb-8 border-t ${bgColor}`}>
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div>
            <img src={logoImg} alt="Logo" className="w-10 mb-3 dark:invert" />
            <h3 className={`font-semibold text-lg mb-3 ${textColor}`}>
              Sale and Lending of Books
            </h3>
            <p className={`${textColor} text-sm leading-relaxed`}>
              A platform for discovering, sharing and exploring books.
              Built for readers who value simplicity and clean experience.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className={`font-semibold mb-4 ${textColor}`}>Navigation</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`${textColor} ${hoverColor} transition`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`font-semibold mb-4 ${textColor}`}>Legal</h4>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`${textColor} ${hoverColor} transition`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-semibold mb-4 ${textColor}`}>Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className={textColor}>support@bookflow.com</li>
              <li className={textColor}>Sumy, Ukraine</li>
            </ul>

            <div className="flex gap-4 mt-4 text-lg">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${textColor} ${hoverColor} transition`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className={`font-semibold mb-4 ${textColor}`}>
              Subscribe
            </h4>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
              />

              <button
                type="submit"
                className="bg-[var(--secondary-color)] hover:bg-[var(--secondary-color-hover)] text-white px-4 py-2 rounded-md transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className={`mt-12 pt-6 border-t text-center text-sm ${textColor}`}>
          © {new Date().getFullYear()} BookFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;