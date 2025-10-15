import { useState, useEffect, useMemo } from 'react';
import { PlantImageFormData, PlantImageSubmission, PlantOption } from '../types/PlantImage';
import { GitHubAdapter } from '../api/GitHubAdapter';
import { Plant } from '../types/Plant';
import './AddPlantImageModal.css';

interface AddPlantImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  plants: Plant[];
}

const AddPlantImageModal: React.FC<AddPlantImageModalProps> = ({ isOpen, onClose, plants }) => {
  const [formData, setFormData] = useState<PlantImageFormData>({
    plantId: '',
    plantCommonName: '',
    plantScientificName: '',
    imageSource: 'file',
    imageUrl: '',
    imageFile: null,
    submitterNotes: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const githubAdapter = useMemo(() => new GitHubAdapter(), []);

  // Create plant options with display names
  const plantOptions: PlantOption[] = useMemo(() => {
    return plants.map(plant => ({
      id: plant.id,
      commonName: plant.commonName,
      scientificName: plant.scientificName,
      displayName: `${plant.commonName} (${plant.scientificName})`,
    }));
  }, [plants]);

  // Filter plants based on search query
  const filteredPlants = useMemo(() => {
    if (!searchQuery.trim()) return plantOptions;
    
    const query = searchQuery.toLowerCase();
    return plantOptions.filter(plant =>
      plant.commonName.toLowerCase().includes(query) ||
      plant.scientificName.toLowerCase().includes(query)
    );
  }, [searchQuery, plantOptions]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        plantId: '',
        plantCommonName: '',
        plantScientificName: '',
        imageSource: 'file',
        imageUrl: '',
        imageFile: null,
        submitterNotes: '',
      });
      setSearchQuery('');
      setShowDropdown(false);
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.plantId) {
      setErrorMessage('Please select a plant.');
      setSubmitStatus('error');
      return;
    }

    if (formData.imageSource === 'file' && !formData.imageFile) {
      setErrorMessage('Please select an image file.');
      setSubmitStatus('error');
      return;
    }

    if (formData.imageSource === 'url' && !formData.imageUrl.trim()) {
      setErrorMessage('Please provide an image URL.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      let imageData: string | undefined;
      let fileName: string | undefined;

      if (formData.imageSource === 'file' && formData.imageFile) {
        // Convert file to base64
        const base64 = await fileToBase64(formData.imageFile);
        imageData = base64;
        fileName = formData.imageFile.name;
      }

      const submission: PlantImageSubmission = {
        timestamp: new Date().toISOString(),
        plantId: formData.plantId,
        plantCommonName: formData.plantCommonName,
        plantScientificName: formData.plantScientificName,
        imageSource: formData.imageSource,
        imageUrl: formData.imageSource === 'url' ? formData.imageUrl : undefined,
        imageData: formData.imageSource === 'file' ? imageData : undefined,
        fileName: formData.imageSource === 'file' ? fileName : undefined,
        submitterNotes: formData.submitterNotes || undefined,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      await githubAdapter.submitPlantImage(submission);
      
      setSubmitStatus('success');

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

  const handlePlantSelect = (plant: PlantOption) => {
    setFormData(prev => ({
      ...prev,
      plantId: plant.id,
      plantCommonName: plant.commonName,
      plantScientificName: plant.scientificName,
    }));
    setSearchQuery(plant.displayName);
    setShowDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(true);
    
    // Clear selected plant if user is typing
    if (formData.plantId) {
      setFormData(prev => ({
        ...prev,
        plantId: '',
        plantCommonName: '',
        plantScientificName: '',
      }));
    }
  };

  const handleImageSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'file' | 'url';
    setFormData(prev => ({
      ...prev,
      imageSource: value,
      imageFile: null,
      imageUrl: '',
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: e.target.value,
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      submitterNotes: e.target.value,
    }));
  };

  if (!isOpen) return null;

  const isConfigured = githubAdapter.isConfigured();

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal" onClick={(e) => e.stopPropagation()}>
        <div className="image-modal-header">
          <h2>📷 Add Plant Image</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {!isConfigured && (
          <div className="image-warning">
            ⚠️ Image submission is not configured. Please contact the administrator to set up the GitHub token.
          </div>
        )}

        <form onSubmit={handleSubmit} className="image-form">
          <div className="form-group">
            <label htmlFor="plantSearch">Select Plant *</label>
            <div className="plant-search-container">
              <input
                type="text"
                id="plantSearch"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Start typing to search for a plant..."
                disabled={isSubmitting}
                required
                autoComplete="off"
              />
              {showDropdown && filteredPlants.length > 0 && (
                <div className="plant-dropdown">
                  {filteredPlants.slice(0, 10).map(plant => (
                    <div
                      key={plant.id}
                      className="plant-option"
                      onClick={() => handlePlantSelect(plant)}
                    >
                      <div className="plant-common-name">{plant.commonName}</div>
                      <div className="plant-scientific-name">{plant.scientificName}</div>
                    </div>
                  ))}
                  {filteredPlants.length > 10 && (
                    <div className="plant-option-hint">
                      ... and {filteredPlants.length - 10} more. Keep typing to narrow down.
                    </div>
                  )}
                </div>
              )}
              {showDropdown && filteredPlants.length === 0 && searchQuery && (
                <div className="plant-dropdown">
                  <div className="plant-option-hint">No plants found matching "{searchQuery}"</div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Image Source *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="imageSource"
                  value="file"
                  checked={formData.imageSource === 'file'}
                  onChange={handleImageSourceChange}
                  disabled={isSubmitting}
                />
                <span>Upload from Computer</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="imageSource"
                  value="url"
                  checked={formData.imageSource === 'url'}
                  onChange={handleImageSourceChange}
                  disabled={isSubmitting}
                />
                <span>Image URL</span>
              </label>
            </div>
          </div>

          {formData.imageSource === 'file' && (
            <div className="form-group">
              <label htmlFor="imageFile">Choose Image File *</label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting}
                required
              />
              {formData.imageFile && (
                <div className="file-info">
                  Selected: {formData.imageFile.name} ({Math.round(formData.imageFile.size / 1024)} KB)
                </div>
              )}
            </div>
          )}

          {formData.imageSource === 'url' && (
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL *</label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="submitterNotes">Notes (Optional)</label>
            <textarea
              id="submitterNotes"
              value={formData.submitterNotes}
              onChange={handleNotesChange}
              placeholder="Add any notes about this image (photographer credit, location, etc.)..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {submitStatus === 'success' && (
            <div className="image-success">
              ✅ Thank you! Your plant image has been submitted successfully.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="image-error">
              ❌ {errorMessage || 'Failed to submit image. Please try again.'}
            </div>
          )}

          <div className="image-modal-footer">
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
              {isSubmitting ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default AddPlantImageModal;
