# Plant Data Standards

## Overview

This document defines the standards for plant data in the PlantFinder application, including the data model, field descriptions, and guidelines for creating and updating plant records.

## Data Model

### Plant Interface

The complete plant data structure is defined in `src/types/Plant.ts`:

```typescript
interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  requirements: PlantRequirements;
  characteristics: PlantCharacteristics;
  relationships: PlantRelationships;
  imageUrl?: string;
  thumbnailUrl?: string;
}
```

### Plant Requirements

Growing conditions needed by the plant:

```typescript
interface PlantRequirements {
  sun: 'full-sun' | 'partial-sun' | 'partial-shade' | 'full-shade';
  moisture: 'dry' | 'medium' | 'moist' | 'wet';
  soil: 'clay' | 'loam' | 'sand' | 'rocky';
}
```

**Field Definitions:**

- **sun**: Light requirements
  - `full-sun`: 6+ hours direct sun
  - `partial-sun`: 4-6 hours direct sun
  - `partial-shade`: 2-4 hours direct sun or dappled shade
  - `full-shade`: Less than 2 hours direct sun

- **moisture**: Water requirements
  - `dry`: Well-drained, drought tolerant
  - `medium`: Average moisture, occasional watering
  - `moist`: Consistently moist soil
  - `wet`: Standing water or saturated soil

- **soil**: Soil type preference
  - `clay`: Heavy, dense soil
  - `loam`: Balanced soil (ideal)
  - `sand`: Light, fast-draining soil
  - `rocky`: Rocky or gravelly soil

### Plant Characteristics

Physical attributes and growing information:

```typescript
interface PlantCharacteristics {
  height: number; // in inches
  width: number; // in inches
  bloomColor: string[];
  bloomTime: string[];
  perennial: boolean;
  nativeRange: string[];
  hardinessZones: string[];
}
```

**Field Definitions:**

- **height**: Maximum height in inches (12 inches = 1 foot)
- **width**: Maximum spread/width in inches
- **bloomColor**: Array of flower colors (e.g., "orange", "yellow", "purple")
- **bloomTime**: Array of bloom periods (e.g., "spring", "summer", "fall")
- **perennial**: `true` for perennials, `false` for annuals/biennials
- **nativeRange**: Array of US states where plant is native
- **hardinessZones**: Array of USDA hardiness zones (e.g., "3", "4", "5")

### Plant Relationships

Wildlife and ecological relationships - **THIS IS THE KEY SECTION FOR BUTTERFLY/WILDLIFE DATA**:

```typescript
interface PlantRelationships {
  hostPlantTo: string[]; // specific butterfly/moth species (scientific names)
  foodFor: string[]; // general wildlife categories that feed on plant
  shelterFor: string[]; // wildlife that uses plant for shelter/habitat
  usefulFor: string[]; // garden uses and benefits
}
```

**Field Definitions:**

#### hostPlantTo
**List of specific butterfly/moth species that use this plant as a larval host.**

**Format:** Use scientific names (binomial nomenclature)

**Examples:**
- `"Danaus plexippus"` (Monarch butterfly)
- `"Papilio glaucus"` (Eastern Tiger Swallowtail)
- `"Battus philenor"` (Pipevine Swallowtail)
- `"Speyeria cybele"` (Great Spangled Fritillary)

**Important:** This field should contain exact species names for butterflies/moths that require this plant for caterpillars. Common names may also be included for user-friendliness.

#### foodFor
**General wildlife categories that use this plant as a food source (nectar, fruit, seeds, etc.).**

**Format:** General categories or families

**Examples:**
- `"butterflies"` - Adult butterflies feeding on nectar
- `"bees"` - Including honeybees and native bees
- `"hummingbirds"` - For nectar-rich flowers
- `"birds"` - For seeds, berries, or fruit
- `"mammals"` - For fruit or foliage

**Note:** This is broader than hostPlantTo - it includes nectar sources, fruit, seeds, etc.

#### shelterFor
**Wildlife that uses the plant for shelter, nesting, or habitat.**

**Format:** General categories

