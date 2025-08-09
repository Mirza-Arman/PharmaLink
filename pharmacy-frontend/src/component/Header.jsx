import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Header.css";

const Header = () => {
  const { customer, pharmacy, logout } = useAuth();
  
  return (
    <header className="header">
      <div className="logo-area">PharmacyConnect</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="#how-it-works">How It Works</a>
        <a href="#features">Features</a>
        <a href="#faq">FAQs</a>
        <a href="#contact">Contact</a>
        {!customer && !pharmacy && <>
          <Link to="/customer-auth">Customer Login/Signup</Link>
          <Link to="/pharmacy-auth">Pharmacy Login/Signup</Link>
        </>}
        {customer && (
          <>
            <span className="user-info">{customer.email}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        )}
        {pharmacy && (
          <div className="pharmacy-dropdown">
            <span className="pharmacy-name">{pharmacy.pharmacyName || pharmacy.email}</span>
            <div className="dropdown-menu">
              <Link to="/pharmacy-dashboard" className="dropdown-item">
                <span>Dashboard</span>
              </Link>
              <button onClick={logout} className="dropdown-item logout-item">
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
export default Header;