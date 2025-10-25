import { useState } from 'react';
import './GardenIcon.css';

interface GardenIconProps {
  isInGarden: boolean;
  onAddToGarden: () => void;
  onOpenConfig: () => void;
}

function GardenIcon({ isInGarden, onAddToGarden, onOpenConfig }: GardenIconProps) {
  const [celebrating, setCelebrating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    if (isInGarden) {
      onOpenConfig();
    } else {
      // Trigger celebration
      setCelebrating(true);
      setShowConfetti(true);
      
      // Add to garden after a brief delay
      setTimeout(() => {
        onAddToGarden();
      }, 100);
      
      // End celebration after animation
      setTimeout(() => {
        setCelebrating(false);
      }, 1000);
      
      // Remove confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
  };

  // Create confetti elements
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    const confettiPieces = [];
    for (let i = 0; i < 30; i++) {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 0.3;
      const animationDuration = 1.5 + Math.random();
      
      confettiPieces.push(
        <div
          key={i}
          className="confetti"
          style={{
            left: `${left}%`,
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`,
          }}
        />
      );
    }
    
    return <div className="confetti-container">{confettiPieces}</div>;
  };

  return (
    <>
      <div className="garden-icon-container">
        <button
          className={`garden-icon-button ${isInGarden ? 'in-garden' : ''} ${celebrating ? 'celebrating' : ''}`}
          onClick={handleClick}
          aria-label={isInGarden ? 'Configure garden plant' : 'Add to garden'}
          title={isInGarden ? 'Configure this plant in your garden' : 'Add this plant to your garden'}
        >
          <img
            src={isInGarden 
              ? '/images/Camp%20Monarch_LOGO%20B1_gold_square.png'
              : '/images/Camp%20Monarch_LOGO%20B1_white_square.png'
            }
            alt="Garden icon"
          />
        </button>
      </div>
      {renderConfetti()}
    </>
  );
}

export default GardenIcon;