**Examples:**
- `"songbirds"` - General songbirds using for nesting/perching
- `"cavity-nesting birds"` - Birds using tree cavities
- `"ground-nesting birds"` - Birds nesting in dense low vegetation
- `"beneficial insects"` - Insects using for overwintering or habitat
- `"amphibians"` - Frogs, toads, salamanders
- `"small mammals"` - Rabbits, mice, etc.

**Guidelines:**
- Trees (≥180" / 15 ft): Include "songbirds" and potentially "cavity-nesting birds"
- Large shrubs (72-180" / 6-15 ft): Include "songbirds"
- Medium shrubs (24-72" / 2-6 ft): Include "ground-nesting birds"
- Small perennials (<12"): Include "beneficial insects"
- Wetland plants: May include "amphibians"
- Dense grasses: May include "small mammals", "ground-nesting birds"

#### usefulFor
**Garden uses, landscape applications, and other benefits.**

**Format:** Descriptive phrases

**Examples:**
- `"pollinator garden"` - Attracts pollinators
- `"rain garden"` - Tolerates wet conditions
- `"woodland garden"` - Suited for shade/woodland settings
- `"prairie restoration"` - Native prairie species
- `"erosion control"` - Helps prevent erosion
- `"drought tolerance"` - Tolerates dry conditions
- `"fall color"` - Provides autumn interest
- `"native tree"` / `"shade tree"` - Tree-specific uses

## Butterfly-Plant Relationships

### Documented Host Plants

The following butterfly species and their host plants are documented in the database:

| Butterfly (Scientific Name) | Common Name | Host Plants |
|----------------------------|-------------|-------------|
| Danaus plexippus | Monarch | Asclepias species (milkweeds) |
| Eurytides marcellus | Zebra Swallowtail | Asimina triloba (Pawpaw) - obligate |
| Battus philenor | Pipevine Swallowtail | Aristolochia species (pipevines) |
| Papilio troilus | Spicebush Swallowtail | Lindera benzoin, Sassafras albidum |
| Heraclides cresphontes | Giant Swallowtail | Ptelea trifoliata, Zanthoxylum americanum |
| Papilio glaucus | Eastern Tiger Swallowtail | Ptelea, Liriodendron, Fraxinus, Malus, Prunus |
| Papilio polyxenes asterius | Black Swallowtail | Zizia aurea, Taenidia integerrima, Thaspium spp. |
| Speyeria cybele | Great Spangled Fritillary | Viola species (violets) |
| Speyeria idalia | Regal Fritillary | Viola species (especially V. pedata) |
| Junonia coenia | Buckeye | Plantago spp., Agalinis spp. |
| Vanessa virginiensis | American Painted Lady | Antennaria species (pussytoes) |
| Limenitis arthemis astyanax | Red-spotted Purple | Salix, Prunus, Malus |
| Limenitis archippus | Viceroy | Salix, Prunus |
| Asterocampa celtis | Hackberry Emperor | Celtis species (hackberry/sugarberry) |
| Phoebis sennae | Cloudless Sulphur | Senna, Chamaecrista |
| Zerene cesonia | Southern Dogface | Amorpha, Dalea species |

### Adding New Host Plant Relationships

When adding a new butterfly-plant relationship:

1. **Research the relationship** - Verify the host plant relationship from reliable sources
2. **Use scientific names** - Include binomial nomenclature in `hostPlantTo`
3. **Note obligate relationships** - Document in description if plant is the only host
4. **Update both directions** - Add butterfly to plant's `hostPlantTo` AND create/update butterfly data
5. **Include common name** - May include common name for user-friendliness

## File Format

### File Naming

Plant data files are stored in `public/data/plants/` with the following naming convention:

- **Format:** `{genus}-{species}.json` (all lowercase)
- **Example:** `asclepias-tuberosa.json`
- **Varieties/Subspecies:** Include variety name: `viburnum-opulus-var-americanum.json`

### JSON Structure

Plant data files must be valid JSON with 2-space indentation and a trailing newline:

```json
{
  "id": "asclepias-tuberosa",
  "commonName": "Butterfly Weed",
  "scientificName": "Asclepias tuberosa",
  "description": "Brilliant orange flowers...",
  "requirements": {
    "sun": "full-sun",
    "moisture": "dry",
    "soil": "sand"
  },
  "characteristics": {
    "height": 24,
    "width": 18,
    "bloomColor": ["orange"],
    "bloomTime": ["summer"],
    "perennial": true,
    "nativeRange": ["Maine", "New York", ...],
    "hardinessZones": ["3", "4", "5", ...]
  },
  "relationships": {
    "hostPlantTo": ["Danaus plexippus"],
    "foodFor": ["butterflies", "bees"],
    "shelterFor": [],
    "usefulFor": ["pollinator garden", "monarch conservation"]
  },
  "imageUrl": "/images/plants/asclepias-tuberosa/...",
  "thumbnailUrl": "/images/plants/asclepias-tuberosa/...-thumb.jpg"
}
```

## Creating New Plant Records

### Required Fields

All plant records must include:

1. **id** - Matches filename (genus-species)
2. **commonName** - Primary common name
3. **scientificName** - Binomial nomenclature
4. **description** - 2-3 sentences about the plant, including butterfly relationships if applicable
5. **requirements** - All three fields (sun, moisture, soil)
6. **characteristics** - All seven fields
7. **relationships** - All four fields (use empty arrays if not applicable)

### Optional Fields

- **imageUrl** - URL to full-size plant image
- **thumbnailUrl** - URL to thumbnail (≤25KB target)

### Best Practices

1. **Descriptions** - Include:
   - Visual characteristics
   - Notable wildlife relationships (especially butterflies)
   - Growing conditions/adaptability
   - Unique features

2. **Scientific Names** - Always capitalize genus, lowercase species:
   - ✓ `"Asclepias tuberosa"`
   - ✗ `"asclepias tuberosa"`
   - ✗ `"Asclepias Tuberosa"`

3. **Arrays** - Always use arrays even for single values:
   - ✓ `"bloomColor": ["orange"]`
   - ✗ `"bloomColor": "orange"`

4. **Consistency** - Use standard values for:
   - Bloom colors: lowercase (orange, yellow, purple, blue, etc.)
   - Bloom times: lowercase with capitals for multi-word (spring, "early summer", summer, "late summer", fall)
   - States: Full names, title case
   - Zones: String numbers ("3", "4", etc.)

## Image Guidelines

### Plant Images

- **Location:** `/public/images/plants/{plant-id}/`
- **Full Image:** `{plant-id}-{timestamp}.jpg`
- **Thumbnail:** `{plant-id}-{timestamp}-thumb.jpg`
- **Size:** Thumbnails should be ≤25KB for performance
- **Content:** Show flowers when possible, or characteristic foliage

### Adding Images

Images can be added via:
1. Manual upload to `/public/images/plants/{plant-id}/`
2. iNaturalist integration (automated)
3. User submissions through the app

## Data Validation

### Required Validation

Before committing plant data:

1. **JSON validity** - Must parse without errors
2. **Required fields** - All required fields present
3. **Type checking** - Values match expected types
4. **Array format** - All array fields use arrays (not single values)
5. **Enum values** - sun/moisture/soil match allowed values

### Recommended Checks

1. **Scientific name format** - Genus capitalized, species lowercase
2. **Height/width reasonable** - Matches plant type (tree vs. perennial)
3. **Native range** - At least one state listed
4. **Butterfly relationships** - Scientific names in hostPlantTo
5. **Description quality** - Mentions key features, relationships

## Future Enhancements

Planned additions to the data model:

- **Animal/Butterfly records** - Dedicated files for butterfly species with images
- **Bloom calendar** - More precise bloom timing
- **Care instructions** - Planting and maintenance guidelines
- **Toxicity information** - Pet/human safety data
- **Deer resistance** - Wildlife browsing information
- **Growth rate** - Fast/medium/slow categories

## References

- USDA Plants Database: https://plants.usda.gov/
- iNaturalist: https://www.inaturalist.org/
- Native Plant Trust: https://www.nativeplanttrust.org/
- Xerces Society (butterfly host plants): https://www.xerces.org/
