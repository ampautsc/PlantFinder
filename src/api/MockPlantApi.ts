import { IPlantApi } from './PlantApi';
import { Plant, PlantFilters } from '../types/Plant';
import { PlantDataLoader } from './PlantDataLoader';
import { PlantSeedShareVolume } from '../types/SeedShare';
import {
  calculatePlantPriorityScore,
  getHostedSpeciesCount,
  getFoodOrShelterGroupsCount,
} from '../config/plantPrioritization';
import { stateNamesToFips } from '../utils/fipsUtils';

/**
 * Mock implementation of the Plant API
 * Uses dynamically loaded data from public directory
 */
export class MockPlantApi implements IPlantApi {
  private plantsCache: Plant[] | null = null;
  private seedShareVolumes: Map<string, PlantSeedShareVolume> = new Map();
  private gardenPlantIds: Set<string> = new Set();

  /**
   * Set seed share volumes for prioritization
   * This should be called before searching to enable priority sorting
   */
  setSeedShareVolumes(volumes: PlantSeedShareVolume[]): void {
    this.seedShareVolumes.clear();
    volumes.forEach(volume => {
      this.seedShareVolumes.set(volume.plantId, volume);
    });
  }

  /**
   * Set garden plant IDs for filtering
   * This should be called before searching to enable garden filtering
   */
  setGardenPlants(plantIds: Set<string>): void {
    this.gardenPlantIds = plantIds;
  }

  async getAllPlants(): Promise<Plant[]> {
    // Load plants from data loader if not cached
    if (!this.plantsCache) {
      this.plantsCache = await PlantDataLoader.getAllPlants();
    }
    // Simulate network delay
    await this.delay(300);
    return [...this.plantsCache];
  }

  async getPlantById(id: string): Promise<Plant | null> {
    await this.delay(200);
    return await PlantDataLoader.getPlantById(id);
  }

  async searchPlants(filters: PlantFilters): Promise<Plant[]> {
    await this.delay(400);
    
    // Ensure plants are loaded
    if (!this.plantsCache) {
      this.plantsCache = await PlantDataLoader.getAllPlants();
    }
    
    let results = [...this.plantsCache];

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(plant =>
        plant.commonName.toLowerCase().includes(query) ||
        plant.scientificName.toLowerCase().includes(query) ||
        plant.description.toLowerCase().includes(query)
      );
    }

    // Filter by sun requirements
    if (filters.sun && filters.sun.length > 0) {
      results = results.filter(plant =>
        plant.requirements && filters.sun!.includes(plant.requirements.sun)
      );
    }

    // Filter by moisture requirements
    if (filters.moisture && filters.moisture.length > 0) {
      results = results.filter(plant =>
        plant.requirements && filters.moisture!.includes(plant.requirements.moisture)
      );
    }

    // Filter by soil requirements
    if (filters.soil && filters.soil.length > 0) {
      results = results.filter(plant =>
        plant.requirements && filters.soil!.includes(plant.requirements.soil)
      );
    }

    // Filter by bloom color
    if (filters.bloomColor && filters.bloomColor.length > 0) {
      results = results.filter(plant =>
        plant.characteristics && 
        plant.characteristics.bloomColor && 
        plant.characteristics.bloomColor.some(color =>
          filters.bloomColor!.includes(color)
        )
      );
    }

    // Filter by bloom time
    if (filters.bloomTime && filters.bloomTime.length > 0) {
      results = results.filter(plant =>
        plant.characteristics && 
        plant.characteristics.bloomTime && 
        plant.characteristics.bloomTime.some(time =>
          filters.bloomTime!.includes(time)
        )
      );
    }

    // Filter by state FIPS codes
    if (filters.stateFips && filters.stateFips.length > 0) {
      results = results.filter(plant => {
        // Use distribution data if available
        if (plant.distribution?.statesFips) {
          return filters.stateFips!.some(stateFips =>
            plant.distribution!.statesFips!.includes(stateFips)
          );
        }
        // Fallback to legacy nativeRange using state names
        if (plant.characteristics?.nativeRange) {
          const plantStateFips = stateNamesToFips(plant.characteristics.nativeRange);
          return filters.stateFips!.some(stateFips =>
            plantStateFips.includes(stateFips)
          );
        }
        return false;
      });
    }

    // Filter by county FIPS codes (NEW)
    if (filters.countyFips && filters.countyFips.length > 0) {
      results = results.filter(plant => {
        // Only use distribution data for county-level filtering
        if (plant.distribution?.fipsCodes) {
          return filters.countyFips!.some(countyFips =>
            plant.distribution!.fipsCodes.includes(countyFips)
          );
        }
        return false;
      });
    }

