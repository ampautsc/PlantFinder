import { useState, useEffect, useCallback } from 'react';
import { Plant } from '../types/Plant';
import { mockSeedShareService } from '../api/MockSeedShareService';
import { PlantSeedShareVolume, UserPlantSeedShare, MatchDetails } from '../types/SeedShare';
import SeedShareActions from './SeedShareActions';
import MatchTracker from './MatchTracker';
import './PlantDetailView.css';

interface PlantDetailViewProps {
  plant: Plant;
  onClose: () => void;
}

// Current user ID (in a real app, this would come from authentication)
const CURRENT_USER_ID = 'current';

function PlantDetailView({ plant, onClose }: PlantDetailViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [plantVolume, setPlantVolume] = useState<PlantSeedShareVolume>({
    plantId: plant.id,
    openOffers: 0,
    openRequests: 0,
  });
  const [userActivity, setUserActivity] = useState<UserPlantSeedShare>({
    plantId: plant.id,
    hasActiveOffer: false,
    hasActiveRequest: false,
  });
  const [matches, setMatches] = useState<MatchDetails[]>([]);

  const loadSeedShareData = useCallback(async () => {
    try {
      const [volume, activity, userMatches] = await Promise.all([
        mockSeedShareService.getPlantVolume(plant.id),
        mockSeedShareService.getUserPlantActivity(CURRENT_USER_ID, plant.id),
        mockSeedShareService.getUserMatches(CURRENT_USER_ID),
      ]);
      setPlantVolume(volume);
      setUserActivity(activity);
      setMatches(userMatches);
    } catch (error) {
      console.error('Error loading seed share data:', error);
    }
  }, [plant.id]);

  // Load seed share data
  useEffect(() => {
    loadSeedShareData();
    // Register plant data with the service for match display
    mockSeedShareService.registerPlantData(plant.id, plant.commonName, plant.scientificName);
  }, [plant.id, plant.commonName, plant.scientificName, loadSeedShareData]);

  const handleCreateOffer = async (quantity: number) => {
    try {
      await mockSeedShareService.createOffer(CURRENT_USER_ID, plant.id, quantity);
      await loadSeedShareData();
    } catch (error) {
      console.error('Error creating offer:', error);
      alert(error instanceof Error ? error.message : 'Failed to create offer');
    }
  };

  const handleCreateRequest = async () => {
    try {
      await mockSeedShareService.createRequest(CURRENT_USER_ID, plant.id);
      await loadSeedShareData();
    } catch (error) {
      console.error('Error creating request:', error);
      alert(error instanceof Error ? error.message : 'Failed to create request');
    }
  };

  const handleCancelOffer = async () => {
    try {
      if (!userActivity.activeOfferId) {
        console.error('No active offer ID found');
        alert('Unable to find active offer to cancel');
        return;
      }
      await mockSeedShareService.cancelOffer(CURRENT_USER_ID, userActivity.activeOfferId);
      await loadSeedShareData();
    } catch (error) {
      console.error('Error canceling offer:', error);
      alert(error instanceof Error ? error.message : 'Failed to cancel offer');
    }
  };

  const handleCancelRequest = async () => {
    try {
      if (!userActivity.activeRequestId) {
        console.error('No active request ID found');
        alert('Unable to find active request to cancel');
        return;
      }
      await mockSeedShareService.cancelRequest(CURRENT_USER_ID, userActivity.activeRequestId);
      await loadSeedShareData();
    } catch (error) {
      console.error('Error canceling request:', error);
      alert(error instanceof Error ? error.message : 'Failed to cancel request');
    }
  };

  const handleMarkAsSent = async (matchId: string) => {
    try {
      await mockSeedShareService.markAsSent(CURRENT_USER_ID, matchId);
      await loadSeedShareData();
    } catch (error) {
      console.error('Error marking as sent:', error);
      alert(error instanceof Error ? error.message : 'Failed to mark as sent');
    }
  };

  const handleMarkAsReceived = async (matchId: string) => {
    try {
      await mockSeedShareService.markAsReceived(CURRENT_USER_ID, matchId);
      await loadSeedShareData();
    } catch (error) {
      console.error('Error marking as received:', error);
      alert(error instanceof Error ? error.message : 'Failed to mark as received');
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getSunIcon = (sun: string) => {
    const icons = {
      'full-sun': '☀️',
      'partial-sun': '⛅',
      'partial-shade': '🌤️',
      'full-shade': '☁️',
    };
    return icons[sun as keyof typeof icons] || '☀️';
  };

  const getSunLabel = (sun: string) => {
    const labels = {
      'full-sun': 'Full Sun',
      'partial-sun': 'Partial Sun',
      'partial-shade': 'Partial Shade',
      'full-shade': 'Full Shade',
    };
    return labels[sun as keyof typeof labels] || sun;
  };

  const getMoistureIcon = (moisture: string) => {
    const icons = {
      'dry': '🏜️',
      'medium': '💧',
      'moist': '💦',
      'wet': '🌊',
    };
    return icons[moisture as keyof typeof icons] || '💧';
  };

  const getMoistureLabel = (moisture: string) => {
    const labels = {
      'dry': 'Dry',
      'medium': 'Medium',
      'moist': 'Moist',
      'wet': 'Wet',
    };
    return labels[moisture as keyof typeof labels] || moisture;
  };

  const getPlantTypeIcon = () => {
    return plant.characteristics.perennial ? '🌱' : '🌿';
  };

  const getPlantTypeLabel = () => {
    return plant.characteristics.perennial ? 'Perennial' : 'Annual';
  };

  return (
    <div className="plant-detail-overlay" onClick={onClose}>
      <div className="plant-detail-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Header / Title Area */}
        <div className="detail-header">
          {plant.imageUrl ? (
            <div className="detail-hero-image">
              <img src={plant.imageUrl} alt={plant.commonName} />
            </div>
          ) : (
            <div className="detail-hero-placeholder">
              <span className="placeholder-icon">🌸</span>
            </div>
          )}
          <div className="detail-title-area">
            <h1 className="detail-common-name">{plant.commonName}</h1>
            <p className="detail-scientific-name">{plant.scientificName}</p>
          </div>
        </div>

        <div className="detail-content">
          {/* Essential Information */}
          <section className="detail-section essential-info">
            <h2 className="section-title">Growth Conditions</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">{getSunIcon(plant.requirements.sun)}</span>
                <div className="info-details">
                  <span className="info-label">Sunlight</span>
                  <span className="info-value">{getSunLabel(plant.requirements.sun)}</span>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">{getMoistureIcon(plant.requirements.moisture)}</span>
                <div className="info-details">
                  <span className="info-label">Water Needs</span>
                  <span className="info-value">{getMoistureLabel(plant.requirements.moisture)}</span>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🌍</span>
                <div className="info-details">
                  <span className="info-label">Soil Type</span>
                  <span className="info-value">{plant.requirements.soil}</span>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🌡️</span>
                <div className="info-details">
                  <span className="info-label">Hardiness Zones</span>
                  <span className="info-value">{plant.characteristics.hardinessZones.join(', ')}</span>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">{getPlantTypeIcon()}</span>
                <div className="info-details">
                  <span className="info-label">Plant Type</span>
                  <span className="info-value">{getPlantTypeLabel()}</span>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📏</span>
                <div className="info-details">
                  <span className="info-label">Size</span>
                  <span className="info-value">{plant.characteristics.height}" H × {plant.characteristics.width}" W</span>
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="detail-section description-section">
            <h2 className="section-title">About This Plant</h2>
            <p className="plant-description">{plant.description}</p>
            {plant.characteristics.bloomColor.length > 0 && (
              <div className="bloom-info">
                <span className="bloom-label">Bloom Colors:</span>
                <div className="bloom-colors">
                  {plant.characteristics.bloomColor.map(color => (
                    <span key={color} className="bloom-tag">{color}</span>
                  ))}
                </div>
              </div>
            )}
            {plant.characteristics.bloomTime.length > 0 && (
              <div className="bloom-info">
                <span className="bloom-label">Bloom Time:</span>
                <span className="bloom-value">{plant.characteristics.bloomTime.join(', ')}</span>
              </div>
            )}
          </section>

          {/* Wildlife Benefits */}
          {(plant.relationships.foodFor.length > 0 || plant.relationships.hostPlantTo.length > 0) && (
            <section className="detail-section wildlife-section">
              <h2 className="section-title">Wildlife Benefits</h2>
              {plant.relationships.foodFor.length > 0 && (
                <div className="wildlife-info">
                  <span className="wildlife-icon">🦋</span>
                  <div>
                    <span className="wildlife-label">Food For:</span>
                    <span className="wildlife-value">{plant.relationships.foodFor.join(', ')}</span>
                  </div>
                </div>
              )}
              {plant.relationships.hostPlantTo.length > 0 && (
                <div className="wildlife-info">
                  <span className="wildlife-icon">🐛</span>
                  <div>
                    <span className="wildlife-label">Host Plant To:</span>
                    <span className="wildlife-value">{plant.relationships.hostPlantTo.join(', ')}</span>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Seed Share Actions */}
          <SeedShareActions
            plantId={plant.id}
            hasActiveOffer={userActivity.hasActiveOffer}
            hasActiveRequest={userActivity.hasActiveRequest}
            activeOfferQuantity={userActivity.activeOfferQuantity}
            activeOfferStatus={userActivity.activeOfferStatus}
            activeRequestStatus={userActivity.activeRequestStatus}
            openOffers={plantVolume.openOffers}
            openRequests={plantVolume.openRequests}
            onOfferClick={handleCreateOffer}
            onRequestClick={handleCreateRequest}
            onCancelOffer={handleCancelOffer}
            onCancelRequest={handleCancelRequest}
          />

          {/* Match Tracker */}
          {matches.length > 0 && (
            <MatchTracker
              userId={CURRENT_USER_ID}
              matches={matches}
              onMarkAsSent={handleMarkAsSent}
              onMarkAsReceived={handleMarkAsReceived}
            />
          )}

          {/* Expandable Sections */}
          <div className="expandable-sections">
            {/* Planting Instructions */}
            <div className="expandable-section">
              <button
                className={`section-header ${expandedSections.has('planting') ? 'expanded' : ''}`}
                onClick={() => toggleSection('planting')}
              >
                <span className="section-header-text">
                  <span className="section-icon">🌱</span>
                  Planting Instructions
                </span>
                <span className="expand-icon">{expandedSections.has('planting') ? '−' : '+'}</span>
              </button>
              {expandedSections.has('planting') && (
                <div className="section-content">
                  <ol className="instruction-list">
                    <li>Choose a location that meets the sunlight and soil requirements listed above.</li>
                    <li>Prepare the soil by removing weeds and loosening to a depth of 6-8 inches.</li>
                    <li>Dig a hole twice as wide as the root ball and just as deep.</li>
                    <li>Place the plant in the hole, ensuring the top of the root ball is level with the ground.</li>
                    <li>Fill the hole with soil and gently firm around the base.</li>
                    <li>Water thoroughly after planting and keep soil {getMoistureLabel(plant.requirements.moisture).toLowerCase()} during establishment.</li>
                    <li>Apply 2-3 inches of mulch around the plant, keeping it away from the stem.</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Helpful Links */}
            <div className="expandable-section">
              <button
                className={`section-header ${expandedSections.has('links') ? 'expanded' : ''}`}
                onClick={() => toggleSection('links')}
              >
                <span className="section-header-text">
                  <span className="section-icon">🔗</span>
                  Helpful Links
                </span>
                <span className="expand-icon">{expandedSections.has('links') ? '−' : '+'}</span>
              </button>
              {expandedSections.has('links') && (
                <div className="section-content">
                  <ul className="links-list">
                    <li>
                      <a href={`https://plants.usda.gov/home/plantProfile?symbol=${plant.id.toUpperCase().substring(0, 5)}`} target="_blank" rel="noopener noreferrer">
                        USDA Plant Database
                      </a>
                    </li>
                    <li>
                      <a href={`https://www.wildflower.org/plants/result.php?id_plant=${plant.scientificName.replace(' ', '+')}`} target="_blank" rel="noopener noreferrer">
                        Lady Bird Johnson Wildflower Center
                      </a>
                    </li>
                    <li>
                      <a href={`https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderSearch.aspx?searchterm=${plant.scientificName.replace(' ', '+')}`} target="_blank" rel="noopener noreferrer">
                        Missouri Botanical Garden
                      </a>
                    </li>
                    <li>
                      <a href={`https://www.audubon.org/native-plants/search?zipcode=&search=${plant.commonName.replace(' ', '+')}`} target="_blank" rel="noopener noreferrer">
                        Audubon Native Plants Database
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Helpful Videos */}
            <div className="expandable-section">
              <button
                className={`section-header ${expandedSections.has('videos') ? 'expanded' : ''}`}
                onClick={() => toggleSection('videos')}
              >
                <span className="section-header-text">
                  <span className="section-icon">🎥</span>
                  Helpful Videos
                </span>
                <span className="expand-icon">{expandedSections.has('videos') ? '−' : '+'}</span>
              </button>
              {expandedSections.has('videos') && (
                <div className="section-content">
                  <ul className="links-list">
                    <li>
                      <a href={`https://www.youtube.com/results?search_query=${plant.commonName.replace(' ', '+')}+planting+care`} target="_blank" rel="noopener noreferrer">
                        Search YouTube for {plant.commonName} planting guides
                      </a>
                    </li>
                    <li>
                      <a href={`https://www.youtube.com/results?search_query=native+${plant.commonName.replace(' ', '+')}+garden`} target="_blank" rel="noopener noreferrer">
                        Native gardening with {plant.commonName}
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Where to Buy */}
            <div className="expandable-section">
              <button
                className={`section-header ${expandedSections.has('buy') ? 'expanded' : ''}`}
                onClick={() => toggleSection('buy')}
              >
                <span className="section-header-text">
                  <span className="section-icon">🛒</span>
                  Where to Buy
                </span>
                <span className="expand-icon">{expandedSections.has('buy') ? '−' : '+'}</span>
              </button>
              {expandedSections.has('buy') && (
                <div className="section-content">
                  <ul className="links-list">
                    <li>
                      <a href="https://www.prairiemoon.com/" target="_blank" rel="noopener noreferrer">
                        Prairie Moon Nursery - Native seeds & plants
                      </a>
                    </li>
                    <li>
                      <a href="https://www.americanmeadows.com/" target="_blank" rel="noopener noreferrer">
                        American Meadows - Wildflower seeds
                      </a>
                    </li>
                    <li>
                      <a href="https://www.highcountrygardens.com/" target="_blank" rel="noopener noreferrer">
                        High Country Gardens - Native plants
                      </a>
                    </li>
                    <li>
                      <a href={`https://www.google.com/search?q=buy+${plant.commonName.replace(' ', '+')}+native+plant+near+me`} target="_blank" rel="noopener noreferrer">
                        Find local nurseries selling {plant.commonName}
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantDetailView;
