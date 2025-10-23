import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', label: 'English', abbr: 'EN' },
    { code: 'es', name: 'Español', flag: '🇪🇸', label: 'Español', abbr: 'ES' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', label: 'Deutsch', abbr: 'DE' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', label: '日本語', abbr: 'JA' },
    { code: 'zh', name: '简体中文', flag: '🇨🇳', label: '简体中文', abbr: '中文' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳', label: 'हिंदी', abbr: 'HI' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('language.select')}
        title={currentLanguage.name}
      >
        {currentLanguage.abbr}
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${lang.code === i18n.language ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
