// src/pages/Reviews.jsx
import React, { useState, useEffect } from 'react';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Sample reviews data
  const sampleReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      title: "Best Chicken Ever!",
      comment: "The crispy fried chicken was absolutely amazing! Perfectly seasoned and cooked to perfection. Delivery was fast and the packaging was great.",
      verified: true,
      helpful: 24
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      date: "2024-01-14",
      title: "Great Service",
      comment: "Ordered the grilled chicken platter and it was delicious. The delivery driver was friendly and on time. Will order again!",
      verified: true,
      helpful: 18
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 5,
      date: "2024-01-13",
      title: "Perfect for Family Night",
      comment: "Ordered the family combo and everyone loved it. The kids especially loved the chicken tenders. Great value for money!",
      verified: true,
      helpful: 32
    },
    {
      id: 4,
      name: "David Wilson",
      rating: 3,
      date: "2024-01-12",
      title: "Good but could be better",
      comment: "Chicken was good but arrived slightly cold. Customer service was quick to address my concern and offered a discount for next time.",
      verified: true,
      helpful: 12
    },
    {
      id: 5,
      name: "Lisa Thompson",
      rating: 5,
      date: "2024-01-11",
      title: "Consistently Delicious",
      comment: "I've been ordering from Chicken Delight for 2 years and they never disappoint. The quality is always excellent and service is fast.",
      verified: true,
      helpful: 45
    },
    {
      id: 6,
      name: "James Brown",
      rating: 4,
      date: "2024-01-10",
      title: "Worth the Wait",
      comment: "The chicken wings were fantastic! A bit spicy for my taste but that's just personal preference. Will definitely order again.",
      verified: false,
      helpful: 15
    },
    {
      id: 7,
      name: "Amanda Davis",
      rating: 5,
      date: "2024-01-09",
      title: "Best Delivery Service",
      comment: "Fast delivery, great food, and excellent customer service. The grilled chicken salad was fresh and delicious. Highly recommend!",
      verified: true,
      helpful: 28
    },
    {
      id: 8,
      name: "Robert Garcia",
      rating: 5,
      date: "2024-01-08",
      title: "Family Favorite",
      comment: "My whole family loves the chicken here. The spice level is perfect and the portions are generous. Great for busy weeknights!",
      verified: true,
      helpful: 35
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setReviews(sampleReviews);
      setFilteredReviews(sampleReviews);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...reviews];
    
    // Filter by rating
    if (selectedRating !== 'all') {
      const ratingFilter = parseInt(selectedRating);
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }
    
    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });
    
    setFilteredReviews(filtered);
  }, [reviews, selectedRating, sortBy]);

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  return (
    <div className="reviews-page">
      
      {/* Hero Section */}
      <section className="reviews-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Customer Reviews</h1>
            <p className="hero-subtitle">
              See what our customers are saying about our delicious chicken
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="reviews-content">
          {/* Rating Summary */}
          <section className="rating-summary">
            <div className="summary-stats">
              <div className="overall-rating">
                <div className="rating-number">{averageRating}</div>
                <div className="rating-stars">{getRatingStars(Math.round(averageRating))}</div>
                <div className="total-reviews">{reviews.length} reviews</div>
              </div>
              <div className="rating-breakdown">
                {ratingCounts.map(({ rating, count, percentage }) => (
                  <div key={rating} className="rating-bar">
                    <span className="rating-value">{rating}★</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="rating-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="reviews-filters">
            <div className="filter-group">
              <label>Filter by Rating:</label>
              <select 
                value={selectedRating} 
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </section>

          {/* Reviews List */}
          <section className="reviews-list">
            {loading ? (
              <div className="loading-reviews">
                <div className="loading-spinner"></div>
                <p>Loading reviews...</p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="no-reviews">
                <div className="no-reviews-icon">📝</div>
                <h3>No reviews found</h3>
                <p>Try adjusting your filters to see more reviews</p>
              </div>
            ) : (
              <>
                {filteredReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-name">
                          {review.name}
                          {review.verified && <span className="verified-badge">✓ Verified</span>}
                        </div>
                        <div className="review-date">{formatDate(review.date)}</div>
                      </div>
                      <div className="review-rating">
                        <div className="rating-stars">{getRatingStars(review.rating)}</div>
                        <div className="rating-number">{review.rating}/5</div>
                      </div>
                    </div>
                    
                    <div className="review-title">
                      {review.title}
                    </div>
                    
                    <div className="review-comment">
                      {review.comment}
                    </div>
                    
                    <div className="review-actions">
                      <button className="helpful-btn">
                        👍 Helpful ({review.helpful})
                      </button>
                      <button className="reply-btn">
                        💬 Reply
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>

          {/* Write Review */}
          <section className="write-review">
            <div className="write-review-content">
              <h3>Share Your Experience</h3>
              <p>How was your experience with our chicken? Your review helps us improve!</p>
              <button className="btn-primary">Write a Review</button>
            </div>
          </section>
        </div>
      </div>

      {/* CTA Section */}
      <section className="reviews-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Try Our Delicious Chicken?</h2>
            <p>
              Join thousands of satisfied customers and experience the Chicken Delight difference.
            </p>
            <a href="/menu" className="btn-primary">
              Order Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;