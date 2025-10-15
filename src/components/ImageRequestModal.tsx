import { useState } from 'react';
import { ImageRequestFormData, ImageRequest } from '../types/ImageRequest';
import { GitHubAdapter } from '../api/GitHubAdapter';
import './FeedbackModal.css';

interface ImageRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  speciesId: string;
  commonName: string;
  scientificName: string;
  speciesType: 'plant' | 'animal';
}

const ImageRequestModal: React.FC<ImageRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  speciesId, 
  commonName, 
  scientificName,
  speciesType 
}) => {
  const [formData, setFormData] = useState<ImageRequestFormData>({
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const githubAdapter = new GitHubAdapter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const imageRequest: ImageRequest = {
        timestamp: new Date().toISOString(),
        requestType: speciesType,
        speciesId,
        commonName,
        scientificName,
        message: formData.message,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      await githubAdapter.submitImageRequest(imageRequest);
      
      setSubmitStatus('success');
      setFormData({
        message: '',
      });

      // Close modal after 2 seconds on success
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setFormData({
      message: value,
    });
  };

  if (!isOpen) return null;

  const isConfigured = githubAdapter.isConfigured();

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <h2>📷 Request Images</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {!isConfigured && (
          <div className="feedback-warning">
            ⚠️ Image request submission is not configured. Please contact the administrator to set up the GitHub token.
          </div>
        )}

        <div className="feedback-info">
          <p><strong>Species:</strong> {commonName}</p>
          <p><strong>Scientific Name:</strong> <em>{scientificName}</em></p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="message">Additional Information (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any specific details about the images you'd like to see (e.g., flower close-up, full plant, habitat)..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {submitStatus === 'success' && (
            <div className="feedback-success">
              ✅ Thank you! Your image request has been submitted successfully.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="feedback-error">
              ❌ {errorMessage || 'Failed to submit image request. Please try again.'}
            </div>
          )}

          <div className="feedback-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={isSubmitting || !isConfigured}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageRequestModal;
