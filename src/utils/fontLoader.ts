/**
 * Dynamic Font Loader
 * 
 * Loads fonts on-demand based on the active language to reduce initial bundle size.
 * This prevents loading all font files (Japanese, Chinese, Devanagari) for all users.
 */

export type Language = 'en' | 'es' | 'de' | 'ja' | 'zh' | 'hi';

const loadedFonts = new Set<string>();

/**
 * Load fonts for a specific language
 */
export async function loadFontsForLanguage(language: Language): Promise<void> {
  const fontKey = `font-${language}`;
  
  // Skip if already loaded
  if (loadedFonts.has(fontKey)) {
    return;
  }

  try {
    switch (language) {
      case 'ja':
        // Japanese
        await Promise.all([
          import('@fontsource/noto-sans-jp/400.css'),
          import('@fontsource/noto-sans-jp/600.css')
        ]);
        break;
      
      case 'zh':
        // Chinese (Simplified)
        await Promise.all([
          import('@fontsource/noto-sans-sc/400.css'),
          import('@fontsource/noto-sans-sc/600.css')
        ]);
        break;
      
      case 'hi':
        // Hindi (Devanagari script)
        await Promise.all([
          import('@fontsource/noto-sans-devanagari/400.css'),
          import('@fontsource/noto-sans-devanagari/600.css')
        ]);
        break;
      
      case 'en':
      case 'es':
      case 'de':
        // Latin-based languages use Noto Sans base font
        await Promise.all([
          import('@fontsource/noto-sans/400.css'),
          import('@fontsource/noto-sans/600.css')
        ]);
        break;
    }
    
    loadedFonts.add(fontKey);
  } catch (error) {
    console.error(`Failed to load fonts for language: ${language}`, error);
  }
}

/**
 * Get the font family for a specific language
 */
export function getFontFamily(language: Language): string {
  switch (language) {
    case 'ja':
      return "'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    case 'zh':
      return "'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    case 'hi':
      return "'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    case 'en':
    case 'es':
    case 'de':
    default:
      return "'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif";
  }
}

/**
 * Preload fonts for the initial language
 */
export async function preloadInitialFonts(): Promise<void> {
  const savedLanguage = (localStorage.getItem('language') || 'en') as Language;
  await loadFontsForLanguage(savedLanguage);
}
