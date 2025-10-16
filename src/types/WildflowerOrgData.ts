/**
 * Data model for plant data from wildflower.org
 * 
 * This interface defines the complete data structure we expect to extract
 * from the Lady Bird Johnson Wildflower Center's plant database.
 * 
 * Source: https://www.wildflower.org/plants/
 */

/**
 * Complete plant data structure from wildflower.org
 */
export interface WildflowerOrgPlantData {
  // Basic Identification
  scientificName: string;
  commonName: string;
  family?: string;
  genus?: string;
  species?: string;
  synonym?: string[];
  
  // Description
  description?: string;
  
  // Physical Characteristics
  characteristics?: {
    // Height and spread
    height?: {
      min?: number; // in inches
      max?: number; // in inches
      unit?: 'inches' | 'feet';
    };
    spread?: {
      min?: number; // in inches
      max?: number; // in inches
      unit?: 'inches' | 'feet';
    };
    
    // Bloom information
    bloomColor?: string[];
    bloomPeriod?: string[];
    bloomTime?: string; // e.g., "Spring to Summer"
    
    // Growth characteristics
    lifespan?: 'annual' | 'biennial' | 'perennial';
    growthRate?: 'slow' | 'moderate' | 'fast';
    growthForm?: string[]; // e.g., 'forb/herb', 'shrub', 'tree', 'vine', 'graminoid'
    
    // Foliage
    foliageTexture?: 'fine' | 'medium' | 'coarse';
    foliageColor?: string[];
    
    // Fruit
    fruitType?: string;
    fruitColor?: string[];
    fruitPeriod?: string;
  };
  
  // Growing Requirements
  requirements?: {
    // Light requirements
    light?: {
      full_sun?: boolean;
      partial_sun?: boolean;
      partial_shade?: boolean;
      full_shade?: boolean;
      description?: string;
    };
    
    // Soil requirements
    soil?: {
      types?: string[]; // e.g., 'sand', 'loam', 'clay', 'caliche', 'limestone'
      pH?: {
        min?: number;
        max?: number;
        description?: string;
      };
      drainage?: 'well-drained' | 'moderate' | 'poor' | 'boggy';
    };
    
    // Water/moisture requirements
    moisture?: {
      dry?: boolean;
      medium?: boolean;
      moist?: boolean;
      wet?: boolean;
      description?: string;
      droughtTolerant?: boolean;
    };
    
    // Temperature/hardiness
    hardiness?: {
      zones?: string[]; // USDA hardiness zones
      minTemperature?: number; // in Fahrenheit
      maxTemperature?: number;
    };
  };
  
  // Geographic Information
  distribution?: {
    nativeRange?: string[]; // States, regions, or ecoregions
    nativeHabitat?: string[]; // e.g., 'prairies', 'woodlands', 'wetlands'
    invasiveStatus?: string;
  };
  
  // Ecological Relationships
  ecology?: {
    // Wildlife relationships
    pollinators?: string[]; // e.g., 'bees', 'butterflies', 'hummingbirds'
    hostPlantFor?: string[]; // Specific insects/butterflies
    wildlifeValue?: string[]; // e.g., 'birds', 'mammals', 'insects'
    foodFor?: string[]; // Animals that eat the plant
    
    // Garden/landscape use
    landscapeUse?: string[]; // e.g., 'border', 'mass planting', 'rock garden'
    suitableFor?: string[]; // e.g., 'pollinator garden', 'rain garden', 'xeriscaping'
    
    // Propagation
    propagationMethods?: string[]; // e.g., 'seed', 'cuttings', 'division'
    seedCollectionTime?: string;
    
    // Conservation
    conservationStatus?: string;
    threatened?: boolean;
    endangered?: boolean;
  };
  
  // Additional attributes
  attributes?: {
    toxicity?: string; // toxicity information
    thorny?: boolean;
    attracts?: string[]; // What it attracts (butterflies, bees, etc.)
    resists?: string[]; // What it resists (deer, rabbits, etc.)
    problems?: string[]; // Potential issues
  };
  
  // Images and media
  images?: {
    primary?: string; // URL to primary image
    additional?: string[]; // URLs to additional images
    credit?: string; // Image attribution
  };
  
  // References and sources
  references?: {
    sourceId?: string; // Internal ID at wildflower.org
    permalink?: string; // Permanent URL to the plant page
    lastUpdated?: string; // ISO timestamp of when data was last updated on source
    dataQuality?: 'complete' | 'partial' | 'minimal';
  };
}

/**
 * Scraped data container that includes metadata about the scraping process
 */
export interface WildflowerOrgScrapedData {
  // Scraping metadata
  source_url: string;
  scraped_at: string; // ISO timestamp
  scraper_version?: string;
  
  // Raw data for reference/debugging
  raw_html?: string; // Snippet or full HTML
  
  // Extracted and structured plant data
  plant_data: WildflowerOrgPlantData;
}

/**
 * Mapping configuration for converting WildflowerOrgPlantData to the app's Plant interface
 */
export interface WildflowerOrgToPlantMapping {
  // Maps wildflower.org field names to our Plant interface field names
  // This helps with data transformation and validation
  
  // Example mappings:
  // wildflower.org 'scientific_name' -> Plant 'scientificName'
  // wildflower.org 'common_name' -> Plant 'commonName'
  // etc.
}

/**
 * Filter options specific to wildflower.org data
 * These represent the actual values available in the wildflower.org database
 */
export interface WildflowerOrgFilterOptions {
  bloomColors: string[];
  bloomPeriods: string[];
  growthForms: string[];
  lightRequirements: string[];
  moistureRequirements: string[];
  soilTypes: string[];
  hardinessZones: string[];
  nativeRegions: string[];
  wildlifeValues: string[];
  landscapeUses: string[];
}
