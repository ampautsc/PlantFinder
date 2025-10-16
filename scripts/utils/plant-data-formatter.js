/**
 * Utility functions for formatting scraped plant data into the PlantFinder schema
 */

/**
 * Normalizes a plant name to create a valid ID
 * @param {string} scientificName - The scientific name of the plant
 * @returns {string} - A normalized ID (e.g., "asclepias-tuberosa")
 */
export function createPlantId(scientificName) {
  return scientificName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Normalizes bloom color names
 * @param {string} color - Raw color string from vendor
 * @returns {string} - Normalized color
 */
export function normalizeColor(color) {
  const colorMap = {
    'pink': 'pink',
    'purple': 'purple',
    'lavender': 'lavender',
    'blue': 'blue',
    'yellow': 'yellow',
    'orange': 'orange',
    'red': 'red',
    'white': 'white',
    'violet': 'violet',
    'mauve': 'mauve'
  };
  
  const normalized = color.toLowerCase().trim();
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  return normalized;
}

/**
 * Normalizes bloom time
 * @param {string} time - Raw bloom time from vendor
 * @returns {string[]} - Array of normalized bloom times
 */
export function normalizeBloomTime(time) {
  const timeMap = {
    'spring': 'spring',
    'early summer': 'early-summer',
    'summer': 'summer',
    'late summer': 'late-summer',
    'fall': 'fall'
  };
  
  const normalized = time.toLowerCase().trim();
  const times = [];
  
  for (const [key, value] of Object.entries(timeMap)) {
    if (normalized.includes(key)) {
      times.push(value);
    }
  }
  
  return times.length > 0 ? times : ['summer'];
}

/**
 * Normalizes sun requirements
 * @param {string} sun - Raw sun requirement from vendor
 * @returns {string} - Normalized sun requirement
 */
export function normalizeSun(sun) {
  const normalized = sun.toLowerCase().trim();
  
  if (normalized.includes('full sun') || normalized.includes('fullsun')) {
    return 'full-sun';
  } else if (normalized.includes('partial sun') || normalized.includes('part sun')) {
    return 'partial-sun';
  } else if (normalized.includes('partial shade') || normalized.includes('part shade')) {
    return 'partial-shade';
  } else if (normalized.includes('full shade') || normalized.includes('shade')) {
    return 'full-shade';
  }
  
  return 'full-sun'; // default
}

/**
 * Normalizes moisture requirements
 * @param {string} moisture - Raw moisture requirement from vendor
 * @returns {string} - Normalized moisture requirement
 */
export function normalizeMoisture(moisture) {
  const normalized = moisture.toLowerCase().trim();
  
  if (normalized.includes('wet')) {
    return 'wet';
  } else if (normalized.includes('moist')) {
    return 'moist';
  } else if (normalized.includes('dry')) {
    return 'dry';
  }
  
  return 'medium'; // default
}

/**
 * Normalizes soil type
 * @param {string} soil - Raw soil type from vendor
 * @returns {string} - Normalized soil type
 */
export function normalizeSoil(soil) {
  const normalized = soil.toLowerCase().trim();
  
  if (normalized.includes('clay')) {
    return 'clay';
  } else if (normalized.includes('sand')) {
    return 'sand';
  } else if (normalized.includes('rock')) {
    return 'rocky';
  }
  
  return 'loam'; // default
}

/**
 * Formats raw scraped data into PlantFinder schema
 * @param {Object} rawData - Raw data from scraper
 * @returns {Object} - Formatted plant object
 */
export function formatPlantData(rawData) {
  const id = createPlantId(rawData.scientificName);
  
  return {
    id,
    commonName: rawData.commonName || '',
    scientificName: rawData.scientificName || '',
    description: rawData.description || '',
    requirements: {
      sun: normalizeSun(rawData.sun || 'full sun'),
      moisture: normalizeMoisture(rawData.moisture || 'medium'),
      soil: normalizeSoil(rawData.soil || 'loam')
    },
    characteristics: {
      height: parseInt(rawData.height) || 24,
      width: parseInt(rawData.width) || 18,
      bloomColor: Array.isArray(rawData.bloomColor) 
        ? rawData.bloomColor.map(normalizeColor)
        : [normalizeColor(rawData.bloomColor || 'white')],
      bloomTime: Array.isArray(rawData.bloomTime)
        ? rawData.bloomTime.flatMap(normalizeBloomTime)
        : normalizeBloomTime(rawData.bloomTime || 'summer'),
      perennial: rawData.perennial !== false,
      nativeRange: Array.isArray(rawData.nativeRange) ? rawData.nativeRange : [],
      hardinessZones: Array.isArray(rawData.hardinessZones) ? rawData.hardinessZones : []
    },
    relationships: {
      hostPlantTo: Array.isArray(rawData.hostPlantTo) ? rawData.hostPlantTo : [],
      foodFor: Array.isArray(rawData.foodFor) ? rawData.foodFor : [],
      usefulFor: Array.isArray(rawData.usefulFor) ? rawData.usefulFor : []
    },
    imageUrl: rawData.imageUrl || undefined,
    source: rawData.source || 'unknown',
    sourceUrl: rawData.sourceUrl || undefined
  };
}
