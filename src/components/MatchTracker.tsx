import { useState } from 'react';
import { MatchDetails } from '../types/SeedShare';
import './MatchTracker.css';

interface MatchTrackerProps {
  userId: string;
  matches: MatchDetails[];
  onConfirmMatch: (matchId: string) => void;
  onMarkAsSent: (matchId: string) => void;
  onMarkAsReceived: (matchId: string) => void;
  onUpdatePlantingStatus: (matchId: string, status: 'planted' | 'sprouted' | 'grown' | 'flowered' | 'seeded' | 'established') => void;
}

function MatchTracker({
  userId,
  matches,
  onConfirmMatch,
  onMarkAsSent,
  onMarkAsReceived,
  onUpdatePlantingStatus,
}: MatchTrackerProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const toggleMatch = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const getStatusInfo = (status: string, plantingStatus?: string) => {
    // If there's a planting status, show that instead
    if (plantingStatus) {
      switch (plantingStatus) {
        case 'planted':
          return { icon: '🌱', label: 'Planted', color: '#8BC34A' };
        case 'sprouted':
          return { icon: '🌿', label: 'Sprouted', color: '#7CB342' };
        case 'grown':
          return { icon: '🌾', label: 'Grown', color: '#689F38' };
        case 'flowered':
          return { icon: '🌸', label: 'Flowered', color: '#558B2F' };
        case 'seeded':
          return { icon: '🫘', label: 'Seeded', color: '#33691E' };
        case 'established':
          return { icon: '💚', label: 'Established', color: '#4CAF50' };
      }
    }

    switch (status) {
      case 'matched':
        return { icon: '🤝', label: 'Matched', color: '#FF9800' };
      case 'confirmed':
        return { icon: '💚', label: 'Confirmed', color: '#8BC34A' };
      case 'sent':
        return { icon: '📦', label: 'Shipped', color: '#2196F3' };
      case 'received':
        return { icon: '📬', label: 'Received', color: '#9C27B0' };
      case 'complete':
        return { icon: '✅', label: 'Complete', color: '#4CAF50' };
      default:
        return { icon: '❓', label: status, color: '#757575' };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="match-tracker">
      <div className="match-tracker-header">
        <h3>🤝 Your Seed Exchanges</h3>
        <span className="match-count">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
      </div>

      <div className="matches-list">
        {matches.map(match => {
          const statusInfo = getStatusInfo(match.status, match.plantingStatus);
          const isSender = match.senderId === userId;
          const isReceiver = match.receiverId === userId;
          const isExpanded = expandedMatch === match.id;

          return (
            <div key={match.id} className={`match-item ${isExpanded ? 'expanded' : ''}`}>
              <div className="match-summary" onClick={() => toggleMatch(match.id)}>
                <div className="match-main-info">
                  <span className="match-status-icon" style={{ color: statusInfo.color }}>
                    {statusInfo.icon}
                  </span>
                  <div className="match-details">
                    <div className="match-plant-name">{match.plantCommonName}</div>
                    <div className="match-role">
                      {isSender ? (
                        <span className="role-badge sender">📤 Sender</span>
                      ) : (
                        <span className="role-badge receiver">📥 Receiver</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="match-status-label" style={{ color: statusInfo.color }}>
                  {statusInfo.label}
                </div>
                <button className="expand-button" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
                  {isExpanded ? '−' : '+'}
                </button>
              </div>

              {isExpanded && (
                <div className="match-expanded-content">
                  <div className="match-timeline">
                    <div className="timeline-item completed">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-label">Matched</div>
                        <div className="timeline-date">{formatDate(match.matchedAt)}</div>
                      </div>
                    </div>

                    <div className={`timeline-item ${match.confirmedAt ? 'completed' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-label">Confirmed</div>
                        {match.confirmedAt && (
                          <div className="timeline-date">{formatDate(match.confirmedAt)}</div>
                        )}
                      </div>
                    </div>

                    <div className={`timeline-item ${match.sentAt ? 'completed' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-label">Shipped</div>
                        {match.sentAt && (
                          <div className="timeline-date">{formatDate(match.sentAt)}</div>
                        )}
                      </div>
                    </div>

                    <div className={`timeline-item ${match.receivedAt ? 'completed' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-label">Received</div>
                        {match.receivedAt && (
                          <div className="timeline-date">{formatDate(match.receivedAt)}</div>
                        )}
                      </div>
                    </div>

                    {isReceiver && match.receivedAt && (
                      <>
                        <div className={`timeline-item ${match.plantedAt ? 'completed' : ''}`}>
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-label">Planted</div>
                            {match.plantedAt && (
                              <div className="timeline-date">{formatDate(match.plantedAt)}</div>
                            )}
                          </div>
                        </div>

                        <div className={`timeline-item ${match.sproutedAt ? 'completed' : ''}`}>
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-label">Sprouted</div>
                            {match.sproutedAt && (
                              <div className="timeline-date">{formatDate(match.sproutedAt)}</div>
                            )}
                          </div>
                        </div>

                        <div className={`timeline-item ${match.grownAt ? 'completed' : ''}`}>
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-label">Grown</div>
                            {match.grownAt && (
                              <div className="timeline-date">{formatDate(match.grownAt)}</div>
                            )}
                          </div>
                        </div>

                        <div className={`timeline-item ${match.floweredAt ? 'completed' : ''}`}>
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-label">Flowered</div>
                            {match.floweredAt && (
                              <div className="timeline-date">{formatDate(match.floweredAt)}</div>
                            )}
                          </div>
                        </div>

                        <div className={`timeline-item ${match.seededAt ? 'completed' : ''}`}>
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-label">Seeded</div>
                            {match.seededAt && (
                              <div className="timeline-date">{formatDate(match.seededAt)}</div>
                            )}
                          </div>
                        </div>

                        <div className={`timeline-item ${match.establishedAt ? 'completed' : ''}`}>
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-label">Established</div>
                            {match.establishedAt && (
                              <div className="timeline-date">{formatDate(match.establishedAt)}</div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {!isReceiver && match.receivedAt && (
                      <div className={`timeline-item ${match.completedAt ? 'completed' : ''}`}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <div className="timeline-label">Complete</div>
                          {match.completedAt && (
                            <div className="timeline-date">{formatDate(match.completedAt)}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="match-info-grid">
                    <div className="info-row">
                      <span className="info-label">Plant:</span>
                      <span className="info-value">
                        {match.plantCommonName}
                        <span className="scientific-name"> ({match.plantScientificName})</span>
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">
                        {isSender ? 'Sending to:' : 'Receiving from:'}
                      </span>
                      <span className="info-value">
                        {isSender ? match.receiverName : match.senderName}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Quantity:</span>
                      <span className="info-value">{match.quantity} packet</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="match-actions">
                    {isSender && match.status === 'matched' && (
                      <>
                        <button
                          className="action-btn confirm-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onConfirmMatch(match.id);
                          }}
                        >
                          💚 Confirm Match
                        </button>
                      </>
                    )}
                    {isSender && match.status === 'confirmed' && (
                      <button
                        className="action-btn send-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsSent(match.id);
                        }}
                      >
                        📦 Mark as Shipped
                      </button>
                    )}
                    {isReceiver && match.status === 'sent' && (
                      <button
                        className="action-btn receive-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsReceived(match.id);
                        }}
                      >
                        ✅ Confirm Delivery
                      </button>
                    )}
                    {isReceiver && match.status === 'received' && !match.plantingStatus && (
                      <button
                        className="action-btn planting-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePlantingStatus(match.id, 'planted');
                        }}
                      >
                        🌱 Planted!
                      </button>
                    )}
                    {isReceiver && match.plantingStatus === 'planted' && (
                      <button
                        className="action-btn planting-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePlantingStatus(match.id, 'sprouted');
                        }}
                      >
                        🌿 Sprouted!
                      </button>
                    )}
                    {isReceiver && match.plantingStatus === 'sprouted' && (
                      <button
                        className="action-btn planting-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePlantingStatus(match.id, 'grown');
                        }}
                      >
                        🌾 Grown!
                      </button>
                    )}
                    {isReceiver && match.plantingStatus === 'grown' && (
                      <button
                        className="action-btn planting-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePlantingStatus(match.id, 'flowered');
                        }}
                      >
                        🌸 Flowered!
                      </button>
                    )}
                    {isReceiver && match.plantingStatus === 'flowered' && (
                      <button
                        className="action-btn planting-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePlantingStatus(match.id, 'seeded');
                        }}
                      >
                        🫘 Seeded!
                      </button>
                    )}
                    {isReceiver && match.plantingStatus === 'seeded' && (
                      <button
                        className="action-btn planting-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdatePlantingStatus(match.id, 'established');
                        }}
                      >
                        💚 Add to Garden
                      </button>
                    )}
                    {match.status === 'complete' && (
                      <div className="complete-message">
                        <span className="complete-icon">🎉</span>
                        <span>This exchange is complete! Thank you for sharing.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MatchTracker;
