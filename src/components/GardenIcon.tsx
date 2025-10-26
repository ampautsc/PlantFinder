import { useState, useRef } from 'react';
import './GardenIcon.css';
import { sparkleBurst } from '../utils/useSparkleBurst';
import { playBonusSound } from '../utils/playBonusSound';

interface GardenIconProps {
  isInGarden: boolean;
  onAddToGarden: () => void;
  onRemoveFromGarden: () => void;
}

function GardenIcon({ isInGarden, onAddToGarden, onRemoveFromGarden }: GardenIconProps) {
  const [celebrating, setCelebrating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (isInGarden) {
      // Simply toggle off without confirmation
      onRemoveFromGarden();
    } else {
      // Trigger celebration with synchronized audio and visual effects
      setCelebrating(true);
      
      // Play sound and trigger sparkle burst when audio starts
      playBonusSound(() => {
        // Synchronize visual effect with audio playback
        if (buttonRef.current) {
          sparkleBurst(buttonRef.current);
        }
      });
      
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
        aria-label={isInGarden ? 'Remove from garden' : 'Add to garden'}
        title={isInGarden ? 'Remove this plant from your garden' : 'Add this plant to your garden'}
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
