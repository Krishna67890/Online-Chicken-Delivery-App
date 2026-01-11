// src/components/RatingModal/RatingModal.jsx
import React, { useState } from 'react';
import './RatingModal.css';

const RatingModal = ({ order, isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, review, anonymous);
    }
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex) => {
    setHoverRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const getRatingMessage = () => {
    switch (rating) {
      case 1:
        return "Sorry to hear about your experience";
      case 2:
        return "We'll work to improve";
      case 3:
        return "Thanks for your feedback";
      case 4:
        return "Glad you enjoyed it!";
      case 5:
        return "Awesome! Thanks for the great review!";
      default:
        return "How was your order?";
    }
  };

  if (!order) return null;

  return (
    <div className="rating-modal-overlay" onClick={onClose}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rate Your Order</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="order-info">
            <div className="order-icon">🍗</div>
            <div className="order-details">
              <h3>Order #{order.orderNumber || 'N/A'}</h3>
              <p>{order.items?.length || 0} items • {order.restaurant?.name || 'Restaurant'}</p>
            </div>
          </div>

          <div className="rating-section">
            <h4>{getRatingMessage()}</h4>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                  key={starIndex}
                  className={`star ${
                    starIndex <= (hoverRating || rating) ? 'filled' : 'empty'
                  }`}
                  onClick={() => handleStarClick(starIndex)}
                  onMouseEnter={() => handleStarHover(starIndex)}
                  onMouseLeave={handleStarLeave}
                  title={`Rate ${starIndex} stars`}
                >
                  {starIndex <= (hoverRating || rating) ? '★' : '☆'}
                </button>
              ))}
            </div>
            <p className="rating-help-text">Click a star to rate your experience</p>
          </div>

          <div className="review-section">
            <h4>Share Your Experience</h4>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience with this order..."
              rows="4"
              className="review-textarea"
            />
          </div>

          <div className="rating-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              Post anonymously
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Skip
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;