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
    <section className="about-hero-bg about-hero-simple">
      <div className="about-hero-fade">
        <h1 className="about-us-title">About Us</h1>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="about-section bg">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
        <div className="fade-left" style={{ flex: 1, minWidth: 260 }}>
          <h2 className="fade-left">Our Mission</h2>
          <p>To empower communities with seamless, safe, and transparent access to essential medicines through technology.</p>
        </div>
        <div className="fade-right" style={{ flex: 1, minWidth: 260 }}>
          <h2 className="fade-right">Our Vision</h2>
          <p>To become the most trusted digital healthcare platform, connecting people to pharmacies everywhere.</p>
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="about-section">
      <h2 className="fade-left">Our Story</h2>
      <p style={{ fontSize: '1.1rem', color: '#444' }}>
        MediLink was born out of a simple realization: many people struggle to find the medicines they need, especially during emergencies or after hours. Our founders experienced this firsthand when a family member couldn’t get timely access to essential medication. This inspired us to create a platform that connects customers with multiple pharmacies, ensuring availability, price transparency, and peace of mind.
      </p>
    </section>

    {/* Features */}
    <section className="about-section bg">
      <h2 className="fade-right">Key Features</h2>
      <ul>
        {features.map((f, i) => (
          <li key={i}><span className="checkmark">✔</span> {f}</li>
        ))}
      </ul>
    </section>

    {/* Team */}
    <section className="about-section">
      <h2 className="fade-left">Meet the Team</h2>
      <div className="about-team">
        {team.map((member, i) => (
          <div key={i} className="about-team-member">
            <img src={member.img} alt={member.name + ' photo'} className="team-photo-large" />
            <div className="name">{member.name}</div>
            <div className="role">{member.role}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="about-section bg">
      <h2 className="fade-right">Why Choose Us?</h2>
      <ul>
        {whyChooseUs.map((point, i) => (
          <li key={i}>• {point}</li>
        ))}
      </ul>
    </section>

    {/* Contact */}
    <section className="about-contact">
      <h2 className="fade-left">Contact Us</h2>
      <p>Have questions or want to learn more? <Link to="/contact">Reach out to our team</Link> and we’ll be happy to help!</p>
    </section>
  </div>
);

export default About;
