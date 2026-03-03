import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      toast.success("Registration successful");
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        className="px-3 py-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="px-3 py-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="px-3 py-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="px-3 py-2 bg-[var(--secondary-color)] text-white rounded">Register</button>
    </form>
  );
};

export default RegisterForm;