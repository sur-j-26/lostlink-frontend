import React from 'react';
import { Loader2 } from 'lucide-react';
import './FeedbackStates.css';

export default function LoadingState({ message = 'Loading campus items...', description = 'Retrieving real-time data from LostLink' }) {
  return (
    <div className="feedback-state loading-state">
      <div className="feedback-icon-wrapper loading-pulse">
        <Loader2 className="feedback-spinner" size={32} />
      </div>
      <h3 className="feedback-title">{message}</h3>
      {description && <p className="feedback-desc">{description}</p>}
    </div>
  );
}
