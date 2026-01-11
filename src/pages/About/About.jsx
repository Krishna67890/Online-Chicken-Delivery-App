// src/pages/About/About.jsx
import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="about-page">
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Our Chicken Story</h1>
              <p className="hero-subtitle">
                From farm to table, we've been serving the most delicious chicken since 2010
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Years of Excellence</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">1M+</span>
                  <span className="stat-label">Chicken Wings Served</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1606755965493-7e24a24e63c9?w=600&h=400&fit=crop" 
                alt="Our delicious chicken" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2010 by passionate chicken enthusiasts, Chicken Delight started as a small family-owned restaurant 
                with a simple mission: to serve the most delicious, perfectly seasoned chicken in town. What began as a 
                humble 20-seat eatery has grown into a beloved chain known for our signature recipes and commitment 
                to quality.
              </p>
              <p>
                Today, we use only the finest, antibiotic-free chicken sourced from trusted farms. Our recipes are 
                carefully crafted and tested to ensure every bite delivers the perfect balance of flavor, juiciness, 
                and that satisfying crunch you crave.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop" 
                alt="Our founder's story" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🍗</div>
              <h3>Quality First</h3>
              <p>
                We never compromise on quality. Every piece of chicken is carefully selected and prepared 
                to perfection.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>
                Hot, fresh chicken delivered to your door in 30 minutes or less, guaranteed.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Customer Love</h3>
              <p>
                Your satisfaction is our top priority. We go above and beyond to exceed expectations.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustainability</h3>
              <p>
                We're committed to sustainable practices and supporting local communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="about-team">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" 
                alt="Chef Michael" 
              />
              <h3>Michael Johnson</h3>
              <p className="role">Head Chef</p>
              <p className="bio">
                15+ years of culinary expertise, specializing in international chicken recipes.
              </p>
            </div>
            <div className="team-member">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face" 
                alt="Sarah Williams" 
              />
              <h3>Sarah Williams</h3>
              <p className="role">Operations Manager</p>
              <p className="bio">
                Ensures every order is prepared and delivered with precision and care.
              </p>
            </div>
            <div className="team-member">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face" 
                alt="David Chen" 
              />
              <h3>David Chen</h3>
              <p className="role">Founder & CEO</p>
              <p className="bio">
                Started the journey with a passion for bringing families together over great food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section className="about-achievements">
        <div className="container">
          <h2 className="section-title">Our Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-number">🏆</div>
              <h3>Best Chicken Restaurant 2023</h3>
              <p>Taste Awards</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">⭐</div>
              <h3>4.8/5 Customer Rating</h3>
              <p>Based on 10,000+ reviews</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">🌱</div>
              <h3>100% Organic Spices</h3>
              <p>Committed to natural flavors</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">🚗</div>
              <h3>100+ Delivery Drivers</h3>
              <p>Ensuring fast, reliable service</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Taste the Difference?</h2>
            <p>
              Join thousands of satisfied customers and experience the Chicken Delight difference today.
            </p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/menu'}>
                Order Now
              </button>
              <button className="btn-outline" onClick={() => window.location.href = '/contact'}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;