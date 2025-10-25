/**
 * Butterfly thumbnail mapping for host plant display
 * This file provides a mapping of butterfly/moth names to their thumbnail images
 * for display in plant detail views.
 */

interface ButterflyThumbnail {
  id: string;
  commonName: string;
  thumbnailUrl: string;
  taxonId: number;
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
    thumbnailUrl: '/images/animals/butterflies/danaus-plexippus/danaus-plexippus-2025-10-23T19-42-16-801Z-thumb.jpg',
    taxonId: 48662
  },
  'Monarch butterfly': {
    id: 'danaus-plexippus',
    commonName: 'Monarch',
    thumbnailUrl: '/images/animals/butterflies/danaus-plexippus/danaus-plexippus-2025-10-23T19-42-16-801Z-thumb.jpg',
    taxonId: 48662
  },
  'Monarch': {
    id: 'danaus-plexippus',
    commonName: 'Monarch',
    thumbnailUrl: '/images/animals/butterflies/danaus-plexippus/danaus-plexippus-2025-10-23T19-42-16-801Z-thumb.jpg',
    taxonId: 48662
  },
  
  // Zebra Swallowtail
  'Eurytides marcellus': {
    id: 'eurytides-marcellus',
    commonName: 'Zebra Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/eurytides-marcellus/eurytides-marcellus-2025-10-23T19-42-18-234Z-thumb.jpg',
    taxonId: 83086
  },
  
  // Pipevine Swallowtail
  'Battus philenor': {
    id: 'battus-philenor',
    commonName: 'Pipevine Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/battus-philenor/battus-philenor-2025-10-23T19-42-14-009Z-thumb.jpg',
    taxonId: 49972
  },
  
  // Spicebush Swallowtail
  'Papilio troilus': {
    id: 'papilio-troilus',
    commonName: 'Spicebush Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-troilus/papilio-troilus-2025-10-23T19-42-32-574Z-thumb.jpg',
    taxonId: 58525
  },
  
  // Giant Swallowtail
  'Heraclides cresphontes': {
    id: 'heraclides-cresphontes',
    commonName: 'Giant Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/heraclides-cresphontes/heraclides-cresphontes-2025-10-23T19-42-20-752Z-thumb.jpg',
    taxonId: 85024
  },
  'Giant Swallowtail': {
    id: 'heraclides-cresphontes',
    commonName: 'Giant Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/heraclides-cresphontes/heraclides-cresphontes-2025-10-23T19-42-20-752Z-thumb.jpg',
    taxonId: 85024
  },
  
  // Eastern Tiger Swallowtail
  'Papilio glaucus': {
    id: 'papilio-glaucus',
    commonName: 'Eastern Tiger Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-glaucus/papilio-glaucus-2025-10-23T19-42-28-276Z-thumb.jpg',
    taxonId: 60551
  },
  
  // Black Swallowtail
  'Papilio polyxenes asterius': {
    id: 'papilio-polyxenes-asterius',
    commonName: 'Black Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-polyxenes-asterius/papilio-polyxenes-asterius-2025-10-23T19-42-31-093Z-thumb.jpg',
    taxonId: 54900
  },
  'Black Swallowtail butterfly': {
    id: 'papilio-polyxenes-asterius',
    commonName: 'Black Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-polyxenes-asterius/papilio-polyxenes-asterius-2025-10-23T19-42-31-093Z-thumb.jpg',
    taxonId: 54900
  },
  
  // Great Spangled Fritillary
  'Speyeria cybele': {
    id: 'speyeria-cybele',
    commonName: 'Great Spangled Fritillary',
    thumbnailUrl: '/images/animals/butterflies/speyeria-cybele/speyeria-cybele-2025-10-23T19-42-36-578Z-thumb.jpg',
    taxonId: 1456562
  },
  'Great Spangled Fritillary': {
    id: 'speyeria-cybele',
    commonName: 'Great Spangled Fritillary',
    thumbnailUrl: '/images/animals/butterflies/speyeria-cybele/speyeria-cybele-2025-10-23T19-42-36-578Z-thumb.jpg',
    taxonId: 1456562
  },
  
  // Regal Fritillary
  'Speyeria idalia': {
    id: 'speyeria-idalia',
    commonName: 'Regal Fritillary',
    thumbnailUrl: '/images/animals/butterflies/speyeria-idalia/speyeria-idalia-2025-10-23T19-42-39-517Z-thumb.jpg',
    taxonId: 1456600
  },
  
  // Buckeye
  'Junonia coenia': {
    id: 'junonia-coenia',
    commonName: 'Buckeye',
    thumbnailUrl: '/images/animals/butterflies/junonia-coenia/junonia-coenia-2025-10-23T19-42-22-450Z-thumb.jpg',
    taxonId: 48505
  },
  
  // American Painted Lady
  'Vanessa virginiensis': {
    id: 'vanessa-virginiensis',
    commonName: 'American Painted Lady',
    thumbnailUrl: '/images/animals/butterflies/vanessa-virginiensis/vanessa-virginiensis-2025-10-23T19-42-42-166Z-thumb.jpg',
    taxonId: 48549
  },
  'American Lady': {
    id: 'vanessa-virginiensis',
    commonName: 'American Painted Lady',
    thumbnailUrl: '/images/animals/butterflies/vanessa-virginiensis/vanessa-virginiensis-2025-10-23T19-42-42-166Z-thumb.jpg',
    taxonId: 48549
  },
  'Painted Lady': {
    id: 'vanessa-virginiensis',
    commonName: 'American Painted Lady',
    thumbnailUrl: '/images/animals/butterflies/vanessa-virginiensis/vanessa-virginiensis-2025-10-23T19-42-42-166Z-thumb.jpg',
    taxonId: 48549
  },
  
  // Red-spotted Purple
  'Limenitis arthemis astyanax': {
    id: 'limenitis-arthemis-astyanax',
    commonName: 'Red-spotted Purple',
    thumbnailUrl: '/images/animals/butterflies/limenitis-arthemis-astyanax/limenitis-arthemis-astyanax-2025-10-23T19-43-41-140Z-thumb.jpg',
    taxonId: 58585
  },
  
  // Viceroy
  'Limenitis archippus': {
    id: 'limenitis-archippus',
    commonName: 'Viceroy',
    thumbnailUrl: '/images/animals/butterflies/limenitis-archippus/limenitis-archippus-2025-10-23T19-42-24-564Z-thumb.jpg',
    taxonId: 58586
  },
  
  // Hackberry Emperor
  'Asterocampa celtis': {
    id: 'asterocampa-celtis',
    commonName: 'Hackberry Emperor',
    thumbnailUrl: '/images/animals/butterflies/asterocampa-celtis/asterocampa-celtis-2025-10-23T19-42-12-683Z-thumb.jpg',
    taxonId: 68264
  },
  
  // Cloudless Sulphur
  'Phoebis sennae': {
    id: 'phoebis-sennae',
    commonName: 'Cloudless Sulphur',
    thumbnailUrl: '/images/animals/butterflies/phoebis-sennae/phoebis-sennae-2025-10-23T19-42-34-002Z-thumb.jpg',
    taxonId: 48550
  },
  'Clouded Sulphur': {
    id: 'phoebis-sennae',
    commonName: 'Cloudless Sulphur',
    thumbnailUrl: '/images/animals/butterflies/phoebis-sennae/phoebis-sennae-2025-10-23T19-42-34-002Z-thumb.jpg',
    taxonId: 48550
  },
  
  // Southern Dogface
  'Zerene cesonia': {
    id: 'zerene-cesonia',
    commonName: 'Southern Dogface',
    thumbnailUrl: '/images/animals/butterflies/zerene-cesonia/zerene-cesonia-2025-10-23T19-42-43-571Z-thumb.jpg',
    taxonId: 129362
  },
  
  // Species without images - using placeholder or similar species
  'Queen butterfly': {
    id: 'danaus-gilippus',
    commonName: 'Queen butterfly',
    thumbnailUrl: '/images/animals/butterflies/danaus-gilippus/danaus-gilippus-2025-10-24T19-40-52-321Z-thumb.jpg',
    taxonId: 51743
  },
  'Pearl Crescent butterfly': {
    id: 'phyciodes-tharos',
    commonName: 'Pearl Crescent butterfly',
    thumbnailUrl: '/images/animals/butterflies/phyciodes-tharos/phyciodes-tharos-2025-10-24T22-31-06-822Z-thumb.jpg',
    taxonId: 52925
  },
  'Atala butterfly': {
    id: 'eumaeus-atala',
    commonName: 'Atala butterfly',
    thumbnailUrl: '/images/animals/butterflies/eumaeus-atala/eumaeus-atala-2025-10-24T22-31-03-341Z-thumb.jpg',
    taxonId: 50075
  },
  'Bordered Patch butterfly': {
    id: 'chlosyne-lacinia',
    commonName: 'Bordered Patch butterfly',
    thumbnailUrl: '/images/animals/butterflies/chlosyne-lacinia/chlosyne-lacinia-2025-10-24T22-30-51-673Z-thumb.jpg',
    taxonId: 68240
  },
  'Columbine Duskywing butterfly': {
    id: 'erynnis-lucilius',
    commonName: 'Columbine Duskywing butterfly',
    thumbnailUrl: '/images/animals/butterflies/erynnis-lucilius/erynnis-lucilius-2025-10-24T22-31-01-955Z-thumb.jpg',
    taxonId: 58477
  },
  'Eastern Comma': {
    id: 'polygonia-comma',
    commonName: 'Eastern Comma',
    thumbnailUrl: '/images/animals/butterflies/polygonia-comma/polygonia-comma-2025-10-24T22-31-08-358Z-thumb.jpg',
    taxonId: 54064
  },
  'Eastern Tailed-Blue': {
    id: 'cupido-comyntas',
    commonName: 'Eastern Tailed-Blue',
    thumbnailUrl: '/images/animals/butterflies/cupido-comyntas/cupido-comyntas-2025-10-24T22-31-00-443Z-thumb.jpg',
    taxonId: 122381
  },
  'Fritillary butterflies': {
    id: 'fritillary-general',
    commonName: 'Fritillary butterflies',
    thumbnailUrl: '/images/animals/butterflies/speyeria-cybele/speyeria-cybele-2025-10-23T19-42-36-578Z-thumb.jpg', // Using Great Spangled Fritillary as representative
    taxonId: 1456562 // Using Great Spangled Fritillary taxon ID as representative
  },
  'Meadow Fritillary': {
    id: 'boloria-bellona',
    commonName: 'Meadow Fritillary',
    thumbnailUrl: '/images/animals/butterflies/boloria-bellona/boloria-bellona-2025-10-24T22-30-50-353Z-thumb.jpg',
    taxonId: 58564
  },
  'Milbert\'s Tortoiseshell': {
    id: 'aglais-milberti',
    commonName: 'Milbert\'s Tortoiseshell',
    thumbnailUrl: '/images/animals/butterflies/aglais-milberti/aglais-milberti-2025-10-24T22-30-48-875Z-thumb.jpg',
    taxonId: 68269
  },
  'Milkweed Tussock Moth': {
    id: 'euchaetes-egle',
    commonName: 'Milkweed Tussock Moth',
    thumbnailUrl: '/images/animals/butterflies/euchaetes-egle/euchaetes-egle-2025-10-24T19-40-54-086Z-thumb.jpg',
    taxonId: 81677
  },
  'Orange Sulphur': {
    id: 'colias-eurytheme',
    commonName: 'Orange Sulphur',
    thumbnailUrl: '/images/animals/butterflies/colias-eurytheme/colias-eurytheme-2025-10-24T22-30-54-332Z-thumb.jpg',
    taxonId: 58532
  },
  'Question Mark': {
    id: 'polygonia-interrogationis',
    commonName: 'Question Mark',
    thumbnailUrl: '/images/animals/butterflies/polygonia-interrogationis/polygonia-interrogationis-2025-10-24T22-31-09-699Z-thumb.jpg',
    taxonId: 58579
  },
  'Red Admiral': {
    id: 'vanessa-atalanta',
    commonName: 'Red Admiral',
    thumbnailUrl: '/images/animals/butterflies/vanessa-atalanta/vanessa-atalanta-2025-10-24T22-31-11-130Z-thumb.jpg',
    taxonId: 49133
  },
  'Silvery Checkerspot butterfly': {
    id: 'chlosyne-nycteis',
    commonName: 'Silvery Checkerspot butterfly',
    thumbnailUrl: '/images/animals/butterflies/chlosyne-nycteis/chlosyne-nycteis-2025-10-24T22-30-53-005Z-thumb.jpg',
    taxonId: 62978
  },
  'Variegated Fritillary': {
    id: 'euptoieta-claudia',
    commonName: 'Variegated Fritillary',
    thumbnailUrl: '/images/animals/butterflies/euptoieta-claudia/euptoieta-claudia-2025-10-24T22-31-04-584Z-thumb.jpg',
    taxonId: 68244
  },
  
  // Additional scientific name mappings for existing butterflies
  'Danaus gilippus': {
    id: 'danaus-gilippus',
    commonName: 'Queen butterfly',
    thumbnailUrl: '/images/animals/butterflies/danaus-gilippus/danaus-gilippus-2025-10-24T19-40-52-321Z-thumb.jpg',
    taxonId: 51743
  },
  'Euchaetes egle': {
    id: 'euchaetes-egle',
    commonName: 'Milkweed Tussock Moth',
    thumbnailUrl: '/images/animals/butterflies/euchaetes-egle/euchaetes-egle-2025-10-24T19-40-54-086Z-thumb.jpg',
    taxonId: 81677
  },
  'Zebra Swallowtail': {
    id: 'eurytides-marcellus',
    commonName: 'Zebra Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/eurytides-marcellus/eurytides-marcellus-2025-10-23T19-42-18-234Z-thumb.jpg',
    taxonId: 83086
  },
  'Pipevine Swallowtail': {
    id: 'battus-philenor',
    commonName: 'Pipevine Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/battus-philenor/battus-philenor-2025-10-23T19-42-14-009Z-thumb.jpg',
    taxonId: 49972
  },
  'Spicebush Swallowtail': {
    id: 'papilio-troilus',
    commonName: 'Spicebush Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-troilus/papilio-troilus-2025-10-23T19-42-32-574Z-thumb.jpg',
    taxonId: 58525
  },
  'Eastern Tiger Swallowtail': {
    id: 'papilio-glaucus',
    commonName: 'Eastern Tiger Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-glaucus/papilio-glaucus-2025-10-23T19-42-28-276Z-thumb.jpg',
    taxonId: 60551
  },
  'Black Swallowtail': {
    id: 'papilio-polyxenes-asterius',
    commonName: 'Black Swallowtail',
    thumbnailUrl: '/images/animals/butterflies/papilio-polyxenes-asterius/papilio-polyxenes-asterius-2025-10-23T19-42-31-093Z-thumb.jpg',
    taxonId: 54900
  },
  'Regal Fritillary': {
    id: 'speyeria-idalia',
    commonName: 'Regal Fritillary',
    thumbnailUrl: '/images/animals/butterflies/speyeria-idalia/speyeria-idalia-2025-10-23T19-42-39-517Z-thumb.jpg',
    taxonId: 1456600
  },
  'Buckeye': {
    id: 'junonia-coenia',
    commonName: 'Buckeye',
    thumbnailUrl: '/images/animals/butterflies/junonia-coenia/junonia-coenia-2025-10-23T19-42-22-450Z-thumb.jpg',
    taxonId: 48505
  },
  'Red-spotted Purple': {
    id: 'limenitis-arthemis-astyanax',
    commonName: 'Red-spotted Purple',
    thumbnailUrl: '/images/animals/butterflies/limenitis-arthemis-astyanax/limenitis-arthemis-astyanax-2025-10-23T19-43-41-140Z-thumb.jpg',
    taxonId: 58585
  },
  'Viceroy': {
    id: 'limenitis-archippus',
    commonName: 'Viceroy',
    thumbnailUrl: '/images/animals/butterflies/limenitis-archippus/limenitis-archippus-2025-10-23T19-42-24-564Z-thumb.jpg',
    taxonId: 58586
  },
  'Hackberry Emperor': {
    id: 'asterocampa-celtis',
    commonName: 'Hackberry Emperor',
    thumbnailUrl: '/images/animals/butterflies/asterocampa-celtis/asterocampa-celtis-2025-10-23T19-42-12-683Z-thumb.jpg',
    taxonId: 68264
  },
  'Cloudless Sulphur': {
    id: 'phoebis-sennae',
    commonName: 'Cloudless Sulphur',
    thumbnailUrl: '/images/animals/butterflies/phoebis-sennae/phoebis-sennae-2025-10-23T19-42-34-002Z-thumb.jpg',
    taxonId: 48550
  },
  'Southern Dogface': {
    id: 'zerene-cesonia',
    commonName: 'Southern Dogface',
    thumbnailUrl: '/images/animals/butterflies/zerene-cesonia/zerene-cesonia-2025-10-23T19-42-43-571Z-thumb.jpg',
    taxonId: 129362
  },
  
  // Scientific name mappings for newly added butterflies
  'Eumaeus atala': {
    id: 'eumaeus-atala',
    commonName: 'Atala butterfly',
    thumbnailUrl: '/images/animals/butterflies/eumaeus-atala/eumaeus-atala-2025-10-24T22-31-03-341Z-thumb.jpg',
    taxonId: 50075
  },
  'Phyciodes tharos': {
    id: 'phyciodes-tharos',
    commonName: 'Pearl Crescent butterfly',
    thumbnailUrl: '/images/animals/butterflies/phyciodes-tharos/phyciodes-tharos-2025-10-24T22-31-06-822Z-thumb.jpg',
    taxonId: 52925
  },
  'Chlosyne lacinia': {
    id: 'chlosyne-lacinia',
    commonName: 'Bordered Patch butterfly',
    thumbnailUrl: '/images/animals/butterflies/chlosyne-lacinia/chlosyne-lacinia-2025-10-24T22-30-51-673Z-thumb.jpg',
    taxonId: 68240
  },
  'Erynnis lucilius': {
    id: 'erynnis-lucilius',
    commonName: 'Columbine Duskywing butterfly',
    thumbnailUrl: '/images/animals/butterflies/erynnis-lucilius/erynnis-lucilius-2025-10-24T22-31-01-955Z-thumb.jpg',
    taxonId: 58477
  },
  'Polygonia comma': {
    id: 'polygonia-comma',
    commonName: 'Eastern Comma',
    thumbnailUrl: '/images/animals/butterflies/polygonia-comma/polygonia-comma-2025-10-24T22-31-08-358Z-thumb.jpg',
    taxonId: 54064
  },
  'Cupido comyntas': {
    id: 'cupido-comyntas',
    commonName: 'Eastern Tailed-Blue',
    thumbnailUrl: '/images/animals/butterflies/cupido-comyntas/cupido-comyntas-2025-10-24T22-31-00-443Z-thumb.jpg',
    taxonId: 122381
  },
  'Boloria bellona': {
    id: 'boloria-bellona',
    commonName: 'Meadow Fritillary',
    thumbnailUrl: '/images/animals/butterflies/boloria-bellona/boloria-bellona-2025-10-24T22-30-50-353Z-thumb.jpg',
    taxonId: 58564
  },
  'Aglais milberti': {
    id: 'aglais-milberti',
    commonName: 'Milbert\'s Tortoiseshell',
    thumbnailUrl: '/images/animals/butterflies/aglais-milberti/aglais-milberti-2025-10-24T22-30-48-875Z-thumb.jpg',
    taxonId: 68269
  },
  'Colias eurytheme': {
    id: 'colias-eurytheme',
    commonName: 'Orange Sulphur',
    thumbnailUrl: '/images/animals/butterflies/colias-eurytheme/colias-eurytheme-2025-10-24T22-30-54-332Z-thumb.jpg',
    taxonId: 58532
  },
  'Polygonia interrogationis': {
    id: 'polygonia-interrogationis',
    commonName: 'Question Mark',
    thumbnailUrl: '/images/animals/butterflies/polygonia-interrogationis/polygonia-interrogationis-2025-10-24T22-31-09-699Z-thumb.jpg',
    taxonId: 58579
  },
  'Vanessa atalanta': {
    id: 'vanessa-atalanta',
    commonName: 'Red Admiral',
    thumbnailUrl: '/images/animals/butterflies/vanessa-atalanta/vanessa-atalanta-2025-10-24T22-31-11-130Z-thumb.jpg',
    taxonId: 49133
  },
  'Chlosyne nycteis': {
    id: 'chlosyne-nycteis',
    commonName: 'Silvery Checkerspot butterfly',
    thumbnailUrl: '/images/animals/butterflies/chlosyne-nycteis/chlosyne-nycteis-2025-10-24T22-30-53-005Z-thumb.jpg',
    taxonId: 62978
  },
  'Euptoieta claudia': {
    id: 'euptoieta-claudia',
    commonName: 'Variegated Fritillary',
    thumbnailUrl: '/images/animals/butterflies/euptoieta-claudia/euptoieta-claudia-2025-10-24T22-31-04-584Z-thumb.jpg',
    taxonId: 68244
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
