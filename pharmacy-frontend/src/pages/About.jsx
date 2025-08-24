import React from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import "./About.css";

const team = [
  { name: "Arman Ejaz", role: "Backend & Database Developer", img: "https://randomuser.me/api/portraits/men/46.jpg" },
  { name: "Ali Hassan", role: "Frontend Developer", img: "https://images.unsplash.com/photo-1608734265656-f035d3e7bcbf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJveXxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Sikandar Aftab", role: "Market Research & Analyst", img: "https://randomuser.me/api/portraits/women/47.jpg" },
];

const features = [
  "Request medicines from multiple pharmacies",
  "Receive pharmacy responses with availability & bills",
  "Confirm orders with Cash on Delivery",
  "Admin monitoring for safety",
];

const whyChooseUs = [
  "Fast, reliable medicine ordering from trusted local pharmacies",
  "Transparent pricing and real-time availability",
  "Secure transactions and privacy protection",
  "Dedicated support and admin oversight for your safety",
];

const About = () => (
  <div className="about-page">
    <Header />
    
    {/* Hero Section - Left Content + Right Stats */}
    <section className="about-hero-section">
      <div className="about-hero-container">
        <div className="about-hero-left">
          <h1 className="about-hero-title">
            Your Health Our Priority <span className="highlight">Get Connected</span>
          </h1>
          <p className="about-hero-subtitle">
            MediLink bridges the gap between customers and local pharmacies, ensuring you get the medicines you need when you need them. Our platform makes healthcare accessible, affordable, and convenient for everyone.
          </p>
          <div className="about-hero-buttons">
            <Link to="/" className="about-btn primary">Get Started</Link>
            <Link to="/" className="about-btn secondary">Learn More</Link>
          </div>
        </div>
        <div className="about-hero-right">
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Partner Pharmacies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Secure Orders</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Timeline/Process Section */}
    <section className="about-timeline-section">
      <div className="about-timeline-container">
        <div className="about-timeline-right">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2024</div>
              <div className="timeline-label">Foundation & Vision</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2024</div>
              <div className="timeline-label">Platform Development</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2025</div>
              <div className="timeline-label">Beta Launch</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2025</div>
              <div className="timeline-label">Full Launch</div>
            </div>
          </div>
        </div>
        <div className="about-timeline-left">
          <h2 className="about-section-title">
            Your Gateway To <span className="highlight">Healthcare Excellence</span>
          </h2>
          <p className="about-section-desc">
            From our humble beginnings to becoming a trusted healthcare platform, we've been committed to making medicine accessible to everyone. Our journey is marked by continuous innovation and unwavering dedication to customer satisfaction. We started with a simple vision: to bridge the gap between patients and pharmacies, ensuring that essential medicines are always within reach. Through rigorous development and testing, we've created a platform that not only connects customers with trusted local pharmacies but also provides real-time availability, competitive pricing, and secure transactions. Our commitment to excellence drives us to continuously improve our services, making healthcare more accessible, affordable, and convenient for everyone.
          </p>
        </div>
      </div>
    </section>

    {/* Features/Services Section */}
    <section className="about-features-section">
      <h2 className="about-section-title center">
        Thoughtful <span className="highlight">Healthcare Solutions</span>
      </h2>
      <div className="features-grid">
        <div className="feature-card primary">
          <div className="feature-icon">💊</div>
          <h3>Medicine Availability</h3>
          <p>Real-time stock checking across multiple pharmacies</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Price Comparison</h3>
          <p>Compare prices and choose the best deal</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Quick delivery with secure payment options</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Secure Platform</h3>
          <p>Your data and transactions are completely secure</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Mobile Responsive Website</h3>
          <p>Order medicines on-the-go with our mobile responsive website</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏥</div>
          <h3>Pharmacy Network</h3>
          <p>Access to trusted local pharmacies nationwide</p>
        </div>
      </div>
    </section>

    {/* Partner Pharmacies Section */}
    <section className="about-partners-section">
      <h2 className="about-section-title center">
        Trusted <span className="highlight">Pharmacy Partners</span>
      </h2>
      <p className="partners-subtitle">
        Partnering with leading pharmacies across the nation to ensure quality healthcare for everyone
      </p>
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
        <div className="partner-logo">
          <span className="partner-name">VitaCare</span>
          <span className="partner-tag">Premium</span>
        </div>
        <div className="partner-logo">
          <span className="partner-name">PharmaPlus</span>
          <span className="partner-tag">Trusted</span>
        </div>
      </div>
    </section>

    {/* Team Section */}
    <section className="about-team-section">
      <div className="about-team-container">
        <div className="about-team-left">
          <h2 className="about-section-title">
            Crafting <span className="highlight">Healthcare Solutions</span> That Inspire
          </h2>
          <p className="about-section-desc">
            Our team of dedicated professionals works tirelessly to ensure that every aspect of our platform serves our users' needs. From development to customer support, we're committed to excellence in everything we do.
          </p>
          <div className="about-team-buttons">
            <Link to="/" className="about-btn primary">Get Started</Link>
            <Link to="/contact" className="about-btn secondary">Contact Us</Link>
          </div>
        </div>
        <div className="about-team-right">
          <div className="team-list">
        {team.map((member, i) => (
              <div key={i} className="team-member-item">
                <div className="team-member-avatar">
                  <img src={member.img} alt={member.name} />
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">{member.name}</div>
                  <div className="team-member-role">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Why Choose Us Section */}
    <section className="about-why-choose-section">
      <div className="about-why-choose-container">
        <div className="about-why-choose-left">
          <h2 className="about-section-title">
            Why <span className="highlight">Choose MediLink?</span>
          </h2>
          <div className="why-choose-list">
            {whyChooseUs.map((reason, i) => (
              <div key={i} className="why-choose-item">
                <div className="why-choose-icon">✓</div>
                <p>{reason}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="about-why-choose-right">
          <img 
            src="https://images.unsplash.com/photo-1698466632366-09fa1d925de6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhhcm1hY3klMjBwaWN0dXJlc3xlbnwwfHwwfHx8MA%3D%3D" 
            alt="Why Choose Us" 
            className="why-choose-image"
          />
        </div>
      </div>
    </section>
  </div>
);

export default About;
