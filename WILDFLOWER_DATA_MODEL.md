# Wildflower.org Data Model

## Overview

This document defines the comprehensive data model for plant data sourced from the [Lady Bird Johnson Wildflower Center](https://www.wildflower.org/). The data model is designed to capture all available information from the wildflower.org plant database to ensure we have complete, usable data for the PlantFinder application.

## Purpose

The batch job (`scripts/fetch_wildflower_data.py`) scrapes plant data from wildflower.org. This data model:

1. **Defines what data we expect** from the wildflower.org website
2. **Structures the data** in a consistent, usable format
3. **Documents field mappings** between wildflower.org and our Plant interface
4. **Ensures completeness** by capturing all available data, not just what we currently use

## Data Model Structure

### TypeScript Interface

The complete data model is defined in `src/types/WildflowerOrgData.ts`:

```typescript
export interface WildflowerOrgPlantData {
  // Basic Identification
  scientificName: string;
  commonName: string;
  family?: string;
  genus?: string;
  species?: string;
  synonym?: string[];
  
  // Physical Characteristics
  characteristics?: {
    height?: { min?: number; max?: number; unit?: string };
    spread?: { min?: number; max?: number; unit?: string };
    bloomColor?: string[];
    bloomPeriod?: string[];
    bloomTime?: string;
    lifespan?: 'annual' | 'biennial' | 'perennial';
    growthRate?: 'slow' | 'moderate' | 'fast';
    growthForm?: string[];
    foliageTexture?: 'fine' | 'medium' | 'coarse';
    foliageColor?: string[];
    fruitType?: string;
    fruitColor?: string[];
    fruitPeriod?: string;
  };
  
  // Growing Requirements
  requirements?: {
    light?: { full_sun?: boolean; partial_sun?: boolean; ... };
    soil?: { types?: string[]; pH?: {...}; drainage?: string };
    moisture?: { dry?: boolean; medium?: boolean; ... };
    hardiness?: { zones?: string[]; minTemperature?: number; ... };
  };
  
  // Geographic Information
  distribution?: {
    nativeRange?: string[];
    nativeHabitat?: string[];
    invasiveStatus?: string;
  };
  
  // Ecological Relationships
  ecology?: {
    pollinators?: string[];
    hostPlantFor?: string[];
    wildlifeValue?: string[];
    foodFor?: string[];
    landscapeUse?: string[];
    suitableFor?: string[];
    propagationMethods?: string[];
    seedCollectionTime?: string;
    conservationStatus?: string;
  };
  
  // Additional attributes
  attributes?: {
    toxicity?: string;
    thorny?: boolean;
    attracts?: string[];
    resists?: string[];
    problems?: string[];
  };
  
  // Images and references
  images?: { primary?: string; additional?: string[]; ... };
  references?: { sourceId?: string; permalink?: string; ... };
}
```

## Field Descriptions

### Basic Identification

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `scientificName` | string | Scientific/botanical name | "Asclepias tuberosa" |
| `commonName` | string | Common name(s) | "Butterfly Weed" |
| `family` | string | Plant family | "Apocynaceae" |
| `genus` | string | Genus classification | "Asclepias" |
| `species` | string | Species classification | "tuberosa" |
| `synonym` | string[] | Alternative scientific names | ["Asclepias aurantiaca"] |

### Physical Characteristics

#### Size
- **height**: Min/max height in inches or feet
- **spread**: Min/max width/spread in inches or feet

#### Bloom Information
- **bloomColor**: Array of flower colors (e.g., ["Orange", "Yellow"])
- **bloomPeriod**: Seasons when plant blooms (e.g., ["Summer", "Fall"])
- **bloomTime**: Descriptive bloom period (e.g., "June to September")

#### Growth Characteristics
- **lifespan**: Annual, biennial, or perennial
- **growthRate**: How quickly the plant grows
- **growthForm**: Plant type/form (forb/herb, shrub, tree, vine, graminoid)

#### Foliage and Fruit
- **foliageTexture**: Leaf texture (fine, medium, coarse)
- **foliageColor**: Leaf colors including fall colors
- **fruitType**: Type of fruit produced
- **fruitColor**: Colors of fruit
- **fruitPeriod**: When fruit is present

### Growing Requirements

#### Light Requirements
Indicates which light conditions the plant tolerates:
- `full_sun`: 6+ hours direct sun
- `partial_sun`: 3-6 hours direct sun
- `partial_shade`: 3-6 hours filtered sun
- `full_shade`: Less than 3 hours sun

#### Soil Requirements
- **types**: Soil types tolerated (sand, loam, clay, limestone, caliche)
- **pH**: Acceptable pH range (min, max, description)
- **drainage**: Drainage requirements

#### Moisture Requirements
Water needs of the plant:
- `dry`: Minimal water, drought conditions
- `medium`: Average moisture
- `moist`: Consistently moist soil
- `wet`: Standing water or very wet soil
- `droughtTolerant`: Can survive extended dry periods

#### Hardiness
- **zones**: USDA hardiness zones (e.g., ["5", "6", "7", "8"])
- **minTemperature**: Minimum temperature tolerance (°F)
- **maxTemperature**: Maximum temperature tolerance (°F)

### Geographic Information

#### Distribution
- **nativeRange**: States, regions, or countries where plant is native
- **nativeHabitat**: Natural habitat types (prairies, woodlands, wetlands, etc.)
- **invasiveStatus**: Invasive designation if applicable

### Ecological Relationships

#### Wildlife Relationships
- **pollinators**: Primary pollinators (bees, butterflies, hummingbirds, moths, etc.)
- **hostPlantFor**: Specific insects that use plant as host (e.g., "Monarch Butterfly")
- **wildlifeValue**: General wildlife benefits
- **foodFor**: Animals that consume the plant

#### Garden/Landscape Use
- **landscapeUse**: Suggested landscape applications (border, mass planting, specimen, etc.)
- **suitableFor**: Garden types (pollinator garden, rain garden, xeriscaping, etc.)

#### Propagation and Conservation
- **propagationMethods**: How to propagate (seed, cuttings, division, etc.)
- **seedCollectionTime**: When to collect seeds
- **conservationStatus**: Conservation status if applicable
- **threatened/endangered**: Conservation concern flags

### Additional Attributes

- **toxicity**: Toxicity information for humans/animals
- **thorny**: Whether plant has thorns/spines
- **attracts**: What the plant attracts (butterflies, hummingbirds, etc.)
- **resists**: What it resists (deer, rabbits, drought, etc.)
- **problems**: Potential problems (invasive tendencies, susceptibility to pests, etc.)

### Images and References

- **images.primary**: URL to primary/featured image
- **images.additional**: Array of additional image URLs
- **images.credit**: Image attribution/credit
- **references.sourceId**: Internal ID at wildflower.org
- **references.permalink**: Permanent URL to plant detail page
- **references.lastUpdated**: When data was last updated at source
- **references.dataQuality**: Assessment of data completeness

## Scraped Data Container

The actual JSON files saved by the scraper include metadata:

```json
{
  "source_url": "https://www.wildflower.org/plants/result.php?id_plant=ASTU",
  "scraped_at": "2025-10-16T12:00:00.000Z",
  "scraper_version": "2.0.0",
  "raw_html": "<!-- snippet of HTML for reference -->",
  "plant_data": {
    "scientificName": "Asclepias tuberosa",
    "commonName": "Butterfly Weed",
    ...
  }
}
```

## Mapping to PlantFinder Plant Interface

The `Plant` interface used in the PlantFinder application is defined in `src/types/Plant.ts`. Here's how wildflower.org data maps to it:

| WildflowerOrg Field | Plant Interface Field | Transformation |
|---------------------|----------------------|----------------|
| `scientificName` | `scientificName` | Direct |
| `commonName` | `commonName` | Direct |
| `description` | `description` | Direct |
| `requirements.light.*` | `requirements.sun` | Map booleans to single value |
| `requirements.moisture.*` | `requirements.moisture` | Map booleans to single value |
| `requirements.soil.types` | `requirements.soil` | Pick primary type |
| `characteristics.height` | `characteristics.height` | Use max or average |
| `characteristics.spread` | `characteristics.width` | Use max or average |
| `characteristics.bloomColor` | `characteristics.bloomColor` | Direct |
| `characteristics.bloomPeriod` | `characteristics.bloomTime` | Direct |
| `characteristics.lifespan` | `characteristics.perennial` | Boolean conversion |
| `distribution.nativeRange` | `characteristics.nativeRange` | Direct |
| `requirements.hardiness.zones` | `characteristics.hardinessZones` | Direct |
| `ecology.hostPlantFor` | `relationships.hostPlantTo` | Direct |
| `ecology.pollinators + foodFor` | `relationships.foodFor` | Combine |
| `ecology.suitableFor` | `relationships.usefulFor` | Direct |
| `images.primary` | `imageUrl` | Direct |

## Data Extraction Strategy

### HTML Parsing Approach

The Python scraper uses HTML parsing to extract data from wildflower.org plant pages. Key strategies:

1. **Identify HTML patterns**: Look for consistent class names, IDs, or structure
2. **Extract by section**: Parse different data types from different page sections
3. **Normalize values**: Convert extracted strings to proper types (numbers, booleans, arrays)
4. **Handle missing data**: Use optional fields; don't fail on missing data
5. **Preserve raw HTML**: Keep snippet for debugging and manual review

### Example HTML Patterns

Based on typical botanical database structures:

```html
<!-- Scientific Name -->
<h1 class="scientific-name">Asclepias tuberosa</h1>

<!-- Common Name -->
<h2 class="common-name">Butterfly Weed</h2>

<!-- Characteristics -->
<div class="plant-details">
  <div class="detail-row">
    <span class="label">Height:</span>
    <span class="value">12-36 inches</span>
  </div>
  <div class="detail-row">
    <span class="label">Bloom Color:</span>
    <span class="value">Orange, Yellow</span>
  </div>
</div>

<!-- Requirements -->
<div class="growing-conditions">
  <div class="light-requirements">
    <span class="icon sun-full">☀️</span> Full Sun
  </div>
</div>
```

## Data Validation

### Required Fields

At minimum, scraped data should include:
- `scientificName` or `commonName` (at least one)
- Some characteristics or requirements data

### Quality Levels

- **Complete**: All major sections populated
- **Partial**: Basic info + some details
- **Minimal**: Just names and basic info

### Validation Rules

1. Scientific names should match botanical nomenclature patterns
2. Numeric ranges (height, zones) should have min ≤ max
3. Colors should be from standard set
4. Hardiness zones should be valid USDA zones (1-13)
5. URLs should be valid and accessible

## Usage Examples

### In Python Scraper

```python
# Extract comprehensive plant data
plant_data = {
    "scientificName": extract_text(html, ".scientific-name"),
    "commonName": extract_text(html, ".common-name"),
    "characteristics": {
        "height": extract_height_range(html),
        "bloomColor": extract_list(html, ".bloom-colors"),
        "bloomPeriod": extract_list(html, ".bloom-period"),
    },
    "requirements": {
        "light": extract_light_requirements(html),
        "moisture": extract_moisture_requirements(html),
        "soil": extract_soil_types(html),
    },
    # ... extract all available fields
}
```

### In TypeScript Application

```typescript
import { WildflowerOrgScrapedData, WildflowerOrgPlantData } from './types/WildflowerOrgData';
import { Plant } from './types/Plant';

// Load scraped data
const scrapedData: WildflowerOrgScrapedData = 
  await import('./data/wildflower-org/asclepias-tuberosa.json');

// Transform to Plant interface
const plant: Plant = transformWildflowerOrgToPlant(scrapedData.plant_data);
```

## Future Enhancements

1. **Real-time validation**: Validate extracted data against schema
2. **Incremental updates**: Only update changed fields
3. **Multiple sources**: Combine data from multiple botanical databases
4. **Image processing**: Download and optimize images locally
5. **Taxonomic validation**: Verify scientific names against authoritative sources
6. **Cross-referencing**: Link related plants and species

## References

- [Lady Bird Johnson Wildflower Center](https://www.wildflower.org/)
- [USDA PLANTS Database](https://plants.usda.gov/)
- [Botanical nomenclature standards](https://www.iapt-taxon.org/nomen/)

## Contributing

When updating the data model:

1. Update `src/types/WildflowerOrgData.ts` with new fields
2. Update this documentation with field descriptions
3. Update the Python scraper to extract new fields
4. Add examples of extracted data
5. Update mapping to Plant interface if needed
