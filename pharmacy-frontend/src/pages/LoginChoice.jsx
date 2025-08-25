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
          You can browse pharmacies, upload prescriptions, and track your orders easily. Get timely reminders so you never miss a dose. Everything is simple, secure, and fast for your convenience.
          </p>
          <ul className="features-list two-col">
            <li>Browse medicine catalog</li>
            <li> Compare prices</li>
            <li> Fast delivery</li>
            <li> Secure payments</li>
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
          Easily accept orders, and track detailed analytics with MediLink. Powerful tools to simplify daily operations and grow your business faster.
          </p>
          <ul className="features-list two-col">
            <li>Manage inventory</li>
            <li> Customer requests</li>
            <li> Analytics dashboard</li>
            <li> Business growth</li>
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
