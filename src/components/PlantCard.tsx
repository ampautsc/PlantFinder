import { useState, useEffect } from 'react';
import { Plant } from '../types/Plant';
import { mockSeedShareService } from '../api/MockSeedShareService';
import { PlantSeedShareVolume } from '../types/SeedShare';
import './SeedShareBadge.css';

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
}

function PlantCard({ plant, onClick }: PlantCardProps) {
  const [plantVolume, setPlantVolume] = useState<PlantSeedShareVolume | null>(null);

  useEffect(() => {
    // Load seed share volume for this plant
    mockSeedShareService.getPlantVolume(plant.id).then(setPlantVolume);
  }, [plant.id]);

  return (
    <div className="plant-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      {plant.thumbnailUrl || plant.imageUrl ? (
        <div className="plant-image">
          <img src={plant.thumbnailUrl || plant.imageUrl} alt={plant.commonName} loading="lazy" />
          {/* Seed Share Badges */}
          {plantVolume && (plantVolume.openOffers > 0 || plantVolume.openRequests > 0) && (
            <div className="seed-share-badge">
              {plantVolume.openOffers > 0 && (
                <div className="badge-item offer-badge">
                  <span className="badge-icon">🫘</span>
                  <span className="badge-count">{plantVolume.openOffers}</span>
                </div>
              )}
              {plantVolume.openRequests > 0 && (
                <div className="badge-item request-badge">
                  <span className="badge-icon">🤲</span>
                  <span className="badge-count">{plantVolume.openRequests}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="plant-image-placeholder">
          <div className="no-image-indicator">📷 Image Coming Soon</div>
          {/* Seed Share Badges for placeholder images */}
          {plantVolume && (plantVolume.openOffers > 0 || plantVolume.openRequests > 0) && (
            <div className="seed-share-badge">
              {plantVolume.openOffers > 0 && (
                <div className="badge-item offer-badge">
                  <span className="badge-icon">🫘</span>
                  <span className="badge-count">{plantVolume.openOffers}</span>
                </div>
              )}
              {plantVolume.openRequests > 0 && (
                <div className="badge-item request-badge">
                  <span className="badge-icon">🤲</span>
                  <span className="badge-count">{plantVolume.openRequests}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <h2>{plant.commonName}</h2>
      <div className="scientific-name">{plant.scientificName}</div>
    </div>
  );
}

export default PlantCard;
