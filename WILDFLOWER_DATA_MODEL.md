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

The complete data model is defined in `src/types/WildflowerOrgData.ts`. This has been updated to match the actual structure of wildflower.org plant pages:

```typescript
export interface WildflowerOrgPlantData {
  // Basic Identification
  scientificName: string;
  commonName: string;
  commonNames?: string[]; // Additional common names
  family?: string;
  usdaSymbol?: string; // e.g., "ASTU"
  usdaNativeStatus?: string; // e.g., "L48 (N), CAN (N)"
  synonym?: string[];
  
  // Plant Characteristics (from "Plant Characteristics" section)
  characteristics?: {
    duration?: string; // Annual, Biennial, Perennial
    habit?: string; // Herb, Shrub, Tree, Vine, Graminoid
    leafRetention?: string; // Deciduous, Evergreen, Semi-evergreen
    leafArrangement?: string; // Alternate, Opposite, Whorled, Basal
    leafShape?: string[]; // Lanceolate, Linear, Oblong, Ovate, etc.
    fruitType?: string; // Follicle, Capsule, Berry, etc.
    sizeNotes?: string;
    
    height?: { min?: number; max?: number; unit?: string };
    leaf?: { shape?: string; color?: string; description?: string; ... };
    flower?: { description?: string; color?: string[]; ... };
    fruit?: { description?: string; color?: string[]; ... };
    
    bloomColor?: string[];
    bloomTime?: string[]; // Month names
    bloomPeriod?: string[];
  };
  
  // Distribution (from "Distribution" section)
  distribution?: {
    usaStates?: string[]; // State codes: AL, AR, AZ, etc.
    canadianProvinces?: string[]; // Province codes
    nativeDistribution?: string; // Text description
    nativeHabitat?: string; // Detailed habitat description
  };
  
  // Growing Conditions (from "Growing Conditions" section)
  growingConditions?: {
    waterUse?: 'Low' | 'Medium' | 'High';
    lightRequirement?: string;
    soilMoisture?: string[];
    caco3Tolerance?: 'Low' | 'Medium' | 'High';
    droughtTolerance?: 'Low' | 'Medium' | 'High';
    soilDescription?: string;
    conditionsComments?: string;
  };
  
  // Benefit (from "Benefit" section)
  benefit?: {
    useOrnamental?: string;
    useMedicinal?: string;
    useOther?: string;
    warning?: string; // Toxicity warnings
    conspicuousFlowers?: boolean;
    attracts?: string[];
    larvalHost?: string[];
    nectarSource?: boolean;
    deerResistant?: 'Low' | 'Medium' | 'High';
  };
  
  // Value to Beneficial Insects
  beneficialInsects?: {
    specialValueToNativeBees?: boolean;
    specialValueToBumbleBees?: boolean;
    specialValueToHoneyBees?: boolean;
    supportsConservationBiologicalControl?: boolean;
  };
  
  // Butterflies and Moths (BAMONA data)
  butterfliesAndMoths?: Array<{
    commonName: string;
    scientificName: string;
    relationship: 'Larval Host' | 'Nectar Source' | 'Adult Food';
    bamonaUrl?: string;
  }>;
  
  // Propagation (from "Propagation" section)
  propagation?: {
    propagationMaterial?: string[];
    description?: string;
    seedCollection?: string;
    commerciallyAvailable?: boolean;
    maintenance?: string;
  };
  
  // Images and resources
  images?: { 
    primary?: string; 
    galleryCount?: number;
    ... 
  };
  
  resources?: {
    mrSmartyPlantsQuestions?: Array<{...}>;
    organizationsDisplaying?: Array<{...}>;
    seedSources?: Array<{...}>;
  };
}
```

## Field Descriptions

