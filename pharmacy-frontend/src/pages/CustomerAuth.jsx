import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { pharmacy, loginCustomer } = useAuth();
  const [showInfoModal, setShowInfoModal] = useState(location.state?.redirectTo === "/select-pharmacy");

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
        const redirectTo = location.state?.redirectTo || "/";
        const pendingOrder = location.state?.pendingOrder;
        navigate(redirectTo, { state: pendingOrder ? pendingOrder : undefined, replace: true });
      } else {
        setIsSignup(false);
        setError("Signup successful! Please login.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  useEffect(() => {
    if (showInfoModal) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [showInfoModal]);

  return (
    <div className="auth-bg customer-auth">
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
      {showInfoModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.24)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
        >
          <div
            className="modal"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "1rem 1.2rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              maxWidth: 520,
              width: "90%",
              color: "#23424a"
            }}
          >
            <div className="modal-title" style={{ fontWeight: 700, fontSize: "1.05rem", textAlign: "center" }}>
              Please log in or sign up to continue.
            </div>
            <p style={{ marginTop: "0.6rem", textAlign: "center" }}>
              After logging in, you'll be redirected to Select Pharmacy, and your entered medicines and delivery details will be saved.
            </p>
            <div className="modal-actions" style={{ marginTop: "0.9rem", display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                className="modal-btn"
                onClick={() => setShowInfoModal(false)}
                style={{
                  background: "#2ca7a0",
                  color: "#fff",
                  border: "none",
                  borderRadius: 9999,
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAuth; 