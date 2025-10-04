// src/pages/Reviews/Reviews.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useReviews } from '../../hooks/useReviews';
import { useNotifications } from '../../hooks/useNotifications';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import ReviewStats from '../../components/ReviewStats/ReviewStats';
import ReviewFilters from '../../components/ReviewFilters/ReviewFilters';
import ReviewSkeleton from '../../components/ReviewSkeleton/ReviewSkeleton';
import EmptyState from '../../components/EmptyState/EmptyState';
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery';
import ReviewAnalysis from '../../components/ReviewAnalysis/ReviewAnalysis';
import { reviewService } from '../../services/reviewService';
import { analyticsService } from '../../services/analyticsService';
import { dateFormatters } from '../../utils/formatters';
import './Reviews.css';

const Reviews = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();

  const {
    reviews,
    stats,
    loading,
    error,
    hasMore,
    loadMoreReviews,
    submitReview,
    updateReview,
    deleteReview,
    likeReview,
    reportReview,
    refreshReviews
  } = useReviews(itemId);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [filters, setFilters] = useState({
    rating: 'all',
    sortBy: 'recent',
    verified: false,
    withPhotos: false,
    searchTerm: ''
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [photoGalleryOpen, setPhotoGalleryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingReview, setReportingReview] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [analysisOpen, setAnalysisOpen] = useState(false);

  // Load reviews on component mount or when filters change
  useEffect(() => {
    refreshReviews(filters);
  }, [filters, refreshReviews]);

  // Track page view
  useEffect(() => {
    analyticsService.trackEvent('reviews_page_view', { itemId });
  }, [itemId]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Apply rating filter
    if (filters.rating !== 'all') {
      const rating = parseInt(filters.rating);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Apply verified filter
    if (filters.verified) {
      filtered = filtered.filter(review => review.isVerified);
    }

    // Apply photos filter
    if (filters.withPhotos) {
      filtered = filtered.filter(review => review.photos && review.photos.length > 0);
    }

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review.comment?.toLowerCase().includes(term) ||
        review.user?.name?.toLowerCase().includes(term)
      );
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'helpful':
          return (b.likes || 0) - (a.likes || 0);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'recent':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [reviews, filters]);

  // Get user's review
  const userReview = useMemo(() => {
    if (!user) return null;
    return reviews.find(review => review.user?.id === user.id);
  }, [reviews, user]);

  // Get reviews with photos
  const reviewsWithPhotos = useMemo(() => {
    return reviews.filter(review => review.photos && review.photos.length > 0);
  }, [reviews]);

  // Get helpful reviews (most liked)
  const helpfulReviews = useMemo(() => {
    return [...reviews]
      .filter(review => review.likes > 0)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
  }, [reviews]);

  // Handle review submission
  const handleSubmitReview = async (reviewData) => {
    try {
      if (editingReview) {
        await updateReview(editingReview.id, reviewData);
        showSuccess('Review updated successfully!');
      } else {
        await submitReview(reviewData);
        showSuccess('Review submitted successfully!');
      }
      
      setShowReviewForm(false);
      setEditingReview(null);
      refreshReviews();
      
      // Track review submission
      analyticsService.trackEvent('review_submitted', {
        itemId,
        rating: reviewData.rating,
        hasPhotos: !!(reviewData.photos && reviewData.photos.length > 0),
        isEdit: !!editingReview
      });
    } catch (err) {
      showError(err.message || 'Failed to submit review');
    }
  };

  // Handle review edit
  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteReview(reviewId);
      showSuccess('Review deleted successfully');
      refreshReviews();
    } catch (err) {
      showError('Failed to delete review');
    }
  };

  // Handle review like
  const handleLikeReview = async (reviewId) => {
    if (!isAuthenticated) {
      showWarning('Please sign in to like reviews');
      navigate('/login', { state: { returnUrl: `/reviews${itemId ? `?item=${itemId}` : ''}` } });
      return;
    }

    try {
      await likeReview(reviewId);
      analyticsService.trackEvent('review_liked', { reviewId });
    } catch (err) {
      showError('Failed to like review');
    }
  };

  // Handle review report
  const handleReportReview = async (reviewId) => {
    if (!reportReason.trim()) {
      showError('Please provide a reason for reporting');
      return;
    }

    try {
      await reportReview(reviewId, reportReason);
      showSuccess('Review reported successfully. Our team will review it shortly.');
      setReportModalOpen(false);
      setReportingReview(null);
      setReportReason('');
      
      analyticsService.trackEvent('review_reported', { reviewId });
    } catch (err) {
      showError('Failed to report review');
    }
  };

  // Open photo gallery
  const handleOpenPhotoGallery = (review, photoIndex = 0) => {
    setSelectedReview(review);
    setSelectedPhotoIndex(photoIndex);
    setPhotoGalleryOpen(true);
  };

  // Open report modal
  const handleOpenReportModal = (review) => {
    setReportingReview(review);
    setReportModalOpen(true);
  };

  // Load more reviews
  const handleLoadMore = async () => {
    try {
      await loadMoreReviews();
    } catch (err) {
      showError('Failed to load more reviews');
    }
  };

  // Quick filter actions
  const quickFilters = [
    {
      label: 'All Reviews',
      value: 'all',
      count: reviews.length
    },
    {
      label: '5 Stars',
      value: '5',
      count: reviews.filter(r => r.rating === 5).length
    },
    {
      label: '4 Stars',
      value: '4',
      count: reviews.filter(r => r.rating === 4).length
    },
    {
      label: '3 Stars',
      value: '3',
      count: reviews.filter(r => r.rating === 3).length
    },
    {
      label: '2 Stars',
      value: '2',
      count: reviews.filter(r => r.rating === 2).length
    },
    {
      label: '1 Star',
      value: '1',
      count: reviews.filter(r => r.rating === 1).length
    }
  ];

  // Sort options
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'helpful', label: 'Most Helpful' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' }
  ];

  // Report reasons
  const reportReasons = [
    'Inappropriate content',
    'Spam or advertising',
    'False information',
    'Harassment or hate speech',
    'Off-topic',
    'Other'
  ];

  if (loading && reviews.length === 0) {
    return (
      <div className="reviews-page">
        <div className="container">
          <div className="reviews-header">
            <div className="skeleton-header">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>
          </div>
          <div className="reviews-content">
            <div className="reviews-grid">
              {[...Array(6)].map((_, index) => (
                <ReviewSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      {/* Header Section */}
      <section className="reviews-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">
                Customer Reviews
                {stats?.totalReviews > 0 && (
                  <span className="reviews-count">({stats.totalReviews})</span>
                )}
              </h1>
              <p className="page-subtitle">
                Read what our customers are saying about their experience
              </p>
              
              {/* Quick Stats */}
              {stats && (
                <div className="quick-stats">
                  <div className="stat">
                    <span className="stat-value">{stats.averageRating?.toFixed(1)}</span>
                    <span className="stat-label">Average Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stats.totalReviews}</span>
                    <span className="stat-label">Total Reviews</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stats.verifiedReviews}</span>
                    <span className="stat-label">Verified</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{reviewsWithPhotos.length}</span>
                    <span className="stat-label">With Photos</span>
                  </div>
                </div>
              )}
            </div>

            <div className="header-actions">
              {isAuthenticated ? (
                userReview ? (
                  <div className="user-review-status">
                    <p>You've already reviewed this item</p>
                    <div className="action-buttons">
                      <button
                        className="btn-outline"
                        onClick={() => handleEditReview(userReview)}
                      >
                        Edit Review
                      </button>
                      <button
                        className="btn-text"
                        onClick={() => handleDeleteReview(userReview.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn-primary btn-large"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Write a Review
                  </button>
                )
              ) : (
                <div className="auth-prompt">
                  <p>Sign in to write a review</p>
                  <button
                    className="btn-outline"
                    onClick={() => navigate('/login', { state: { returnUrl: '/reviews' } })}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Review Stats & Analysis */}
      {stats && (
        <section className="stats-section">
          <div className="container">
            <ReviewStats
              stats={stats}
              onShowAnalysis={() => setAnalysisOpen(true)}
            />
          </div>
        </section>
      )}

      {/* Filters & Controls */}
      <section className="filters-section">
        <div className="container">
          <ReviewFilters
            filters={filters}
            onFiltersChange={setFilters}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={filteredReviews.length}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="reviews-content">
        <div className="container">
          {filteredReviews.length === 0 ? (
            <EmptyState
              type="review"
              title="No reviews found"
              message={
                filters.rating !== 'all' || filters.searchTerm || filters.verified || filters.withPhotos
                  ? "Try adjusting your filters to see more reviews"
                  : "Be the first to review this item"
              }
              action={
                isAuthenticated && !userReview
                  ? {
                      label: 'Write First Review',
                      onClick: () => setShowReviewForm(true)
                    }
                  : filters.rating !== 'all' || filters.searchTerm
                  ? {
                      label: 'Clear Filters',
                      onClick: () => setFilters({
                        rating: 'all',
                        sortBy: 'recent',
                        verified: false,
                        withPhotos: false,
                        searchTerm: ''
                      })
                    }
                  : null
              }
            />
          ) : (
            <>
              {/* Reviews Grid/List */}
              <div className={`reviews-container ${viewMode}`}>
                {filteredReviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    viewMode={viewMode}
                    isOwner={user?.id === review.user?.id}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    onLike={handleLikeReview}
                    onReport={handleOpenReportModal}
                    onPhotoClick={handleOpenPhotoGallery}
                    currentUserId={user?.id}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="load-more-section">
                  <button
                    className="btn-outline btn-large"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More Reviews'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Featured Sections */}
      {helpfulReviews.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Most Helpful Reviews</h2>
            <div className="featured-reviews">
              {helpfulReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  featured={true}
                  onLike={handleLikeReview}
                  onPhotoClick={handleOpenPhotoGallery}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {reviewsWithPhotos.length > 0 && (
        <section className="photos-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Customer Photos</h2>
              <button
                className="btn-text"
                onClick={() => setPhotoGalleryOpen(true)}
              >
                View All ({reviewsWithPhotos.length})
              </button>
            </div>
            <PhotoGallery
              reviews={reviewsWithPhotos.slice(0, 8)}
              onPhotoClick={handleOpenPhotoGallery}
            />
          </div>
        </section>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ReviewForm
              review={editingReview}
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setShowReviewForm(false);
                setEditingReview(null);
              }}
              itemId={itemId}
            />
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {photoGalleryOpen && selectedReview && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <PhotoGallery
              reviews={reviewsWithPhotos}
              initialIndex={selectedPhotoIndex}
              onClose={() => setPhotoGalleryOpen(false)}
              showNavigation
            />
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && reportingReview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Report Review</h3>
              <button
                className="close-button"
                onClick={() => {
                  setReportModalOpen(false);
                  setReportingReview(null);
                  setReportReason('');
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Please select a reason for reporting this review:</p>
              
              <div className="report-reasons">
                {reportReasons.map(reason => (
                  <label key={reason} className="report-reason">
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={(e) => setReportReason(e.target.value)}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {reportReason === 'Other' && (
                <div className="custom-reason">
                  <textarea
                    placeholder="Please specify the reason..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn-outline"
                  onClick={() => {
                    setReportModalOpen(false);
                    setReportingReview(null);
                    setReportReason('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleReportReview(reportingReview.id)}
                  disabled={!reportReason.trim()}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Analysis Modal */}
      {analysisOpen && stats && (
        <ReviewAnalysis
          stats={stats}
          reviews={reviews}
          isOpen={analysisOpen}
          onClose={() => setAnalysisOpen(false)}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <div className="container">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <button 
                className="retry-button"
                onClick={refreshReviews}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;