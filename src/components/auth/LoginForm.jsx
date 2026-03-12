import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful");
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 py-3">
      <input
        type="email"
        placeholder="Email"
        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="px-3 py-2 bg-[var(--secondary-color)] text-white rounded hover:bg-[var(--secondary-color-hover)] transition">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
