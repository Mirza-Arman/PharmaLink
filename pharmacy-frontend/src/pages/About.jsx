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
        <div className="about-hero-content-new">
          <h1 className="about-us-title">About Us</h1>
          {/* <p className="about-hero-desc">
            MediLink is a digital bridge connecting you to trusted pharmacies. Our platform makes it easy to request medicines, compare offers, and get your orders delivered quickly and safely—all from the comfort of your home.
          </p> */}
        </div>
      </div>
    </section>

    {/* Story + Image Section */}
    <section className="about-story-section">
      <div className="about-story-content">
        <div className="about-story-text">
          <h2 className="fade-left">Our Story</h2>
          <p>
            MediLink was born out of a simple realization: many people struggle to find the medicines they need, especially during emergencies or after hours. Our founders experienced this firsthand when a family member couldn't get timely access to essential medication. This inspired us to create a platform that connects customers with multiple pharmacies, ensuring availability, price transparency, and peace of mind.
          </p>
        </div>
        <div className="about-story-image">
          <img src="https://images.unsplash.com/photo-1698466632366-09fa1d925de6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhhcm1hY3klMjBwaWN0dXJlc3xlbnwwfHwwfHx8MA%3D%3D" alt="Pharmacy" />
        </div>
      </div>
    </section>

    {/* Mission & Vision Cards */}
    <section className="about-mission-vision-section">
      <div className="about-mission-vision-cards">
        <div className="about-mission-card fade-left">
          <h2>Our Mission</h2>
          <p>
          Our mission is to make healthcare more accessible and affordable by connecting customers with local pharmacies through a simple, secure, and convenient online marketplace for ordering medicines..</p>
        </div>
        <div className="about-vision-card fade-right">
          <h2>Our Vision</h2>
          <p>To become the leading online pharmacy marketplace that ensures everyone can access the medicines they need—quickly, affordably, and reliably..</p>
        </div>
      </div>
    </section>

    {/* Team Members Section */}
    <section className="about-team-section">
      <h2 className="fade-left">Meet Our Team</h2>
      <div className="about-team-new">
        {team.map((member, i) => (
          <div key={i} className="about-team-member-new">
            <img src={member.img} alt={member.name + ' photo'} className="team-photo-large-new" />
            <div className="name">{member.name}</div>
            <div className="role">{member.role}</div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default About;
