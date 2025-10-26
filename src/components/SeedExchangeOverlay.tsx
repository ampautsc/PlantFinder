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
  openOffers,
  openRequests,
}: SeedExchangeOverlayProps) {
  return (
    <div className="seed-exchange-overlay">
      {/* Count Badge - Top Right - This stays on the image */}
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
    </div>
  );
}

export default SeedExchangeOverlay;
