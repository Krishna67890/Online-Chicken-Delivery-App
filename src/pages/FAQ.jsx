// src/pages/FAQ/FAQ.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import { usePreferences } from '../../hooks/usePreferences';
import FAQCategory from '../../components/FAQCategory/FAQCategory';
import SearchBox from '../../components/SearchBox/SearchBox';
import QuickActions from '../../components/QuickActions/QuickActions';
import ContactCTA from '../../components/ContactCTA/ContactCTA';
import WasThisHelpful from '../../components/WasThisHelpful/WasThisHelpful';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { faqService } from '../../services/faqService';
import { analyticsService } from '../../services/analyticsService';
import './FAQ.css';

const FAQ = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences, updatePreferences } = usePreferences();
  
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [helpfulFeedback, setHelpfulFeedback] = useState({});
  const [viewedQuestions, setViewedQuestions] = useState(new Set());
  const [popularQuestions, setPopularQuestions] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Initialize search hook
  const { searchResults, search } = useSearch();

  // Load FAQ data
  useEffect(() => {
    const loadFAQData = async () => {
      try {
        setLoading(true);
        const [categories, popular] = await Promise.all([
          faqService.getCategories(),
          faqService.getPopularQuestions()
        ]);
        
        setFaqData(categories);
        setPopularQuestions(popular);
        
        // Track FAQ view
        analyticsService.trackEvent('faq_page_view');
      } catch (err) {
        setError('Failed to load FAQ content. Please try again later.');
        console.error('FAQ loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFAQData();
  }, []);

  // Load recently viewed questions from preferences
  useEffect(() => {
    if (preferences?.recentlyViewedFAQs) {
      setRecentlyViewed(preferences.recentlyViewedFAQs);
    }
  }, [preferences]);

  // Handle URL hash for direct question linking
  useEffect(() => {
    if (location.hash) {
      const questionId = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(questionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          handleQuestionExpand(questionId);
        }
      }, 500);
    }
  }, [location.hash, faqData]);

  // Search functionality
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    if (term.trim()) {
      search(term, faqData.flatMap(cat => cat.questions));
    }
  }, [faqData, search]);

  // Filter categories and questions based on search and active category
  const filteredData = useMemo(() => {
    if (!searchTerm.trim() && activeCategory === 'all') {
      return faqData;
    }

    return faqData.map(category => {
      if (activeCategory !== 'all' && category.id !== activeCategory) {
        return { ...category, questions: [] };
      }

      let questions = category.questions;
      
      if (searchTerm.trim()) {
        const searchResultsIds = new Set(searchResults.map(item => item.id));
        questions = questions.filter(q => searchResultsIds.has(q.id));
      }

      return { ...category, questions };
    }).filter(category => category.questions.length > 0);
  }, [faqData, activeCategory, searchTerm, searchResults]);

  // Get all categories for navigation
  const categories = useMemo(() => [
    { id: 'all', name: 'All Questions', icon: '📚', count: faqData.reduce((sum, cat) => sum + cat.questions.length, 0) },
    ...faqData.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      count: category.questions.length
    }))
  ], [faqData]);

  // Quick actions
  const quickActions = [
    {
      id: 'contact-support',
      icon: '💬',
      title: 'Contact Support',
      description: 'Get help from our support team',
      action: () => navigate('/contact'),
      color: 'var(--primary)'
    },
    {
      id: 'track-order',
      icon: '🚚',
      title: 'Track Order',
      description: 'Check your order status',
      action: () => navigate('/track-order'),
      color: 'var(--secondary)'
    },
    {
      id: 'menu',
      icon: '📋',
      title: 'Browse Menu',
      description: 'Explore our delicious offerings',
      action: () => navigate('/menu'),
      color: 'var(--success)'
    },
    {
      id: 'account-help',
      icon: '👤',
      title: 'Account Help',
      description: 'Password, login, and account issues',
      action: () => setActiveCategory('account'),
      color: 'var(--warning)'
    }
  ];

  // Handle question expand/collapse
  const handleQuestionExpand = useCallback(async (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
      
      // Track question view
      if (!viewedQuestions.has(questionId)) {
        analyticsService.trackEvent('faq_question_view', { questionId });
        setViewedQuestions(prev => new Set([...prev, questionId]));
        
        // Add to recently viewed
        const question = findQuestionById(questionId);
        if (question) {
          const newRecentlyViewed = [
            question,
            ...recentlyViewed.filter(q => q.id !== questionId)
          ].slice(0, 5);
          
          setRecentlyViewed(newRecentlyViewed);
          updatePreferences({ recentlyViewedFAQs: newRecentlyViewed });
        }
      }
    }
    
    setExpandedQuestions(newExpanded);
  }, [expandedQuestions, viewedQuestions, recentlyViewed, updatePreferences]);

  // Find question by ID
  const findQuestionById = useCallback((questionId) => {
    for (const category of faqData) {
      const question = category.questions.find(q => q.id === questionId);
      if (question) return question;
    }
    return null;
  }, [faqData]);

  // Handle helpful feedback
  const handleHelpfulFeedback = useCallback(async (questionId, isHelpful) => {
    try {
      setHelpfulFeedback(prev => ({
        ...prev,
        [questionId]: isHelpful
      }));

      await faqService.submitFeedback(questionId, isHelpful);
      analyticsService.trackEvent('faq_feedback', { questionId, isHelpful });
      
      // Show temporary confirmation
      setTimeout(() => {
        setHelpfulFeedback(prev => {
          const newState = { ...prev };
          delete newState[questionId];
          return newState;
        });
      }, 3000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  }, []);

  // Expand all questions in a category
  const handleExpandCategory = useCallback((categoryId) => {
    const category = faqData.find(cat => cat.id === categoryId);
    if (!category) return;

    const newExpanded = new Set(expandedQuestions);
    category.questions.forEach(question => {
      newExpanded.add(question.id);
    });
    setExpandedQuestions(newExpanded);
  }, [faqData, expandedQuestions]);

  // Collapse all questions
  const handleCollapseAll = useCallback(() => {
    setExpandedQuestions(new Set());
  }, []);

  // Get featured questions (popular + recent)
  const featuredQuestions = useMemo(() => {
    const featured = [...popularQuestions];
    recentlyViewed.forEach(question => {
      if (!featured.find(fq => fq.id === question.id)) {
        featured.push(question);
      }
    });
    return featured.slice(0, 6);
  }, [popularQuestions, recentlyViewed]);

  if (loading) {
    return (
      <div className="faq-page">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Loading help content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faq-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load FAQ</h2>
          <p>{error}</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">How can we help you?</h1>
              <p className="hero-subtitle">
                Find answers to common questions about ordering, delivery, payments, and more.
              </p>
              
              {/* Search Box */}
              <div className="search-container">
                <SearchBox
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search for answers..."
                  className="faq-search"
                />
                <div className="search-tips">
                  <span>Try: "delivery time", "payment methods", "order tracking"</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="help-illustration">
                <div className="floating-element">❓</div>
                <div className="floating-element">💡</div>
                <div className="floating-element">🔍</div>
                <div className="main-illustration">🍗🤔</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <QuickActions
            actions={quickActions}
            title="Quick Help"
            columns={4}
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="faq-main">
        <div className="container">
          <div className="faq-layout">
            {/* Sidebar */}
            <aside className="faq-sidebar">
              {/* Categories Navigation */}
              <nav className="categories-nav">
                <h3>Categories</h3>
                <div className="category-list">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                      {category.count > 0 && (
                        <span className="category-count">{category.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Featured Questions */}
              {featuredQuestions.length > 0 && (
                <div className="featured-questions">
                  <h3>Featured Questions</h3>
                  <div className="featured-list">
                    {featuredQuestions.map(question => (
                      <button
                        key={question.id}
                        className="featured-question"
                        onClick={() => handleQuestionExpand(question.id)}
                      >
                        <span className="question-text">{question.question}</span>
                        <span className="question-arrow">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="faq-stats">
                <h3>Help Center Stats</h3>
                <div className="stats-grid">
                  <div className="stat">
                    <span className="stat-number">{faqData.reduce((sum, cat) => sum + cat.questions.length, 0)}</span>
                    <span className="stat-label">Questions</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{faqData.length}</span>
                    <span className="stat-label">Categories</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="faq-content">
              {/* Search Results Header */}
              {searchTerm && (
                <div className="search-results-header">
                  <h2>
                    Search Results for "{searchTerm}"
                    <span className="results-count">
                      ({filteredData.reduce((sum, cat) => sum + cat.questions.length, 0)} results)
                    </span>
                  </h2>
                  <button
                    className="btn-text"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Controls Bar */}
              <div className="controls-bar">
                <div className="controls-left">
                  <h2>
                    {activeCategory === 'all' ? 'All Questions' : 
                     categories.find(cat => cat.id === activeCategory)?.name}
                  </h2>
                  <span className="questions-count">
                    {filteredData.reduce((sum, cat) => sum + cat.questions.length, 0)} questions
                  </span>
                </div>
                <div className="controls-right">
                  <button
                    className="btn-outline"
                    onClick={handleCollapseAll}
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* FAQ Content */}
              <div className="faq-categories">
                {filteredData.length === 0 ? (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>We couldn't find any questions matching your search. Try different keywords or browse the categories.</p>
                    <button
                      className="btn-primary"
                      onClick={() => setSearchTerm('')}
                    >
                      Browse All Questions
                    </button>
                  </div>
                ) : (
                  filteredData.map(category => (
                    <FAQCategory
                      key={category.id}
                      category={category}
                      expandedQuestions={expandedQuestions}
                      onQuestionExpand={handleQuestionExpand}
                      onExpandCategory={handleExpandCategory}
                      helpfulFeedback={helpfulFeedback}
                      onHelpfulFeedback={handleHelpfulFeedback}
                      searchTerm={searchTerm}
                    />
                  ))
                )}
              </div>

              {/* Still Need Help CTA */}
              <ContactCTA
                title="Still need help?"
                description="Can't find what you're looking for? Our support team is ready to assist you."
                buttonText="Contact Support"
                onButtonClick={() => navigate('/contact')}
              />
            </main>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <section className="bottom-cta-section">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-card">
              <div className="cta-icon">📞</div>
              <h3>Call Us</h3>
              <p>Speak directly with our support team</p>
              <a href="tel:+1-800-CHICKEN" className="cta-link">
                +1-800-CHICKEN
              </a>
              <small>Available 24/7</small>
            </div>
            
            <div className="cta-card">
              <div className="cta-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Get instant help from our agents</p>
              <button 
                className="cta-link"
                onClick={() => navigate('/contact')}
              >
                Start Chat
              </button>
              <small>9 AM - 11 PM daily</small>
            </div>
            
            <div className="cta-card">
              <div className="cta-icon">📧</div>
              <h3>Email Us</h3>
              <p>Send us a detailed message</p>
              <a href="mailto:support@chickendelivery.com" className="cta-link">
                support@chickendelivery.com
              </a>
              <small>Response within 2 hours</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;