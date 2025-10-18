// Seed Share Domain Types

/**
 * Status of a seed offer or request
 */
export type SeedShareStatus = 'open' | 'matched' | 'sent' | 'received' | 'complete' | 'cancelled';

/**
 * Type of seed sharing action
 */
export type SeedShareType = 'offer' | 'request';

/**
 * A seed offer - user offering to share seeds
 * Users can offer up to 10 packets at a time
 */
export interface SeedOffer {
  id: string;
  plantId: string;
  userId: string;
  quantity: number; // 1-10 packets
  status: SeedShareStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A seed request - user requesting seeds
 * Requests are always for one packet
 */
export interface SeedRequest {
  id: string;
  plantId: string;
  userId: string;
  quantity: 1; // Always 1
  status: SeedShareStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A match between an offer and a request
 */
export interface SeedMatch {
  id: string;
  offerId: string;
  requestId: string;
  plantId: string;
  senderId: string; // userId who made the offer
  receiverId: string; // userId who made the request
  quantity: number; // Always 1 (request quantity)
  status: 'matched' | 'sent' | 'received' | 'complete';
  matchedAt: Date;
  sentAt?: Date;
  receivedAt?: Date;
  completedAt?: Date;
}

/**
 * Volume statistics for a plant
 */
export interface PlantSeedShareVolume {
  plantId: string;
  openOffers: number; // Total packets available
  openRequests: number; // Total number of requests
}

/**
 * User's seed share activity for a specific plant
 */
export interface UserPlantSeedShare {
  plantId: string;
  hasActiveOffer: boolean;
  hasActiveRequest: boolean;
  activeOfferId?: string;
  activeOfferQuantity?: number;
  activeOfferStatus?: SeedShareStatus;
  activeRequestId?: string;
  activeRequestStatus?: SeedShareStatus;
}

/**
 * Match details for display
 */
export interface MatchDetails extends SeedMatch {
  plantCommonName: string;
  plantScientificName: string;
  senderName: string;
  receiverName: string;
}
