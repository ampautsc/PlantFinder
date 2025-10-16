/**
 * Example: Using wildflower.org scraped data in PlantFinder
 * 
 * This example demonstrates how to:
 * 1. Load scraped wildflower.org data
 * 2. Transform it to the Plant interface
 * 3. Validate data quality
 * 4. Use it in the application
 */

import { transformWildflowerOrgToPlant, validateWildflowerOrgData } from '../utils/wildflowerOrgTransform';
import { WildflowerOrgScrapedData } from '../types/WildflowerOrgData';
import { Plant } from '../types/Plant';

// Example 1: Loading and transforming a single plant
export async function loadAsclepiasTuberosa(): Promise<Plant> {
  // In a real application, this would be a dynamic import or API call
  const scrapedData: WildflowerOrgScrapedData = {
    source_url: "/plant.php?id=asclepias-tuberosa",
    scraped_at: "2025-10-16T17:30:10.206622",
    scraper_version: "2.0.0",
    raw_html: "...",
    plant_data: {
      scientificName: "Asclepias tuberosa",
      commonName: "Butterfly Weed",
      family: "Family: Apocynaceae (Dogbane family)",
      description: "A vibrant orange wildflower that attracts butterflies. " +
                   "This showy perennial is native to eastern North America and is an important " +
                   "host plant for Monarch butterflies. The clusters of bright orange to yellow " +
                   "flowers bloom throughout the summer, providing nectar for many pollinators.",
      characteristics: {
        height: { min: 12, max: 36, unit: "inches" },
        bloomColor: ["Orange", "Yellow"],
        bloomPeriod: ["Summer", "Early Fall"],
        lifespan: "perennial"
      },
      requirements: {
        light: { full_sun: true, partial_sun: true },
        moisture: { dry: true, droughtTolerant: true },
        soil: { types: ["sand", "loam", "rocky"] },
        hardiness: { zones: ["3", "4", "5", "6", "7", "8", "9"] }
      },
      distribution: {
        nativeRange: ["Nebraska", "Oklahoma", "Texas", "Kansas"]
      },
      ecology: {
        pollinators: ["bees", "butterflies", "hummingbirds"],
        hostPlantFor: ["Monarch Butterfly"],
        foodFor: ["birds"],
        suitableFor: ["pollinator garden", "xeriscaping", "native garden", "rain garden"]
      }
    }
  };

  // Transform to Plant interface
  const plant = transformWildflowerOrgToPlant(scrapedData);
  
  return plant;
}

// Example 2: Validating data quality before transformation
export function transformWithValidation(scrapedData: WildflowerOrgScrapedData): {
  plant?: Plant;
  validation: { valid: boolean; quality: string; warnings: string[] };
} {
  // Validate the scraped data
  const validation = validateWildflowerOrgData(scrapedData.plant_data);
  
  if (!validation.valid) {
    console.warn('Invalid wildflower.org data:', validation.warnings);
    return { validation };
  }
  
  if (validation.quality === 'minimal') {
    console.warn('Minimal quality data:', validation.warnings);
  }
  
  // Transform if valid
  const plant = transformWildflowerOrgToPlant(scrapedData);
  
  return { plant, validation };
}

// Example 3: Loading multiple plants from scraped data directory
export async function loadAllWildflowerOrgPlants(): Promise<Plant[]> {
  // In a real implementation, this would dynamically load all JSON files
  // from src/data/wildflower-org/
  
  // For now, we'll demonstrate with the example plants
  const plants: Plant[] = [];
  
  // Load each scraped plant file
  const plantFiles = [
    'asclepias-tuberosa',
    'echinacea-purpurea',
    'rudbeckia-hirta'
  ];
  
  for (const plantId of plantFiles) {
    try {
      // Dynamic import would look like:
      // const scrapedData = await import(`../data/wildflower-org/${plantId}.json`);
      
      // For example purposes, we'll use a placeholder
      console.log(`Loading ${plantId}...`);
      
      // Transform and add to collection
      // const plant = transformWildflowerOrgToPlant(scrapedData);
      // plants.push(plant);
      
    } catch (error) {
      console.error(`Failed to load ${plantId}:`, error);
    }
  }
  
  return plants;
}

