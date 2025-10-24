import { GardenPlant, IGardenApi, PlantStatus } from '../types/Garden';

const STORAGE_KEY = 'camp-monarch-garden';

/**
 * Mock implementation of the Garden service using localStorage
 */
export class MockGardenService implements IGardenApi {
  private gardenPlants: Map<string, GardenPlant> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Load garden data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as Record<string, Omit<GardenPlant, 'addedAt' | 'updatedAt'> & { addedAt: string; updatedAt: string }>;
        // Convert stored data back to Map with Date objects
        Object.entries(data).forEach(([plantId, plant]) => {
          this.gardenPlants.set(plantId, {
            ...plant,
            addedAt: new Date(plant.addedAt),
            updatedAt: new Date(plant.updatedAt),
          });
        });
      }
    } catch (error) {
      console.error('Error loading garden data from storage:', error);
    }
  }

  /**
   * Save garden data to localStorage
   */
  private saveToStorage(): void {
    try {
      const data: Record<string, GardenPlant> = {};
      this.gardenPlants.forEach((plant, plantId) => {
        data[plantId] = plant;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving garden data to storage:', error);
    }
  }

  async getGardenPlant(plantId: string): Promise<GardenPlant | null> {
    return this.gardenPlants.get(plantId) || null;
  }

  async getAllGardenPlants(): Promise<GardenPlant[]> {
    return Array.from(this.gardenPlants.values());
  }

  async isInGarden(plantId: string): Promise<boolean> {
    return this.gardenPlants.has(plantId);
  }

  async addToGarden(plantId: string): Promise<GardenPlant> {
    const now = new Date();
    const gardenPlant: GardenPlant = {
      plantId,
      status: 'seeds' as PlantStatus,
      quantity: 1,
      isPotted: false,
      addedAt: now,
      updatedAt: now,
    };
    
    this.gardenPlants.set(plantId, gardenPlant);
    this.saveToStorage();
    return gardenPlant;
  }

  async updateGardenPlant(
    plantId: string,
    updates: Partial<Omit<GardenPlant, 'plantId' | 'addedAt'>>
  ): Promise<GardenPlant> {
    const existing = this.gardenPlants.get(plantId);
    if (!existing) {
      throw new Error(`Plant ${plantId} not found in garden`);
    }

    const updated: GardenPlant = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.gardenPlants.set(plantId, updated);
    this.saveToStorage();
    return updated;
  }

  async removeFromGarden(plantId: string): Promise<void> {
    this.gardenPlants.delete(plantId);
    this.saveToStorage();
  }
}

// Export singleton instance
export const mockGardenService = new MockGardenService();
