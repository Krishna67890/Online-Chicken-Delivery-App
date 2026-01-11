// src/pages/FAQ.jsx
import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "What makes your chicken special?",
          answer: "Our chicken is made with premium, antibiotic-free ingredients and our signature blend of 11 secret spices. We marinate our chicken for 24 hours before cooking to ensure maximum flavor and tenderness."
        },
        {
          question: "Do you offer delivery?",
          answer: "Yes! We offer fast and reliable delivery to most areas within a 10-mile radius of our restaurant. Delivery is free on orders over $25."
        },
        {
          question: "What are your business hours?",
          answer: "We're open 7 days a week from 10:00 AM to 10:00 PM. Our last order is taken at 9:30 PM to ensure your food is fresh and hot."
        }
      ]
    },
    {
      category: "Orders & Payment",
      questions: [
        {
          question: "How do I place an order?",
          answer: "You can place an order through our website, mobile app, or by calling us directly at (555) 123-4567. We recommend ordering through our website for the best experience and exclusive online-only deals."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, PayPal, Apple Pay, Google Pay, and cash on delivery for local orders."
        },
        {
          question: "Can I modify my order after placing it?",
          answer: "You can modify your order if it hasn't been prepared yet. Please call us immediately at (555) 123-4567, and our team will do their best to accommodate your request."
        }
      ]
    },
    {
      category: "Delivery & Pickup",
      questions: [
        {
          question: "How long does delivery take?",
          answer: "Our standard delivery time is 30-45 minutes. During peak hours (5-7 PM), it may take slightly longer. We guarantee hot, fresh food delivery within 60 minutes or your order is free."
        },
        {
          question: "Do you offer contactless delivery?",
          answer: "Yes, we offer contactless delivery as a standard option. Your food will be left at your door with a text notification when it arrives."
        },
        {
          question: "Can I schedule an order for later?",
          answer: "Yes! You can schedule your order up to 24 hours in advance through our website or app. Perfect for planning ahead for parties, family dinners, or busy weeknights."
        }
      ]
    },
    {
      category: "Dietary & Allergens",
      questions: [
        {
          question: "Do you offer vegetarian options?",
          answer: "Yes! While we're known for our chicken, we also offer delicious vegetarian options including our famous veggie wraps, salads, and plant-based nuggets made from soy protein."
        },
        {
          question: "Are your items gluten-free?",
          answer: "We offer several gluten-free options. Our grilled chicken items are naturally gluten-free. However, our fried chicken is prepared in the same kitchen as gluten-containing items, so cross-contamination may occur."
        },
        {
          question: "Do you have spicy options?",
          answer: "Absolutely! We offer 5 different spice levels from Mild to Extra Hot. Our signature 'Fire Wings' are our hottest item, but we can customize the spice level on most items to your preference."
        }
      ]
    },
    {
      category: "Special Offers",
      questions: [
        {
          question: "Do you have a loyalty program?",
          answer: "Yes! Our 'Cluck Club' loyalty program rewards you with points for every purchase. Earn 1 point per $1 spent, and get $5 off every 100 points. Plus, special birthday rewards and exclusive member deals."
        },
        {
          question: "What are your current promotions?",
          answer: "We regularly offer promotions including 'Wing Wednesday' (20% off all wings), 'Family Friday' (buy 2 get 1 free on family meals), and seasonal deals. Sign up for our newsletter to stay updated!"
        },
        {
          question: "Do you offer catering?",
          answer: "Yes! We offer catering for events of all sizes. From small office meetings to large parties, we can provide boxes of chicken, sides, and drinks. Contact us at least 24 hours in advance for catering orders."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenQuestion(openQuestion === key ? null : key);
  };

  return (
    <div className="faq-page">
      
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Frequently Asked Questions</h1>
            <p className="hero-subtitle">
              Find answers to common questions about our delicious chicken and services
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="faq-content">
          {faqData.map((category, categoryIndex) => (
            <section key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="faq-accordion">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openQuestion === `${categoryIndex}-${questionIndex}`;
                  return (
                    <div key={questionIndex} className="faq-item">
                      <button
                        className={`faq-question ${isOpen ? 'open' : ''}`}
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      >
                        <span className="question-text">{faq.question}</span>
                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                      </button>
                      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <section className="faq-contact">
        <div className="container">
          <div className="contact-content">
            <h2>Still Have Questions?</h2>
            <p>
              Can't find the answer you're looking for? Feel free to reach out to our friendly customer support team.
            </p>
            <div className="contact-buttons">
              <a href="/contact" className="btn-primary">
                Contact Us
              </a>
              <a href="tel:+15551234567" className="btn-outline">
                Call Us: (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="faq-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Hungry for Answers?</h2>
            <p>
              Order now and taste why we're the #1 chicken delivery service in town!
            </p>
            <a href="/menu" className="btn-primary">
              Browse Menu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;