/**
 * Garden plant status types
 */
export type PlantStatus = 'seeds' | 'seedlings' | 'plants';

/**
 * Represents a plant in the user's garden
 */
export interface GardenPlant {
  plantId: string;
  status: PlantStatus;
  quantity?: number; // Number of plants or square feet
  isPotted: boolean;
  addedAt: Date;
  updatedAt: Date;
  notes?: string;
}

/**
 * Garden service API interface
 */
export interface IGardenApi {
  // Read operations
  getGardenPlant(plantId: string): Promise<GardenPlant | null>;
  getAllGardenPlants(): Promise<GardenPlant[]>;
  isInGarden(plantId: string): Promise<boolean>;
  
  // Write operations
  addToGarden(plantId: string): Promise<GardenPlant>;
  updateGardenPlant(plantId: string, updates: Partial<Omit<GardenPlant, 'plantId' | 'addedAt'>>): Promise<GardenPlant>;
  removeFromGarden(plantId: string): Promise<void>;
}
