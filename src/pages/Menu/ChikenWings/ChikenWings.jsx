import React, { useState, useRef, useEffect } from 'react';

// Custom hook for wing cooking simulation
const useWingCooker = () => {
  const [wings, setWings] = useState([]);
  const [isCooking, setIsCooking] = useState(false);
  const [cookLevel, setCookLevel] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [seasoning, setSeasoning] = useState('original');

  const addWing = () => {
    const newWing = {
      id: Date.now() + Math.random(),
      position: {
        x: Math.random() * 60 + 20,
        y: Math.random() * 60 + 20,
        rotation: Math.random() * 360
      },
      cookLevel: 0,
      flipped: false
    };
    setWings(prev => [...prev, newWing]);
  };

  const removeWing = (id) => {
    setWings(prev => prev.filter(wing => wing.id !== id));
  };

  const startCooking = () => {
    setIsCooking(true);
    setCookLevel(0);
    setFlipCount(0);
  };

  const stopCooking = () => {
    setIsCooking(false);
  };

  const flipWings = () => {
    setFlipCount(prev => prev + 1);
    setWings(prev => prev.map(wing => ({
      ...wing,
      flipped: !wing.flipped,
      position: {
        ...wing.position,
        rotation: wing.position.rotation + 180
      }
    })));
  };

  const changeSeasoning = (newSeasoning) => {
    setSeasoning(newSeasoning);
  };

  // Cooking simulation effect
  useEffect(() => {
    if (!isCooking) return;

    const cookInterval = setInterval(() => {
      setCookLevel(prev => Math.min(prev + 1, 100));
      setWings(prev => prev.map(wing => ({
        ...wing,
        cookLevel: Math.min(wing.cookLevel + 1, 100)
      })));
    }, 100);

    return () => clearInterval(cookInterval);
  }, [isCooking]);

  return {
    wings,
    isCooking,
    cookLevel,
    flipCount,
    seasoning,
    addWing,
    removeWing,
    startCooking,
    stopCooking,
    flipWings,
    changeSeasoning
  };
};

// 3D Wing Component with advanced styling
const ChickenWing = ({ wing, seasoning, onClick }) => {
  const getWingColor = () => {
    if (wing.cookLevel < 25) return '#F5D0A9'; // Raw
    if (wing.cookLevel < 50) return '#F7BE81'; // Light
    if (wing.cookLevel < 75) return '#DBA901'; // Golden
    if (wing.cookLevel < 90) return '#B45F04'; // Brown
    return '#8A4B08'; // Crispy
  };

  const getSeasoningColor = () => {
    switch (seasoning) {
      case 'bbq': return '#8B4513';
      case 'buffalo': return '#FF4500';
      case 'lemon-pepper': return '#FFD700';
      case 'garlic-parmesan': return '#F5DEB3';
      case 'teriyaki': return '#8B0000';
      default: return 'transparent';
    }
  };

  return (
    <div
      onClick={() => onClick(wing.id)}
      style={{
        position: 'absolute',
        left: `${wing.position.x}%`,
        top: `${wing.position.y}%`,
        transform: `rotate(${wing.position.rotation}deg) scale(${wing.flipped ? -1 : 1}, 1)`,
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        zIndex: Math.floor(wing.position.y)
      }}
    >
      {/* Main wing body */}
      <div style={{
        width: '60px',
        height: '30px',
        background: getWingColor(),
        borderRadius: '15px 8px 8px 15px',
        position: 'relative',
        boxShadow: `
          0 4px 20px rgba(0,0,0,0.3),
          inset 2px 0 10px rgba(255,255,255,0.2),
          inset -2px 0 10px rgba(0,0,0,0.1)
        `,
        transform: 'perspective(500px) rotateX(5deg)',
        transition: 'all 0.4s ease'
      }}>
        {/* Bone */}
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '5px',
          width: '15px',
          height: '20px',
          background: 'linear-gradient(45deg, #F5F5F5, #E0E0E0)',
          borderRadius: '3px',
          transform: 'rotate(-5deg)',
          boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)'
        }} />
        
        {/* Seasoning overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 40%, ${getSeasoningColor()}40 0%, transparent 50%)`,
          borderRadius: '15px 8px 8px 15px',
          pointerEvents: 'none'
        }} />
        
        {/* Grill marks */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '15%',
          right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)',
          transform: 'rotate(-30deg)'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          left: '15%',
          right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)',
          transform: 'rotate(30deg)'
        }} />
      </div>
    </div>
  );
};

