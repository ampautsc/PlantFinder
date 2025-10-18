import { useState } from 'react';
import { MatchDetails } from '../types/SeedShare';
import './MatchTracker.css';

interface MatchTrackerProps {
  userId: string;
  matches: MatchDetails[];
  onMarkAsSent: (matchId: string) => void;
  onMarkAsReceived: (matchId: string) => void;
}

function MatchTracker({
  userId,
  matches,
  onMarkAsSent,
  onMarkAsReceived,
}: MatchTrackerProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const toggleMatch = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'matched':
        return { icon: '🤝', label: 'Matched', color: '#FF9800' };
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
          const statusInfo = getStatusInfo(match.status);
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

                    <div className={`timeline-item ${match.completedAt ? 'completed' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-label">Complete</div>
                        {match.completedAt && (
                          <div className="timeline-date">{formatDate(match.completedAt)}</div>
                        )}
                      </div>
                    </div>
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
                        ✅ Mark as Received
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
