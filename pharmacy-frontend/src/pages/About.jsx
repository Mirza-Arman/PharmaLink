import React from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import "./About.css";

const team = [
  { name: "Ali Hassan", role: "Frontend Developer", img: "https://images.unsplash.com/photo-1608734265656-f035d3e7bcbf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJveXxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Arman Ejaz", role: "Backend & Database Developer", img: "https://randomuser.me/api/portraits/men/46.jpg" },
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
    {/* Hero Section */}
    <section className="about-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=1200&auto=format&fit=crop&q=80')" }}>
      <div className="about-hero-content">
        <h1>MediLink</h1>
        <p style={{ fontSize: '1.3rem', fontStyle: 'italic', color: '#000', marginBottom: 16 }}>
          "Connecting you to trusted pharmacies, wherever you are."
        </p>
        <p style={{ maxWidth: 810, margin: '0 auto', color: '#000' }}>
          MediLink is your digital bridge to local pharmacies. We make it easy to request medicines, compare offers, and get your orders delivered quickly and safely—all from the comfort of your home.
        </p>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="about-section bg">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2>Our Mission</h2>
          <p>To empower communities with seamless, safe, and transparent access to essential medicines through technology.</p>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2>Our Vision</h2>
          <p>To become the most trusted digital healthcare platform, connecting people to pharmacies everywhere.</p>
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="about-section">
      <h2>Our Story</h2>
      <p style={{ fontSize: '1.1rem', color: '#444' }}>
        MediLink was born out of a simple realization: many people struggle to find the medicines they need, especially during emergencies or after hours. Our founders experienced this firsthand when a family member couldn’t get timely access to essential medication. This inspired us to create a platform that connects customers with multiple pharmacies, ensuring availability, price transparency, and peace of mind.
      </p>
    </section>

    {/* Features */}
    <section className="about-section bg">
      <h2>Key Features</h2>
      <ul>
        {features.map((f, i) => (
          <li key={i}><span className="checkmark">✔</span> {f}</li>
        ))}
      </ul>
    </section>

    {/* Team */}
    <section className="about-section">
      <h2>Meet the Team</h2>
      <div className="about-team">
        {team.map((member, i) => (
          <div key={i} className="about-team-card">
            <img src={member.img} alt={member.name + " photo"} className="team-photo" style={{ borderRadius: '50%', width: 90, height: 90, objectFit: 'cover', marginBottom: 12, boxShadow: '0 2px 8px #0001' }} />
            <div className="name" style={{ fontWeight: 600, fontSize: '1.15rem', marginBottom: 4 }}>{member.name}</div>
            <div className="role" style={{ color: '#2ca7a0', fontWeight: 500 }}>{member.role}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="about-section bg">
      <h2>Why Choose Us?</h2>
      <ul>
        {whyChooseUs.map((point, i) => (
          <li key={i}>• {point}</li>
        ))}
      </ul>
    </section>

    {/* Contact */}
    <section className="about-contact">
      <h2>Contact Us</h2>
      <p>Have questions or want to learn more? <Link to="/contact">Reach out to our team</Link> and we’ll be happy to help!</p>
    </section>
  </div>
);

export default About;
