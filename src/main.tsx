import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { ThemeProvider } from './contexts/ThemeContext'
import { preloadInitialFonts, getFontFamily } from './utils/fontLoader'

// Preload fonts for the saved language before rendering
preloadInitialFonts().then(() => {
  // Set the font family for the initial language
  const savedLanguage = (localStorage.getItem('language') || 'en') as 'en' | 'es' | 'de' | 'ja' | 'zh' | 'hi';
  document.body.style.fontFamily = getFontFamily(savedLanguage);
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  )
})
