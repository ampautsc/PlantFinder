import './AddPlantImageButton.css';

interface AddPlantImageButtonProps {
  onClick: () => void;
}

const AddPlantImageButton: React.FC<AddPlantImageButtonProps> = ({ onClick }) => {
  return (
    <button
      className="add-image-button"
      onClick={onClick}
      aria-label="Add plant image"
      title="Add plant image"
    >
      📷
    </button>
  );
};

export default AddPlantImageButton;
