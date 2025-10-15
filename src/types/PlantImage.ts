export interface PlantImageSubmission {
  timestamp: string;
  plantId: string;
  plantCommonName: string;
  plantScientificName: string;
  imageSource: 'file' | 'url';
  imageUrl?: string;
  imageData?: string; // base64 encoded for file uploads
  fileName?: string;
  submitterNotes?: string;
  userAgent?: string;
  url?: string;
}

export interface PlantImageFormData {
  plantId: string;
  plantCommonName: string;
  plantScientificName: string;
  imageSource: 'file' | 'url';
  imageUrl: string;
  imageFile: File | null;
  submitterNotes: string;
}

export interface PlantOption {
  id: string;
  commonName: string;
  scientificName: string;
  displayName: string;
}
