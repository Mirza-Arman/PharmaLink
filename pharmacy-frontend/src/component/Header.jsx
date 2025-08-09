import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getGravatarUrl } from "../utils/gravatar";
import "./Header.css";

const Header = () => {
  const { customer, pharmacy, logout } = useAuth();
  const [gravatarUrl, setGravatarUrl] = useState(null);
  const [showLetter, setShowLetter] = useState(false);

  // Generate Gravatar URL when pharmacy changes
  useEffect(() => {
    if (pharmacy?.email) {
      const url = getGravatarUrl(pharmacy.email, 80, '404');
      setGravatarUrl(url);
      setShowLetter(false);
    } else {
      setGravatarUrl(null);
      setShowLetter(false);
    }
  }, [pharmacy]);

  const handleImageError = () => {
    setShowLetter(true);
  };

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
          <div className="customer-dropdown">
            <div className="customer-avatar">
              {gravatarUrl && !showLetter ? (
                <img
                  src={gravatarUrl}
                  alt="Profile"
                  className="avatar-image"
                  onError={handleImageError}
                />
              ) : (
                <div className="avatar-letter">
                  {(customer.email || 'C').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-header-content">
                  <div className="dropdown-avatar">
                    {gravatarUrl && !showLetter ? (
                      <img
                        src={gravatarUrl}
                        alt="Profile"
                        className="dropdown-avatar-image"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="dropdown-avatar-letter">
                        {(customer.email || 'C').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="dropdown-info">
                    <div className="dropdown-customer-name">
                      {customer.fullName || customer.email}
                    </div>
                    <div className="dropdown-email">
                      {customer.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="dropdown-divider"></div>
              <button onClick={logout} className="dropdown-item logout-item">
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {pharmacy && (
          <div className="pharmacy-dropdown">
            <div className="pharmacy-avatar">
              {gravatarUrl && !showLetter ? (
                <img
                  src={gravatarUrl}
                  alt="Profile"
                  className="avatar-image"
                  onError={handleImageError}
                />
              ) : (
                <div className="avatar-letter">
                  {(pharmacy.email || 'P').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-header-content">
                  <div className="dropdown-avatar">
                    {gravatarUrl && !showLetter ? (
                      <img
                        src={gravatarUrl}
                        alt="Profile"
                        className="dropdown-avatar-image"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="dropdown-avatar-letter">
                        {(pharmacy.email || 'P').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="dropdown-info">
                    <div className="dropdown-pharmacy-name">
                      {pharmacy.pharmacyName || pharmacy.email}
                    </div>
                    <div className="dropdown-email">
                      {pharmacy.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
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