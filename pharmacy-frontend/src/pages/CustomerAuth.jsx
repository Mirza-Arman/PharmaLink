import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";
import "./CustomerAuth.css";



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

const API_URL = "http://localhost:5000/api/customer";

const CustomerAuth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { pharmacy, loginCustomer } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    
    // Check if pharmacy is logged in before allowing customer login
    if (!isSignup && pharmacy) {
      setError("A pharmacy is currently logged in. Please logout the pharmacy first or the pharmacy session will be automatically cleared.");
    }
    
    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const headers = { "Content-Type": "application/json" };
      
      // Send pharmacy token if exists to check for conflicts
      if (!isSignup) {
        const pharmacyToken = localStorage.getItem("pharmacy_token");
        if (pharmacyToken) {
          headers.Authorization = `Bearer ${pharmacyToken}`;
        }
      }
      
      const res = await fetch(API_URL + endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      if (!isSignup) {
        loginCustomer(data.user, data.token);
        navigate("/");
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
          <h2 className="auth-title">{isSignup ? "Customer Signup" : "Customer Login"}</h2>
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
                New customer? <button onClick={() => { setIsSignup(true); setError(""); }}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerAuth; 