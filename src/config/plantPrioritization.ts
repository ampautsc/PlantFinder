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
   * Points per species hosted (e.g., per butterfly/moth species)
   * Applied to hostPlantTo relationships
   */
  pointsPerHostedSpecies: number;

  /**
   * Points per group provided food or shelter
   * Applied to foodFor groups (e.g., "butterflies", "bees", "birds")
   */
  pointsPerFoodOrShelterGroup: number;

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
}

/**
 * Default prioritization weights
 * 
 * Priority scoring:
 * - 3 points per species hosted (hostPlantTo)
 * - 1 point per food/shelter group (foodFor)
 * - Seeds offered and adoption requests use multiplier weights
 */
export const DEFAULT_PRIORITIZATION_CONFIG: PlantPrioritizationConfig = {
  pointsPerHostedSpecies: 3,       // 3 points per butterfly/moth species hosted
  pointsPerFoodOrShelterGroup: 1,  // 1 point per food/shelter group (bees, birds, etc.)
  seedsOfferedWeight: 100,         // Seeds offered multiplier
  adoptionRequestWeight: 10,       // Adoption request multiplier
};

/**
 * Calculate priority score for a plant
 */
export function calculatePlantPriorityScore(
  hostedSpeciesCount: number,
  foodOrShelterGroupsCount: number,
  seedsOffered: number,
  adoptionRequests: number,
  config: PlantPrioritizationConfig = DEFAULT_PRIORITIZATION_CONFIG
): number {
  let score = 0;

  // Add points per hosted species (e.g., Monarch, Queen butterfly, etc.)
  score += hostedSpeciesCount * config.pointsPerHostedSpecies;

  // Add points per food/shelter group (e.g., butterflies, bees, birds, etc.)
  score += foodOrShelterGroupsCount * config.pointsPerFoodOrShelterGroup;

  // Add points for seeds offered (proportional to quantity)
  score += seedsOffered * config.seedsOfferedWeight;

  // Add points for adoption requests (proportional to quantity)
  score += adoptionRequests * config.adoptionRequestWeight;

  return score;
}

/**
 * Count the number of species a plant hosts
 * Each entry in hostPlantTo array represents a species
 */
export function getHostedSpeciesCount(plant: { 
  relationships?: { hostPlantTo?: string[] } 
}): number {
  if (!plant.relationships?.hostPlantTo) {
    return 0;
  }
  
  return plant.relationships.hostPlantTo.length;
}

/**
 * Count the number of food/shelter groups a plant supports
 * Each entry in foodFor array represents a group (bees, butterflies, birds, etc.)
 */
export function getFoodOrShelterGroupsCount(plant: {
  relationships?: { foodFor?: string[] }
}): number {
  if (!plant.relationships?.foodFor) {
    return 0;
  }
  
  return plant.relationships.foodFor.length;
}
