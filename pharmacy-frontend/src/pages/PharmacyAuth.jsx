import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PharmacyAuth.css";
import { useAuth } from "../AuthContext";

const Header = () => (
  <header className="header">
    <div className="logo-area">PharmacyConnect</div>
    <nav className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/buy-medicine">Buy Medicine</Link>
      <Link to="/customer-auth">Customer Login/Signup</Link>
      <Link to="/pharmacy-auth">Pharmacy Login/Signup</Link>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-left">
      <div className="footer-logo">PharmacyConnect</div>
      <div className="footer-desc">Your trusted pharmacy marketplace</div>
    </div>
    <div className="footer-right">
      <div className="footer-links">
        <a href="#about">About Us</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
      </div>
    </div>
  </footer>
);

const API_URL = "http://localhost:5000/api/pharmacy";

const PharmacyAuth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    pharmacyName: "",
    address: "",
    licence: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { customer, loginPharmacy } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    
    // Check if customer is logged in before allowing pharmacy login
    if (!isSignup && customer) {
      setError("A customer is currently logged in. Please logout the customer first or the customer session will be automatically cleared.");
    }
    
    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const body = isSignup ? form : { email: form.email, password: form.password };
      const headers = { "Content-Type": "application/json" };
      
      // Send customer token if exists to check for conflicts
      if (!isSignup) {
        const customerToken = localStorage.getItem("customer_token");
        if (customerToken) {
          headers.Authorization = `Bearer ${customerToken}`;
        }
      }
      
      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      if (!isSignup) {
        loginPharmacy(data.user, data.token);
        navigate("/pharmacy-dashboard");
      } else {
        setIsSignup(false);
        setError("Signup successful! Please login.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-bg">
      <Header />
      <div className="auth-container">
        <div className="auth-inner">
          <h2 className="auth-title">{isSignup ? "Pharmacy Signup" : "Pharmacy Login"}</h2>
          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-section">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                className="form-input"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-section">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                className="form-input"
                type="tel"
                placeholder="03XXXXXXXXX"
                value={form.phone}
                onChange={handleChange}
                pattern="03[0-9]{9}"
                required
              />
            </div>
            <div className="form-section">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                className="form-input"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {isSignup && (
              <>
                <div className="form-section">
                  <label className="form-label" htmlFor="pharmacyName">Pharmacy Name</label>
                  <input
                    id="pharmacyName"
                    name="pharmacyName"
                    className="form-input"
                    type="text"
                    placeholder="Pharmacy Name"
                    value={form.pharmacyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-section">
                  <label className="form-label" htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    className="form-input"
                    type="text"
                    placeholder="Pharmacy Address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-section">
                  <label className="form-label" htmlFor="licence">Licence Number</label>
                  <input
                    id="licence"
                    name="licence"
                    className="form-input"
                    type="text"
                    placeholder="Licence Number"
                    value={form.licence}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <button className="submit-btn" type="submit">{isSignup ? "Sign Up" : "Login"}</button>
            {error && <div className={error.includes("success") ? "success-msg" : "error-msg"}>{error}</div>}
          </form>
          <div className="auth-switch">
            {isSignup ? (
              <>
                Already have an account? <button onClick={() => { setIsSignup(false); setError(""); }}>Login</button>
              </>
            ) : (
              <>
                New pharmacy? <button onClick={() => { setIsSignup(true); setError(""); }}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PharmacyAuth; 