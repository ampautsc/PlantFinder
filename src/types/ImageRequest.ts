export interface ImageRequest {
  timestamp: string;
  requestType: 'plant' | 'animal';
  speciesId: string;
  commonName: string;
  scientificName: string;
  message?: string;
  userAgent?: string;
  url?: string;
}

export interface ImageRequestFormData {
  message: string;
}