### Basic Identification

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `scientificName` | string | Scientific/botanical name | "Asclepias tuberosa" |
| `commonName` | string | Primary common name | "Butterflyweed" |
| `commonNames` | string[] | All common names | ["Butterfly Weed", "Butterfly Milkweed", "Orange Milkweed", "Pleurisy Root"] |
| `family` | string | Plant family | "Asclepiadaceae (Milkweed Family)" |
| `usdaSymbol` | string | USDA PLANTS symbol | "ASTU" |
| `usdaNativeStatus` | string | USDA native status code | "L48 (N), CAN (N)" |
| `synonym` | string[] | Taxonomic synonyms | ["Asclepias aurantiaca"] |
| `genus` | string | Genus classification | "Asclepias" |
| `species` | string | Species classification | "tuberosa" |
| `synonym` | string[] | Alternative scientific names | ["Asclepias aurantiaca"] |

### Plant Characteristics

The `characteristics` section corresponds to the "Plant Characteristics" section on wildflower.org pages:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `duration` | string | Plant lifespan category | "Perennial" |
| `habit` | string | Growth form | "Herb", "Shrub", "Tree" |
| `leafRetention` | string | Foliage retention | "Deciduous", "Evergreen" |
| `leafArrangement` | string | How leaves are arranged | "Alternate", "Opposite" |
| `leafShape` | string[] | Leaf shape types | ["Lanceolate", "Linear", "Oblong"] |
| `fruitType` | string | Type of fruit produced | "Follicle", "Capsule" |
| `sizeNotes` | string | Size description | "1-2 ft (30-60 cm)" |

#### Detailed Structures

**Leaf Details:**
```typescript
leaf?: {
  shape?: string; // "Linear to oblong to lanceolate"
  color?: string; // Color description
  description?: string; // Full description
  length?: string; // "2-4 in (5-10cm)"
  width?: string; // "3/8 - 3/4 in (1-2 cm)"
}
```

**Flower Details:**
```typescript
flower?: {
  description?: string; // Full flower description
  color?: string[]; // Flower colors
  corollaDescription?: string; // Specific parts description
  size?: string; // Dimensions
  structure?: string; // Structural details
}
```

**Fruit Details:**
```typescript
fruit?: {
  description?: string; // Full fruit description
  color?: string[]; // Fruit colors
  size?: string; // Overall size
  length?: string; // "4-8 in (10-20 cm)"
  width?: string; // "1-2 1/2 in (2 1/2 - 6 cm)"
  surface?: string; // "Covered in short hairs"
}
```

**Bloom Information:**
- `bloomColor`: Array of colors (["Orange", "Yellow"])
- `bloomTime`: Month names (["May", "Jun", "Jul", "Aug", "Sep"])
- `bloomPeriod`: Seasonal periods (["Summer", "Fall"])

### Distribution

Corresponds to the "Distribution" section:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `usaStates` | string[] | US state codes | ["AL", "AR", "AZ", "CA", ...] |
| `canadianProvinces` | string[] | Canadian province codes | ["NL", "ON", "QC"] |
| `nativeDistribution` | string | Text description of range | "Ontario to Newfoundland; New England south to Florida..." |
| `nativeHabitat` | string | Habitat description | "Grows in prairies, open woods, canyons..." |

### Growing Conditions

Corresponds to the "Growing Conditions" section:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `waterUse` | enum | Water needs | "Low", "Medium", "High" |
| `lightRequirement` | string | Sun requirements | "Sun", "Part Shade", "Shade" |
| `soilMoisture` | string[] | Moisture preferences | ["Dry", "Moist"] |
| `caco3Tolerance` | enum | Calcium carbonate tolerance | "Low", "Medium", "High" |
| `droughtTolerance` | enum | Drought tolerance | "Low", "Medium", "High" |
| `soilDescription` | string | Detailed soil preferences | "Prefers well-drained sandy soils..." |
| `conditionsComments` | string | Growing tips and notes | "Butterfly weed has an interesting..." |

### Benefit

