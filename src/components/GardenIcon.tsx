import { useState, useRef } from 'react';
import './GardenIcon.css';
import { sparkleBurst } from '../utils/useSparkleBurst';
import { playBonusSound } from '../utils/playBonusSound';

interface GardenIconProps {
  isInGarden: boolean;
  onAddToGarden: () => void;
  onOpenConfig: () => void;
}

function GardenIcon({ isInGarden, onAddToGarden, onOpenConfig }: GardenIconProps) {
  const [celebrating, setCelebrating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (isInGarden) {
      onOpenConfig();
    } else {
      // Trigger celebration with sound first, then sparkle burst
      setCelebrating(true);
      playBonusSound();
      
      // Delay sparkle burst slightly to let sound start playing first
      setTimeout(() => {
        if (buttonRef.current) {
          sparkleBurst(buttonRef.current);
        }
      }, 50);
      
      // Add to garden after a brief delay
      setTimeout(() => {
        onAddToGarden();
      }, 100);
      
      // End celebration after animation
      setTimeout(() => {
        setCelebrating(false);
      }, 1000);
    }
  };

  return (
    <div className="garden-icon-container">
      <button
        ref={buttonRef}
        className={`garden-icon-button ${isInGarden ? 'in-garden' : ''} ${celebrating ? 'celebrating' : ''}`}
        onClick={handleClick}
        aria-label={isInGarden ? 'Configure garden plant' : 'Add to garden'}
        title={isInGarden ? 'Configure this plant in your garden' : 'Add this plant to your garden'}
      >
        <img
          src={isInGarden 
            ? '/images/Camp%20Monarch_LOGO%20icon%20for%20Garden.png'
            : '/images/Camp%20Monarch_LOGO%20B1_gray_square.png'
          }
          alt="Garden icon"
        />
      </button>
    </div>
  );
}

export default GardenIcon;
