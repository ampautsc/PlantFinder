import {
  PlantSeedShareVolume,
  UserPlantSeedShare,
  SeedOffer,
  SeedRequest,
  SeedMatch,
  MatchDetails,
} from '../types/SeedShare';

/**
 * Read-only interface for retrieving seed share volume data
 */
export interface ISeedShareReadApi {
  /**
   * Get the total volume of open offers and requests for a specific plant
   */
  getPlantVolume(plantId: string): Promise<PlantSeedShareVolume>;

  /**
   * Get volumes for all plants
   */
  getAllPlantsVolume(): Promise<PlantSeedShareVolume[]>;

  /**
   * Get user's seed share activity for a specific plant
   */
  getUserPlantActivity(userId: string, plantId: string): Promise<UserPlantSeedShare>;

  /**
   * Get user's seed share activity for all plants
   */
  getUserAllPlantsActivity(userId: string): Promise<UserPlantSeedShare[]>;
}

/**
 * Operate interface for creating and managing offers/requests
 */
export interface ISeedShareOperateApi {
  /**
   * Create a seed offer for a plant
   * @param userId - User making the offer
   * @param plantId - Plant identifier
   * @param quantity - Number of packets (1-10)
   * @returns The created offer
   */
  createOffer(userId: string, plantId: string, quantity: number): Promise<SeedOffer>;

  /**
   * Create a seed request for a plant
   * @param userId - User making the request
   * @param plantId - Plant identifier
   * @returns The created request
   */
  createRequest(userId: string, plantId: string): Promise<SeedRequest>;

  /**
   * Cancel an existing offer
   */
  cancelOffer(userId: string, offerId: string): Promise<void>;

  /**
   * Cancel an existing request
   */
  cancelRequest(userId: string, requestId: string): Promise<void>;
}

/**
 * Read/Write interface for managing matches
 */
export interface ISeedMatchApi {
  /**
   * Get all matches for a user (both as sender and receiver)
   */
  getUserMatches(userId: string): Promise<MatchDetails[]>;

  /**
   * Get matches for a specific plant
   */
  getPlantMatches(plantId: string): Promise<SeedMatch[]>;

  /**
   * Confirm a match (called by sender/offerer)
   */
  confirmMatch(userId: string, matchId: string): Promise<SeedMatch>;

  /**
   * Mark a match as sent (called by sender)
   */
  markAsSent(userId: string, matchId: string): Promise<SeedMatch>;

  /**
   * Mark a match as received (called by receiver)
   */
  markAsReceived(userId: string, matchId: string): Promise<SeedMatch>;

  /**
   * Update planting status (called by receiver)
   */
  updatePlantingStatus(userId: string, matchId: string, status: 'planted' | 'sprouted' | 'grown' | 'flowered' | 'seeded' | 'established'): Promise<SeedMatch>;

  /**
   * Get match details by ID
   */
  getMatchById(matchId: string): Promise<MatchDetails | null>;
}
