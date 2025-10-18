import { useState } from 'react';
import './SeedShareActions.css';

interface SeedShareActionsProps {
  plantId: string;
  hasActiveOffer: boolean;
  hasActiveRequest: boolean;
  activeOfferQuantity?: number;
  activeOfferStatus?: string;
  activeRequestStatus?: string;
  openOffers: number;
  openRequests: number;
  onOfferClick: (quantity: number) => void;
  onRequestClick: () => void;
  onCancelOffer?: () => void;
  onCancelRequest?: () => void;
}

function SeedShareActions({
  hasActiveOffer,
  hasActiveRequest,
  activeOfferQuantity,
  activeOfferStatus,
  activeRequestStatus,
  openOffers,
  openRequests,
  onOfferClick,
  onRequestClick,
  onCancelOffer,
  onCancelRequest,
}: SeedShareActionsProps) {
  const [showOfferQuantity, setShowOfferQuantity] = useState(false);
  const [offerQuantity, setOfferQuantity] = useState(1);

  const handleOfferButtonClick = () => {
    if (hasActiveOffer) {
      return; // Already has an offer
    }
    setShowOfferQuantity(true);
  };

  const handleConfirmOffer = () => {
    onOfferClick(offerQuantity);
    setShowOfferQuantity(false);
    setOfferQuantity(1);
  };

  const getStatusDisplay = (status?: string) => {
    switch (status) {
      case 'open':
        return 'Active';
      case 'matched':
        return 'Matched';
      case 'confirmed':
        return 'Confirmed';
      case 'sent':
        return 'Shipped';
      case 'received':
        return 'Received';
      case 'complete':
        return 'Complete';
      default:
        return status;
    }
  };

  return (
    <div className="seed-share-actions">
      <div className="seed-share-header">
        <h3>🌱 Seed Share</h3>
        <p className="seed-share-subtitle">Share seeds with other gardeners!</p>
      </div>

      {/* Volume Display */}
      <div className="seed-share-volume">
        <div className="volume-item">
          <span className="volume-icon">🌻</span>
          <div className="volume-details">
            <span className="volume-count">{openOffers}</span>
            <span className="volume-label">Available Packets</span>
          </div>
        </div>
        <div className="volume-item">
          <span className="volume-icon">🤲</span>
          <div className="volume-details">
            <span className="volume-count">{openRequests}</span>
            <span className="volume-label">Open Requests</span>
          </div>
        </div>
      </div>

      {/* Active Status Display */}
      {(hasActiveOffer || hasActiveRequest) && (
        <div className="active-status">
          {hasActiveOffer && (
            <div className="status-badge offer-badge">
              <div className="status-header">
                <span className="status-icon">📤</span>
                <span className="status-title">Your Offer</span>
              </div>
              <div className="status-details">
                <div className="status-info">
                  <span className="status-quantity">{activeOfferQuantity} packet{activeOfferQuantity !== 1 ? 's' : ''}</span>
                  <span className="status-state">
                    {getStatusDisplay(activeOfferStatus)}
                  </span>
                </div>
                {activeOfferStatus === 'open' && onCancelOffer && (
                  <button className="cancel-button" onClick={onCancelOffer}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
          {hasActiveRequest && (
            <div className="status-badge request-badge">
              <div className="status-header">
                <span className="status-icon">📥</span>
                <span className="status-title">Your Request</span>
              </div>
              <div className="status-details">
                <div className="status-info">
                  <span className="status-quantity">1 packet</span>
                  <span className="status-state">
                    {getStatusDisplay(activeRequestStatus)}
                  </span>
                </div>
                {activeRequestStatus === 'open' && onCancelRequest && (
                  <button className="cancel-button" onClick={onCancelRequest}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!hasActiveOffer && !hasActiveRequest && (
        <div className="action-buttons">
          {!showOfferQuantity ? (
            <>
              <button
                className="action-button offer-button"
                onClick={handleOfferButtonClick}
                disabled={hasActiveRequest}
              >
                <span className="button-icon">🌻</span>
                <div className="button-content">
                  <span className="button-title">Offer Seeds</span>
                  <span className="button-subtitle">Share up to 10 packets</span>
                </div>
              </button>
              <button
                className="action-button request-button"
                onClick={onRequestClick}
                disabled={hasActiveOffer}
              >
                <span className="button-icon">🤲</span>
                <div className="button-content">
                  <span className="button-title">Request Seeds</span>
                  <span className="button-subtitle">Get 1 packet</span>
                </div>
              </button>
            </>
          ) : (
            <div className="quantity-selector">
              <h4>How many packets do you want to offer?</h4>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => setOfferQuantity(Math.max(1, offerQuantity - 1))}
                  disabled={offerQuantity <= 1}
                >
                  −
                </button>
                <span className="quantity-display">{offerQuantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setOfferQuantity(Math.min(10, offerQuantity + 1))}
                  disabled={offerQuantity >= 10}
                >
                  +
                </button>
              </div>
              <div className="quantity-actions">
                <button className="confirm-button" onClick={handleConfirmOffer}>
                  Confirm Offer
                </button>
                <button
                  className="cancel-link"
                  onClick={() => {
                    setShowOfferQuantity(false);
                    setOfferQuantity(1);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {(hasActiveOffer || hasActiveRequest) && (
        <div className="info-message">
          <span className="info-icon">ℹ️</span>
          <span>You can only have one active offer or request per plant.</span>
        </div>
      )}
    </div>
  );
}

export default SeedShareActions;
