import { IPlantApi } from './PlantApi';
import { Plant, PlantFilters } from '../types/Plant';
import { PlantDataLoader } from './PlantDataLoader';
import { PlantSeedShareVolume } from '../types/SeedShare';
import {
  calculatePlantPriorityScore,
  isMonarchHostPlant,
  isNectarSource,
} from '../config/plantPrioritization';

/**
 * Mock implementation of the Plant API
 * Uses dynamically loaded data from public directory
 */
export class MockPlantApi implements IPlantApi {
  private plantsCache: Plant[] | null = null;
  private seedShareVolumes: Map<string, PlantSeedShareVolume> = new Map();

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

    // Filter by native range
    if (filters.nativeRange && filters.nativeRange.length > 0) {
      results = results.filter(plant =>
        plant.characteristics && 
        plant.characteristics.nativeRange && 
        filters.nativeRange!.every(range =>
          plant.characteristics.nativeRange.includes(range)
        )
      );
    }

    // Filter by hardiness zones
    if (filters.hardinessZones && filters.hardinessZones.length > 0) {
      results = results.filter(plant =>
        plant.characteristics && 
        plant.characteristics.hardinessZones && 
        plant.characteristics.hardinessZones.some(zone =>
          filters.hardinessZones!.includes(zone)
        )
      );
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

    // Sort by priority score (highest priority first)
    results = this.sortByPriority(results);

    return results;
  }

  /**
   * Sort plants by priority score
   * Prioritizes: 1) Monarch hosts, 2) Seeds offered, 3) Adoption requests, 4) Nectar sources
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
    const isMonarch = isMonarchHostPlant(plant);
    const isNectar = isNectarSource(plant);

    return calculatePlantPriorityScore(
      isMonarch,
      seedsOffered,
      adoptionRequests,
      isNectar
    );
  }

  async getFilterOptions(): Promise<{
    bloomColors: string[];
    bloomTimes: string[];
    nativeRanges: string[];
    hardinessZones: string[];
    hostPlantTo: string[];
  }> {
    await this.delay(200);

    // Ensure plants are loaded
    if (!this.plantsCache) {
      this.plantsCache = await PlantDataLoader.getAllPlants();
    }

    const bloomColors = new Set<string>();
    const bloomTimes = new Set<string>();
    const nativeRanges = new Set<string>();
    const hardinessZones = new Set<string>();
    const hostPlantTo = new Set<string>();

    this.plantsCache.forEach(plant => {
      if (plant.characteristics) {
        if (plant.characteristics.bloomColor) {
          plant.characteristics.bloomColor.forEach(color => bloomColors.add(color));
        }
        if (plant.characteristics.bloomTime) {
          plant.characteristics.bloomTime.forEach(time => bloomTimes.add(time));
        }
        if (plant.characteristics.nativeRange) {
          plant.characteristics.nativeRange.forEach(range => nativeRanges.add(range));
        }
        if (plant.characteristics.hardinessZones) {
          plant.characteristics.hardinessZones.forEach(zone => hardinessZones.add(zone));
        }
      }
      if (plant.relationships) {
        if (plant.relationships.hostPlantTo) {
          plant.relationships.hostPlantTo.forEach(host => hostPlantTo.add(host));
        }
      }
    });

    return {
      bloomColors: Array.from(bloomColors).sort(),
      bloomTimes: Array.from(bloomTimes).sort(),
      nativeRanges: Array.from(nativeRanges).sort(),
      hardinessZones: Array.from(hardinessZones).sort((a, b) => parseInt(a) - parseInt(b)),
      hostPlantTo: Array.from(hostPlantTo).sort(),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
