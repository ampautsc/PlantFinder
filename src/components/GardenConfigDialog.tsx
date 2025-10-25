import { useState } from 'react';
import { GardenPlant, PlantStatus } from '../types/Garden';
import './GardenConfigDialog.css';

interface GardenConfigDialogProps {
  gardenPlant: GardenPlant;
  plantName: string;
  onSave: (updates: Partial<Omit<GardenPlant, 'plantId' | 'addedAt'>>) => void;
  onRemove: () => void;
  onClose: () => void;
}

function GardenConfigDialog({
  gardenPlant,
  plantName,
  onSave,
  onRemove,
  onClose,
}: GardenConfigDialogProps) {
  const [status, setStatus] = useState<PlantStatus>(gardenPlant.status);
  const [quantity, setQuantity] = useState<number>(gardenPlant.quantity || 1);
  const [isPotted, setIsPotted] = useState<boolean>(gardenPlant.isPotted);
  const [notes, setNotes] = useState<string>(gardenPlant.notes || '');

  const handleSave = () => {
    onSave({
      status,
      quantity,
      isPotted,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm(`Are you sure you want to remove ${plantName} from your garden?`)) {
      onRemove();
      onClose();
    }
  };

  const getQuantityLabel = () => {
    switch (status) {
      case 'seeds':
        return 'Number of Seed Packets';
      case 'seedlings':
        return 'Number of Seedlings';
      case 'plants':
        return 'Square Feet or Number of Plants';
      default:
        return 'Quantity';
    }
  };

  return (
    <div className="garden-config-overlay" onClick={onClose}>
      <div className="garden-config-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="garden-config-header">
          <h2 className="garden-config-title">
            <img 
              src="/images/Camp%20Monarch_LOGO%20B1_gold_square.png" 
              alt="Garden" 
            />
            {plantName} in Your Garden
          </h2>
          <button
            className="config-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form className="garden-config-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Plant Status
            </label>
            <select
              id="status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as PlantStatus)}
            >
              <option value="seeds">Seeds</option>
              <option value="seedlings">Seedlings</option>
              <option value="plants">Plants</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity" className="form-label">
              {getQuantityLabel()}
            </label>
            <input
              id="quantity"
              type="number"
              className="form-input"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          <div className="form-group">
            <label className="form-checkbox-group">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isPotted}
                onChange={(e) => setIsPotted(e.target.checked)}
              />
              <span className="checkbox-label">Potted (not in ground)</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              className="form-input"
              rows={3}
              placeholder="Add any notes about this plant..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="config-button config-button-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="config-button config-button-primary"
            >
              Save Changes
            </button>
          </div>

          <div className="remove-section">
            <button
              type="button"
              className="config-button config-button-danger"
              onClick={handleRemove}
            >
              Remove from Garden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GardenConfigDialog;
