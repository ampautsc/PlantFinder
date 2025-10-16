/**
 * Utility functions for transforming wildflower.org data to the Plant interface
 * 
 * This module provides functions to convert scraped wildflower.org data
 * (WildflowerOrgPlantData) into the Plant interface used by the application.
 */

import { Plant, PlantRequirements, PlantCharacteristics, PlantRelationships } from '../types/Plant';
import { WildflowerOrgPlantData, WildflowerOrgScrapedData } from '../types/WildflowerOrgData';

/**
 * Transform light requirements from wildflower.org format to Plant format
 */
function transformLightRequirements(
  light?: { full_sun?: boolean; partial_sun?: boolean; partial_shade?: boolean; full_shade?: boolean }
): PlantRequirements['sun'] {
  if (!light) return 'full-sun'; // Default
  
  // Priority: Full sun > Partial sun > Partial shade > Full shade
  if (light.full_sun) return 'full-sun';
  if (light.partial_sun) return 'partial-sun';
  if (light.partial_shade) return 'partial-shade';
  if (light.full_shade) return 'full-shade';
  
  return 'full-sun'; // Default
}

/**
 * Transform moisture requirements from wildflower.org format to Plant format
 */
function transformMoistureRequirements(
  moisture?: { dry?: boolean; medium?: boolean; moist?: boolean; wet?: boolean }
): PlantRequirements['moisture'] {
  if (!moisture) return 'medium'; // Default
  
  // Priority: Dry > Medium > Moist > Wet
  if (moisture.dry) return 'dry';
  if (moisture.medium) return 'medium';
  if (moisture.moist) return 'moist';
  if (moisture.wet) return 'wet';
  
  return 'medium'; // Default
}

/**
 * Transform soil types from wildflower.org format to Plant format
 */
function transformSoilType(
  soil?: { types?: string[] }
): PlantRequirements['soil'] {
  if (!soil || !soil.types || soil.types.length === 0) return 'loam'; // Default
  
  // Map wildflower.org soil types to Plant soil types
  const soilMap: { [key: string]: PlantRequirements['soil'] } = {
    'sand': 'sand',
    'sandy': 'sand',
    'loam': 'loam',
    'loamy': 'loam',
    'clay': 'clay',
    'clayey': 'clay',
    'rocky': 'rocky',
    'limestone': 'rocky',
    'caliche': 'rocky'
  };
  
  // Return first matching type
  for (const type of soil.types) {
    const normalized = type.toLowerCase();
    if (soilMap[normalized]) {
      return soilMap[normalized];
    }
  }
  
  return 'loam'; // Default
}

/**
 * Transform height to average or max value in inches
 */
function transformHeight(height?: { min?: number; max?: number }): number {
  if (!height) return 24; // Default 24 inches
  
  // Use average if both min and max available
  if (height.min !== undefined && height.max !== undefined) {
    return Math.round((height.min + height.max) / 2);
  }
  
  // Use max or min if only one is available
  return height.max || height.min || 24;
}

/**
 * Transform width/spread to average or max value in inches
 */
function transformWidth(spread?: { min?: number; max?: number }): number {
  if (!spread) return 18; // Default 18 inches
  
  // Use average if both min and max available
  if (spread.min !== undefined && spread.max !== undefined) {
    return Math.round((spread.min + spread.max) / 2);
  }
  
  // Use max or min if only one is available
  return spread.max || spread.min || 18;
}

/**
 * Normalize bloom color names
 */
function normalizeBloomColors(colors?: string[]): string[] {
  if (!colors || colors.length === 0) return ['White']; // Default
  
  // Normalize color names to title case and remove duplicates
  const normalized = colors.map(color => {
    // Clean up and normalize
    return color
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });
  
  return Array.from(new Set(normalized));
}

/**
 * Normalize bloom time/period names
 */
function normalizeBloomTime(periods?: string[]): string[] {
  if (!periods || periods.length === 0) return ['Summer']; // Default
  
  // Normalize period names to title case
  const normalized = periods.map(period => {
    return period
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });
  
  return Array.from(new Set(normalized));
}

/**
 * Normalize native range from state codes to display format
 */
