// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send the form data to your backend
      console.log('Form submitted:', formData);
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Get In Touch</h1>
            <p className="hero-subtitle">
              Have questions about our delicious chicken? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          {/* Contact Information */}
          <section className="contact-info">
            <h2 className="section-title">Contact Information</h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Our Location</h3>
                <p>123 Chicken Street<br />Foodville, FL 32801</p>
              </div>
              
              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>Phone Number</h3>
                <p>(555) 123-4567<br />Mon-Sun: 10AM - 10PM</p>
              </div>
              
              <div className="info-card">
                <div className="info-icon">✉️</div>
                <h3>Email Us</h3>
                <p>hello@chickendelight.com<br />support@chickendelight.com</p>
              </div>
              
              <div className="info-card">
                <div className="info-icon">🕒</div>
                <h3>Business Hours</h3>
                <p>Monday - Sunday<br />10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="contact-form-section">
            <h2 className="section-title">Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              {submitError && (
                <div className="form-error">
                  {submitError}
                </div>
              )}
              
              {submitSuccess && (
                <div className="form-success">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </section>

          {/* Map Section */}
          <section className="contact-map">
            <h2 className="section-title">Find Us</h2>
            <div className="map-container">
              <div className="map-placeholder">
                <div className="map-icon">🗺️</div>
                <p>Interactive Map Would Be Here</p>
                <div className="map-marker">
                  <div className="marker-icon">🍗</div>
                  <div className="marker-label">Chicken Delight</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Need Immediate Assistance?</h2>
            <p>Call us directly or order online for the fastest service.</p>
            <div className="cta-buttons">
              <a href="tel:+15551234567" className="btn-primary">
                <span className="btn-icon">📞</span>
                Call Now
              </a>
              <a href="/menu" className="btn-outline">
                <span className="btn-icon">🍗</span>
                Order Online
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;