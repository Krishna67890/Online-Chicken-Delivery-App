import React from 'react';
import './LoyaltyCard.css';

const LoyaltyCard = ({ 
  user, 
  loyaltyData = {}, 
  onRedeem,
  onViewRewards,
  showActions = true
}) => {
  const defaultLoyalty = {
    points: 0,
    tier: 'Bronze',
    progress: 0,
    nextTier: 'Silver',
    nextTierPoints: 1000,
    rewardsAvailable: 0,
    lifetimePoints: 0
  };

  const loyalty = { ...defaultLoyalty, ...loyaltyData };

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      case 'platinum':
        return '#E5E4E2';
      case 'diamond':
        return '#B9F2FF';
      default:
        return '#CD7F32';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'bronze':
        return '🥉';
      case 'silver':
        return '🥈';
      case 'gold':
        return '🥇';
      case 'platinum':
        return '💎';
      case 'diamond':
        return '✨';
      default:
        return '🥉';
    }
  };

  const progressPercentage = Math.min(100, (loyalty.progress / loyalty.nextTierPoints) * 100);

  return (
    <div className="loyalty-card" style={{ borderImage: `linear-gradient(45deg, ${getTierColor(loyalty.tier)}, #667eea) 1` }}>
      <div className="loyalty-header">
        <div className="loyalty-tier-info">
          <div className="tier-icon">{getTierIcon(loyalty.tier)}</div>
          <div className="tier-details">
            <h3 className="tier-name">{loyalty.tier} Tier</h3>
            <p className="tier-description">Welcome to the {loyalty.tier} tier!</p>
          </div>
        </div>
        <div className="loyalty-points">
          <div className="points-amount">{loyalty.points}</div>
          <div className="points-label">Points</div>
        </div>
      </div>

      <div className="loyalty-progress">
        <div className="progress-info">
          <span className="current-tier">{loyalty.tier}</span>
          <span className="next-tier">{loyalty.nextTier}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: getTierColor(loyalty.tier)
            }}
          ></div>
        </div>
        <div className="progress-labels">
          <span className="current-points">{loyalty.progress} pts</span>
          <span className="next-tier-points">{loyalty.nextTierPoints} pts</span>
        </div>
      </div>

      <div className="loyalty-stats">
        <div className="stat-item">
          <div className="stat-value">{loyalty.rewardsAvailable}</div>
          <div className="stat-label">Rewards Available</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{loyalty.lifetimePoints}</div>
          <div className="stat-label">Lifetime Points</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">VIP</div>
          <div className="stat-label">Member</div>
        </div>
      </div>

      {showActions && (
        <div className="loyalty-actions">
          {onRedeem && (
            <button className="btn-redeem" onClick={onRedeem}>
              Redeem Rewards
            </button>
          )}
          {onViewRewards && (
            <button className="btn-view-rewards" onClick={onViewRewards}>
              View Rewards
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LoyaltyCard;