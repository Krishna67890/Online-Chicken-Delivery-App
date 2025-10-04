import React, { useState, useRef, useEffect } from 'react';

// Custom hook for slide management
const useSlideManager = (initialSlides = []) => {
  const [slides, setSlides] = useState(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('forward');

  const addSlide = (content) => {
    setSlides(prev => [...prev, { id: Date.now(), content }]);
  };

  const removeSlide = (index) => {
    setSlides(prev => prev.filter((_, i) => i !== index));
    if (currentSlide >= index && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const nextSlide = () => {
    setTransitionDirection('forward');
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setTransitionDirection('backward');
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setTransitionDirection(index > currentSlide ? 'forward' : 'backward');
    setCurrentSlide(index);
  };

  const togglePresentation = () => {
    setIsPresenting(prev => !prev);
  };

  return {
    slides,
    currentSlide,
    isPresenting,
    transitionDirection,
    addSlide,
    removeSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    togglePresentation,
    setSlides
  };
};

// Styled Components
const PresentationContainer = ({ children, isPresenting }) => {
  return (
    <div style={{
      width: '100%',
      height: isPresenting ? '100vh' : 'auto',
      background: isPresenting ? '#000' : 'transparent',
      position: isPresenting ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      zIndex: isPresenting ? 1000 : 1,
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {children}
    </div>
  );
};

const Slide = ({ content, isActive, transitionDirection, index }) => {
  const slideRef = useRef(null);

  useEffect(() => {
    if (isActive && slideRef.current) {
      slideRef.current.focus();
    }
  }, [isActive]);

  return (
    <div
      ref={slideRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: isActive ? 1 : 0,
        transform: `translateX(${isActive ? '0%' : transitionDirection === 'forward' ? '100%' : '-100%'})`,
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
      tabIndex={-1}
    >
      <div style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Slide {index + 1}
      </div>
      <div style={{
        fontSize: '1.5rem',
        lineHeight: 1.6,
        maxWidth: '80%'
      }}>
        {content}
      </div>
    </div>
  );
};

const Controls = ({ onNext, onPrev, onAdd, onRemove, onTogglePresent, isPresenting, currentSlide, totalSlides }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '50px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(10px)',
      zIndex: 1001
    }}>
      <ControlButton onClick={onPrev} disabled={totalSlides === 0}>
        ⬅️
      </ControlButton>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        fontWeight: 'bold',
        color: '#333'
      }}>
        {currentSlide + 1} / {totalSlides}
      </div>
      
      <ControlButton onClick={onNext} disabled={totalSlides === 0}>
        ➡️
      </ControlButton>
      
      <ControlButton onClick={onAdd} variant="success">
        ➕
      </ControlButton>
      
      <ControlButton onClick={onRemove} disabled={totalSlides === 0} variant="danger">
        ➖
      </ControlButton>
      
      <ControlButton onClick={onTogglePresent} variant="primary">
        {isPresenting ? 'Exit' : 'Present'}
      </ControlButton>
    </div>
  );
};

const ControlButton = ({ onClick, disabled, children, variant = 'default' }) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #56ab2f, #a8e063)',
          color: 'white'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
          color: 'white'
        };
      default:
        return {
          background: 'rgba(255,255,255,0.9)',
          color: '#333',
          border: '2px solid #e0e0e0'
        };
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 16px',
        border: 'none',
        borderRadius: '50%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        ...getVariantStyle(),
        '&:hover:not(:disabled)': {
          transform: 'translateY(-2px)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
        },
        '&:active:not(:disabled)': {
          transform: 'translateY(0)'
        }
      }}
    >
      {children}
    </button>
  );
};

const SlidePreview = ({ slides, currentSlide, onSelect }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      background: 'rgba(255,255,255,0.95)',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      zIndex: 1001,
      maxHeight: '60vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Slides</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => onSelect(index)}
            style={{
              padding: '0.5rem',
              background: index === currentSlide ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f0',
              color: index === currentSlide ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: index === currentSlide 
                  ? 'linear-gradient(135deg, #5a6fd8, #6a4190)' 
                  : '#e0e0e0'
              }
            }}
          >
            Slide {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const SlidesExtras = () => {
  const {
    slides,
    currentSlide,
    isPresenting,
    transitionDirection,
    addSlide,
    removeSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    togglePresentation
  } = useSlideManager([
    { id: 1, content: 'Welcome to Advanced Slides!' },
    { id: 2, content: 'Built with React and modern CSS' },
    { id: 3, content: 'Features smooth animations and transitions' }
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isPresenting) {
        switch (e.key) {
          case 'ArrowRight':
          case ' ':
            nextSlide();
            break;
          case 'ArrowLeft':
            prevSlide();
            break;
          case 'Escape':
            togglePresentation();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPresenting, nextSlide, prevSlide, togglePresentation]);

  const handleAddSlide = () => {
    const newContent = `Slide ${slides.length + 1} content`;
    addSlide(newContent);
  };

  const handleRemoveSlide = () => {
    removeSlide(currentSlide);
  };

  return (
    <>
      <PresentationContainer isPresenting={isPresenting}>
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {slides.map((slide, index) => (
            <Slide
              key={slide.id}
              content={slide.content}
              isActive={index === currentSlide}
              transitionDirection={transitionDirection}
              index={index}
            />
          ))}
        </div>
      </PresentationContainer>

      {!isPresenting && (
        <>
          <Controls
            onNext={nextSlide}
            onPrev={prevSlide}
            onAdd={handleAddSlide}
            onRemove={handleRemoveSlide}
            onTogglePresent={togglePresentation}
            isPresenting={isPresenting}
            currentSlide={currentSlide}
            totalSlides={slides.length}
          />
          
          <SlidePreview
            slides={slides}
            currentSlide={currentSlide}
            onSelect={goToSlide}
          />
        </>
      )}

      {/* Global styles */}
      <style>
        {`
          @keyframes slideInFromRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInFromLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
        `}
      </style>
    </>
  );
};

export default SlidesExtras;