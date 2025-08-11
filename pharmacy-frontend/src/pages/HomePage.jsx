
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";

// Placeholder image/icon URLs
const icons = {
  city: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  list: "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
  compare: "https://cdn-icons-png.flaticon.com/512/1828/1828961.png",
  price: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  realtime: "https://cdn-icons-png.flaticon.com/512/1828/1828970.png",
  secure: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
};

const faqs = [
  {
    question: "How do I order medicines?",
    answer: "Select your city, add medicines to your list, compare offers, and place your order online.",
  },
  {
    question: "Is my information secure?",
    answer: "Yes, we use industry-standard security to protect your data and orders.",
  },
  {
    question: "How fast is delivery?",
    answer: "Delivery times depend on your location and selected pharmacy, but most orders are delivered within a few hours.",
  },
];



const HomePage = () => {
const [openFaq, setOpenFaq] = useState(null);
const { customer, pharmacy } = useAuth();

  return (
    <div className="homepage-container">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <section className="hero-section full-width-bg">
        <div className="hero-bg" style={{backgroundImage: "url('https://plus.unsplash.com/premium_photo-1682129892808-3476952259c7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}} />
        <div className="hero-content">
          <h1 className="hero-title">Your Local Pharmacy, Now Online</h1>
          <p className="hero-subtitle">Compare prices, check availability, and order medicines from trusted pharmacies near you. Experience healthcare simplified.</p>
          <div className="hero-ctas">
            {pharmacy ? (
              <Link to="/pharmacy-dashboard" className="cta-button">Your Dashboard</Link>
            ) : (
              <>
                <Link to="/buy-medicine" className="cta-button">Buy Medicines</Link>
                {!customer ? (
                  <Link to="/pharmacy-auth" className="cta-button secondary">Pharmacy Login/Signup</Link>
                ) : (
                  <Link to="/user-requests" className="cta-button secondary">User Requests</Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section full-width-section" id="how-it-works">
        <h2>How It Works</h2>
        <div className="steps steps-3">
          <div className="step">
            <img src={icons.city} alt="Select City" className="card-icon step-anim" />
            <h3>1. Select Your City</h3>
            <p>Choose your location to find nearby pharmacies</p>
          </div>
          <div className="step">
            <img src={icons.list} alt="Create List" className="card-icon step-anim" />
            <h3>2. Create Medicine List</h3>
            <p>Add required medicines and quantities</p>
          </div>
          <div className="step">
            <img src={icons.compare} alt="Compare & Order" className="card-icon step-anim" />
            <h3>3. Compare & Order</h3>
            <p>Compare prices and place your order</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="features-section full-width-section" id="features">
        <h2>Key Features</h2>
        <div className="features features-3">
          <div className="feature">
            <img src={icons.price} alt="Price Comparison" className="card-icon feature-anim" />
            <h4>Price Comparison</h4>
            <p>Compare medicine prices across multiple pharmacies</p>
          </div>
          <div className="feature">
            <img src={icons.realtime} alt="Real-time Availability" className="card-icon feature-anim" />
            <h4>Real-time Availability</h4>
            <p>Check medicine availability instantly</p>
          </div>
          <div className="feature">
            <img src={icons.secure} alt="Secure Orders" className="card-icon feature-anim" />
            <h4>Secure Orders</h4>
            <p>Safe and secure medicine ordering process</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section full-width-section" id="faq">
        <h2>FAQs</h2>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div className={`faq-item${openFaq === idx ? " open" : ""}`} key={idx}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                {faq.question}
                <span className="faq-arrow">{openFaq === idx ? "▲" : "▼"}</span>
              </button>
              <div className="faq-answer" style={{display: openFaq === idx ? "block" : "none"}}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Support/CTA Section */}
      <section className="support-section full-width-bg">
        <div className="support-bg" style={{backgroundImage: "url('https://images.unsplash.com/photo-1671108503276-1d3d5ab23a3a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}} />
        <div className="support-content">
          <div className="support-logo">PharmacyConnect</div>
          <h3>Need Help?</h3>
          <p>Our support team is available 24/7</p>
          <button className="support-button">Email Support</button>
        </div>
      </section>

      {/* Footer is injected globally in App */}
    </div>
  );
};


export default HomePage; 