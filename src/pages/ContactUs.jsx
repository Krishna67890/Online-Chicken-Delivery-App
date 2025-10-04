// src/pages/ContactUs/ContactUs.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import ContactForm from '../../components/ContactForm/ContactForm';
import ContactInfo from '../../components/ContactInfo/ContactInfo';
import FAQSection from '../../components/FAQSection/FAQSection';
import LiveChat from '../../components/LiveChat/LiveChat';
import StoreLocator from '../../components/StoreLocator/StoreLocator';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { contactService } from '../../services/contactService';
import { validationSchemas } from '../../utils/validation';
import './ContactUs.css';

const ContactUs = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    orderNumber: '',
    urgency: 'normal',
    message: '',
    attachments: []
  });

  // Contact information
  const contactInfo = {
    email: 'krishnaajaysing.patil@gmail.com',
    phone: '+91 XXXXXXXXXX', // Masked for privacy
    customerService: '+1-800-CHICKEN',
    address: '123 Chicken Street, Food District, Mumbai, Maharashtra 400001',
    hours: {
      monday_friday: '9:00 AM - 11:00 PM',
      saturday_sunday: '10:00 AM - 12:00 AM'
    },
    socialMedia: {
      facebook: 'https://facebook.com/chickendelivery',
      instagram: 'https://instagram.com/chickendelivery',
      twitter: 'https://twitter.com/chickendelivery'
    }
  };

  // FAQ categories
  const faqCategories = [
    {
      id: 'ordering',
      title: 'Ordering & Payment',
      icon: '🛒',
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'You can place an order through our website, mobile app, or by calling our customer service. Simply select your items, customize as needed, and proceed to checkout.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept credit/debit cards, digital wallets (Google Pay, PhonePe, Paytm), UPI, net banking, and cash on delivery.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 5 minutes of placing it. After that, please contact our customer service immediately.'
        }
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery & Pickup',
      icon: '🚚',
      questions: [
        {
          question: 'What are your delivery areas?',
          answer: 'We deliver within a 10km radius of our restaurant locations. Enter your address during checkout to check availability.'
        },
        {
          question: 'How long does delivery take?',
          answer: 'Standard delivery takes 30-45 minutes. Express delivery (available in select areas) takes 20-30 minutes.'
        },
        {
          question: 'Do you offer contactless delivery?',
          answer: 'Yes, we offer contactless delivery. You can request this option during checkout.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Rewards',
      icon: '👤',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click on "Sign Up" and provide your email, phone number, and create a password. You can also sign up with Google or Facebook.'
        },
        {
          question: 'How does the loyalty program work?',
          answer: 'Earn 10 points for every ₹100 spent. Redeem points for discounts, free items, and exclusive offers.'
        },
        {
          question: 'I forgot my password. How can I reset it?',
          answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
        }
      ]
    },
    {
      id: 'quality',
      title: 'Food Quality & Safety',
      icon: '🍗',
      questions: [
        {
          question: 'How do you ensure food safety?',
          answer: 'We follow strict hygiene protocols, use fresh ingredients daily, and maintain proper temperature control throughout preparation and delivery.'
        },
        {
          question: 'Can I customize my spice level?',
          answer: 'Yes! You can choose from Mild, Medium, Hot, or Extra Hot for most menu items during customization.'
        },
        {
          question: 'Do you offer vegetarian options?',
          answer: 'While we specialize in chicken, we offer vegetarian sides like fries, coleslaw, garlic bread, and salads.'
        }
      ]
    }
  ];

  // Quick help topics
  const quickHelpTopics = [
    {
      icon: '📦',
      title: 'Track Your Order',
      description: 'Check real-time status of your delivery',
      action: () => navigate('/track-order')
    },
    {
      icon: '🔄',
      title: 'Reorder Favorite',
      description: 'Quickly order your previous favorites',
      action: () => navigate('/profile/orders')
    },
    {
      icon: '💳',
      title: 'Payment Issues',
      description: 'Troubleshoot payment problems',
      action: () => setActiveTab('payment')
    },
    {
      icon: '🍗',
      title: 'Menu Questions',
      description: 'Learn about ingredients and options',
      action: () => setActiveTab('quality')
    },
    {
      icon: '🏠',
      title: 'Delivery Address',
      description: 'Update or change delivery location',
      action: () => navigate('/profile/addresses')
    },
    {
      icon: '⭐',
      title: 'Leave Feedback',
      description: 'Share your experience with us',
      action: () => setActiveTab('feedback')
    }
  ];

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle file attachments
  const handleFileUpload = useCallback((files) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  }, []);

  // Handle file removal
  const handleFileRemove = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);

      // Validate form data
      const validation = validationSchemas.contact;
      const errors = {};
      
      if (!formData.name.trim()) errors.name = 'Name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
      if (!formData.message.trim()) errors.message = 'Message is required';

      if (Object.keys(errors).length > 0) {
        showError('Please fill in all required fields correctly');
        return;
      }

      // Submit to backend
      await contactService.submitContactForm(formData);

      // Show success message
      showSuccess('Your message has been sent successfully! We\'ll get back to you within 24 hours.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        orderNumber: '',
        urgency: 'normal',
        message: '',
        attachments: []
      });

    } catch (error) {
      showError('Failed to send your message. Please try again or contact us directly.');
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle quick action
  const handleQuickAction = (action) => {
    action();
  };

  // Start live chat
  const handleStartChat = () => {
    setLiveChatOpen(true);
  };

  // Call customer service
  const handleCallSupport = () => {
    if (window.confirm('Call customer service at +1-800-CHICKEN?')) {
      window.location.href = 'tel:+18002442536';
    }
  };

  return (
    <div className="contact-us-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">We're Here to Help</h1>
              <p className="hero-subtitle">
                Have questions, feedback, or need assistance? Our team is ready to help you 
                with anything related to your chicken delivery experience.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support Available</span>
                </div>
                <div className="stat">
                  <span className="stat-number">15min</span>
                  <span className="stat-label">Avg. Response Time</span>
                </div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfaction Rate</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="support-illustration">
                <div className="floating-icon">📞</div>
                <div className="floating-icon">💬</div>
                <div className="floating-icon">📧</div>
                <div className="main-illustration">🍗❤️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="quick-help-section">
        <div className="container">
          <h2 className="section-title">Quick Help</h2>
          <p className="section-subtitle">Find instant solutions to common questions</p>
          <div className="quick-help-grid">
            {quickHelpTopics.map((topic, index) => (
              <button
                key={index}
                className="help-topic-card"
                onClick={() => handleQuickAction(topic.action)}
              >
                <div className="topic-icon">{topic.icon}</div>
                <div className="topic-content">
                  <h3 className="topic-title">{topic.title}</h3>
                  <p className="topic-description">{topic.description}</p>
                </div>
                <div className="topic-arrow">→</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="contact-main">
        <div className="container">
          <div className="contact-layout">
            {/* Contact Form Section */}
            <section className="contact-form-section">
              <div className="section-header">
                <h2>Send us a Message</h2>
                <p>We typically respond within 2 hours during business hours</p>
              </div>

              <ContactForm
                formData={formData}
                onInputChange={handleInputChange}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                categories={[
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'order', label: 'Order Issue' },
                  { value: 'payment', label: 'Payment Problem' },
                  { value: 'delivery', label: 'Delivery Concern' },
                  { value: 'quality', label: 'Food Quality' },
                  { value: 'feedback', label: 'Feedback/Suggestion' },
                  { value: 'complaint', label: 'Complaint' },
                  { value: 'business', label: 'Business Inquiry' }
                ]}
                urgencyLevels={[
                  { value: 'low', label: 'Low - Whenever possible' },
                  { value: 'normal', label: 'Normal - Within 24 hours' },
                  { value: 'high', label: 'High - As soon as possible' },
                  { value: 'urgent', label: 'Urgent - Immediate attention' }
                ]}
              />
            </section>

            {/* Contact Info & Immediate Help */}
            <aside className="contact-sidebar">
              <ContactInfo
                contactInfo={contactInfo}
                onCallSupport={handleCallSupport}
                onStartChat={handleStartChat}
              />

              {/* Store Locator */}
              <div className="sidebar-section">
                <h3>Find Our Restaurants</h3>
                <StoreLocator
                  onStoreSelect={setSelectedStore}
                  selectedStore={selectedStore}
                />
              </div>

              {/* Emergency Contact */}
              <div className="emergency-contact">
                <div className="emergency-header">
                  <span className="emergency-icon">🚨</span>
                  <h4>Urgent Food Safety Issue?</h4>
                </div>
                <p>For immediate food safety concerns, call our hotline:</p>
                <a href="tel:+91" className="emergency-phone">
                  +91 None
                </a>
                <small>Available 24/7 for critical food safety matters</small>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </div>
          
          <div className="faq-tabs">
            {faqCategories.map(category => (
              <button
                key={category.id}
                className={`faq-tab ${activeTab === category.id ? 'active' : ''}`}
                onClick={() => setActiveTab(category.id)}
              >
                <span className="tab-icon">{category.icon}</span>
                <span className="tab-label">{category.title}</span>
              </button>
            ))}
          </div>

          <div className="faq-content">
            {faqCategories.map(category => (
              <div
                key={category.id}
                className={`faq-category ${activeTab === category.id ? 'active' : ''}`}
              >
                <FAQSection
                  questions={category.questions}
                  category={category.title}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Support Options */}
      <section className="support-options-section">
        <div className="container">
          <h2 className="section-title">Other Ways to Get Help</h2>
          <div className="support-options-grid">
            <div className="support-option">
              <div className="option-icon">📧</div>
              <h3>Email Support</h3>
              <p>Send detailed inquiries to our support team</p>
              <a href={`mailto:${contactInfo.email}`} className="option-link">
                {contactInfo.email}
              </a>
              <small>Response within 2-4 hours</small>
            </div>

            <div className="support-option">
              <div className="option-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Instant help from our support agents</p>
              <button className="option-link" onClick={handleStartChat}>
                Start Live Chat
              </button>
              <small>Available 9 AM - 11 PM daily</small>
            </div>

            <div className="support-option">
              <div className="option-icon">📞</div>
              <h3>Phone Support</h3>
              <p>Speak directly with our team</p>
              <button className="option-link" onClick={handleCallSupport}>
                Call +1-800-CHICKEN
              </button>
              <small>24/7 for urgent matters</small>
            </div>

            <div className="support-option">
              <div className="option-icon">🌐</div>
              <h3>Social Media</h3>
              <p>Connect with us on social platforms</p>
              <div className="social-links">
                <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href={contactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Component */}
      {liveChatOpen && (
        <LiveChat
          isOpen={liveChatOpen}
          onClose={() => setLiveChatOpen(false)}
          userEmail={formData.email}
          userName={formData.name}
        />
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="loading-content">
            <LoadingSpinner size="large" />
            <p>Sending your message...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;