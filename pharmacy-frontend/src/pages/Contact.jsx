import React, { useState } from 'react';
import Header from '../component/Header';
import contactImage from '../assets/logo.jpg';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });

    if (!name || !email || !subject || !message) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const contentType = response.headers.get('content-type') || '';
      let payload;
      try {
        if (contentType.includes('application/json')) {
          payload = await response.json();
        } else {
          const text = await response.text();
          payload = { message: text };
        }
      } catch (parseErr) {
        const text = await response.text().catch(() => '');
        payload = { message: text };
      }

      if (!response.ok) {
        throw new Error(payload.error || payload.message || 'Submission failed');
      }

      setStatus({ type: 'success', text: payload.message || 'Thanks! Your message has been sent.' });
      resetForm();
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />

      <section className="contact-hero full-width-bg">
        <div
          className="contact-hero-bg"
          style={{
            backgroundImage:
              "url('https://plus.unsplash.com/premium_photo-1681995729207-04e4d7210227?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>
          Have questions, feedback, or need assistance with your medicine requests? Our team at MediLink is always ready to support you. Reach out to us and we’ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="contact-grid full-width-section">
        <div className="contact-card">
          <div className="icon-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#fff" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8.236l7.386 6.275a1 1 0 001.228 0L20 8.236V18H4z"/>
            </svg>
          </div>
          <h3>Email</h3>
          <a className="value-link" href="mailto:support@pharmacyconnect.app">support@pharmacyconnect.app</a>
        </div>

        <div className="contact-card">
          <div className="icon-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#fff" d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1 17 17 0 01-17-17 1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z"/>
            </svg>
          </div>
          <h3>Phone</h3>
          <a className="value-link" href="tel:+923001234567">+92 300 1234567</a>
        </div>

        <div className="contact-card">
          <div className="icon-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#fff" d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
            </svg>
          </div>
          <h3>Office</h3>
          <p>Govt.Jinnah Islamia College Sialkot</p>
          <p className="muted">Mon–Fri, 9:00 AM – 6:00 PM</p>
        </div>
      </section>

      <section className="contact-form-section full-width-section">
        <div className="form-wrapper">
          <div className="form-visual">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" alt="Contact" />
          </div>
          <div className="form-content">
            <h2>Send us a message</h2>
            <p className="form-subtitle">
              Fill the form below and our team will get back to you shortly.
            </p>

            {status.text && (
              <div className={`form-status ${status.type}`}>{status.text}</div>
            )}

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label >Message</label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button className="submit-button" type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;


