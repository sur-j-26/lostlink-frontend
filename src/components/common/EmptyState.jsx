import React from 'react';
import { PackageSearch } from 'lucide-react';
import Button from './Button';
import './FeedbackStates.css';

export default function EmptyState({
  icon: Icon = PackageSearch,
  title = 'No items found',
  description = 'Try adjusting your search terms or filters to find what you are looking for.',
  actionLabel,
  onAction,
  actionIcon,
}) {
  return (
    <div className="feedback-state empty-state">
      <div className="feedback-icon-wrapper empty-icon">
        <Icon size={36} className="state-icon" />
      </div>
      <h3 className="feedback-title">{title}</h3>
      <p className="feedback-desc">{description}</p>
      {actionLabel && onAction && (
        <div className="feedback-action">
          <Button variant="primary" size="md" icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
