import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PharmacyAuth.css";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";



const API_URL = "http://localhost:5000/api/pharmacy";

const PharmacyAuth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    pharmacyName: "",
    address: "",
    city: "",
    licence: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { customer, loginPharmacy } = useAuth();

  const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot"];

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
      if (isSignup && form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      let body = isSignup ? { ...form } : { email: form.email, password: form.password };
      // On signup, include city in address to support city filtering by backend using address regex
      if (isSignup && form.address && form.city) {
        body.address = `${form.address}, ${form.city}`;
      }
      if (isSignup) {
        // Do not send confirmPassword to backend
        delete body.confirmPassword;
      }
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
        <div className={`auth-inner ${!isSignup ? 'compact' : ''}`}>
          <h2 className="auth-title">{isSignup ? "Pharmacy Signup" : "Pharmacy Login"}</h2>
          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            {!isSignup && (
              <>
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
              </>
            )}
            {!isSignup && (
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
            )}
            {isSignup && (
              <div className="form-grid two-col">
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
                  <label className="form-label" htmlFor="city">City</label>
                  <select
                    id="city"
                    name="city"
                    className="form-input"
                    value={form.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
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
                <div className="form-section">
                  <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
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
    </div>
  );
};

export default PharmacyAuth; 