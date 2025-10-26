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
  onConfirmMatch?: () => void;
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
  onConfirmMatch,
}: SeedExchangeOverlayProps) {
  const [showOfferQuantity, setShowOfferQuantity] = useState(false);
  const [offerQuantity, setOfferQuantity] = useState(1);

  const handleOfferButtonClick = () => {
    // If user has an active offer, allow them to update quantity
    if (hasActiveOffer) {
      setOfferQuantity(activeOfferQuantity || 1);
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

  return (
    <div className="seed-exchange-overlay">
      {/* Count Badge - Top Right */}
      {(openOffers > 0 || openRequests > 0) && (
        <div className={`count-badge ${openRequests > 0 ? 'count-badge-request' : 'count-badge-offer'}`}>
          {openRequests > 0 ? (
            <>
              <span className="badge-icon">🤲</span>
              <span className="badge-count">{openRequests}</span>
            </>
          ) : (
            <>
              <span className="badge-icon">🫘</span>
              <span className="badge-count">{openOffers}</span>
            </>
          )}
        </div>
      )}

      {/* Show buttons only when no active offer exists */}
      {!hasActiveOffer && !hasActiveRequest && (
        <>
          {/* Offer Button - Bottom Left */}
          <button
            className="exchange-button offer-button"
            onClick={handleOfferButtonClick}
            aria-label="Offer seeds"
          >
            <span className="button-icon">🫘</span>
            <span className="button-label">Offer Seeds</span>
          </button>

          {/* Request Button - Bottom Right */}
          <button
            className="exchange-button request-button"
            onClick={handleRequestButtonClick}
            aria-label="Request seeds"
          >
            <span className="button-icon">🤲</span>
            <span className="button-label">Adopt Seeds</span>
          </button>
        </>
      )}

      {/* Full-Width Status Bar - Shown when offer is active */}
      {hasActiveOffer && (
        <div className="status-bar status-bar-seed">
          <span className="status-bar-text">
            {activeOfferStatus === 'open' && 'Awaiting Match'}
            {activeOfferStatus === 'matched' && 'Matched!'}
            {activeOfferStatus === 'confirmed' && 'Confirmed'}
            {activeOfferStatus === 'sent' && 'Shipped'}
            {activeOfferStatus === 'received' && 'Delivered!'}
            {activeOfferStatus === 'complete' && 'Established'}
            {activeOfferQuantity && activeOfferStatus === 'open' && ` (${activeOfferQuantity})`}
          </span>
          {activeOfferStatus === 'open' && onCancelOffer && (
            <button
              className="withdraw-button"
              onClick={(e) => {
                e.stopPropagation();
                onCancelOffer();
              }}
              aria-label="Withdraw offer"
            >
              Withdraw
            </button>
          )}
          {activeOfferStatus === 'matched' && (
            <>
              {onConfirmMatch && (
                <button
                  className="confirm-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfirmMatch();
                  }}
                  aria-label="Confirm match"
                >
                  Confirm
                </button>
              )}
              {onCancelOffer && (
                <button
                  className="withdraw-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelOffer();
                  }}
                  aria-label="Withdraw offer"
                >
                  Withdraw
                </button>
              )}
            </>
          )}
        </div>
      )}

      {hasActiveRequest && (
        <div className="status-bar status-bar-adoption">
          <span className="status-bar-text">
            {activeRequestStatus === 'open' && 'Awaiting Match'}
            {activeRequestStatus === 'matched' && 'Matched!'}
            {activeRequestStatus === 'confirmed' && 'Confirmed'}
            {activeRequestStatus === 'sent' && 'Shipped'}
            {activeRequestStatus === 'received' && 'Delivered!'}
            {activeRequestStatus === 'complete' && 'Complete'}
          </span>
          {activeRequestStatus === 'open' && onCancelRequest && (
            <button
              className="withdraw-button"
              onClick={onCancelRequest}
              aria-label="Withdraw request"
            >
              Withdraw
            </button>
          )}
        </div>
      )}

      {/* Quantity Selector Modal */}
      {showOfferQuantity && (
        <div className="quantity-modal" onClick={() => setShowOfferQuantity(false)}>
          <div className="quantity-content" onClick={(e) => e.stopPropagation()}>
            <h4>{hasActiveOffer ? 'Update quantity' : 'How many packets?'}</h4>
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
                {hasActiveOffer ? 'Update' : 'Confirm'}
              </button>
              {hasActiveOffer && onCancelOffer && (
                <button className="withdraw-action-btn" onClick={() => {
                  setShowOfferQuantity(false);
                  onCancelOffer();
                }}>
                  Withdraw
                </button>
              )}
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
