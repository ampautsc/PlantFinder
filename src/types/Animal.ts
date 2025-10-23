// Animal Characteristics
export interface AnimalCharacteristics {
  wingspan?: number; // in inches (for butterflies/moths)
  size?: string; // small, medium, large
  flightSeason: string[]; // when they are active
  lifespan?: string; // typical lifespan
}

// Animal Relationships
export interface AnimalRelationships {
  hostPlants: string[]; // plants needed for caterpillars
  nectarPlants?: string[]; // plants adults feed on
  habitat: string[]; // preferred habitats
}

// Complete Animal interface
export interface Animal {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  type: 'butterfly' | 'moth' | 'skipper';
  characteristics: AnimalCharacteristics;
  relationships: AnimalRelationships;
  nativeRange: string[]; // US states where native
  imageUrl?: string;
  thumbnailUrl?: string; // Smaller image for use in plant details (target: ≤25KB)
}
