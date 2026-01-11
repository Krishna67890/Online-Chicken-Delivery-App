// src/pages/SpecialOffers.jsx
import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import './SpecialOffers.css';

const SpecialOffers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [countdowns, setCountdowns] = useState({});
  const { showSuccess } = useNotifications();

  // Sample offers data
  const offers = [
    {
      id: 1,
      title: "Wing Wednesday Special",
      description: "20% off all chicken wings when you order 2+ wings flavors",
      discount: "20% OFF",
      type: "percentage",
      category: "wings",
      originalPrice: 24.99,
      discountedPrice: 19.99,
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      image: "https://images.unsplash.com/photo-1606755965493-7e24a24e63c9?w=400&fit=crop",
      popular: true
    },
    {
      id: 2,
      title: "Family Meal Deal",
      description: "Complete family meal for 4-6 people with free delivery",
      discount: "$15 OFF",
      type: "fixed",
      category: "combos",
      originalPrice: 49.99,
      discountedPrice: 34.99,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&fit=crop",
      popular: true
    },
    {
      id: 3,
      title: "Matoshri Campus Special",
      description: "Exclusive student discount for Matoshri College residents",
      discount: "30% OFF",
      type: "percentage",
      category: "student",
      originalPrice: 14.99,
      discountedPrice: 9.99,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&fit=crop",
      popular: false
    }
  ];

  useEffect(() => {
    const calculateCountdowns = () => {
      const newCountdowns = {};
      offers.forEach(offer => {
        const diff = offer.validUntil - new Date();
        newCountdowns[offer.id] = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          expired: diff <= 0
        };
      });
      setCountdowns(newCountdowns);
    };
    calculateCountdowns();
    const interval = setInterval(calculateCountdowns, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = (title) => {
    showSuccess(`Congrats! You have claimed the "${title}". Discount will be applied at checkout! 🍗`);
  };

  const filteredOffers = activeTab === 'all' 
    ? offers 
    : offers.filter(offer => offer.category === activeTab);

  return (
    <div className="special-offers-page-advanced">
      <div className="offers-hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <h1 className="animate-pop">🔥 Exclusive <span className="highlight">Offers</span></h1>
          <p>Grab the best deals from Matoshri Kitchen before they expire!</p>
        </div>
      </div>

      <div className="container">
        <div className="offers-filter-bar">
          {['all', 'wings', 'combos', 'student'].map(tab => (
            <button 
              key={tab} 
              className={`offer-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="offers-grid-advanced">
          {filteredOffers.map(offer => (
            <div key={offer.id} className="offer-card-premium animate-fade-in">
              <div className="offer-img-box">
                <img src={offer.image} alt={offer.title} />
                <div className="discount-tag-floating">{offer.discount}</div>
              </div>
              <div className="offer-info-box">
                {offer.popular && <span className="trending-label">🔥 Trending</span>}
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <div className="price-tag-box">
                  <span className="old-price">${offer.originalPrice}</span>
                  <span className="new-price">${offer.discountedPrice}</span>
                </div>
                <div className="timer-box">
                  Ends in: {countdowns[offer.id]?.days}d {countdowns[offer.id]?.hours}h {countdowns[offer.id]?.minutes}m
                </div>
                <button className="btn-claim-offer" onClick={() => handleClaim(offer.title)}>
                  Claim Offer Now 🎁
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;