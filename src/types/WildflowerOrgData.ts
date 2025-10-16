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
 * Updated to match actual wildflower.org plant pages
 */
export interface WildflowerOrgPlantData {
  // Basic Identification
  scientificName: string;
  commonName: string;
  commonNames?: string[]; // Additional common names
  family?: string;
  genus?: string;
  species?: string;
  synonym?: string[];
  usdaSymbol?: string; // e.g., "ASTU"
  usdaNativeStatus?: string; // e.g., "L48 (N), CAN (N)"
  
  // Description - main text description from the page
  description?: string;
  additionalDescription?: string; // Secondary description paragraph
  
  // Plant Characteristics (from "Plant Characteristics" section)
  characteristics?: {
    // Basic plant attributes
    duration?: string; // Annual, Biennial, Perennial
    habit?: string; // Herb, Shrub, Tree, Vine, Graminoid
    leafRetention?: string; // Deciduous, Evergreen, Semi-evergreen
    leafArrangement?: string; // Alternate, Opposite, Whorled, Basal
    leafShape?: string[]; // Lanceolate, Linear, Oblong, Ovate, etc.
    fruitType?: string; // Follicle, Capsule, Berry, etc.
    
    // Size information
    sizeNotes?: string; // e.g., "1-2 ft (30-60 cm)"
    height?: {
      min?: number;
      max?: number;
      unit?: 'inches' | 'feet' | 'cm' | 'm';
    };
    spread?: {
      min?: number;
      max?: number;
      unit?: 'inches' | 'feet' | 'cm' | 'm';
    };
    
    // Leaf details
    leaf?: {
      shape?: string;
      color?: string;
      description?: string;
      length?: string;
      width?: string;
    };
    
    // Flower details
    flower?: {
      description?: string;
      color?: string[];
      corollaDescription?: string;
      size?: string;
      structure?: string;
    };
    
    // Fruit details
    fruit?: {
      description?: string;
      color?: string[];
      size?: string;
      length?: string;
      width?: string;
      surface?: string;
    };
    
    // Bloom information
    bloomColor?: string[];
    bloomTime?: string[]; // Month names: May, Jun, Jul, etc.
    bloomPeriod?: string[];
    
    // Legacy/compatibility fields
    lifespan?: 'annual' | 'biennial' | 'perennial'; // Use duration instead, but kept for compatibility
  };
  
  // Distribution (from "Distribution" section)
  distribution?: {
    // Geographic distribution
    usaStates?: string[]; // Two-letter state codes: AL, AR, AZ, etc.
    canadianProvinces?: string[]; // Province codes: ON, QC, NL, etc.
    nativeDistribution?: string; // Text description of native range
    nativeHabitat?: string; // Detailed habitat description
    nativeRange?: string[]; // Legacy field for compatibility
    invasiveStatus?: string;
  };
  
  // Growing Conditions (from "Growing Conditions" section)
  growingConditions?: {
    waterUse?: 'Low' | 'Medium' | 'High';
    lightRequirement?: string; // Sun, Part Shade, Shade
    soilMoisture?: string[]; // Dry, Moist, Wet
    caco3Tolerance?: 'Low' | 'Medium' | 'High'; // Calcium carbonate tolerance
    droughtTolerance?: 'Low' | 'Medium' | 'High';
    soilDescription?: string; // Detailed soil preferences
    conditionsComments?: string; // Additional growing tips and comments
  };
  
  // Requirements (legacy structure - kept for compatibility)
  requirements?: {
    light?: {
      full_sun?: boolean;
      partial_sun?: boolean;
      partial_shade?: boolean;
      full_shade?: boolean;
      description?: string;
    };
    soil?: {
      types?: string[];
      pH?: {
        min?: number;
        max?: number;
        description?: string;
      };
      drainage?: 'well-drained' | 'moderate' | 'poor' | 'boggy';
    };
    moisture?: {
      dry?: boolean;
      medium?: boolean;
      moist?: boolean;
      wet?: boolean;
      description?: string;
      droughtTolerant?: boolean;
    };
    hardiness?: {
      zones?: string[];
      minTemperature?: number;
      maxTemperature?: number;
    };
  };
  
  // Benefit (from "Benefit" section)
  benefit?: {
    useOrnamental?: string; // Ornamental uses and features
    useMedicinal?: string; // Medicinal uses
    useOther?: string; // Other uses
    warning?: string; // Toxicity and safety warnings
    conspicuousFlowers?: boolean;
    attracts?: string[]; // Butterflies, Hummingbirds, etc.
    larvalHost?: string[]; // Specific butterfly/moth species
    nectarSource?: boolean;
    deerResistant?: 'Low' | 'Medium' | 'High';
  };
  
  // Value to Beneficial Insects (from Xerces Society data)
  beneficialInsects?: {
    specialValueToNativeBees?: boolean;
    specialValueToBumbleBees?: boolean;
    specialValueToHoneyBees?: boolean;
    supportsConservationBiologicalControl?: boolean;
  };
  
  // Butterflies and Moths information (BAMONA data)
  butterfliesAndMoths?: Array<{
    commonName: string;
    scientificName: string;
    relationship: 'Larval Host' | 'Nectar Source' | 'Adult Food';
    bamonaUrl?: string;
  }>;
  
  // Propagation (from "Propagation" section)
  propagation?: {
    propagationMaterial?: string[]; // Root Cuttings, Seeds, etc.
    description?: string; // Detailed propagation instructions
    seedCollection?: string; // Seed collection information
    commerciallyAvailable?: boolean;
    maintenance?: string; // Maintenance requirements and tips
  };
  
  // Ecology (legacy field - kept for compatibility)
  ecology?: {
    pollinators?: string[];
    hostPlantFor?: string[];
    wildlifeValue?: string[];
    foodFor?: string[];
    landscapeUse?: string[];
    suitableFor?: string[];
    propagationMethods?: string[];
    seedCollectionTime?: string;
    conservationStatus?: string;
    threatened?: boolean;
    endangered?: boolean;
  };
  
  // Images and media
  images?: {
    primary?: string;
    additional?: string[];
    credit?: string;
    galleryCount?: number; // Number of photos in the image gallery
  };
  
  // Additional Resources
  resources?: {
    mrSmartyPlantsQuestions?: Array<{
      title: string;
      date: string;
      url: string;
    }>;
    organizationsDisplaying?: Array<{
      name: string;
      location: string;
    }>;
    seedSources?: Array<{
      name: string;
      url?: string;
    }>;
    propagationProtocols?: Array<{
      name: string;
      url: string;
    }>;
  };
  
  // References and sources
  references?: {
    sourceId?: string;
    permalink?: string;
    lastUpdated?: string;
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