function normalizeNativeRange(usaStates?: string[]): string[] {
  if (!usaStates || usaStates.length === 0) return ['United States']; // Default
  
  // State codes are already in the correct format (e.g., ["TX", "OK", "KS"])
  // Return them as-is, already unique and sorted
  return usaStates;
}

/**
 * Combine pollinators and food sources into foodFor array
 */
function combineWildlifeFood(ecology?: {
  pollinators?: string[];
  foodFor?: string[];
  wildlifeValue?: string[];
}): string[] {
  const combined = new Set<string>();
  
  if (ecology) {
    // Add pollinators
    ecology.pollinators?.forEach(p => combined.add(p));
    
    // Add food sources
    ecology.foodFor?.forEach(f => combined.add(f));
    
    // Add wildlife values
    ecology.wildlifeValue?.forEach(w => combined.add(w));
  }
  
  // Ensure we have at least one entry
  if (combined.size === 0) {
    combined.add('pollinators');
  }
  
  return Array.from(combined);
}

/**
 * Transform complete wildflower.org plant data to Plant interface
 */
export function transformWildflowerOrgToPlant(
  scrapedData: WildflowerOrgScrapedData
): Plant {
  const data = scrapedData.plant_data;
  
  // Generate ID from scientific name
  const id = (data.scientificName || data.commonName || 'unknown')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Build requirements
  const requirements: PlantRequirements = {
    sun: transformLightRequirements(data.requirements?.light),
    moisture: transformMoistureRequirements(data.requirements?.moisture),
    soil: transformSoilType(data.requirements?.soil)
  };
  
  // Build characteristics
  const characteristics: PlantCharacteristics = {
    height: transformHeight(data.characteristics?.height),
    width: transformWidth(data.characteristics?.spread),
    bloomColor: normalizeBloomColors(data.characteristics?.bloomColor),
    bloomTime: normalizeBloomTime(data.characteristics?.bloomPeriod),
    perennial: data.characteristics?.lifespan === 'perennial',
    nativeRange: normalizeNativeRange(data.distribution?.usaStates),
    hardinessZones: data.requirements?.hardiness?.zones || ['5', '6', '7', '8']
  };
  
  // Build relationships
  const relationships: PlantRelationships = {
    hostPlantTo: data.ecology?.hostPlantFor || [],
    foodFor: combineWildlifeFood(data.ecology),
    usefulFor: data.ecology?.suitableFor || ['native garden']
  };
  
  // Build complete Plant object
  const plant: Plant = {
    id,
    commonName: data.commonName || 'Unknown Plant',
    scientificName: data.scientificName || 'Unknown species',
    description: data.description || 'A native plant species.',
    requirements,
    characteristics,
    relationships,
    imageUrl: data.images?.primary
  };
  
  return plant;
}

/**
 * Transform multiple wildflower.org plants to Plant array
 */
export function transformWildflowerOrgPlants(
  scrapedDataArray: WildflowerOrgScrapedData[]
): Plant[] {
  return scrapedDataArray.map(transformWildflowerOrgToPlant);
}

/**
 * Validate wildflower.org data completeness
 */
export function validateWildflowerOrgData(
  data: WildflowerOrgPlantData
): { valid: boolean; quality: 'complete' | 'partial' | 'minimal'; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check required fields
  if (!data.scientificName && !data.commonName) {
    warnings.push('Missing both scientific name and common name');
  }
  
  // Check characteristics
  if (!data.characteristics) {
    warnings.push('Missing characteristics section');
  } else {
    if (!data.characteristics.height) warnings.push('Missing height information');
    if (!data.characteristics.bloomColor) warnings.push('Missing bloom color information');
  }
  
  // Check requirements
  if (!data.requirements) {
    warnings.push('Missing requirements section');
  } else {
    if (!data.requirements.light) warnings.push('Missing light requirements');
    if (!data.requirements.moisture) warnings.push('Missing moisture requirements');
  }
  
  // Determine quality level
  let quality: 'complete' | 'partial' | 'minimal' = 'minimal';
  
  if (warnings.length === 0) {
    quality = 'complete';
  } else if (warnings.length <= 2) {
    quality = 'partial';
  }
  
  return {
    valid: data.scientificName !== undefined || data.commonName !== undefined,
    quality,
    warnings
  };
}
