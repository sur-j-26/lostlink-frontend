import React from 'react';
import { Calendar, MapPin, Tag, ShieldCheck, Sparkles, Eye } from 'lucide-react';
import Button from '../common/Button';
import './ItemCard.css';

export default function ItemCard({ item, onViewDetails }) {
  const isLost = item.type === 'lost';

  return (
    <article className="item-card card">
      {/* Header bar with Badges */}
      <div className="item-card-header">
        <div className="item-badge-group">
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            <span className="badge-dot" />
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
          <span className="badge-category">
            <Tag size={12} />
            {item.category}
          </span>
        </div>

        {item.aiConfidence && (
          <div className="ai-match-badge" title="Potential AI matching with reported item">
            <Sparkles size={12} />
            <span>AI Match</span>
          </div>
        )}
      </div>

      {/* Main Item Body */}
      <div className="item-card-body">
        <h3 className="item-title">{item.title}</h3>
        <p className="item-description">{item.description}</p>

        {/* Metadata Details */}
        <div className="item-meta-list">
          <div className="item-meta-item">
            <MapPin size={15} className="meta-icon" />
            <span className="meta-text" title={item.location}>{item.location}</span>
          </div>
          <div className="item-meta-item">
            <Calendar size={15} className="meta-icon" />
            <span className="meta-text">{item.formattedDate || item.date}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="item-card-footer">
        <div className="item-status-indicator">
          {item.securityVerified ? (
            <span className="verified-tag" title="Verified by campus security desk">
              <ShieldCheck size={14} className="verified-icon" />
              <span>Desk Verified</span>
            </span>
          ) : (
            <span className="reported-tag">
              Status: <strong>{item.status || 'Active'}</strong>
            </span>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Eye}
          onClick={() => onViewDetails(item)}
          className="item-view-btn"
        >
          View Details
        </Button>
      </div>
    </article>
  );
}
