import { Plant, PlantFilters } from '../types/Plant';

/**
 * Plant API Interface
 * Defines the contract for plant data access
 */
export interface IPlantApi {
  /**
   * Get all plants
   */
  getAllPlants(): Promise<Plant[]>;

  /**
   * Get a single plant by ID
   */
  getPlantById(id: string): Promise<Plant | null>;

  /**
   * Search and filter plants
   */
  searchPlants(filters: PlantFilters): Promise<Plant[]>;

  /**
   * Get available filter options
   */
  getFilterOptions(): Promise<{
    bloomColors: string[];
    bloomTimes: string[];
    hostPlantTo: string[];
    foodFor: string[];
    shelterFor: string[];
  }>;
}
