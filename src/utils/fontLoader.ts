/**
 * Dynamic Font Loader
 * 
 * Loads fonts on-demand based on the active language to reduce initial bundle size.
 * This prevents loading all font files (Japanese, Chinese, Devanagari) for all users.
 */

export type Language = 'en' | 'es' | 'de' | 'ja' | 'zh' | 'hi';

const loadedFonts = new Set<string>();

// Font loading constants
const FONT_WEIGHTS = [400, 600] as const;
const FONT_SIZE = '16px';
const FONT_LOAD_FALLBACK_TIMEOUT = 100; // ms

/**
 * Check if a language uses Latin script
 */
function isLatinLanguage(language: Language): boolean {
  return language === 'en' || language === 'es' || language === 'de';
}

/**
 * Get the font name for a specific language
 */
function getFontName(language: Language): string {
  if (isLatinLanguage(language)) {
    return 'Noto Sans';
  }
  
  switch (language) {
    case 'ja':
      return 'Noto Sans JP';
    case 'zh':
      return 'Noto Sans SC';
    case 'hi':
      return 'Noto Sans Devanagari';
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
    await new Promise(resolve => setTimeout(resolve, FONT_LOAD_FALLBACK_TIMEOUT));
    return;
  }

  try {
    // Wait for all configured font weights to load
    await Promise.all(
      FONT_WEIGHTS.map(weight => 
        document.fonts.load(`${weight} ${FONT_SIZE} "${fontName}"`)
      )
    );
    
    // Ensure browser has processed all font faces
    // This is necessary as document.fonts.load() only triggers loading,
    // but fonts may not be immediately available for rendering
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
        // Japanese - load only Japanese subset
        await Promise.all([
          import('@fontsource/noto-sans-jp/japanese-400.css'),
          import('@fontsource/noto-sans-jp/japanese-600.css')
        ]);
        break;
      
      case 'zh':
        // Chinese (Simplified) - load only Chinese subset
        await Promise.all([
          import('@fontsource/noto-sans-sc/chinese-simplified-400.css'),
          import('@fontsource/noto-sans-sc/chinese-simplified-600.css')
        ]);
        break;
      
      case 'hi':
        // Hindi (Devanagari script) - load only Devanagari subset
        await Promise.all([
          import('@fontsource/noto-sans-devanagari/devanagari-400.css'),
          import('@fontsource/noto-sans-devanagari/devanagari-600.css')
        ]);
        break;
      
      case 'en':
      case 'es':
      case 'de':
        // Latin-based languages - load only Latin subset
        await Promise.all([
          import('@fontsource/noto-sans/latin-400.css'),
          import('@fontsource/noto-sans/latin-600.css')
        ]);
        break;
      
      default:
        // Fallback to latin subset for any unexpected language
        console.warn(`Unexpected language: ${language}, falling back to Noto Sans latin subset`);
        await Promise.all([
          import('@fontsource/noto-sans/latin-400.css'),
          import('@fontsource/noto-sans/latin-600.css')
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
  const fontName = getFontName(language);
  const fallbackFonts = isLatinLanguage(language)
    ? ", -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
    : ", -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  
  return `'${fontName}'${fallbackFonts}`;
}

/**
 * Preload fonts for the initial language
 */
export async function preloadInitialFonts(): Promise<void> {
  const savedLanguage = (localStorage.getItem('language') || 'en') as Language;
  await loadFontsForLanguage(savedLanguage);
}
