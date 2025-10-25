import { Plant } from '../types/Plant';
import { PlantSeedShareVolume, UserPlantSeedShare } from '../types/SeedShare';
import GardenIcon from './GardenIcon';
import './SeedShareBadge.css';

interface PlantCardProps {
  plant: Plant;
  plantVolume: PlantSeedShareVolume | null;
  userActivity: UserPlantSeedShare | null;
  isInGarden: boolean;
  onAddToGarden: () => void;
  onRemoveFromGarden: () => void;
  onClick?: () => void;
}

function PlantCard({ plant, plantVolume, userActivity, isInGarden, onAddToGarden, onRemoveFromGarden, onClick }: PlantCardProps) {

  // Determine what badge to show in top-right corner
  // Priority: offers > requests (can't show both)
  const showOfferBadge = plantVolume && plantVolume.openOffers > 0;
  const showRequestBadge = plantVolume && plantVolume.openRequests > 0 && !showOfferBadge;

  // Determine user's status for this plant
  const getUserStatus = () => {
    if (!userActivity) return null;
    
    if (userActivity.hasActiveOffer) {
      if (userActivity.activeOfferStatus === 'matched') {
        return 'Matched';
      }
      return 'Seeds Offered';
    }
    
    if (userActivity.hasActiveRequest) {
      if (userActivity.activeRequestStatus === 'matched') {
        return 'Matched';
      }
      return 'Adoption Offered';
    }
    
    return null;
  };

  const userStatus = getUserStatus();

  return (
    <div className="plant-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      {plant.thumbnailUrl || plant.imageUrl ? (
        <div className="plant-image">
          <img src={plant.thumbnailUrl || plant.imageUrl} alt={plant.commonName} loading="lazy" />
          {/* Garden Icon - Always show */}
          <div onClick={(e) => e.stopPropagation()}>
            <GardenIcon
              isInGarden={isInGarden}
              onAddToGarden={onAddToGarden}
              onRemoveFromGarden={onRemoveFromGarden}
            />
          </div>
          {/* Seed Share Badge - Show EITHER offers OR requests (prioritize offers) */}
          {(showOfferBadge || showRequestBadge) && (
            <div className="seed-share-badge">
              {showOfferBadge && (
                <div className="badge-item offer-badge">
                  <span className="badge-icon">🫘</span>
                  <span className="badge-count">{plantVolume!.openOffers}</span>
                </div>
              )}
              {showRequestBadge && (
                <div className="badge-item request-badge">
                  <span className="badge-icon">🤲</span>
                  <span className="badge-count">{plantVolume!.openRequests}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="plant-image-placeholder">
          <div className="no-image-indicator">📷 Image Coming Soon</div>
          {/* Garden Icon - Always show */}
          <div onClick={(e) => e.stopPropagation()}>
            <GardenIcon
              isInGarden={isInGarden}
              onAddToGarden={onAddToGarden}
              onRemoveFromGarden={onRemoveFromGarden}
            />
          </div>
          {/* Seed Share Badge - Show EITHER offers OR requests (prioritize offers) */}
          {(showOfferBadge || showRequestBadge) && (
            <div className="seed-share-badge">
              {showOfferBadge && (
                <div className="badge-item offer-badge">
                  <span className="badge-icon">🫘</span>
                  <span className="badge-count">{plantVolume!.openOffers}</span>
                </div>
              )}
              {showRequestBadge && (
                <div className="badge-item request-badge">
                  <span className="badge-icon">🤲</span>
                  <span className="badge-count">{plantVolume!.openRequests}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <h2>{plant.commonName}</h2>
      <div className="scientific-name">{plant.scientificName}</div>
      {/* User Status Bar */}
      {userStatus && (
        <div className={`user-status-bar ${userStatus === 'Matched' ? 'status-matched' : userStatus === 'Seeds Offered' ? 'status-offered' : 'status-requested'}`}>
          <span className="status-text">{userStatus}</span>
        </div>
      )}
    </div>
  );
}

export default PlantCard;
