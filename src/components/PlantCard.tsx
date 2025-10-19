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
  const getSunLabel = (sun: string) => {
    const labels = {
      'full-sun': '☀️ Full Sun',
      'partial-sun': '⛅ Partial Sun',
      'partial-shade': '🌤️ Partial Shade',
      'full-shade': '☁️ Full Shade',
    };
    return labels[sun as keyof typeof labels] || sun;
  };

  const getMoistureLabel = (moisture: string) => {
    const labels = {
      'dry': '🏜️ Dry',
      'medium': '💧 Medium',
      'moist': '💦 Moist',
      'wet': '🌊 Wet',
    };
    return labels[moisture as keyof typeof labels] || moisture;
  };

  return (
    <div className="plant-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      {plant.imageUrl ? (
        <div className="plant-image">
          <img src={plant.imageUrl} alt={plant.commonName} loading="lazy" />
          {/* Seed Share Badges */}
          {plantVolume && (plantVolume.openOffers > 0 || plantVolume.openRequests > 0) && (
            <div className="seed-share-badge">
              {plantVolume.openOffers > 0 && (
                <div className="badge-item offer-badge">
                  <img src="/milkweed_seed_icon.ico" alt="Seed" className="badge-icon" />
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
                  <img src="/milkweed_seed_icon.ico" alt="Seed" className="badge-icon" />
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
      <p className="description">{plant.description}</p>

      <div className="plant-details">
        <div className="detail-row">
          <span className="detail-label">Sun:</span>
          <span className="detail-value">{getSunLabel(plant.requirements.sun)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Moisture:</span>
          <span className="detail-value">{getMoistureLabel(plant.requirements.moisture)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Soil:</span>
          <span className="detail-value">{plant.requirements.soil}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Size:</span>
          <span className="detail-value">{`${plant.characteristics.height}" H × ${plant.characteristics.width}" W`}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Bloom:</span>
          <span className="detail-value">{plant.characteristics.bloomTime.join(', ')}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Zones:</span>
          <span className="detail-value">{plant.characteristics.hardinessZones.join(', ')}</span>
        </div>
      </div>

      <div className="tags">
        {plant.characteristics.bloomColor.map(color => (
          <span key={color} className="tag">{color}</span>
        ))}
        {plant.relationships.foodFor.map(food => (
          <span key={food} className="tag">{food}</span>
        ))}
      </div>
    </div>
  );
}

export default PlantCard;
