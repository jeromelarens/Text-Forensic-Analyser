import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // Save token
      localStorage.setItem("token", res.data.token);

      alert("Registration successful");

      navigate("/home");

    } catch (error) {
      alert(
        error.response?.data?.error ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center text-textPrimary">
      
      <div className="w-[440px] border border-muted px-10 py-12 relative">

        <div className="absolute left-0 top-0 h-full w-[2px] bg-accent/60" />

        <div className="mb-10">
          <h1 className="text-xl font-semibold tracking-tight">
            Skeptical AI Engine
          </h1>
          <p className="text-sm text-textSecondary mt-2">
            Create Account
          </p>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-textSecondary mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-secondary border border-muted px-3 py-2 text-sm focus:outline-none focus:border-accent transition"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-textSecondary mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-secondary border border-muted px-3 py-2 text-sm focus:outline-none focus:border-accent transition"
          />
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-wider text-textSecondary mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-secondary border border-muted px-3 py-2 text-sm focus:outline-none focus:border-accent transition"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-2 border border-accent text-accent text-sm hover:bg-accent hover:text-primary transition-all duration-200 tracking-wide"
        >
          {loading ? "Registering..." : "REGISTER"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 py-2 border border-muted text-sm text-textSecondary hover:border-accent hover:text-accent transition-colors"
        >
          Already have account? Login
        </button>

      </div>
    </div>
  );
}
