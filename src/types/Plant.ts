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
  nativeRange: string[];
  states: string[]; // US states where the plant is native
  hardinessZones: string[];
}

// Plant Relationships
export interface PlantRelationships {
  hostPlantTo: string[]; // butterflies, moths, etc.
  foodFor: string[]; // birds, pollinators, etc.
  usefulFor: string[]; // erosion control, wildlife habitat, etc.
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
  imageUrl?: string;
}

// Filter criteria interfaces
export interface PlantFilters {
  sun?: PlantRequirements['sun'][];
  moisture?: PlantRequirements['moisture'][];
  soil?: PlantRequirements['soil'][];
  bloomColor?: string[];
  bloomTime?: string[];
  perennial?: boolean;
  nativeRange?: string[];
  states?: string[]; // Filter by US states (intersection logic when multiple selected)
  hardinessZones?: string[];
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  hostPlantTo?: string[];
  foodFor?: string[];
  usefulFor?: string[];
  searchQuery?: string;
}
