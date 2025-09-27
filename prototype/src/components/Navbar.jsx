import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBook } from "react-icons/fa6";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaBook /> SmartPods
        </Link>
        <div className="navbar-links">
          <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
          <NavLink to="/info" className="nav-link">Info</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;