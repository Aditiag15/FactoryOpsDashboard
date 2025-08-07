import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">InsightBoard</Link>
      </div>

      <div className={`navbar-links ${open ? "open" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/login">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/logout">Logout</Link>
        <Link to="/register">Sign Up</Link>
      </div>

      <div className="hamburger" onClick={() => setOpen(!open)}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>
    </nav>
  );
};

export default Navbar;