// Advanced Control Panel
const ControlPanel = ({ 
  isCooking, 
  cookLevel, 
  flipCount, 
  seasoning, 
  onAddWing, 
  onRemoveWing, 
  onStartCooking, 
  onStopCooking, 
  onFlipWings, 
  onChangeSeasoning 
}) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.3)',
      zIndex: 1000,
      minWidth: '300px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <ControlButton onClick={onAddWing} variant="success" disabled={isCooking}>
          ➕ Add Wing
        </ControlButton>
        <ControlButton onClick={onRemoveWing} variant="danger" disabled={isCooking}>
          ➖ Remove Wing
        </ControlButton>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <ControlButton 
          onClick={isCooking ? onStopCooking : onStartCooking} 
          variant={isCooking ? "danger" : "primary"}
        >
          {isCooking ? '🔥 Stop Cooking' : '🍗 Start Cooking'}
        </ControlButton>
        <ControlButton onClick={onFlipWings} variant="secondary" disabled={!isCooking}>
          🔄 Flip Wings
        </ControlButton>
      </div>

      <div style={{
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Seasoning</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['original', 'bbq', 'buffalo', 'lemon-pepper', 'garlic-parmesan', 'teriyaki'].map(flavor => (
            <SeasoningButton
              key={flavor}
              flavor={flavor}
              active={seasoning === flavor}
              onClick={() => onChangeSeasoning(flavor)}
              disabled={isCooking}
            />
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '1rem',
        borderRadius: '12px',
        color: 'white'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Cook Stats</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <span>Cook Level:</span>
          <span style={{ fontWeight: 'bold' }}>{cookLevel}%</span>
          <span>Flips:</span>
          <span style={{ fontWeight: 'bold' }}>{flipCount}</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '4px',
          marginTop: '0.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${cookLevel}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ff6b6b, #ffa500, #ffd700)',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({ onClick, disabled, children, variant = 'default' }) => {
  const getVariantStyle = () => {
    const baseStyle = {
      padding: '12px 16px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
          }
        };
      case 'secondary':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #f093fb, #f5576c)',
          color: 'white',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(245, 87, 108, 0.4)'
          }
        };
      case 'success':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
          color: 'white',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(78, 205, 196, 0.4)'
          }
        };
      case 'danger':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          color: 'white',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(255, 107, 107, 0.4)'
          }
        };
      default:
        return {
          ...baseStyle,
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          border: '2px solid #e0e0e0',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
          }
        };
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...getVariantStyle(),
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {children}
    </button>
  );
};

const SeasoningButton = ({ flavor, active, onClick, disabled }) => {
  const getFlavorStyle = () => {
    switch (flavor) {
      case 'bbq': return { background: '#8B4513', color: 'white' };
      case 'buffalo': return { background: '#FF4500', color: 'white' };
      case 'lemon-pepper': return { background: '#FFD700', color: '#333' };
      case 'garlic-parmesan': return { background: '#F5DEB3', color: '#333' };
      case 'teriyaki': return { background: '#8B0000', color: 'white' };
      default: return { background: '#f0f0f0', color: '#333' };
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 12px',
        border: 'none',
        borderRadius: '20px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: '600',
        fontSize: '12px',
        textTransform: 'capitalize',
        opacity: disabled ? 0.6 : 1,
        transform: active ? 'scale(1.1)' : 'scale(1)',
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
        ...getFlavorStyle()
      }}
    >
      {flavor}
    </button>
  );
};

// Main Component
const ChickenWings = () => {
  const {
    wings,
    isCooking,
    cookLevel,
    flipCount,
    seasoning,
    addWing,
    removeWing,
    startCooking,
    stopCooking,
    flipWings,
    changeSeasoning
  } = useWingCooker();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24, #ffd700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          margin: 0
        }}>
          🍗 Advanced Chicken Wings
        </h1>
        <p style={{
          color: '#666',
          fontSize: '1.2rem',
          margin: '0.5rem 0 0 0'
        }}>
          Interactive 3D Wing Cooking Simulator
        </p>
      </div>

      {/* Grill Surface */}
      <div style={{
        position: 'relative',
        width: '80%',
        height: '400px',
        margin: '0 auto',
        background: isCooking 
          ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
          : 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
        borderRadius: '15px',
        border: '3px solid #2c3e50',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        transition: 'all 0.5s ease'
      }}>
        {/* Grill lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, transparent 24px, rgba(0,0,0,0.1) 24px, rgba(0,0,0,0.1) 25px, transparent 25px),
            linear-gradient(0deg, transparent 24px, rgba(0,0,0,0.1) 24px, rgba(0,0,0,0.1) 25px, transparent 25px)
          `,
          backgroundSize: '25px 25px'
        }} />

        {/* Heat waves animation when cooking */}
        {isCooking && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255,165,0,0.3) 0%, transparent 50%)',
            animation: 'heatWave 2s infinite alternate',
            pointerEvents: 'none'
          }} />
        )}

        {/* Render wings */}
        {wings.map(wing => (
          <ChickenWing
            key={wing.id}
            wing={wing}
            seasoning={seasoning}
            onClick={removeWing}
          />
        ))}
      </div>

      {/* Control Panel */}
      <ControlPanel
        isCooking={isCooking}
        cookLevel={cookLevel}
        flipCount={flipCount}
        seasoning={seasoning}
        onAddWing={addWing}
        onRemoveWing={removeWing}
        onStartCooking={startCooking}
        onStopCooking={stopCooking}
        onFlipWings={flipWings}
        onChangeSeasoning={changeSeasoning}
      />

      {/* Global animations */}
      <style>
        {`
          @keyframes heatWave {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 0.6; transform: scale(1.1); }
          }
          
          @keyframes sizzle {
            0% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.02) rotate(1deg); }
            50% { transform: scale(1) rotate(0deg); }
            75% { transform: scale(1.02) rotate(-1deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default ChickenWings;