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
    <section className="about-hero-bg">
      <div className="about-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGhhcm1hY3l8ZW58MHx8MHx8fDA%3D')" }} />
      <div className="about-hero-content">
        <h1>About MediLink</h1>
        <p>
          MediLink is your digital bridge to local pharmacies. We make it easy to request medicines, compare offers, and get your orders delivered quickly and safely—all from the comfort of your home.
        </p>
      </div>
    </section>

    <section className="about-section bg">
      <h2>Our Mission</h2>
      <p>To empower communities with seamless, safe, and transparent access to essential medicines through technology.</p>
      <h2>Our Vision</h2>
      <p>To become the most trusted digital healthcare platform, connecting people to pharmacies everywhere.</p>
    </section>

    <section className="about-section">
      <h2>Our Story</h2>
      <p>
        MediLink was born out of a simple realization: many people struggle to find the medicines they need, especially during emergencies or after hours. Our founders experienced this firsthand when a family member couldn’t get timely access to essential medication. This inspired us to create a platform that connects customers with multiple pharmacies, ensuring availability, price transparency, and peace of mind.
      </p>
    </section>

    <section className="about-section bg">
      <h2>Key Features</h2>
      <ul>
        {features.map((f, i) => (
          <li key={i}><span className="checkmark">✔</span> {f}</li>
        ))}
      </ul>
    </section>

    <section className="about-section">
      <h2>Meet the Team</h2>
      <div className="about-team">
        {team.map((member, i) => (
          <div key={i} className="about-team-card">
            <img src={member.img} alt={member.name + " photo"} className="team-photo" />
            <div className="name">{member.name}</div>
            <div className="role">{member.role}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="about-section bg">
      <h2>Why Choose Us?</h2>
      <ul>
        {whyChooseUs.map((point, i) => (
          <li key={i}>• {point}</li>
        ))}
      </ul>
    </section>

    <section className="about-contact">
      <h2>Contact Us</h2>
      <p>Have questions or want to learn more? <Link to="/contact">Reach out to our team</Link> and we’ll be happy to help!</p>
    </section>
  </div>
);

export default About;
