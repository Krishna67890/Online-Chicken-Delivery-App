import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [stats, setStats] = useState([
    { number: 0, label: 'Happy Customers', suffix: 'K+' },
    { number: 0, label: 'Orders Delivered', suffix: 'K+' },
    { number: 0, label: 'Cities Served', suffix: '+' },
    { number: 0, label: 'Team Members', suffix: '+' }
  ]);

  // Animate stats counting
  useEffect(() => {
    const finalStats = [25, 150, 12, 8];
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    stats.forEach((_, index) => {
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentNumber = Math.floor(finalStats[index] * progress);
        
        setStats(prev => prev.map((stat, i) => 
          i === index ? { ...stat, number: currentNumber } : stat
        ));

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }, []);

  const teamMembers = [
    {
      name: "Krishna Patil Rajput",
      role: "Lead Developer & Founder",
      image: "👨‍💻",
      description: "Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about creating seamless user experiences.",
      skills: ["React", "Node.js", "MongoDB", "AWS", "UI/UX"],
      social: {
        github: "https://github.com/krishna-patil",
        linkedin: "https://linkedin.com/in/krishna-patil",
        portfolio: "https://krishnapatil.dev"
      }
    },
    {
      name: "Noman Sayyed",
      role: "Client & Business Strategist",
      image: "👔",
      description: "Visionary entrepreneur with extensive experience in food delivery services and customer-centric business models.",
      skills: ["Business Strategy", "Marketing", "Operations", "Customer Service"],
      social: {
        linkedin: "https://linkedin.com/in/noman-sayyed",
        email: "noman@chickendelivery.com"
      }
    }
  ];

  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast Delivery",
      description: "Get your favorite chicken dishes delivered in under 30 minutes"
    },
    {
      icon: "🍗",
      title: "Premium Quality",
      description: "100% fresh, hygienically prepared chicken with secret family recipes"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive pricing with regular discounts and loyalty rewards"
    },
    {
      icon: "🌍",
      title: "Eco-Friendly",
      description: "Sustainable packaging and carbon-neutral delivery options"
    }
  ];

  const milestones = [
    { year: "2023", event: "Company Founded", description: "Started with a vision to revolutionize chicken delivery" },
    { year: "2024", event: "App Launch", description: "Launched our React-based delivery platform" },
    { year: "2024", event: "10K Customers", description: "Reached milestone of 10,000 happy customers" },
    { year: "2025", event: "National Expansion", description: "Expanding to 5 new cities nationwide" }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Serving <span className="highlight">Delicious Chicken</span> 
            <br />With Love & Technology
          </h1>
          <p className="hero-subtitle">
            Founded by Krishna Patil Rajput and backed by Noman Sayyed's vision, 
            we're revolutionizing how you experience chicken delivery.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Order Now</button>
            <button className="btn-secondary">View Menu</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-chicken">🍗</div>
          <div className="floating-wing">🍗</div>
          <div className="floating-burger">🍔</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">
                {stat.number}{stat.suffix}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs Section */}
      <section className="tabs-section">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            Our Story
          </button>
          <button 
            className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Our Team
          </button>
          <button 
            className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
            onClick={() => setActiveTab('mission')}
          >
            Mission & Values
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'story' && (
            <div className="story-content">
              <div className="story-text">
                <h2>From Kitchen to Your Doorstep</h2>
                <p>
                  Founded in 2023, our journey began when <strong>Krishna Patil Rajput</strong>, 
                  a passionate developer and food enthusiast, teamed up with <strong>Noman Sayyed</strong>, 
                  an experienced business strategist in the food industry.
                </p>
                <p>
                  We noticed a gap in the market for high-quality, fast chicken delivery that combines 
                  traditional recipes with modern technology. What started as a small project has now 
                  grown into a platform serving thousands of satisfied customers daily.
                </p>
                
                <div className="milestones">
                  <h3>Our Journey</h3>
                  <div className="milestones-timeline">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="milestone">
                        <div className="milestone-year">{milestone.year}</div>
                        <div className="milestone-content">
                          <h4>{milestone.event}</h4>
                          <p>{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="team-content">
              <h2>Meet The Brains & Brawn</h2>
              <div className="team-grid">
                {teamMembers.map((member, index) => (
                  <div key={index} className="team-card">
                    <div className="member-image">
                      {member.image}
                    </div>
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p className="member-role">{member.role}</p>
                      <p className="member-description">{member.description}</p>
                      
                      <div className="member-skills">
                        {member.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                      
                      <div className="member-social">
                        {member.social.github && (
                          <a href={member.social.github} className="social-link">GitHub</a>
                        )}
                        {member.social.linkedin && (
                          <a href={member.social.linkedin} className="social-link">LinkedIn</a>
                        )}
                        {member.social.portfolio && (
                          <a href={member.social.portfolio} className="social-link">Portfolio</a>
                        )}
                        {member.social.email && (
                          <a href={`mailto:${member.social.email}`} className="social-link">Email</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mission' && (
            <div className="mission-content">
              <div className="mission-statement">
                <h2>Our Mission</h2>
                <p>
                  To deliver the most delicious, fresh, and affordable chicken dishes 
                  right to your doorstep, powered by cutting-edge technology and 
                  unwavering commitment to quality.
                </p>
              </div>
              
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">🎯</div>
                  <h3>Quality First</h3>
                  <p>We never compromise on the quality of our ingredients or preparation methods.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">⚡</div>
                  <h3>Speed & Efficiency</h3>
                  <p>Leveraging technology to ensure fastest possible delivery times.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">💝</div>
                  <h3>Customer Love</h3>
                  <p>Every customer is family, and we treat them with the utmost care and respect.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon">🌱</div>
                  <h3>Sustainability</h3>
                  <p>Committed to eco-friendly practices and sustainable operations.</p>
                </div>
              </div>

              <div className="features-showcase">
                <h3>Why Choose Us?</h3>
                <div className="features-grid">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">{feature.icon}</div>
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Taste the Difference?</h2>
          <p>Join thousands of satisfied customers and experience the best chicken delivery service.</p>
          <div className="cta-buttons">
            <button className="btn-primary large">Order Your First Meal</button>
            <button className="btn-secondary large">Download Our App</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;