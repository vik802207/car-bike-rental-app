import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="navbar-logo">
        <NavLink to="/" onClick={closeMenu}>VehicleRental</NavLink>
      </div>

      <button className="hamburger" onClick={toggleMenu}>☰</button>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
        <li><NavLink to="/all-vehicles" onClick={closeMenu}>Book Vehicles</NavLink></li>
        <li><NavLink to="/appointment" onClick={closeMenu}>Book Appointment</NavLink></li>
        <li><NavLink to="/about" onClick={closeMenu}>About Us</NavLink></li>
        <li><NavLink to="/contact" onClick={closeMenu}>Contact Us</NavLink></li>
        <li>
          <button onClick={toggleDarkMode} className="dark-toggle-btn">
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
