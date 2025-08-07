import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/auth/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1737365505446-3a7519af3bee?q=80&w=687&auto=format&fit=crop')] bg-cover bg-center">
      <div className="bg-black bg-opacity-60 text-white p-8 rounded-2xl shadow-2xl w-[350px]">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back!</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-black px-4 py-2 bg-gray-800 bg-opacity-80 rounded focus:outline-none placeholder-gray-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 bg-opacity-80 rounded focus:outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded transition cursor-pointer"
          >
            LOGIN
          </button>
        </form>
        <div className="mt-2">
          <p className="text-gray-300 mt-5">New to our platform?</p>
          <Link to="/register">
            <button className="cursor-pointer w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition">
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
