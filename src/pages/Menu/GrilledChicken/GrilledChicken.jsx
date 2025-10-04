import React, { useState, useMemo } from 'react';

// Custom hook for animation states
const useGrillAnimation = () => {
  const [isGrilling, setIsGrilling] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  const startGrilling = () => setIsGrilling(true);
  const flipChicken = () => setFlipCount(prev => prev + 1);
  const resetGrill = () => {
    setIsGrilling(false);
    setFlipCount(0);
  };

  return {
    isGrilling,
    flipCount,
    startGrilling,
    flipChicken,
    resetGrill
  };
};

// Styled components using CSS-in-JSX pattern
const Container = ({ children, theme = 'light' }) => {
  const containerStyle = {
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: theme === 'dark' ? '#2c3e50' : '#ecf0f1',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease'
  };

  return <div style={containerStyle}>{children}</div>;
};

const GrillSurface = ({ isHot, children }) => {
  const grillStyle = {
    position: 'relative',
    padding: '2rem',
    background: isHot 
      ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
      : 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
    borderRadius: '8px',
    border: '2px solid #34495e',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
    }
  };

  return <div style={grillStyle}>{children}</div>;
};

const ChickenPiece = ({ isGrilling, flipCount, doneness }) => {
  // Calculate color based on doneness
  const getChickenColor = () => {
    const baseColor = '#f39c12';
    const cookedColors = {
      rare: '#e67e22',
      medium: '#d35400',
      well: '#ba4a00',
      charred: '#7e5100'
    };
    
    return cookedColors[doneness] || baseColor;
  };

  const chickenStyle = {
    width: '120px',
    height: '80px',
    background: getChickenColor(),
    borderRadius: '8px',
    position: 'relative',
    margin: '0 auto',
    transform: `rotateY(${flipCount % 2 === 0 ? '0deg' : '180deg'})`,
    transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    boxShadow: `
      0 4px 20px rgba(0,0,0,0.2),
      inset 0 2px 10px rgba(255,255,255,0.1),
      inset 0 -2px 10px rgba(0,0,0,0.1)
    `,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '10%',
      left: '10%',
      right: '10%',
      bottom: '10%',
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%)',
      backgroundSize: '8px 8px'
    }
  };

  // Grill marks animation
  if (isGrilling) {
    chickenStyle.animation = 'grillMarks 2s infinite alternate';
  }

  return <div style={chickenStyle} />;
};

const ControlButton = ({ onClick, disabled, children, variant = 'primary' }) => {
  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    ...(variant === 'primary' ? {
      background: 'linear-gradient(135deg, #3498db, #2980b9)',
      color: 'white',
      '&:hover:not(:disabled)': {
        background: 'linear-gradient(135deg, #2980b9, #1c6ea4)',
        transform: 'translateY(-2px)'
      }
    } : {
      background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
      color: 'white',
      '&:hover:not(:disabled)': {
        background: 'linear-gradient(135deg, #c0392b, #a93226)',
        transform: 'translateY(-2px)'
      }
    }),
    '&:disabled': {
      opacity: 0.6,
      transform: 'none'
    }
  };

  return (
    <button 
      style={buttonStyle} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Main Component
const GrilledChicken = () => {
  const { isGrilling, flipCount, startGrilling, flipChicken, resetGrill } = useGrillAnimation();
  const [doneness, setDoneness] = useState('rare');

  // Calculate doneness based on flip count and grilling time
  useMemo(() => {
    if (flipCount >= 4) setDoneness('charred');
    else if (flipCount >= 3) setDoneness('well');
    else if (flipCount >= 2) setDoneness('medium');
    else setDoneness('rare');
  }, [flipCount]);

  const grillStatus = isGrilling ? 'GRILLING...' : 'READY';
  const statusColor = isGrilling ? '#e74c3c' : '#27ae60';

  return (
    <Container theme="dark">
      <div style={{
        textAlign: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <h1 style={{
          color: '#fff',
          marginBottom: '2rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, #f39c12, #e67e22)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🍗 Advanced Chicken Griller
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <GrillSurface isHot={isGrilling}>
            <ChickenPiece 
              isGrilling={isGrilling} 
              flipCount={flipCount} 
              doneness={doneness}
            />
          </GrillSurface>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <ControlButton
            onClick={startGrilling}
            disabled={isGrilling}
            variant="primary"
          >
            Start Grill
          </ControlButton>
          
          <ControlButton
            onClick={flipChicken}
            disabled={!isGrilling}
            variant="secondary"
          >
            Flip Chicken
          </ControlButton>
          
          <ControlButton
            onClick={resetGrill}
            variant="secondary"
          >
            Reset
          </ControlButton>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>Stats</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            color: '#ecf0f1'
          }}>
            <span>Status:</span>
            <span style={{ color: statusColor, fontWeight: 'bold' }}>
              {grillStatus}
            </span>
            
            <span>Flips:</span>
            <span style={{ fontWeight: 'bold' }}>{flipCount}</span>
            
            <span>Doneness:</span>
            <span style={{ 
              fontWeight: 'bold',
              textTransform: 'capitalize',
              color: doneness === 'charred' ? '#7e5100' : 
                     doneness === 'well' ? '#ba4a00' : 
                     doneness === 'medium' ? '#d35400' : '#e67e22'
            }}>
              {doneness}
            </span>
          </div>
        </div>

        {/* CSS Animation keyframes as style tag */}
        <style>
          {`
            @keyframes grillMarks {
              0% {
                box-shadow: 
                  inset 0 2px 10px rgba(255,255,255,0.1),
                  inset 0 -2px 10px rgba(0,0,0,0.1),
                  0 0 0 rgba(0,0,0,0.2);
              }
              100% {
                box-shadow: 
                  inset 0 2px 10px rgba(255,255,255,0.1),
                  inset 0 -2px 10px rgba(0,0,0,0.1),
                  0 0 20px rgba(230, 126, 34, 0.6);
              }
            }
          `}
        </style>
      </div>
    </Container>
  );
};

export default GrilledChicken;