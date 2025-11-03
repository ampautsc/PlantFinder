/**
 * Dynamic Font Loader
 * 
 * Loads fonts on-demand based on the active language to reduce initial bundle size.
 * This prevents loading all font files (Japanese, Chinese, Devanagari) for all users.
 */

export type Language = 'en' | 'es' | 'de' | 'ja' | 'zh' | 'hi';

const loadedFonts = new Set<string>();

/**
 * Get the font name for a specific language
 */
function getFontName(language: Language): string {
  switch (language) {
    case 'ja':
      return 'Noto Sans JP';
    case 'zh':
      return 'Noto Sans SC';
    case 'hi':
      return 'Noto Sans Devanagari';
    case 'en':
    case 'es':
    case 'de':
    default:
      return 'Noto Sans';
  }
}

/**
 * Wait for fonts to be loaded using the Font Loading API
 */
async function waitForFontsToLoad(fontName: string): Promise<void> {
  if (!document.fonts) {
    // Font Loading API not supported, wait a bit for fonts to load
    await new Promise(resolve => setTimeout(resolve, 100));
    return;
  }

  try {
    // Wait for both 400 and 600 weight fonts to load
    await Promise.all([
      document.fonts.load(`400 16px "${fontName}"`),
      document.fonts.load(`600 16px "${fontName}"`)
    ]);
    
    // Additional check to ensure fonts are ready
    await document.fonts.ready;
  } catch (error) {
    console.warn(`Font loading check failed for ${fontName}:`, error);
    // Continue anyway - fonts might still load
  }
}

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
    
    // Wait for the fonts to actually be loaded before marking as complete
    const fontName = getFontName(language);
    await waitForFontsToLoad(fontName);
    
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
