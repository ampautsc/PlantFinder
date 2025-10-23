/**
 * Configuration for plant prioritization in the wildflower list
 * 
 * Plants are sorted by priority score (higher score = higher priority)
 * The score is calculated based on multiple weighted factors.
 * 
 * EDIT THIS FILE to adjust how plants are prioritized in the list.
 */

export interface PlantPrioritizationConfig {
  /**
   * Weight for plants that are Monarch butterfly host plants
   * These are essential for Monarch conservation (milkweeds)
   */
  monarchHostPlantWeight: number;

  /**
   * Weight for plants with seeds offered through the seed share program
   * Higher priority if seeds are available for distribution
   */
  seedsOfferedWeight: number;

  /**
   * Weight for plants with adoption requests
   * Higher priority if someone is requesting seeds for this plant
   */
  adoptionRequestWeight: number;

  /**
   * Weight for plants that are nectar sources
   * Important for adult butterflies and other pollinators
   */
  nectarSourceWeight: number;
}

/**
 * Default prioritization weights
 * 
 * Priority order (as specified):
 * 1. Monarch host plants (highest)
 * 2. Seeds offered
 * 3. Adoption offered
 * 4. Nectar source
 */
export const DEFAULT_PRIORITIZATION_CONFIG: PlantPrioritizationConfig = {
  monarchHostPlantWeight: 1000,    // Highest priority
  seedsOfferedWeight: 100,         // Second priority
  adoptionRequestWeight: 10,       // Third priority
  nectarSourceWeight: 1,           // Fourth priority (base scoring)
};

/**
 * Calculate priority score for a plant
 */
export function calculatePlantPriorityScore(
  isMonarchHost: boolean,
  seedsOffered: number,
  adoptionRequests: number,
  isNectarSource: boolean,
  config: PlantPrioritizationConfig = DEFAULT_PRIORITIZATION_CONFIG
): number {
  let score = 0;

  // Add points for Monarch host plant
  if (isMonarchHost) {
    score += config.monarchHostPlantWeight;
  }

  // Add points for seeds offered (proportional to quantity)
  score += seedsOffered * config.seedsOfferedWeight;

  // Add points for adoption requests (proportional to quantity)
  score += adoptionRequests * config.adoptionRequestWeight;

  // Add points for nectar source
  if (isNectarSource) {
    score += config.nectarSourceWeight;
  }

  return score;
}

/**
 * Check if a plant is a Monarch butterfly host plant
 */
export function isMonarchHostPlant(plant: { 
  relationships?: { hostPlantTo?: string[] } 
}): boolean {
  if (!plant.relationships?.hostPlantTo) {
    return false;
  }
  
  return plant.relationships.hostPlantTo.some(host =>
    host.toLowerCase().includes('monarch')
  );
}

/**
 * Check if a plant is mentioned as a nectar source
 */
export function isNectarSource(plant: {
  description?: string;
  relationships?: { usefulFor?: string[] }
}): boolean {
  // Check description for nectar mentions
  if (plant.description && plant.description.toLowerCase().includes('nectar')) {
    return true;
  }
  
  // Check if it's useful for pollinator conservation
  if (plant.relationships?.usefulFor) {
    return plant.relationships.usefulFor.some(use =>
      use.toLowerCase().includes('pollinator') ||
      use.toLowerCase().includes('nectar')
    );
  }
  
  return false;
}
