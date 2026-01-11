// src/components/ShareOrderModal/ShareOrderModal.jsx
import React, { useState, useEffect } from 'react';
import './ShareOrderModal.css';

const ShareOrderModal = ({ order, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState('link');

  if (!isOpen) return null;

  const orderLink = `${window.location.origin}/track/${order?.id || 'orderId'}`;
  const shareMessage = `Check out my chicken order! Order #${order?.orderNumber || 'N/A'}. Tracking: ${orderLink}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(orderLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share && shareMethod === 'native') {
      try {
        await navigator.share({
          title: 'Chicken Order Update',
          text: `Check out my chicken order! Order #${order?.orderNumber || 'N/A'}`,
          url: orderLink
        });
        onClose();
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSocialShare = (platform) => {
    let shareUrl = '';
    const encodedText = encodeURIComponent(shareMessage);
    const encodedUrl = encodeURIComponent(orderLink);

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Check out my chicken order!&body=${shareMessage}`;
        break;
      default:
        shareUrl = orderLink;
    }

    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!order) return null;

  return (
    <div className="share-order-modal-overlay" onClick={onClose}>
      <div className="share-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Your Order</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div className="order-preview">
            <div className="order-icon">🍗</div>
            <div className="order-details">
              <h3>Order #{order.orderNumber || 'N/A'}</h3>
              <p className="order-status">{order.status?.replace(/_/g, ' ') || 'Unknown'}</p>
              <p className="order-items">{order.items?.length || 0} items</p>
            </div>
          </div>

          <div className="share-options">
            <h4>Share via</h4>
            <div className="share-methods">
              <button 
                className={`share-method ${shareMethod === 'link' ? 'active' : ''}`}
                onClick={() => setShareMethod('link')}
              >
                Link
              </button>
              <button 
                className={`share-method ${shareMethod === 'native' ? 'active' : ''}`}
                onClick={() => setShareMethod('native')}
                disabled={!navigator.share}
              >
                Share
              </button>
            </div>

            <div className="share-links">
              <div className="link-input-container">
                <input 
                  type="text" 
                  value={orderLink} 
                  readOnly 
                  className="share-link-input"
                />
                <button 
                  className="copy-button"
                  onClick={handleCopyLink}
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              <div className="social-share-buttons">
                <button 
                  className="social-share-btn facebook"
                  onClick={() => handleSocialShare('facebook')}
                  title="Share on Facebook"
                >
                  f
                </button>
                <button 
                  className="social-share-btn twitter"
                  onClick={() => handleSocialShare('twitter')}
                  title="Share on Twitter"
                >
                  X
                </button>
                <button 
                  className="social-share-btn whatsapp"
                  onClick={() => handleSocialShare('whatsapp')}
                  title="Share on WhatsApp"
                >
                  WhatsApp
                </button>
                <button 
                  className="social-share-btn email"
                  onClick={() => handleSocialShare('email')}
                  title="Share via Email"
                >
                  ✉️
                </button>
              </div>
            </div>
          </div>

          <div className="share-preview">
            <h4>Preview</h4>
            <div className="preview-card">
              <div className="preview-icon">🍗</div>
              <div className="preview-text">
                <p>Check out my chicken order!</p>
                <p><strong>Order #{order.orderNumber || 'N/A'}</strong></p>
                <p>Tracking: {orderLink}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleShare}>
            {shareMethod === 'native' ? 'Share' : 'Copy & Share'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareOrderModal;