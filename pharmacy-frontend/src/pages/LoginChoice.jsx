import React from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import "./LoginChoice.css";

const LoginChoice = () => {
  return (
    <div className="login-choice-page">
      <Header />

      <section className="choice-hero">
        <h1>Welcome to MediLink</h1>
        <p>Select how you'd like to continue</p>
      </section>

      <section className="choice-grid">
        <div className="choice-card customer">
          <div className="card-badge">For Customers</div>
          <h2>Order Medicines Easily</h2>
          <p>
            Browse pharmacies, upload prescriptions, track orders, and get
            timely reminders. Simple, secure, and fast.
          </p>
          <ul className="features-list two-col">
            <li>Browse medicine catalog</li>
            <li>💰 Compare prices</li>
            <li>🚚 Fast delivery</li>
            <li>🛡️ Secure payments</li>
          </ul>
          <div className="card-actions">
            <Link to="/customer-auth" className="btn primary">
              Login / Sign up as Customer
            </Link>
          </div>
        </div>

        <div className="choice-card pharmacy">
          <div className="card-badge">For Pharmacies</div>
          <h2>Manage Your Pharmacy</h2>
          <p>
            Accept orders, manage inventory, view analytics, and grow your
            business with MediLink's powerful tools.
          </p>
          <ul className="features-list two-col">
            <li>Manage inventory</li>
            <li>📱 Customer requests</li>
            <li>📊 Analytics dashboard</li>
            <li>💼 Business growth</li>
          </ul>
          <div className="card-actions">
            <Link to="/pharmacy-auth" className="btn secondary">
              Login / Sign up as Pharmacy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginChoice;
