import {
  ISeedShareReadApi,
  ISeedShareOperateApi,
  ISeedMatchApi,
} from './SeedShareApi';
import {
  SeedOffer,
  SeedRequest,
  SeedMatch,
  PlantSeedShareVolume,
  UserPlantSeedShare,
  MatchDetails,
  SeedShareStatus,
} from '../types/SeedShare';

/**
 * Mock implementation of the Seed Share service
 * Handles offers, requests, and automatic matching
 */
export class MockSeedShareService
  implements ISeedShareReadApi, ISeedShareOperateApi, ISeedMatchApi
{
  private offers: Map<string, SeedOffer> = new Map();
  private requests: Map<string, SeedRequest> = new Map();
  private matches: Map<string, SeedMatch> = new Map();
  private nextOfferId = 1;
  private nextRequestId = 1;
  private nextMatchId = 1;

  // Mock user names for display
  private userNames: Map<string, string> = new Map([
    ['user1', 'Alice Green'],
    ['user2', 'Bob Smith'],
    ['user3', 'Charlie Brown'],
    ['current', 'You'],
  ]);

  // Mock plant data for match details
  private plantData: Map<string, { commonName: string; scientificName: string }> = new Map();

  constructor() {
    // Initialize with some mock data for demonstration
    this.seedMockData();
  }

  private seedMockData() {
    // Add some initial offers and requests for demonstration
    // Creating a mix of offers and requests across various plants
    
    // Plant IDs to use for mock data - expanded list for better coverage
    const plantIds = [
      'achillea-millefolium',
      'acer-rubrum',
      'actaea-racemosa',
      'amelanchier-alnifolia',
      'amsonia-tabernaemontana',
      'aquilegia-canadensis',
      'asclepias-incarnata',
      'asclepias-tuberosa',
      'baptisia-australis',
      'coreopsis-lanceolata',
      'echinacea-purpurea',
      'helianthus-maximiliani',
      'liatris-spicata',
      'lobelia-cardinalis',
      'monarda-fistulosa',
      'penstemon-digitalis',
      'rudbeckia-hirta',
      'solidago-canadensis',
      'symphyotrichum-novae-angliae',
      'zizia-aurea',
      'allium-schoenoprasum',
      'amorpha-fruticosa',
      'anaphalis-margaritacea',
      'andropogon-gerardii',
      'angelica-atropurpurea',
      'aquilegia-chrysantha',
      'aquilegia-formosa',
      'arbutus-menziesii',
      'arctostaphylos-uva-ursi',
      'asclepias-speciosa',
      'asclepias-syriaca',
      'aster-laevis',
      'astragalus-canadensis',
      'bouteloua-curtipendula',
      'bouteloua-gracilis',
      'ceanothus-americanus',
      'cercis-canadensis',
      'chamaecrista-fasciculata',
      'chelone-glabra',
      'chrysanthemum-leucanthemum',
      'coreopsis-tinctoria',
      'coreopsis-verticillata',
      'cornus-sericea',
      'dalea-purpurea',
      'delphinium-exaltatum',
      'desmanthus-illinoensis',
      'desmodium-canadense',
      'dodecatheon-meadia',
      'echinacea-pallida',
      'eryngium-yuccifolium',
      'eupatorium-maculatum',
      'eupatorium-perfoliatum',
      'fragaria-virginiana',
      'gaillardia-aristata',
      'geranium-maculatum',
      'geum-triflorum',
      'helenium-autumnale',
      'helianthus-annuus',
      'helianthus-divaricatus',
      'helianthus-grosseserratus',
      'heliopsis-helianthoides',
      'hibiscus-moscheutos',
      'hypoxis-hirsuta',
      'iris-versicolor',
      'lespedeza-capitata',
      'liatris-aspera',
      'liatris-pycnostachya',
      'lobelia-siphilitica',
      'lupinus-perennis',
      'monarda-didyma',
      'oenothera-biennis',
      'penstemon-grandiflorus',
      'penstemon-hirsutus',
      'phlox-divaricata',
      'phlox-pilosa',
      'physostegia-virginiana',
      'podophyllum-peltatum',
      'polygonatum-biflorum',
      'potentilla-fruticosa',
      'ratibida-pinnata',
      'rosa-carolina',
      'rudbeckia-fulgida',
      'rudbeckia-laciniata',
      'salvia-azurea',
      'sanguinaria-canadensis',
      'schizachyrium-scoparium',
      'scutellaria-lateriflora',
      'silene-regia',
      'silphium-integrifolium',
      'silphium-laciniatum',
      'silphium-perfoliatum',
      'sisyrinchium-angustifolium',
      'solidago-juncea',
      'solidago-rigida',
      'solidago-speciosa',
      'sorghastrum-nutans',
      'spiraea-alba',
    ];
    
    // Mock user IDs
    const userIds = ['user1', 'user2', 'user3'];
    
    // Create a mix of offers and requests (approximately 50/50)
    plantIds.forEach((plantId, index) => {
      const randomUser = userIds[index % userIds.length];
      
      if (index % 2 === 0) {
        // Create an offer (even index)
        const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 packets
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
        const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        
        const offer: SeedOffer = {
          id: this.generateOfferId(),
          plantId,
          userId: randomUser,
          quantity,
          status: 'open',
          createdAt,
          updatedAt: createdAt,
        };
        this.offers.set(offer.id, offer);
      } else {
        // Create a request (odd index)
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
        const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        
        const request: SeedRequest = {
          id: this.generateRequestId(),
          plantId,
          userId: randomUser,
          quantity: 1,
          status: 'open',
          createdAt,
          updatedAt: createdAt,
        };
        this.requests.set(request.id, request);
      }
    });
  }

  private generateOfferId(): string {
    return `offer-${this.nextOfferId++}`;
  }

  private generateRequestId(): string {
    return `request-${this.nextRequestId++}`;
  }

  private generateMatchId(): string {
    return `match-${this.nextMatchId++}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== ISeedShareReadApi Implementation =====

  async getPlantVolume(plantId: string): Promise<PlantSeedShareVolume> {
    await this.delay(100);

    let openOffers = 0;
    let openRequests = 0;

    // Count open offers (available packets)
    for (const offer of this.offers.values()) {
      if (offer.plantId === plantId && offer.status === 'open') {
        openOffers += offer.quantity;
      }
    }

    // Count open requests
    for (const request of this.requests.values()) {
      if (request.plantId === plantId && request.status === 'open') {
        openRequests += request.quantity;
      }
    }

    return {
      plantId,
      openOffers,
      openRequests,
    };
  }

  async getAllPlantsVolume(): Promise<PlantSeedShareVolume[]> {
    await this.delay(150);

    const plantVolumes = new Map<string, PlantSeedShareVolume>();

    // Aggregate offers
    for (const offer of this.offers.values()) {
      if (offer.status === 'open') {
        const existing = plantVolumes.get(offer.plantId) || {
          plantId: offer.plantId,
          openOffers: 0,
          openRequests: 0,
        };
        existing.openOffers += offer.quantity;
        plantVolumes.set(offer.plantId, existing);
      }
    }

    // Aggregate requests
    for (const request of this.requests.values()) {
      if (request.status === 'open') {
        const existing = plantVolumes.get(request.plantId) || {
          plantId: request.plantId,
          openOffers: 0,
          openRequests: 0,
        };
        existing.openRequests += request.quantity;
        plantVolumes.set(request.plantId, existing);
      }
    }

    return Array.from(plantVolumes.values());
  }

  async getUserPlantActivity(
    userId: string,
    plantId: string
  ): Promise<UserPlantSeedShare> {
    await this.delay(100);

    let hasActiveOffer = false;
    let hasActiveRequest = false;
    let activeOfferId: string | undefined;
    let activeOfferQuantity: number | undefined;
    let activeOfferStatus: SeedShareStatus | undefined;
    let activeRequestId: string | undefined;
    let activeRequestStatus: SeedShareStatus | undefined;

    // Check for active offer
    for (const offer of this.offers.values()) {
      if (
        offer.plantId === plantId &&
        offer.userId === userId &&
        offer.status !== 'cancelled'
      ) {
        hasActiveOffer = true;
        activeOfferId = offer.id;
        activeOfferQuantity = offer.quantity;
        activeOfferStatus = offer.status;
        break;
      }
    }

    // Check for active request
    for (const request of this.requests.values()) {
      if (
        request.plantId === plantId &&
        request.userId === userId &&
        request.status !== 'cancelled'
      ) {
        hasActiveRequest = true;
        activeRequestId = request.id;
        activeRequestStatus = request.status;
        break;
      }
    }

    return {
      plantId,
      hasActiveOffer,
      hasActiveRequest,
      activeOfferId,
      activeOfferQuantity,
      activeOfferStatus,
      activeRequestId,
      activeRequestStatus,
    };
  }

  async getUserAllPlantsActivity(userId: string): Promise<UserPlantSeedShare[]> {
    await this.delay(150);

    const plantActivities = new Map<string, UserPlantSeedShare>();

    // Process offers
    for (const offer of this.offers.values()) {
      if (offer.userId === userId && offer.status !== 'cancelled') {
        plantActivities.set(offer.plantId, {
          plantId: offer.plantId,
          hasActiveOffer: true,
          hasActiveRequest: false,
          activeOfferId: offer.id,
          activeOfferQuantity: offer.quantity,
          activeOfferStatus: offer.status,
        });
      }
    }

    // Process requests
    for (const request of this.requests.values()) {
      if (request.userId === userId && request.status !== 'cancelled') {
        const existing = plantActivities.get(request.plantId);
        if (existing) {
          existing.hasActiveRequest = true;
          existing.activeRequestId = request.id;
          existing.activeRequestStatus = request.status;
        } else {
          plantActivities.set(request.plantId, {
            plantId: request.plantId,
            hasActiveOffer: false,
            hasActiveRequest: true,
            activeRequestId: request.id,
            activeRequestStatus: request.status,
          });
        }
      }
    }

    return Array.from(plantActivities.values());
  }

  // ===== ISeedShareOperateApi Implementation =====

  async createOffer(
    userId: string,
    plantId: string,
    quantity: number
  ): Promise<SeedOffer> {
    await this.delay(200);

    // Validate quantity
    if (quantity < 1 || quantity > 10) {
      throw new Error('Offer quantity must be between 1 and 10 packets');
    }

    // Check if user already has an active offer for this plant
    for (const offer of this.offers.values()) {
      if (
        offer.userId === userId &&
        offer.plantId === plantId &&
        offer.status !== 'cancelled'
      ) {
        throw new Error('You already have an active offer for this plant');
      }
    }

    const now = new Date();
    const offer: SeedOffer = {
      id: this.generateOfferId(),
      plantId,
      userId,
      quantity,
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };

    this.offers.set(offer.id, offer);

    // Auto-match with open requests
    await this.autoMatchOfferWithRequests(offer);

    return offer;
  }

  async createRequest(userId: string, plantId: string): Promise<SeedRequest> {
    await this.delay(200);

    // Check if user already has an active request for this plant
    for (const request of this.requests.values()) {
      if (
        request.userId === userId &&
        request.plantId === plantId &&
        request.status !== 'cancelled'
      ) {
        throw new Error('You already have an active request for this plant');
      }
    }

    const now = new Date();
    const request: SeedRequest = {
      id: this.generateRequestId(),
      plantId,
      userId,
      quantity: 1,
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };

    this.requests.set(request.id, request);

    // Auto-match with open offers
    await this.autoMatchRequestWithOffers(request);

    return request;
  }

  async cancelOffer(userId: string, offerId: string): Promise<void> {
    await this.delay(150);

    const offer = this.offers.get(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.userId !== userId) {
      throw new Error('You can only cancel your own offers');
    }

    if (offer.status !== 'open') {
      throw new Error('Can only cancel open offers');
    }

    offer.status = 'cancelled';
    offer.updatedAt = new Date();
  }

  async cancelRequest(userId: string, requestId: string): Promise<void> {
    await this.delay(150);

    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.userId !== userId) {
      throw new Error('You can only cancel your own requests');
    }

    if (request.status !== 'open') {
      throw new Error('Can only cancel open requests');
    }

    request.status = 'cancelled';
    request.updatedAt = new Date();
  }

  // ===== ISeedMatchApi Implementation =====

  async getUserMatches(userId: string): Promise<MatchDetails[]> {
    await this.delay(200);

    const userMatches: MatchDetails[] = [];

    for (const match of this.matches.values()) {
      if (match.senderId === userId || match.receiverId === userId) {
        const details = await this.enrichMatchWithDetails(match);
        if (details) {
          userMatches.push(details);
        }
      }
    }

    // Sort by most recent first
    userMatches.sort((a, b) => b.matchedAt.getTime() - a.matchedAt.getTime());

    return userMatches;
  }

  async getPlantMatches(plantId: string): Promise<SeedMatch[]> {
    await this.delay(150);

    const plantMatches: SeedMatch[] = [];

    for (const match of this.matches.values()) {
      if (match.plantId === plantId) {
        plantMatches.push(match);
      }
    }

    return plantMatches;
  }

  async markAsSent(userId: string, matchId: string): Promise<SeedMatch> {
    await this.delay(150);

    const match = this.matches.get(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.senderId !== userId) {
      throw new Error('Only the sender can mark as sent');
    }

    if (match.status !== 'matched') {
      throw new Error('Can only mark matched items as sent');
    }

    match.status = 'sent';
    match.sentAt = new Date();

    // Update the offer status
    const offer = this.offers.get(match.offerId);
    if (offer) {
      offer.status = 'sent';
      offer.updatedAt = new Date();
    }

    // Update the request status
    const request = this.requests.get(match.requestId);
    if (request) {
      request.status = 'sent';
      request.updatedAt = new Date();
    }

    return match;
  }

  async markAsReceived(userId: string, matchId: string): Promise<SeedMatch> {
    await this.delay(150);

    const match = this.matches.get(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.receiverId !== userId) {
      throw new Error('Only the receiver can mark as received');
    }

    if (match.status !== 'sent') {
      throw new Error('Can only mark sent items as received');
    }

    match.status = 'received';
    match.receivedAt = new Date();

    // Automatically mark as complete when received
    match.status = 'complete';
    match.completedAt = match.receivedAt;

    // Update the offer status
    const offer = this.offers.get(match.offerId);
    if (offer) {
      offer.status = 'complete';
      offer.updatedAt = new Date();
    }

    // Update the request status
    const request = this.requests.get(match.requestId);
    if (request) {
      request.status = 'complete';
      request.updatedAt = new Date();
    }

    return match;
  }

  async getMatchById(matchId: string): Promise<MatchDetails | null> {
    await this.delay(100);

    const match = this.matches.get(matchId);
    if (!match) {
      return null;
    }

    return this.enrichMatchWithDetails(match);
  }

  // ===== Private Helper Methods =====

  /**
   * Auto-match a new offer with existing open requests
   */
  private async autoMatchOfferWithRequests(offer: SeedOffer): Promise<void> {
    let remainingQuantity = offer.quantity;

    // Find open requests for the same plant (oldest first)
    const openRequests = Array.from(this.requests.values())
      .filter(
        req =>
          req.plantId === offer.plantId &&
          req.status === 'open' &&
          req.userId !== offer.userId // Don't match with own requests
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    for (const request of openRequests) {
      if (remainingQuantity <= 0) break;

      // Create a match
      await this.createMatch(offer, request);
      remainingQuantity--;
    }

    // Update offer quantity and status
    if (remainingQuantity === 0) {
      offer.status = 'matched';
    }
    offer.quantity = remainingQuantity;
    offer.updatedAt = new Date();
  }

  /**
   * Auto-match a new request with existing open offers
   */
  private async autoMatchRequestWithOffers(request: SeedRequest): Promise<void> {
    // Find the first open offer for the same plant (oldest first)
    const openOffer = Array.from(this.offers.values())
      .filter(
        off =>
          off.plantId === request.plantId &&
          off.status === 'open' &&
          off.quantity > 0 &&
          off.userId !== request.userId // Don't match with own offers
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

    if (openOffer) {
      // Create a match
      await this.createMatch(openOffer, request);

      // Update offer quantity
      openOffer.quantity--;
      if (openOffer.quantity === 0) {
        openOffer.status = 'matched';
      }
      openOffer.updatedAt = new Date();
    }
  }

  /**
   * Create a match between an offer and a request
   */
  private async createMatch(
    offer: SeedOffer,
    request: SeedRequest
  ): Promise<SeedMatch> {
    const now = new Date();
    const match: SeedMatch = {
      id: this.generateMatchId(),
      offerId: offer.id,
      requestId: request.id,
      plantId: offer.plantId,
      senderId: offer.userId,
      receiverId: request.userId,
      quantity: 1, // Always 1 for a request
      status: 'matched',
      matchedAt: now,
    };

    this.matches.set(match.id, match);

    // Update request status
    request.status = 'matched';
    request.updatedAt = now;

    return match;
  }

  /**
   * Enrich a match with display details
   */
  private async enrichMatchWithDetails(
    match: SeedMatch
  ): Promise<MatchDetails | null> {
    // Get plant data (in a real app, this would come from the plant API)
    const plantData = this.plantData.get(match.plantId) || {
      commonName: 'Unknown Plant',
      scientificName: 'Unknown',
    };

    return {
      ...match,
      plantCommonName: plantData.commonName,
      plantScientificName: plantData.scientificName,
      senderName: this.userNames.get(match.senderId) || match.senderId,
      receiverName: this.userNames.get(match.receiverId) || match.receiverId,
    };
  }

  /**
   * Register plant data for enriching match details
   */
  public registerPlantData(
    plantId: string,
    commonName: string,
    scientificName: string
  ): void {
    this.plantData.set(plantId, { commonName, scientificName });
  }
}

// Export a singleton instance
export const mockSeedShareService = new MockSeedShareService();
