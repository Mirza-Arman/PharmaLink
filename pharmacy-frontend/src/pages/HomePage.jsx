import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import { useAuth } from "../AuthContext";
import Header from "../component/Header";
import Hero from "../component/Hero";

// Icon URLs for sections
const icons = {
  // generic
  price: "https://cdn-icons-png.flaticon.com/512/2983/2983872.png", // bill icon
  realtime: "https://cdn-icons-png.flaticon.com/512/190/190411.png", // checkmark
  secure: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",

  // how it works
  meds: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png", // pills
  city: "https://cdn-icons-png.flaticon.com/512/535/535239.png", // map pin
  pharmacy: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png", // pharmacy
  bids: "https://cdn-icons-png.flaticon.com/512/2983/2983872.png", // bill/offer
  clock: "https://cdn-icons-png.flaticon.com/512/2088/2088617.png", // clock
  rider: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // delivery rider
  pill: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png", // pill icon
  truck: "https://cdn-icons-png.flaticon.com/512/1048/1048313.png", // delivery truck
};

const faqs = [
  {
    icon: 'pill',
    question: "How do I order medicines?",
    answer: "Start by selecting your city so we can show pharmacies that serve your area. Next, add the medicines you need (tablet, syrup, or capsule) and specify quantities or upload a prescription if required. Submit your request and nearby pharmacies will respond with prices, stock availability, and estimated delivery times. You can compare offers side‑by‑side, chat or ask for clarification if needed, and then confirm the pharmacy that best fits your budget and timing. Once confirmed, you’ll receive order updates and a delivery ETA.",
  },
  {
    icon: 'secure',
    question: "Is my information secure?",
    answer: "Yes. We use industry‑standard encryption (HTTPS/TLS) for all data in transit and apply strict access controls to protect your profile, prescription details, and order history. Only verified pharmacies participating in your request can view the minimum information required to provide a quote. We never sell your data, and you can delete your account or request data export at any time via settings.",
  },
  {
    icon: 'truck',
    question: "How fast is delivery?",
    answer: "Most orders are fulfilled within a few hours on the same day, depending on stock and your location. Each pharmacy includes an estimated delivery window in its offer, along with any delivery fee. After you confirm an order, you’ll see real‑time status updates and can contact the pharmacy or rider if needed. For urgent needs, look for offers marked ‘express’ with faster delivery slots.",
  },
];

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const { customer, pharmacy } = useAuth();

  return (
    <div className="homepage-container">
      {/* Header */}
      <Header />
      {/* Site-wide Reusable Hero */}
      <Hero
        title="Your Local Pharmacy, Now Online"
        subtitle="Compare prices, check availability, and order medicines from trusted pharmacies near you. Experience healthcare simplified."
        imageAlt="Illustration of a patient ordering medicines online via mobile or laptop, and a pharmacist or delivery rider preparing a package. Includes healthcare icons like pills, capsules, medicine bottles, and delivery box. Clean, minimal white background with soft blue/green gradient. Modern flat vector style, professional and friendly."
        align="image-left"
        imageSrc={null}
        bgImageSrc="/hero-pharmacy.jpg"
        overlay={true}
        bulletPoints={[
          "Real-time availability",
          "Compare prices across pharmacies",
          "Secure and private ordering",
          "Trusted local pharmacies",
          "Fast delivery options",
        ]}
        ctaPrimary={pharmacy ? { label: "Your Dashboard", to: "/pharmacy-dashboard" } : { label: "Buy Medicines", to: "/buy-medicine" }}
        ctaSecondary={pharmacy ? null : (!customer ? { label: "Pharmacy Login/Signup", to: "/pharmacy-auth" } : { label: "User Requests", to: "/user-requests" })}
      />

      {/* How It Works - Modern 4-step timeline */}
      <section className="howitworks full-width-section" id="how-it-works">
        <div className="hiw-inner">
          <h2 className="hiw-title">How It Works</h2>
          <div className="hiw-timeline">
            {/* Step 1 */}
            <div className="hiw-step">
              <div className="hiw-icon">
                <img src="/create%20medicine%20logo.svg" alt="Create Medicine List" />
              </div>
              <span className="hiw-number">1</span>
              <h3 className="hiw-heading">Create Medicine List</h3>
              <p className="hiw-text">Add tablets, syrups, and capsules to your list.</p>
            </div>

            {/* Step 2 */}
            <div className="hiw-step">
              <div className="hiw-icon">
                <img src="/ocation%20logo.svg" alt="Select City & Pharmacies" />
              </div>
              <span className="hiw-number">2</span>
              <h3 className="hiw-heading">Select City & Pharmacies</h3>
              <p className="hiw-text">Choose your city and nearby trusted pharmacies.</p>
            </div>

            {/* Step 3 */}
            <div className="hiw-step">
              <div className="hiw-icon">
                <img src="/bid%20logo.svg" alt="Receive Bids" />
              </div>
              <span className="hiw-number">3</span>
              <h3 className="hiw-heading">Receive Bids</h3>
              <p className="hiw-text">Compare offers with price and delivery time.</p>
            </div>

            {/* Step 4 */}
            <div className="hiw-step">
              <div className="hiw-icon">
                <img src="/delivery%20icon.svg" alt="Confirm Order & Delivery" />
              </div>
              <span className="hiw-number">4</span>
              <h3 className="hiw-heading">Confirm Order & Delivery</h3>
              <p className="hiw-text">Select a pharmacy, confirm, and track delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Pharmacy Partners - Inserted between How It Works and Key Features */}
      <section className="home-partners-section" id="partners">
        <h2 className="partners-title">Trusted <span className="highlight">Pharmacy Partners</span></h2>
        <p className="partners-subtitle">Partnering with leading pharmacies across the nation to ensure quality healthcare for everyone</p>
        <div className="partners-grid">
          <div className="partner-logo">
            <span className="partner-name">MediCare</span>
            <span className="partner-tag">Premium</span>
          </div>
          <div className="partner-logo">
            <span className="partner-name">HealthPlus</span>
            <span className="partner-tag">24/7</span>
          </div>
          <div className="partner-logo">
            <span className="partner-name">PharmaCare</span>
            <span className="partner-tag">Trusted</span>
          </div>
          <div className="partner-logo">
            <span className="partner-name">WellnessRx</span>
            <span className="partner-tag">Quality</span>
          </div>
          <div className="partner-logo">
            <span className="partner-name">CarePharm</span>
            <span className="partner-tag">Reliable</span>
          </div>
          <div className="partner-logo">
            <span className="partner-name">LifeRx</span>
            <span className="partner-tag">Fast</span>
          </div>
          <div className="partner-logo">
            <span className="partner-name">HealthFirst</span>
            <span className="partner-tag">Expert</span>
          </div>
          <div className="partner-logo">
            <span className="partner-name">MediLink</span>
            <span className="partner-tag">Innovative</span>
          </div>
        </div>
      </section>

      {/* Key Features - Modern cards */}
      <section className="features-modern full-width-section" id="features">
        <div className="features-inner">
          <h2 className="features-title">Key Features</h2>
          <p className="features-subtitle">Why choose our pharmacy marketplace</p>
          <div className="features-grid">
            {/* Card 1 */}
            <div className="feature-card">
              <div className="feature-icon" aria-hidden>
                <img src="/price%20compare%20logo.svg" alt="Price Comparison" />
              </div>
              <h3 className="feature-heading">Price Comparison</h3>
              <p className="feature-text">Compare medicine prices across multiple pharmacies to get the best deal.</p>
            </div>
            {/* Card 2 */}
            <div className="feature-card">
              <div className="feature-icon"><img src="/tick%20logo.svg" alt="Real-time Availability" /></div>
              <h3 className="feature-heading">Real-time Availability</h3>
              <p className="feature-text">Check instant availability of medicines across verified pharmacies.</p>
            </div>
            {/* Card 3 */}
            <div className="feature-card">
              <div className="feature-icon"><img src={icons.secure} alt="Secure Orders" /></div>
              <h3 className="feature-heading">Secure Orders</h3>
              <p className="feature-text">Place safe and secure medicine orders with end-to-end protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs - Modern Accordion */}
      <section className="faqs-modern full-width-section" id="faq">
        <div className="faqs-inner">
          <h2 className="faqs-title">Frequently Asked Questions</h2>
          <p className="faqs-subtitle">Everything you need to know before placing your order</p>
          <div className="faqs-list">
            {faqs.map((faq, idx) => (
              <div className={`faqs-item${openFaq === idx ? " open" : ""}`} key={idx}>
                <button className="faqs-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  <span className="faqs-q-left">
                    <span className="faqs-q-icon">
                      <img src={icons[faq.icon] || icons.pill} alt="faq icon" />
                    </span>
                    <span className="faqs-q-text">{faq.question}</span>
                  </span>
                  <span className="faqs-arrow" aria-hidden>{openFaq === idx ? "−" : "+"}</span>
                </button>
                <div className="faqs-answer" style={{height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0}}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support/CTA Section */}
      <section className="support-section full-width-bg">
        <div className="support-bg" style={{backgroundImage: "url('https://images.unsplash.com/photo-1671108503276-1d3d5ab23a3a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}} />
        <div className="support-content">
          
          <div className="support-logo">PharmacyConnect</div>
          <h3>Need Help?</h3>
          <p>Our support team is available 24/7</p>
          <Link to="/contact#send-message" className="support-button">Email Support</Link>
        </div>
      </section>

      {/* Footer is injected globally in App */}
    </div>
  );
};


export default HomePage; 