Corresponds to the "Benefit" section:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `useOrnamental` | string | Ornamental uses | "Butterfly weed makes a delightful cut flower..." |
| `useMedicinal` | string | Medicinal uses | "Its tough root was chewed by First Nations People..." |
| `useOther` | string | Other uses | "This showy plant is frequently grown from seed..." |
| `warning` | string | Toxicity/safety warnings | "POISONOUS PARTS: Roots, plant sap..." |
| `conspicuousFlowers` | boolean | Has showy flowers | true |
| `attracts` | string[] | What it attracts | ["Butterflies", "Hummingbirds"] |
| `larvalHost` | string[] | Larval host for species | ["Grey Hairstreak", "Monarch", "Queens"] |
| `nectarSource` | boolean | Is a nectar source | true |
| `deerResistant` | enum | Deer resistance level | "Low", "Medium", "High" |

### Beneficial Insects

Data from The Xerces Society for Invertebrate Conservation:

| Field | Type | Description |
|-------|------|-------------|
| `specialValueToNativeBees` | boolean | Has special value to native bees |
| `specialValueToBumbleBees` | boolean | Has special value to bumble bees |
| `specialValueToHoneyBees` | boolean | Has special value to honey bees |
| `supportsConservationBiologicalControl` | boolean | Supports conservation biological control |

### Butterflies and Moths

BAMONA (Butterflies and Moths of North America) data:

```typescript
butterfliesAndMoths?: Array<{
  commonName: string; // "Monarch"
  scientificName: string; // "Danaus plexippus"
  relationship: 'Larval Host' | 'Nectar Source' | 'Adult Food';
  bamonaUrl?: string; // Link to BAMONA page
}>
```

### Propagation

Corresponds to the "Propagation" section:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `propagationMaterial` | string[] | Propagation methods | ["Root Cuttings", "Seeds"] |
| `description` | string | Propagation instructions | "The easiest method of propagation is root cuttings..." |
| `seedCollection` | string | Seed collection info | "Watch plants closely for seedpods..." |
| `commerciallyAvailable` | boolean | Available commercially | true |
| `maintenance` | string | Maintenance requirements | "Needs to be transplanted carefully..." |

### Images and Resources

**Images:**
```typescript
images?: {
  primary?: string; // URL to primary image
  additional?: string[]; // Additional image URLs
  credit?: string; // Photo credit
  galleryCount?: number; // Number of photos in gallery (e.g., 168)
}
```

**Resources:**
```typescript
resources?: {
  // Mr. Smarty Plants Q&A
  mrSmartyPlantsQuestions?: Array<{
    title: string;
    date: string;
    url: string;
  }>;
  
  // Organizations displaying this plant
  organizationsDisplaying?: Array<{
    name: string;
    location: string;
  }>;
  
  // Seed sources
  seedSources?: Array<{
    name: string;
    url?: string;
  }>;
  
  // Propagation protocols
  propagationProtocols?: Array<{
    name: string;
    url: string;
  }>;
}
```

## Complete Example

Here's a complete example based on Asclepias tuberosa from wildflower.org:

```json
{
  "scientificName": "Asclepias tuberosa",
  "commonName": "Butterflyweed",
  "commonNames": [
    "Butterfly Weed",
    "Butterfly Milkweed", 
    "Orange Milkweed",
    "Pleurisy Root",
    "Chigger Flower",
    "Chiggerweed"
  ],
  "family": "Asclepiadaceae (Milkweed Family)",
  "usdaSymbol": "ASTU",
  "usdaNativeStatus": "L48 (N), CAN (N)",
  "description": "This bushy, 1 1/2-2 ft. perennial is prized for its large, flat-topped clusters of bright-orange flowers...",
  
  "characteristics": {
    "duration": "Perennial",
    "habit": "Herb",
    "leafRetention": "Deciduous",
    "leafArrangement": "Alternate",
    "leafShape": ["Lanceolate", "Linear", "Oblong"],
    "fruitType": "Follicle",
    "sizeNotes": "1-2 ft (30-60 cm)",
    
    "leaf": {
      "shape": "Linear to oblong to lanceolate",
      "color": "Bottom of leaf is a lighter green then the top of the leaf",
      "length": "2-4 in (5-10cm)",
      "width": "3/8 - 3/4 in (1 -2 cm)"
    },
    
    "flower": {
      "description": "Corolla, hoods, and horns are orange. Glabrous.",
      "color": ["Orange", "Yellow", "Red"],
      "structure": "Hoods are 3/16 - 1/4 in (5-6 mm) long, and horns just slightly smaller 1/8 in (3 mm)"
    },
    
    "fruit": {
      "description": "Pod color is grayish green",
      "color": ["Grayish green"],
      "length": "4-8 in (10-20 cm)",
      "width": "1-2 1/2 in (2 1/2 - 6 cm)",
      "surface": "Covered in short hairs"
    },
    
    "bloomColor": ["Orange", "Yellow"],
    "bloomTime": ["May", "Jun", "Jul", "Aug", "Sep"]
  },
  
  "distribution": {
    "usaStates": ["AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", ...],
    "canadianProvinces": ["NL", "ON", "QC"],
    "nativeDistribution": "Ontario to Newfoundland; New England south to Florida; west to Texas; north through Colorado to Minnesota",
    "nativeHabitat": "Grows in prairies, open woods, canyons, and hillsides throughout most of the state, common in eastern two thirds of Texas, uncommon in the Hill Country. Plant in well-drained sand, loam, clay, or limestone."
  },
  
  "growingConditions": {
    "waterUse": "Low",
    "lightRequirement": "Sun",
    "soilMoisture": ["Dry", "Moist"],
    "caco3Tolerance": "Medium",
    "droughtTolerance": "High",
    "soilDescription": "Prefers well-drained sandy soils. Tolerates drought.",
    "conditionsComments": "Butterfly weed has an interesting and unusual flower structure. Plant it among other mid-sized perennials..."
  },
  
  "benefit": {
    "useOrnamental": "Butterfly weed makes a delightful cut flower. Strong color, Blooms ornamental, Showy, Long-living, Perennial garden.",
    "useMedicinal": "Its tough root was chewed by First Nations People as a cure for pleurisy and other pulmonary ailments...",
    "useOther": "This showy plant is frequently grown from seed in home gardens.",
    "warning": "POISONOUS PARTS: Roots, plant sap from all parts. Not edible. Toxic only if eaten in large quantities...",
    "conspicuousFlowers": true,
    "attracts": ["Butterflies", "Hummingbirds"],
    "larvalHost": ["Grey Hairstreak", "Monarch", "Queens"],
    "nectarSource": true,
    "deerResistant": "High"
  },
  
  "beneficialInsects": {
    "specialValueToNativeBees": true,
    "specialValueToBumbleBees": true,
    "specialValueToHoneyBees": true,
    "supportsConservationBiologicalControl": true
  },
  
  "butterfliesAndMoths": [
    {
      "commonName": "Monarch",
      "scientificName": "Danaus plexippus",
      "relationship": "Larval Host",
      "bamonaUrl": "..."
    },
    {
      "commonName": "Queen",
      "scientificName": "Danaus gilippus",
      "relationship": "Larval Host",
      "bamonaUrl": "..."
    }
  ],
  
  "propagation": {
    "propagationMaterial": ["Root Cuttings", "Seeds"],
    "description": "The easiest method of propagation is root cuttings. In the fall, cut the taproot into 2-inch sections and plant each section vertically, keeping the area moist.",
    "seedCollection": "Watch plants closely for seedpods in late summer/early fall...",
    "commerciallyAvailable": true,
    "maintenance": "Needs to be transplanted carefully and requires good drainage. It takes 2-3 years before A. tuberosa produces its vibrant flowers..."
  },
  
  "images": {
    "galleryCount": 168,
    "credit": "Cressler, Alan"
  },
  
  "resources": {
    "organizationsDisplaying": [
      {
        "name": "Naval Air Station Kingsville",
        "location": "Kingsville, TX"
      },
      {
        "name": "Lady Bird Johnson Wildflower Center",
        "location": "Austin, TX"
      }
      // ... more organizations
    ]
  }
}
```

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
