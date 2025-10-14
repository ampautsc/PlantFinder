import './FeedbackButton.css';

interface FeedbackButtonProps {
  onClick: () => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
  return (
    <button
      className="feedback-button"
      onClick={onClick}
      aria-label="Send feedback"
      title="Send feedback"
    >
      💬
    </button>
  );
};

export default FeedbackButton;
