import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
import './FeedbackStates.css';

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'We could not complete your request. Please try again.',
  onRetry,
}) {
  return (
    <div className="feedback-state error-state" role="alert">
      <div className="feedback-icon-wrapper error-icon">
        <AlertCircle size={36} className="state-icon" />
      </div>
      <h3 className="feedback-title">{title}</h3>
      <p className="feedback-desc">{message}</p>
      {onRetry && (
        <div className="feedback-action">
          <Button variant="secondary" size="md" icon={RefreshCw} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