    // Filter by host plant relationships
    if (filters.hostPlantTo && filters.hostPlantTo.length > 0) {
      results = results.filter(plant =>
        plant.relationships && 
        plant.relationships.hostPlantTo && 
        plant.relationships.hostPlantTo.some(host =>
          filters.hostPlantTo!.some(filter =>
            host.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }

    // Filter by food for relationships
    if (filters.foodFor && filters.foodFor.length > 0) {
      results = results.filter(plant =>
        plant.relationships && 
        plant.relationships.foodFor && 
        plant.relationships.foodFor.some(food =>
          filters.foodFor!.some(filter =>
            food.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }

    // Filter by shelter for relationships
    if (filters.shelterFor && filters.shelterFor.length > 0) {
      results = results.filter(plant =>
        plant.relationships && 
        plant.relationships.shelterFor && 
        plant.relationships.shelterFor.some(shelter =>
          filters.shelterFor!.some(filter =>
            shelter.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }

    // Filter by availability - in my garden
    if (filters.inMyGarden !== undefined) {
      results = results.filter(plant => {
        const isInGarden = this.gardenPlantIds.has(plant.id);
        return filters.inMyGarden ? isInGarden : !isInGarden;
      });
    }

    // Filter by availability - seeds offered
    if (filters.seedsOffered !== undefined) {
      results = results.filter(plant => {
        const volume = this.seedShareVolumes.get(plant.id);
        const hasSeedsOffered = volume && volume.openOffers > 0;
        return filters.seedsOffered ? hasSeedsOffered : !hasSeedsOffered;
      });
    }

    // Filter by availability - adoption offered (requests for seeds)
    if (filters.adoptionOffered !== undefined) {
      results = results.filter(plant => {
        const volume = this.seedShareVolumes.get(plant.id);
        const hasAdoptionOffered = volume && volume.openRequests > 0;
        return filters.adoptionOffered ? hasAdoptionOffered : !hasAdoptionOffered;
      });
    }

    // Sort by priority score (highest priority first)
    results = this.sortByPriority(results);

    return results;
  }

  /**
   * Sort plants by priority score
   * Prioritizes based on: hosted species count, food/shelter groups, seeds offered, adoption requests
   */
  private sortByPriority(plants: Plant[]): Plant[] {
    return plants.sort((a, b) => {
      const scoreA = this.calculatePlantScore(a);
      const scoreB = this.calculatePlantScore(b);
      
      // Sort by score descending (higher score = higher priority)
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      // If scores are equal, sort alphabetically by common name
      return a.commonName.localeCompare(b.commonName);
    });
  }

  /**
   * Calculate priority score for a plant
   */
  private calculatePlantScore(plant: Plant): number {
    const volume = this.seedShareVolumes.get(plant.id);
    const seedsOffered = volume?.openOffers || 0;
    const adoptionRequests = volume?.openRequests || 0;
    const hostedSpecies = getHostedSpeciesCount(plant);
    const foodShelterGroups = getFoodOrShelterGroupsCount(plant);

    return calculatePlantPriorityScore(
      hostedSpecies,
      foodShelterGroups,
      seedsOffered,
      adoptionRequests
    );
  }

  async getFilterOptions(): Promise<{
    bloomColors: string[];
    bloomTimes: string[];
    hostPlantTo: string[];
    foodFor: string[];
    shelterFor: string[];
  }> {
    await this.delay(200);

    // Ensure plants are loaded
    if (!this.plantsCache) {
      this.plantsCache = await PlantDataLoader.getAllPlants();
    }

    const bloomColors = new Set<string>();
    const bloomTimes = new Set<string>();
    const hostPlantTo = new Set<string>();
    const foodFor = new Set<string>();
    const shelterFor = new Set<string>();

    this.plantsCache.forEach(plant => {
      if (plant.characteristics) {
        if (plant.characteristics.bloomColor) {
          plant.characteristics.bloomColor.forEach(color => bloomColors.add(color));
        }
        if (plant.characteristics.bloomTime) {
          plant.characteristics.bloomTime.forEach(time => bloomTimes.add(time));
        }
      }
      if (plant.relationships) {
        if (plant.relationships.hostPlantTo) {
          plant.relationships.hostPlantTo.forEach(host => hostPlantTo.add(host));
        }
        if (plant.relationships.foodFor) {
          plant.relationships.foodFor.forEach(food => foodFor.add(food));
        }
        if (plant.relationships.shelterFor) {
          plant.relationships.shelterFor.forEach(shelter => shelterFor.add(shelter));
        }
      }
    });

    return {
      bloomColors: Array.from(bloomColors).sort(),
      bloomTimes: Array.from(bloomTimes).sort(),
      hostPlantTo: Array.from(hostPlantTo).sort(),
      foodFor: Array.from(foodFor).sort(),
      shelterFor: Array.from(shelterFor).sort(),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