// Example 4: Filtering plants by data quality
export function filterByQuality(
  scrapedDataArray: WildflowerOrgScrapedData[],
  minQuality: 'minimal' | 'partial' | 'complete'
): Plant[] {
  const qualityOrder = { minimal: 0, partial: 1, complete: 2 };
  const minLevel = qualityOrder[minQuality];
  
  return scrapedDataArray
    .filter(scrapedData => {
      const validation = validateWildflowerOrgData(scrapedData.plant_data);
      return validation.valid && qualityOrder[validation.quality] >= minLevel;
    })
    .map(scrapedData => transformWildflowerOrgToPlant(scrapedData));
}

// Example 5: Enriching existing Plant data with wildflower.org data
export function enrichPlantData(
  existingPlant: Plant,
  wildflowerOrgData: WildflowerOrgScrapedData
): Plant {
  const transformed = transformWildflowerOrgToPlant(wildflowerOrgData);
  
  // Merge data, preferring wildflower.org data where available
  return {
    ...existingPlant,
    ...transformed,
    
    // For arrays, merge unique values
    characteristics: {
      ...existingPlant.characteristics,
      ...transformed.characteristics,
      bloomColor: [
        ...new Set([
          ...existingPlant.characteristics.bloomColor,
          ...transformed.characteristics.bloomColor
        ])
      ],
      bloomTime: [
        ...new Set([
          ...existingPlant.characteristics.bloomTime,
          ...transformed.characteristics.bloomTime
        ])
      ],
      nativeRange: [
        ...new Set([
          ...existingPlant.characteristics.nativeRange,
          ...transformed.characteristics.nativeRange
        ])
      ],
      hardinessZones: [
        ...new Set([
          ...existingPlant.characteristics.hardinessZones,
          ...transformed.characteristics.hardinessZones
        ])
      ]
    },
    
    relationships: {
      hostPlantTo: [
        ...new Set([
          ...existingPlant.relationships.hostPlantTo,
          ...transformed.relationships.hostPlantTo
        ])
      ],
      foodFor: [
        ...new Set([
          ...existingPlant.relationships.foodFor,
          ...transformed.relationships.foodFor
        ])
      ],
      usefulFor: [
        ...new Set([
          ...existingPlant.relationships.usefulFor,
          ...transformed.relationships.usefulFor
        ])
      ]
    }
  };
}

// Example 6: Creating a PlantApi implementation using wildflower.org data
export class WildflowerOrgPlantApi {
  private plants: Plant[] = [];
  
  async initialize(): Promise<void> {
    // Load all plants from wildflower.org scraped data
    this.plants = await loadAllWildflowerOrgPlants();
    console.log(`Loaded ${this.plants.length} plants from wildflower.org data`);
  }
  
  async getAllPlants(): Promise<Plant[]> {
    return this.plants;
  }
  
  async getPlantById(id: string): Promise<Plant | null> {
    return this.plants.find(p => p.id === id) || null;
  }
  
  async searchPlants(query: string): Promise<Plant[]> {
    const lowerQuery = query.toLowerCase();
    return this.plants.filter(p =>
      p.commonName.toLowerCase().includes(lowerQuery) ||
      p.scientificName.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }
}

// Example usage in comments:
/*

// Basic transformation
const plant = await loadAsclepiasTuberosa();
console.log(plant.commonName); // "Butterfly Weed"
console.log(plant.characteristics.bloomColor); // ["Orange", "Yellow"]

// With validation
const result = transformWithValidation(scrapedData);
if (result.plant) {
  console.log(`Loaded plant: ${result.plant.commonName}`);
  console.log(`Data quality: ${result.validation.quality}`);
}

// Filter by quality
const highQualityPlants = filterByQuality(allScrapedData, 'partial');
console.log(`Found ${highQualityPlants.length} high-quality plants`);

// Use in API
const api = new WildflowerOrgPlantApi();
await api.initialize();
const plants = await api.getAllPlants();

*/
