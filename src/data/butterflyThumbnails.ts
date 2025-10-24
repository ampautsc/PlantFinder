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
    id: 'danaus-gilippus',
    commonName: 'Queen butterfly',
    thumbnailUrl: '/images/animals/butterflies/danaus-gilippus/danaus-gilippus-2025-10-24T19-40-52-321Z-thumb.jpg'
  },
  'Pearl Crescent butterfly': {
    id: 'phyciodes-tharos',
    commonName: 'Pearl Crescent butterfly',
    thumbnailUrl: '/images/animals/butterflies/phyciodes-tharos/phyciodes-tharos-2025-10-24T22-31-06-822Z-thumb.jpg'
  },
  'Atala butterfly': {
    id: 'eumaeus-atala',
    commonName: 'Atala butterfly',
    thumbnailUrl: '/images/animals/butterflies/eumaeus-atala/eumaeus-atala-2025-10-24T22-31-03-341Z-thumb.jpg'
  },
  'Bordered Patch butterfly': {
    id: 'chlosyne-lacinia',
    commonName: 'Bordered Patch butterfly',
    thumbnailUrl: '/images/animals/butterflies/chlosyne-lacinia/chlosyne-lacinia-2025-10-24T22-30-51-673Z-thumb.jpg'
  },
  'Columbine Duskywing butterfly': {
    id: 'erynnis-lucilius',
    commonName: 'Columbine Duskywing butterfly',
    thumbnailUrl: '/images/animals/butterflies/erynnis-lucilius/erynnis-lucilius-2025-10-24T22-31-01-955Z-thumb.jpg'
  },
  'Eastern Comma': {
    id: 'polygonia-comma',
    commonName: 'Eastern Comma',
    thumbnailUrl: '/images/animals/butterflies/polygonia-comma/polygonia-comma-2025-10-24T22-31-08-358Z-thumb.jpg'
  },
  'Eastern Tailed-Blue': {
    id: 'cupido-comyntas',
    commonName: 'Eastern Tailed-Blue',
    thumbnailUrl: '/images/animals/butterflies/cupido-comyntas/cupido-comyntas-2025-10-24T22-31-00-443Z-thumb.jpg'
  },
  'Fritillary butterflies': {
    id: 'fritillary-general',
    commonName: 'Fritillary butterflies',
    thumbnailUrl: '/images/animals/butterflies/speyeria-cybele/speyeria-cybele-2025-10-23T19-42-36-578Z-thumb.jpg' // Using Great Spangled Fritillary as representative
  },
  'Meadow Fritillary': {
    id: 'boloria-bellona',
    commonName: 'Meadow Fritillary',
    thumbnailUrl: '/images/animals/butterflies/boloria-bellona/boloria-bellona-2025-10-24T22-30-50-353Z-thumb.jpg'
  },
  'Milbert\'s Tortoiseshell': {
    id: 'aglais-milberti',
    commonName: 'Milbert\'s Tortoiseshell',
    thumbnailUrl: '/images/animals/butterflies/aglais-milberti/aglais-milberti-2025-10-24T22-30-48-875Z-thumb.jpg'
  },
  'Milkweed Tussock Moth': {
    id: 'euchaetes-egle',
    commonName: 'Milkweed Tussock Moth',
    thumbnailUrl: '/images/animals/butterflies/euchaetes-egle/euchaetes-egle-2025-10-24T19-40-54-086Z-thumb.jpg'
  },
  'Orange Sulphur': {
    id: 'colias-eurytheme',
    commonName: 'Orange Sulphur',
    thumbnailUrl: '/images/animals/butterflies/colias-eurytheme/colias-eurytheme-2025-10-24T22-30-54-332Z-thumb.jpg'
  },
  'Question Mark': {
    id: 'polygonia-interrogationis',
    commonName: 'Question Mark',
    thumbnailUrl: '/images/animals/butterflies/polygonia-interrogationis/polygonia-interrogationis-2025-10-24T22-31-09-699Z-thumb.jpg'
  },
  'Red Admiral': {
    id: 'vanessa-atalanta',
    commonName: 'Red Admiral',
    thumbnailUrl: '/images/animals/butterflies/vanessa-atalanta/vanessa-atalanta-2025-10-24T22-31-11-130Z-thumb.jpg'
  },
  'Silvery Checkerspot butterfly': {
    id: 'chlosyne-nycteis',
    commonName: 'Silvery Checkerspot butterfly',
    thumbnailUrl: '/images/animals/butterflies/chlosyne-nycteis/chlosyne-nycteis-2025-10-24T22-30-53-005Z-thumb.jpg'
  },
  'Variegated Fritillary': {
    id: 'euptoieta-claudia',
    commonName: 'Variegated Fritillary',
    thumbnailUrl: '/images/animals/butterflies/euptoieta-claudia/euptoieta-claudia-2025-10-24T22-31-04-584Z-thumb.jpg'
  },
  
  // Additional scientific name mappings for existing butterflies
  'Danaus gilippus': {
    id: 'danaus-gilippus',
    commonName: 'Queen butterfly',
    thumbnailUrl: '/images/animals/butterflies/danaus-gilippus/danaus-gilippus-2025-10-24T19-40-52-321Z-thumb.jpg'
  },
  'Euchaetes egle': {
    id: 'euchaetes-egle',
    commonName: 'Milkweed Tussock Moth',
    thumbnailUrl: '/images/animals/butterflies/euchaetes-egle/euchaetes-egle-2025-10-24T19-40-54-086Z-thumb.jpg'
  },
  'Zebra Swallowtail': {
    id: 'eurytides-marcellus',
    commonName: 'Zebra Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/eurytides-marcellus/eurytides-marcellus-2025-10-23T19-42-18-234Z-thumb.jpg'
  },
  'Pipevine Swallowtail': {
    id: 'battus-philenor',
    commonName: 'Pipevine Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/battus-philenor/battus-philenor-2025-10-23T19-42-14-009Z-thumb.jpg'
  },
  'Spicebush Swallowtail': {
    id: 'papilio-troilus',
    commonName: 'Spicebush Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-troilus/papilio-troilus-2025-10-23T19-42-32-574Z-thumb.jpg'
  },
  'Eastern Tiger Swallowtail': {
    id: 'papilio-glaucus',
    commonName: 'Eastern Tiger Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-glaucus/papilio-glaucus-2025-10-23T19-42-28-276Z-thumb.jpg'
  },
  'Black Swallowtail': {
    id: 'papilio-polyxenes-asterius',
    commonName: 'Black Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-polyxenes-asterius/papilio-polyxenes-asterius-2025-10-23T19-42-31-093Z-thumb.jpg'
  },
  'Regal Fritillary': {
    id: 'speyeria-idalia',
    commonName: 'Regal Fritillary',
    thumbnailUrl: '/images/animals/butterflies/speyeria-idalia/speyeria-idalia-2025-10-23T19-42-39-517Z-thumb.jpg'
  },
  'Buckeye': {
    id: 'junonia-coenia',
    commonName: 'Buckeye',
    thumbnailUrl: '/images/animals/butterflies/junonia-coenia/junonia-coenia-2025-10-23T19-42-22-450Z-thumb.jpg'
  },
  'Red-spotted Purple': {
    id: 'limenitis-arthemis-astyanax',
    commonName: 'Red-spotted Purple',
    thumbnailUrl: '/images/animals/butterflies/limenitis-arthemis-astyanax/limenitis-arthemis-astyanax-2025-10-23T19-43-41-140Z-thumb.jpg'
  },
  'Viceroy': {
    id: 'limenitis-archippus',
    commonName: 'Viceroy',
    thumbnailUrl: '/images/animals/butterflies/limenitis-archippus/limenitis-archippus-2025-10-23T19-42-24-564Z-thumb.jpg'
  },
  'Hackberry Emperor': {
    id: 'asterocampa-celtis',
    commonName: 'Hackberry Emperor',
    thumbnailUrl: '/images/animals/butterflies/asterocampa-celtis/asterocampa-celtis-2025-10-23T19-42-12-683Z-thumb.jpg'
  },
  'Cloudless Sulphur': {
    id: 'phoebis-sennae',
    commonName: 'Cloudless Sulphur',
    thumbnailUrl: '/images/animals/butterflies/phoebis-sennae/phoebis-sennae-2025-10-23T19-42-34-002Z-thumb.jpg'
  },
  'Southern Dogface': {
    id: 'zerene-cesonia',
    commonName: 'Southern Dogface',
    thumbnailUrl: '/images/animals/butterflies/zerene-cesonia/zerene-cesonia-2025-10-24T19-42-43-571Z-thumb.jpg'
  },
  
  // Scientific name mappings for newly added butterflies
  'Eumaeus atala': {
    id: 'eumaeus-atala',
    commonName: 'Atala butterfly',
    thumbnailUrl: '/images/animals/butterflies/eumaeus-atala/eumaeus-atala-2025-10-24T22-31-03-341Z-thumb.jpg'
  },
  'Phyciodes tharos': {
    id: 'phyciodes-tharos',
    commonName: 'Pearl Crescent butterfly',
    thumbnailUrl: '/images/animals/butterflies/phyciodes-tharos/phyciodes-tharos-2025-10-24T22-31-06-822Z-thumb.jpg'
  },
  'Chlosyne lacinia': {
    id: 'chlosyne-lacinia',
    commonName: 'Bordered Patch butterfly',
    thumbnailUrl: '/images/animals/butterflies/chlosyne-lacinia/chlosyne-lacinia-2025-10-24T22-30-51-673Z-thumb.jpg'
  },
  'Erynnis lucilius': {
    id: 'erynnis-lucilius',
    commonName: 'Columbine Duskywing butterfly',
    thumbnailUrl: '/images/animals/butterflies/erynnis-lucilius/erynnis-lucilius-2025-10-24T22-31-01-955Z-thumb.jpg'
  },
  'Polygonia comma': {
    id: 'polygonia-comma',
    commonName: 'Eastern Comma',
    thumbnailUrl: '/images/animals/butterflies/polygonia-comma/polygonia-comma-2025-10-24T22-31-08-358Z-thumb.jpg'
  },
  'Cupido comyntas': {
    id: 'cupido-comyntas',
    commonName: 'Eastern Tailed-Blue',
    thumbnailUrl: '/images/animals/butterflies/cupido-comyntas/cupido-comyntas-2025-10-24T22-31-00-443Z-thumb.jpg'
  },
  'Boloria bellona': {
    id: 'boloria-bellona',
    commonName: 'Meadow Fritillary',
    thumbnailUrl: '/images/animals/butterflies/boloria-bellona/boloria-bellona-2025-10-24T22-30-50-353Z-thumb.jpg'
  },
  'Aglais milberti': {
    id: 'aglais-milberti',
    commonName: 'Milbert\'s Tortoiseshell',
    thumbnailUrl: '/images/animals/butterflies/aglais-milberti/aglais-milberti-2025-10-24T22-30-48-875Z-thumb.jpg'
  },
  'Colias eurytheme': {
    id: 'colias-eurytheme',
    commonName: 'Orange Sulphur',
    thumbnailUrl: '/images/animals/butterflies/colias-eurytheme/colias-eurytheme-2025-10-24T22-30-54-332Z-thumb.jpg'
  },
  'Polygonia interrogationis': {
    id: 'polygonia-interrogationis',
    commonName: 'Question Mark',
    thumbnailUrl: '/images/animals/butterflies/polygonia-interrogationis/polygonia-interrogationis-2025-10-24T22-31-09-699Z-thumb.jpg'
  },
  'Vanessa atalanta': {
    id: 'vanessa-atalanta',
    commonName: 'Red Admiral',
    thumbnailUrl: '/images/animals/butterflies/vanessa-atalanta/vanessa-atalanta-2025-10-24T22-31-11-130Z-thumb.jpg'
  },
  'Chlosyne nycteis': {
    id: 'chlosyne-nycteis',
    commonName: 'Silvery Checkerspot butterfly',
    thumbnailUrl: '/images/animals/butterflies/chlosyne-nycteis/chlosyne-nycteis-2025-10-24T22-30-53-005Z-thumb.jpg'
  },
  'Euptoieta claudia': {
    id: 'euptoieta-claudia',
    commonName: 'Variegated Fritillary',
    thumbnailUrl: '/images/animals/butterflies/euptoieta-claudia/euptoieta-claudia-2025-10-24T22-31-04-584Z-thumb.jpg'
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
