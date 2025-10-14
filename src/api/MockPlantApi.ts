import { IPlantApi } from './PlantApi';
import { Plant, PlantFilters } from '../types/Plant';
import { plants } from '../data/Plants';

/**
 * Mock implementation of the Plant API
 * Uses in-memory data for development and testing
 */
export class MockPlantApi implements IPlantApi {
  private plants: Plant[] = plants;

  async getAllPlants(): Promise<Plant[]> {
    // Simulate network delay
    await this.delay(300);
    return [...this.plants];
  }

  async getPlantById(id: string): Promise<Plant | null> {
    await this.delay(200);
    return this.plants.find(plant => plant.id === id) || null;
  }

  async searchPlants(filters: PlantFilters): Promise<Plant[]> {
    await this.delay(400);
    
    let results = [...this.plants];

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
        filters.sun!.includes(plant.requirements.sun)
      );
    }

    // Filter by moisture requirements
    if (filters.moisture && filters.moisture.length > 0) {
      results = results.filter(plant =>
        filters.moisture!.includes(plant.requirements.moisture)
      );
    }

    // Filter by soil requirements
    if (filters.soil && filters.soil.length > 0) {
      results = results.filter(plant =>
        filters.soil!.includes(plant.requirements.soil)
      );
    }

    // Filter by bloom color
    if (filters.bloomColor && filters.bloomColor.length > 0) {
      results = results.filter(plant =>
        plant.characteristics.bloomColor.some(color =>
          filters.bloomColor!.includes(color)
        )
      );
    }

    // Filter by bloom time
    if (filters.bloomTime && filters.bloomTime.length > 0) {
      results = results.filter(plant =>
        plant.characteristics.bloomTime.some(time =>
          filters.bloomTime!.includes(time)
        )
      );
    }

    // Filter by perennial
    if (filters.perennial !== undefined) {
      results = results.filter(plant =>
        plant.characteristics.perennial === filters.perennial
      );
    }

    // Filter by native range
    if (filters.nativeRange && filters.nativeRange.length > 0) {
      results = results.filter(plant =>
        plant.characteristics.nativeRange.some(range =>
          filters.nativeRange!.includes(range)
        )
      );
    }

    // Filter by states (intersection logic: plant must be in ALL selected states)
    if (filters.states && filters.states.length > 0) {
      results = results.filter(plant =>
        filters.states!.every(state =>
          plant.characteristics.states.includes(state)
        )
      );
    }

    // Filter by hardiness zones
    if (filters.hardinessZones && filters.hardinessZones.length > 0) {
      results = results.filter(plant =>
        plant.characteristics.hardinessZones.some(zone =>
          filters.hardinessZones!.includes(zone)
        )
      );
    }

    // Filter by height
    if (filters.minHeight !== undefined) {
      results = results.filter(plant =>
        plant.characteristics.height >= filters.minHeight!
      );
    }
    if (filters.maxHeight !== undefined) {
      results = results.filter(plant =>
        plant.characteristics.height <= filters.maxHeight!
      );
    }

    // Filter by width
    if (filters.minWidth !== undefined) {
      results = results.filter(plant =>
        plant.characteristics.width >= filters.minWidth!
      );
    }
    if (filters.maxWidth !== undefined) {
      results = results.filter(plant =>
        plant.characteristics.width <= filters.maxWidth!
      );
    }

    // Filter by host plant relationships
    if (filters.hostPlantTo && filters.hostPlantTo.length > 0) {
      results = results.filter(plant =>
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
        plant.relationships.foodFor.some(food =>
          filters.foodFor!.includes(food)
        )
      );
    }

    // Filter by useful for relationships
    if (filters.usefulFor && filters.usefulFor.length > 0) {
      results = results.filter(plant =>
        plant.relationships.usefulFor.some(use =>
          filters.usefulFor!.some(filter =>
            use.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }

    return results;
  }

  async getFilterOptions(): Promise<{
    bloomColors: string[];
    bloomTimes: string[];
    nativeRanges: string[];
    states: string[];
    hardinessZones: string[];
    hostPlantTo: string[];
    foodFor: string[];
    usefulFor: string[];
  }> {
    await this.delay(200);

    const bloomColors = new Set<string>();
    const bloomTimes = new Set<string>();
    const nativeRanges = new Set<string>();
    const states = new Set<string>();
    const hardinessZones = new Set<string>();
    const hostPlantTo = new Set<string>();
    const foodFor = new Set<string>();
    const usefulFor = new Set<string>();

    this.plants.forEach(plant => {
      plant.characteristics.bloomColor.forEach(color => bloomColors.add(color));
      plant.characteristics.bloomTime.forEach(time => bloomTimes.add(time));
      plant.characteristics.nativeRange.forEach(range => nativeRanges.add(range));
      plant.characteristics.states.forEach(state => states.add(state));
      plant.characteristics.hardinessZones.forEach(zone => hardinessZones.add(zone));
      plant.relationships.hostPlantTo.forEach(host => hostPlantTo.add(host));
      plant.relationships.foodFor.forEach(food => foodFor.add(food));
      plant.relationships.usefulFor.forEach(use => usefulFor.add(use));
    });

    return {
      bloomColors: Array.from(bloomColors).sort(),
      bloomTimes: Array.from(bloomTimes).sort(),
      nativeRanges: Array.from(nativeRanges).sort(),
      states: Array.from(states).sort(),
      hardinessZones: Array.from(hardinessZones).sort((a, b) => parseInt(a) - parseInt(b)),
      hostPlantTo: Array.from(hostPlantTo).sort(),
      foodFor: Array.from(foodFor).sort(),
      usefulFor: Array.from(usefulFor).sort(),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
