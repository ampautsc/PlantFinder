/**
 * Butterfly thumbnail mapping for host plant display
 * This file provides a mapping of butterfly/moth names to their thumbnail images
 * for display in plant detail views.
 */

interface ButterflyThumbnail {
  id: string;
  commonName: string;
  thumbnailUrl: string;
}

/**
 * Mapping of butterfly/moth names (both scientific and common) to thumbnail data
 * This is manually maintained based on the butterfly data files
 */
const butterflyThumbnailMap: Record<string, ButterflyThumbnail> = {
  // Monarch
  'Danaus plexippus': {
    id: 'danaus-plexippus',
    commonName: 'Monarch',
    thumbnailUrl: '/images/animals/butterflies/danaus-plexippus/danaus-plexippus-2025-10-23T19-42-16-801Z-thumb.jpg'
  },
  'Monarch butterfly': {
    id: 'danaus-plexippus',
    commonName: 'Monarch',
    thumbnailUrl: '/images/animals/butterflies/danaus-plexippus/danaus-plexippus-2025-10-23T19-42-16-801Z-thumb.jpg'
  },
  'Monarch': {
    id: 'danaus-plexippus',
    commonName: 'Monarch',
    thumbnailUrl: '/images/animals/butterflies/danaus-plexippus/danaus-plexippus-2025-10-23T19-42-16-801Z-thumb.jpg'
  },
  
  // Zebra Swallowtail
  'Eurytides marcellus': {
    id: 'eurytides-marcellus',
    commonName: 'Zebra Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/eurytides-marcellus/eurytides-marcellus-2025-10-23T19-42-18-234Z-thumb.jpg'
  },
  
  // Pipevine Swallowtail
  'Battus philenor': {
    id: 'battus-philenor',
    commonName: 'Pipevine Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/battus-philenor/battus-philenor-2025-10-23T19-42-14-009Z-thumb.jpg'
  },
  
  // Spicebush Swallowtail
  'Papilio troilus': {
    id: 'papilio-troilus',
    commonName: 'Spicebush Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-troilus/papilio-troilus-2025-10-23T19-42-32-574Z-thumb.jpg'
  },
  
  // Giant Swallowtail
  'Heraclides cresphontes': {
    id: 'heraclides-cresphontes',
    commonName: 'Giant Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/heraclides-cresphontes/heraclides-cresphontes-2025-10-23T19-42-20-752Z-thumb.jpg'
  },
  'Giant Swallowtail': {
    id: 'heraclides-cresphontes',
    commonName: 'Giant Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/heraclides-cresphontes/heraclides-cresphontes-2025-10-23T19-42-20-752Z-thumb.jpg'
  },
  
  // Eastern Tiger Swallowtail
  'Papilio glaucus': {
    id: 'papilio-glaucus',
    commonName: 'Eastern Tiger Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-glaucus/papilio-glaucus-2025-10-23T19-42-28-276Z-thumb.jpg'
  },
  
  // Black Swallowtail
  'Papilio polyxenes asterius': {
    id: 'papilio-polyxenes-asterius',
    commonName: 'Black Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-polyxenes-asterius/papilio-polyxenes-asterius-2025-10-23T19-42-31-093Z-thumb.jpg'
  },
  'Black Swallowtail butterfly': {
    id: 'papilio-polyxenes-asterius',
    commonName: 'Black Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-polyxenes-asterius/papilio-polyxenes-asterius-2025-10-23T19-42-31-093Z-thumb.jpg'
  },
  
  // Great Spangled Fritillary
  'Speyeria cybele': {
    id: 'speyeria-cybele',
    commonName: 'Great Spangled Fritillary',
    thumbnailUrl: '/images/animals/butterflies/speyeria-cybele/speyeria-cybele-2025-10-23T19-42-36-578Z-thumb.jpg'
  },
  'Great Spangled Fritillary': {
    id: 'speyeria-cybele',
    commonName: 'Great Spangled Fritillary',
    thumbnailUrl: '/images/animals/butterflies/speyeria-cybele/speyeria-cybele-2025-10-23T19-42-36-578Z-thumb.jpg'
  },
  
  // Regal Fritillary
  'Speyeria idalia': {
    id: 'speyeria-idalia',
    commonName: 'Regal Fritillary',
    thumbnailUrl: '/images/animals/butterflies/speyeria-idalia/speyeria-idalia-2025-10-23T19-42-39-517Z-thumb.jpg'
  },
  
  // Buckeye
  'Junonia coenia': {
    id: 'junonia-coenia',
    commonName: 'Buckeye',
    thumbnailUrl: '/images/animals/butterflies/junonia-coenia/junonia-coenia-2025-10-23T19-42-22-450Z-thumb.jpg'
  },
  
  // American Painted Lady
  'Vanessa virginiensis': {
    id: 'vanessa-virginiensis',
    commonName: 'American Painted Lady',
    thumbnailUrl: '/images/animals/butterflies/vanessa-virginiensis/vanessa-virginiensis-2025-10-23T19-42-42-166Z-thumb.jpg'
  },
  'American Lady': {
    id: 'vanessa-virginiensis',
    commonName: 'American Painted Lady',
    thumbnailUrl: '/images/animals/butterflies/vanessa-virginiensis/vanessa-virginiensis-2025-10-23T19-42-42-166Z-thumb.jpg'
  },
  'Painted Lady': {
    id: 'vanessa-virginiensis',
    commonName: 'American Painted Lady',
    thumbnailUrl: '/images/animals/butterflies/vanessa-virginiensis/vanessa-virginiensis-2025-10-23T19-42-42-166Z-thumb.jpg'
  },
  
  // Red-spotted Purple
  'Limenitis arthemis astyanax': {
    id: 'limenitis-arthemis-astyanax',
    commonName: 'Red-spotted Purple',
    thumbnailUrl: '/images/animals/butterflies/limenitis-arthemis-astyanax/limenitis-arthemis-astyanax-2025-10-23T19-43-41-140Z-thumb.jpg'
  },
  
  // Viceroy
  'Limenitis archippus': {
    id: 'limenitis-archippus',
    commonName: 'Viceroy',
    thumbnailUrl: '/images/animals/butterflies/limenitis-archippus/limenitis-archippus-2025-10-23T19-42-24-564Z-thumb.jpg'
  },
  
  // Hackberry Emperor
  'Asterocampa celtis': {
    id: 'asterocampa-celtis',
    commonName: 'Hackberry Emperor',
    thumbnailUrl: '/images/animals/butterflies/asterocampa-celtis/asterocampa-celtis-2025-10-23T19-42-12-683Z-thumb.jpg'
  },
  
  // Cloudless Sulphur
  'Phoebis sennae': {
    id: 'phoebis-sennae',
    commonName: 'Cloudless Sulphur',
    thumbnailUrl: '/images/animals/butterflies/phoebis-sennae/phoebis-sennae-2025-10-23T19-42-34-002Z-thumb.jpg'
  },
  'Clouded Sulphur': {
    id: 'phoebis-sennae',
    commonName: 'Cloudless Sulphur',
    thumbnailUrl: '/images/animals/butterflies/phoebis-sennae/phoebis-sennae-2025-10-23T19-42-34-002Z-thumb.jpg'
  },
  
  // Southern Dogface
  'Zerene cesonia': {
    id: 'zerene-cesonia',
    commonName: 'Southern Dogface',
    thumbnailUrl: '/images/animals/butterflies/zerene-cesonia/zerene-cesonia-2025-10-23T19-42-43-571Z-thumb.jpg'
  },
  
  // Species without images - using placeholder or similar species
  'Queen butterfly': {
    id: 'queen-butterfly',
    commonName: 'Queen butterfly',
    thumbnailUrl: '' // No image available
  },
  'Pearl Crescent butterfly': {
    id: 'pearl-crescent',
    commonName: 'Pearl Crescent butterfly',
    thumbnailUrl: '' // No image available
  },
  'Atala butterfly': {
    id: 'atala',
    commonName: 'Atala butterfly',
    thumbnailUrl: '' // No image available
  },
  'Bordered Patch butterfly': {
    id: 'bordered-patch',
    commonName: 'Bordered Patch butterfly',
    thumbnailUrl: '' // No image available
  },
  'Columbine Duskywing butterfly': {
    id: 'columbine-duskywing',
    commonName: 'Columbine Duskywing butterfly',
    thumbnailUrl: '' // No image available
  },
  'Eastern Comma': {
    id: 'eastern-comma',
    commonName: 'Eastern Comma',
    thumbnailUrl: '' // No image available
  },
  'Eastern Tailed-Blue': {
    id: 'eastern-tailed-blue',
    commonName: 'Eastern Tailed-Blue',
    thumbnailUrl: '' // No image available
  },
  'Fritillary butterflies': {
    id: 'fritillary-general',
    commonName: 'Fritillary butterflies',
    thumbnailUrl: '' // No image available - generic category
  },
  'Meadow Fritillary': {
    id: 'meadow-fritillary',
    commonName: 'Meadow Fritillary',
    thumbnailUrl: '' // No image available
  },
  'Milbert\'s Tortoiseshell': {
    id: 'milberts-tortoiseshell',
    commonName: 'Milbert\'s Tortoiseshell',
    thumbnailUrl: '' // No image available
  },
  'Milkweed Tussock Moth': {
    id: 'milkweed-tussock-moth',
    commonName: 'Milkweed Tussock Moth',
    thumbnailUrl: '' // No image available
  },
  'Orange Sulphur': {
    id: 'orange-sulphur',
    commonName: 'Orange Sulphur',
    thumbnailUrl: '' // No image available
  },
  'Question Mark': {
    id: 'question-mark',
    commonName: 'Question Mark',
    thumbnailUrl: '' // No image available
  },
  'Red Admiral': {
    id: 'red-admiral',
    commonName: 'Red Admiral',
    thumbnailUrl: '' // No image available
  },
  'Silvery Checkerspot butterfly': {
    id: 'silvery-checkerspot',
    commonName: 'Silvery Checkerspot butterfly',
    thumbnailUrl: '' // No image available
  },
  'Variegated Fritillary': {
    id: 'variegated-fritillary',
    commonName: 'Variegated Fritillary',
    thumbnailUrl: '' // No image available
  },
};

/**
 * Get thumbnail data for a butterfly/moth by name (scientific or common)
 * @param name Scientific or common name of the butterfly/moth
 * @returns Thumbnail data or undefined if not found
 */
export function getButterflyThumbnail(name: string): ButterflyThumbnail | undefined {
  return butterflyThumbnailMap[name];
}

/**
 * Check if a butterfly/moth has a thumbnail available
 * @param name Scientific or common name of the butterfly/moth
 * @returns true if thumbnail is available
 */
export function hasButterflyThumbnail(name: string): boolean {
  return name in butterflyThumbnailMap;
}

export type { ButterflyThumbnail };
