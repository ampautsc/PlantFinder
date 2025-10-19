import { useState } from 'react';
import './SeedExchangeOverlay.css';

interface SeedExchangeOverlayProps {
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

function SeedExchangeOverlay({
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
}: SeedExchangeOverlayProps) {
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

  const handleRequestButtonClick = () => {
    if (hasActiveRequest) {
      return; // Already has a request
    }
    onRequestClick();
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
      case 'complete':
        return 'Complete';
      default:
        return status;
    }
  };

  return (
    <div className="seed-exchange-overlay">
      {/* Offer Button - Bottom Left */}
      {!hasActiveOffer && (
        <button
          className="exchange-button offer-button"
          onClick={handleOfferButtonClick}
          aria-label="Offer seeds"
        >
          <span className="button-icon">🌱</span>
          <span className="button-count">{openOffers}</span>
        </button>
      )}

      {/* Request Button - Bottom Right */}
      {!hasActiveRequest && (
        <button
          className="exchange-button request-button"
          onClick={handleRequestButtonClick}
          aria-label="Request seeds"
        >
          <span className="button-icon">🤲</span>
          <span className="button-count">{openRequests}</span>
        </button>
      )}

      {/* Active Status Bar - Bottom */}
      {(hasActiveOffer || hasActiveRequest) && (
        <div className="active-status-bar">
          {hasActiveOffer && (
            <div className="status-item offer-status">
              <span className="status-icon">📤</span>
              <span className="status-text">
                Your Offer: {activeOfferQuantity} packet{activeOfferQuantity !== 1 ? 's' : ''} • {getStatusDisplay(activeOfferStatus)}
              </span>
              {activeOfferStatus === 'open' && onCancelOffer && (
                <button className="status-cancel" onClick={onCancelOffer} aria-label="Cancel offer">
                  ✕
                </button>
              )}
            </div>
          )}
          {hasActiveRequest && (
            <div className="status-item request-status">
              <span className="status-icon">📥</span>
              <span className="status-text">
                Your Request: 1 packet • {getStatusDisplay(activeRequestStatus)}
              </span>
              {activeRequestStatus === 'open' && onCancelRequest && (
                <button className="status-cancel" onClick={onCancelRequest} aria-label="Cancel request">
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector Modal */}
      {showOfferQuantity && (
        <div className="quantity-modal" onClick={() => setShowOfferQuantity(false)}>
          <div className="quantity-content" onClick={(e) => e.stopPropagation()}>
            <h4>How many packets?</h4>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => setOfferQuantity(Math.max(1, offerQuantity - 1))}
                disabled={offerQuantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="quantity-display">{offerQuantity}</span>
              <button
                className="quantity-btn"
                onClick={() => setOfferQuantity(Math.min(10, offerQuantity + 1))}
                disabled={offerQuantity >= 10}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="quantity-actions">
              <button className="confirm-btn" onClick={handleConfirmOffer}>
                Confirm
              </button>
              <button className="cancel-btn" onClick={() => setShowOfferQuantity(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeedExchangeOverlay;
