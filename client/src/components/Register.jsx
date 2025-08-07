import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/auth/users/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (<>
  <Navbar/>
    <div className="flex flex-col md:flex-row h-screen bg-cover bg-center"style={{ backgroundImage: "url('https://images.unsplash.com/photo-1737365505446-3a7519af3bee?q=80&w=687&auto=format&fit=crop')" }}>
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2  bg-opacity-70 text-white items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center max-w-sm">
          <h2 className="text-4xl font-bold mb-6">Welcome!</h2>
          <p className="text-gray-300 mb-8">Already have an account?</p>
          <Link
            to="/login"
            className="inline-block border-2 border-white px-6 py-2 rounded-lg hover:bg-white hover:text-black transition font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className=" bg-gray-900 w-full md:w-1/2 bg-opacity-90 flex items-center justify-center p-10 text-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 ">Create Account</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-400 hover:text-black cursor-pointer transition"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div></>
  );
}
