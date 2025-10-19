import { Plant } from '../types/Plant';

/**
 * PlantDataLoader - Dynamically loads plant data from the public directory
 * 
 * This loader fetches plant data on-demand from static JSON files in the public/data/plants
 * directory, significantly reducing the initial bundle size. It includes caching to avoid
 * redundant network requests.
 * 
 * Benefits:
 * - Reduces initial bundle size by ~500 KB
 * - Better browser caching (plant data cached separately from JS)
 * - Easy migration to backend API (just change BASE_URL)
 */
export class PlantDataLoader {
  private static BASE_URL = '/data/plants';
  private static cache: Map<string, Plant> = new Map();
  private static allPlantsCache: Plant[] | null = null;
  private static plantIdsCache: string[] | null = null;

  /**
   * Get all available plant IDs without loading the full plant data
   */
  static async getPlantIds(): Promise<string[]> {
    if (this.plantIdsCache) {
      return this.plantIdsCache;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/index.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch plant index: ${response.statusText}`);
      }
      const ids = await response.json();
      this.plantIdsCache = ids;
      return ids;
    } catch (error) {
      console.error('Error loading plant IDs:', error);
      throw error;
    }
  }

  /**
   * Get all plants (loads all plant data)
   * Note: This is expensive and should only be used when truly necessary
   */
  static async getAllPlants(): Promise<Plant[]> {
    if (this.allPlantsCache) {
      return this.allPlantsCache;
    }

    try {
      const plantIds = await this.getPlantIds();
      
      // Load all plants in parallel (browser will limit concurrent requests)
      const plants = await Promise.all(
        plantIds.map(id => this.getPlantById(id))
      );

      // Filter out any null results (failed loads)
      const validPlants = plants.filter((p): p is Plant => p !== null);
      
      this.allPlantsCache = validPlants;
      return validPlants;
    } catch (error) {
      console.error('Error loading all plants:', error);
      throw error;
    }
  }

  /**
   * Get a single plant by its ID
   * Uses caching to avoid redundant requests
   */
  static async getPlantById(id: string): Promise<Plant | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/${id}.json`);
      if (!response.ok) {
        console.error(`Failed to fetch plant ${id}: ${response.statusText}`);
        return null;
      }
      
      const plant: Plant = await response.json();
      
      // Validate that the loaded data is a valid Plant object
      if (!this.isValidPlant(plant)) {
        console.error(`Invalid plant data for ${id}: missing required properties`);
        return null;
      }
      
      this.cache.set(id, plant);
      return plant;
    } catch (error) {
      console.error(`Error loading plant ${id}:`, error);
      return null;
    }
  }

  /**
   * Validate that an object is a valid Plant
   */
  private static isValidPlant(plant: unknown): plant is Plant {
    if (!plant || typeof plant !== 'object') {
      return false;
    }

    const p = plant as Record<string, unknown>;
    
    return (
      typeof p.id === 'string' &&
      typeof p.commonName === 'string' &&
      typeof p.scientificName === 'string' &&
      p.requirements !== undefined &&
      typeof p.requirements === 'object' &&
      p.requirements !== null &&
      typeof (p.requirements as Record<string, unknown>).sun === 'string' &&
      p.characteristics !== undefined &&
      typeof p.characteristics === 'object' &&
      p.characteristics !== null &&
      Array.isArray((p.characteristics as Record<string, unknown>).bloomColor) &&
      p.relationships !== undefined &&
      typeof p.relationships === 'object' &&
      p.relationships !== null
    );
  }

  /**
   * Load multiple plants by their IDs
   * More efficient than calling getPlantById multiple times
   */
  static async getPlantsByIds(ids: string[]): Promise<Plant[]> {
    const plants = await Promise.all(
      ids.map(id => this.getPlantById(id))
    );
    
    // Filter out any null results
    return plants.filter((p): p is Plant => p !== null);
  }

  /**
   * Clear all caches (useful for testing or forced refresh)
   */
  static clearCache(): void {
    this.cache.clear();
    this.allPlantsCache = null;
    this.plantIdsCache = null;
  }

  /**
   * Get cache statistics (useful for debugging)
   */
  static getCacheStats(): {
    cachedPlants: number;
    allPlantsCached: boolean;
    plantIdsCached: boolean;
  } {
    return {
      cachedPlants: this.cache.size,
      allPlantsCached: this.allPlantsCache !== null,
      plantIdsCached: this.plantIdsCache !== null,
    };
  }
}
