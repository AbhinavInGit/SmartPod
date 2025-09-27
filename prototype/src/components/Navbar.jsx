import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🚀 SmartPods
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