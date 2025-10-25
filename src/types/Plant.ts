// Plant Requirements
export interface PlantRequirements {
  sun: 'full-sun' | 'partial-sun' | 'partial-shade' | 'full-shade';
  moisture: 'dry' | 'medium' | 'moist' | 'wet';
  soil: 'clay' | 'loam' | 'sand' | 'rocky';
}

// Plant Characteristics
export interface PlantCharacteristics {
  height: number; // in inches
  width: number; // in inches
  bloomColor: string[];
  bloomTime: string[];
  perennial: boolean;
  nativeRange: string[]; // DEPRECATED: Use Plant.distribution instead
  hardinessZones: string[];
}

// Plant Relationships
export interface PlantRelationships {
  hostPlantTo: string[]; // butterflies, moths, etc. (scientific names preferred)
  foodFor: string[]; // birds, pollinators, etc.
  shelterFor: string[]; // wildlife that uses plant for shelter (birds, toads, etc.)
  usefulFor: string[]; // erosion control, wildlife habitat, etc.
}

// Plant Distribution (county-level using FIPS codes)
export interface PlantDistribution {
  fipsCodes: string[]; // 5-digit county FIPS codes where plant is native
  statesFips?: string[]; // 2-digit state FIPS codes (optional, for quick state-level queries)
  distributionFile?: string; // Optional: path to external distribution file for widespread plants
}

// Complete Plant interface
export interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  requirements: PlantRequirements;
  characteristics: PlantCharacteristics;
  relationships: PlantRelationships;
  distribution?: PlantDistribution; // NEW: County-level distribution via FIPS codes
  imageUrl?: string;
  thumbnailUrl?: string; // Smaller image for cards (target: ≤25KB)
  usdaPlantId?: string; // USDA PLANTS Database identifier
}

// Filter criteria interfaces
export interface PlantFilters {
  sun?: PlantRequirements['sun'][];
  moisture?: PlantRequirements['moisture'][];
  soil?: PlantRequirements['soil'][];
  bloomColor?: string[];
  bloomTime?: string[];
  perennial?: boolean;
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  hostPlantTo?: string[];
  foodFor?: string[];
  shelterFor?: string[];
  usefulFor?: string[];
  searchQuery?: string;
  // Location-based filtering
  location?: string; // User's address/ZIP input
  countyFips?: string[]; // Filter by specific county FIPS codes
  stateFips?: string[]; // Filter by state FIPS codes
  // Availability filters
  inMyGarden?: boolean; // Show only plants in user's garden
  seedsOffered?: boolean; // Show only plants with seeds offered
  adoptionOffered?: boolean; // Show only plants with adoption requests
}
