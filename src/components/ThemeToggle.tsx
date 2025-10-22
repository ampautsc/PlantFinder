import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const ariaLabel = theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight');

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;
