import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FaMoon className="text-gray-700" />
      ) : (
        <FaSun className="text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;