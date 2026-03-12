import { NavLink } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import ThemeToggle from '../../theme/ThemeToggle';

const MobileMenu = ({ isOpen, onClose }) => {

  const { userProfile } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="absolute top-16 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-l-lg">
        <nav className="p-4">
          <ul className="space-y-4">
            
            {userProfile?.role === "admin" && (
            <li>
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                      : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800'
                  }`
                }
              >
                Admin Panel
              </NavLink>
            </li>
          )}
          
            <li>
              <NavLink
                to="/"
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-[var(--accept-color)] hover:[var(--accept-color-hover)] text-gray-700 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/books"
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-[var(--accept-color)] hover:[var(--accept-color-hover)] text-gray-700 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                Books
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/takers"
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-[var(--accept-color)] hover:[var(--accept-color-hover)] text-gray-700 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                Takers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-[var(--accept-color)] hover:[var(--accept-color-hover)] text-gray-700 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-start">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;