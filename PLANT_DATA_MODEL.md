# Plant Data Model Specification

## Overview

This document defines the complete data model for plant data in the PlantFinder application. It specifies all required fields, data types, and structures needed to support the application's features including filtering, searching, and location-based queries.

## Purpose

This specification serves to:

1. **Define data requirements** - Specify exactly what data is needed for the application to function
2. **Minimize data size** - Identify only essential fields to keep data packages small
3. **Support filtering** - Ensure all filter functionality is supported by the data model
4. **Enable location queries** - Support county-level distribution filtering via FIPS codes
5. **Facilitate localization** - Clearly separate translatable content from data

## Core Data Model

### Plant Interface

The primary data structure for a plant in the PlantFinder application:

```typescript
interface Plant {
  // Identification
  id: string;                      // Unique identifier (genus-species format)
  commonName: string;              // Primary common name (localized)
  scientificName: string;          // Binomial nomenclature (not localized)
  description: string;             // 2-3 sentence description (localized)
  
  // Growing Requirements
  requirements: PlantRequirements;
  
  // Physical Characteristics
  characteristics: PlantCharacteristics;
  
  // Ecological Relationships
  relationships: PlantRelationships;
  
  // Distribution (NEW)
  distribution: PlantDistribution;
  
  // Media
  imageUrl?: string;               // Full-size image URL
  thumbnailUrl?: string;           // Thumbnail image URL (≤25KB target)
  
  // External References
  usdaPlantId?: string;           // USDA PLANTS Database symbol
}
```

### PlantRequirements

Growing conditions required by the plant:

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

- **soil**: Primary soil type preference
  - `clay`: Heavy, dense soil
  - `loam`: Balanced soil (ideal)
  - `sand`: Light, fast-draining soil
  - `rocky`: Rocky or gravelly soil

### PlantCharacteristics

Physical attributes and growing information:

```typescript
interface PlantCharacteristics {
  height: number;              // Maximum height in inches
  width: number;               // Maximum spread in inches
  bloomColor: string[];        // Flower colors (not localized)
  bloomTime: string[];         // Bloom periods (localized keys)
  perennial: boolean;          // true for perennials, false for annuals
  hardinessZones: string[];    // USDA hardiness zones
}
```

**Field Definitions:**

- **height**: Maximum height in inches (12 inches = 1 foot)
- **width**: Maximum spread/width in inches
- **bloomColor**: Array of color values (e.g., `["orange", "yellow"]`)
  - Standard values: `"blue"`, `"lavender"`, `"mauve"`, `"orange"`, `"pink"`, `"purple"`, `"red"`, `"violet"`, `"white"`, `"yellow"`
- **bloomTime**: Array of bloom period keys (e.g., `["spring", "summer"]`)
  - Standard values: `"spring"`, `"early-summer"`, `"summer"`, `"late-summer"`, `"fall"`
  - These are localization keys, not literal strings
- **perennial**: `true` for perennials, `false` for annuals/biennials
- **hardinessZones**: Array of USDA zone strings (e.g., `["3", "4", "5"]`)

### PlantRelationships

Wildlife and ecological relationships:

```typescript
interface PlantRelationships {
  hostPlantTo: string[];       // Butterfly/moth species (scientific names)
  foodFor: string[];           // Wildlife categories that feed on plant
  shelterFor: string[];        // Wildlife that uses plant for shelter
  usefulFor: string[];         // Garden uses and benefits (localized keys)
}
```

**Field Definitions:**

- **hostPlantTo**: Specific butterfly/moth species that use this plant as larval host
  - Use scientific names (e.g., `"Danaus plexippus"` for Monarch)
  - Scientific names are not localized
  - Common names can be looked up via the Animal data model

- **foodFor**: General wildlife categories
  - Standard values: `"butterflies"`, `"bees"`, `"hummingbirds"`, `"birds"`, `"mammals"`
  - These are localization keys

- **shelterFor**: Wildlife using plant for shelter/habitat
  - Standard values: `"songbirds"`, `"ground-nesting-birds"`, `"beneficial-insects"`, `"amphibians"`, `"small-mammals"`
  - These are localization keys

- **usefulFor**: Garden uses and benefits
  - Standard values: `"pollinator-garden"`, `"rain-garden"`, `"woodland-garden"`, `"prairie-restoration"`, `"erosion-control"`, `"drought-tolerance"`, `"monarch-conservation"`
  - These are localization keys

### PlantDistribution (NEW)

County-level distribution data using FIPS codes:

```typescript
interface PlantDistribution {
  fipsCodes: string[];         // County FIPS codes where plant is native
  statesFips?: string[];       // State FIPS codes for quick state-level queries (optional)
}
```

**Field Definitions:**

- **fipsCodes**: Array of 5-digit FIPS codes identifying counties where the plant is native
  - Format: `"SSCCC"` where SS = state code, CCC = county code
  - Example: `"48201"` = Harris County, Texas (48 = TX, 201 = Harris)
  - This replaces the previous `nativeRange` array of state names
  - Data is sourced from USDA distribution CSVs

- **statesFips**: Array of 2-digit state FIPS codes (optional optimization)
  - Format: `"SS"` where SS = state code
  - Example: `"48"` = Texas
  - This can be derived from `fipsCodes` but may be stored for faster state-level filtering
  - Optional field for performance optimization

**FIPS Code Reference:**
- FIPS codes are standardized by the US Census Bureau
- 2-digit state codes: `"01"` (Alabama) through `"56"` (Wyoming)
- 5-digit county codes: State code + 3-digit county code
- Full list available at: https://www.census.gov/library/reference/code-lists/ansi.html

## Data Minimization Strategy

To keep distribution data as small as possible while supporting county-level filtering:

### 1. Use FIPS Codes Instead of Names

**Before (state names):**
```json
{
  "nativeRange": ["Texas", "Oklahoma", "Kansas", "Nebraska", "South Dakota"]
}
```
- 62 characters for 5 states

**After (FIPS codes):**
```json
{
  "distribution": {
    "fipsCodes": ["48201", "48113", "40109", "20173", "31055", "46099"],
    "statesFips": ["48", "40", "20", "31", "46"]
  }
}
```
- More granular (county-level) in less space when compressed
- State-level codes optional for performance

### 2. Compressed Distribution Files

For plants with extensive distribution (e.g., native across many states):

**Option A: Inline (for plants in few counties)**
```json
{
  "distribution": {
    "fipsCodes": ["48201", "48113", "48141"]  // 3 Texas counties
  }
}
```

**Option B: Reference external file (for widespread plants)**
```json
{
  "distribution": {
    "distributionFile": "distribution/asclepias-syriaca.json"
  }
}
```

Where `distribution/asclepias-syriaca.json` contains:
```json
{
  "fipsCodes": ["01001", "01003", ...],  // All counties
  "statesFips": ["01", "04", "05", ...]   // Quick state lookup
}
```

### 3. Data Loading Strategy

The application will:
1. Load plant data with inline distribution for most plants
2. Lazy-load external distribution files only when needed
3. Cache loaded distribution data in memory
4. Support both formats transparently

## Fields Not Included (Excluded from Model)

To minimize data size, the following fields from source data are **NOT** included in the plant data model:

- Detailed taxonomic hierarchy beyond genus/species
- Seed propagation instructions
- Detailed plant morphology descriptions
- Historical naming/synonym information (unless critical)
- Detailed cultivation instructions
- Commercial availability information
- Extensive bibliography/reference lists
- Raw HTML or unprocessed source data

These fields may exist in source data but should not be packaged with the application.

## Localization Strategy

### Translatable Fields (Localized)

These fields should have translations in i18next locale files:

1. **Plant Data:**
   - `commonName` - Store as localization key, e.g., `"plants.asclepias-tuberosa.commonName"`
   - `description` - Store as localization key, e.g., `"plants.asclepias-tuberosa.description"`

2. **Filter Values:**
   - `bloomTime` values - Already localized (e.g., `"filters.bloomTime.spring"`)
   - `foodFor` values - Localize categories (e.g., `"wildlife.butterflies"`)
   - `shelterFor` values - Localize categories
   - `usefulFor` values - Localize uses (e.g., `"uses.pollinator-garden"`)

3. **UI Labels:**
   - Filter labels
   - Field labels
   - Help text
   - Error messages

### Non-Translatable Fields (Universal)

These fields are the same across all languages:

1. **Identifiers:**
   - `id`
   - `scientificName`
   - `usdaPlantId`

2. **Scientific Data:**
   - `hostPlantTo` (scientific names)
   - `hardinessZones`
   - `fipsCodes`
   - Bloom colors (use color names as keys)

3. **Measurements:**
   - `height`
   - `width`

4. **Enums:**
   - `requirements.sun`
   - `requirements.moisture`
   - `requirements.soil`
   - `characteristics.perennial`

### Localization File Structure

For each plant, create entries in locale files:

**en/plants.json:**
```json
{
  "asclepias-tuberosa": {
    "commonName": "Butterfly Weed",
    "description": "Brilliant orange flowers that are a magnet for butterflies..."
  }
}
```

**es/plants.json:**
```json
{
  "asclepias-tuberosa": {
    "commonName": "Hierba de Mariposa",
    "description": "Flores naranjas brillantes que son un imán para las mariposas..."
  }
}
```

**Plant JSON (data file):**
```json
{
  "id": "asclepias-tuberosa",
  "commonName": "plants.asclepias-tuberosa.commonName",
  "description": "plants.asclepias-tuberosa.description",
  ...
}
```

## Address-Based Filtering

### User Input

Users can enter location information in several formats:

1. **Full Address:** "123 Main St, Austin, TX 78701"
2. **City, State:** "Austin, TX"
3. **ZIP Code:** "78701"
4. **County, State:** "Travis County, TX"

### Geocoding Approach

To convert addresses to FIPS codes, the application needs a geocoding service:

**Option 1: Third-Party Geocoding API**
- Google Maps Geocoding API
- Mapbox Geocoding API
- OpenCage Geocoding API
- **Pros:** Accurate, handles various input formats
- **Cons:** Requires API key, usage limits, privacy concerns

**Option 2: Census Geocoding API (Recommended)**
- US Census Bureau Geocoding Services API
- URL: https://geocoding.geo.census.gov/geocoder/
- **Pros:** Free, no API key required, authoritative source
- **Cons:** US only, requires internet connection

**Option 3: Client-Side ZIP/County Database**
- Bundle ZIP code to FIPS mapping in application
- File: `public/data/zip-to-fips.json`
- **Pros:** Works offline, fast, no external dependencies
- **Cons:** Limited to ZIP codes, requires periodic updates

### Recommended Implementation

Use a hybrid approach:

1. **ZIP Code Input:** Use bundled ZIP-to-FIPS mapping
2. **Other Inputs:** Use Census Geocoding API
3. **Fallback:** Manual county/state selection

### Example ZIP-to-FIPS Mapping

`public/data/zip-to-fips.json`:
```json
{
  "78701": {
    "county": "Travis County",
    "countyFips": "48453",
    "state": "Texas",
    "stateFips": "48"
  },
  "90210": {
    "county": "Los Angeles County",
    "countyFips": "06037",
    "state": "California",
    "stateFips": "06"
  }
}
```

This file can be generated from US Census data and bundled with the application.

### Filter Flow

```
User Input (Address/ZIP)
    ↓
Geocode to FIPS Code
    ↓
Filter plants where distribution.fipsCodes includes user's FIPS
    ↓
Display matching plants
```

## Filter Support

The data model must support all current filter functionality:

### Current Filters

1. **Requirements Filters:**
   - Sun exposure (multi-select)
   - Moisture level (multi-select)
   - Soil type (multi-select)

2. **Characteristics Filters:**
   - Height range (min/max slider)
   - Width range (min/max slider)
   - Bloom color (multi-select)
   - Bloom time (multi-select)
   - Plant type (perennial checkbox)
   - Hardiness zones (multi-select)

3. **Relationships Filters:**
   - Host plant for butterflies (multi-select)
   - Food for wildlife (multi-select)
   - Shelter for wildlife (multi-select)
   - Useful for purposes (multi-select)

4. **Distribution Filters (NEW):**
   - Native to location (address/ZIP input)
   - Native to state (multi-select via FIPS)
   - Native to county (multi-select via FIPS)

5. **Search:**
   - Full-text search across common name, scientific name, description

### New Filter Interface

Update `PlantFilters` interface:

```typescript
interface PlantFilters {
  // Existing filters
  sun?: PlantRequirements['sun'][];
  moisture?: PlantRequirements['moisture'][];
  soil?: PlantRequirements['soil'][];
  bloomColor?: string[];
  bloomTime?: string[];
  perennial?: boolean;
  hardinessZones?: string[];
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  hostPlantTo?: string[];
  foodFor?: string[];
  shelterFor?: string[];
  usefulFor?: string[];
  searchQuery?: string;
  
  // NEW: Distribution filters
  location?: string;           // User's address/ZIP input
  countyFips?: string[];      // Filter by specific FIPS codes
  stateFips?: string[];       // Filter by state FIPS codes
  
  // DEPRECATED (for backward compatibility)
  nativeRange?: string[];     // Legacy state names
}
```

## Data Sources

Plant data should be sourced from:

1. **USDA PLANTS Database**
   - Distribution data (FIPS codes)
   - Scientific names
   - Plant symbols
   - Source: https://plants.usda.gov/

2. **iNaturalist**
   - Common names
   - Descriptions
   - Photos
   - Observations
   - Source: https://www.inaturalist.org/

3. **Xerces Society**
   - Butterfly host plant relationships
   - Pollinator value
   - Source: https://www.xerces.org/

4. **Lady Bird Johnson Wildflower Center**
   - Growing requirements
   - Regional information
   - Source: https://www.wildflower.org/

## File Format and Storage

### Plant Data Files

Location: `public/data/plants/{plant-id}.json`

Format:
```json
{
  "id": "asclepias-tuberosa",
  "commonName": "plants.asclepias-tuberosa.commonName",
  "scientificName": "Asclepias tuberosa",
  "description": "plants.asclepias-tuberosa.description",
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
    "hardinessZones": ["3", "4", "5", "6", "7", "8", "9"]
  },
  "relationships": {
    "hostPlantTo": ["Danaus plexippus"],
    "foodFor": ["butterflies", "bees"],
    "shelterFor": ["ground-nesting-birds"],
    "usefulFor": ["pollinator-garden", "monarch-conservation"]
  },
  "distribution": {
    "fipsCodes": [
      "09001", "09003", "09005", "09007", "09009",
      "36001", "36003", "36005", "36007",
      "48001", "48003", "48005"
    ],
    "statesFips": ["09", "36", "48"]
  },
  "imageUrl": "/images/plants/asclepias-tuberosa/image.jpg",
  "thumbnailUrl": "/images/plants/asclepias-tuberosa/thumb.jpg",
  "usdaPlantId": "ASTU"
}
```

### Distribution Data Files (for widespread plants)

Location: `public/data/distribution/{plant-id}.json`

Format:
```json
{
  "plantId": "asclepias-syriaca",
  "fipsCodes": [
    "01001", "01003", "01005", ...
  ],
  "statesFips": ["01", "04", "05", ...]
}
```

### Locale Files

Location: `src/locales/{lang}/plants.json`

Format:
```json
{
  "asclepias-tuberosa": {
    "commonName": "Butterfly Weed",
    "description": "Brilliant orange flowers..."
  },
  "asclepias-syriaca": {
    "commonName": "Common Milkweed",
    "description": "Large clusters of fragrant..."
  }
}
```

## Validation Rules

### Required Fields

All plant records must include:
- `id`
- `commonName` (as localization key)
- `scientificName`
- `description` (as localization key)
- `requirements.*` (all three fields)
- `characteristics.*` (all fields)
- `relationships.*` (all fields, use empty arrays if none)
- `distribution.fipsCodes` (at least one FIPS code)

### Optional Fields

- `imageUrl`
- `thumbnailUrl`
- `usdaPlantId`
- `distribution.statesFips` (can be computed from fipsCodes)
- `distribution.distributionFile` (alternative to inline fipsCodes)

### Data Quality Checks

1. **Scientific Name Format:** Genus capitalized, species lowercase
2. **FIPS Code Format:** 2-digit (state) or 5-digit (county) strings
3. **Height/Width:** Positive integers in inches
4. **Hardiness Zones:** Valid USDA zones ("1" through "13")
5. **Enum Values:** Match defined constants
6. **Arrays:** No duplicates, properly formatted
7. **Localization Keys:** Exist in all locale files

## Migration from Current Model

### Current Model (v1.x)

```typescript
interface Plant {
  characteristics: {
    nativeRange: string[];  // Array of state names
  }
}
```

Example:
```json
{
  "characteristics": {
    "nativeRange": ["Maine", "New York", "Texas"]
  }
}
```

### New Model (v2.0)

```typescript
interface Plant {
  distribution: {
    fipsCodes: string[];
    statesFips?: string[];
  }
}
```

Example:
```json
{
  "distribution": {
    "fipsCodes": ["23001", "36001", "48001"],
    "statesFips": ["23", "36", "48"]
  }
}
```

### Migration Strategy

1. **Phase 1: Add new field (backward compatible)**
   - Add `distribution` field to Plant interface (optional)
   - Keep existing `nativeRange` field
   - Update data loading to use `distribution` if present, fallback to `nativeRange`

2. **Phase 2: Update data files**
   - Generate FIPS codes from existing USDA distribution CSVs
   - Update all plant JSON files to include `distribution`
   - Keep `nativeRange` for backward compatibility

3. **Phase 3: Update filters**
   - Add new location-based filter UI
   - Update filter logic to use FIPS codes
   - Maintain state-based filter using `statesFips`

4. **Phase 4: Deprecate old field**
   - Mark `nativeRange` as deprecated in types
   - Remove from new data files
   - Update documentation

## Implementation Checklist

- [ ] Update `Plant` interface in `src/types/Plant.ts`
- [ ] Create `PlantDistribution` interface
- [ ] Update `PlantFilters` interface with location-based filters
- [ ] Create utility functions for FIPS code operations
- [ ] Generate ZIP-to-FIPS mapping file
- [ ] Update data loading to support distribution files
- [ ] Add geocoding service integration
- [ ] Update filter UI for location input
- [ ] Update filter logic to use FIPS codes
- [ ] Migrate existing plant data to new format
- [ ] Update locale files with plant translations
- [ ] Update documentation
- [ ] Add data validation utilities
- [ ] Write tests for new functionality

## Performance Considerations

### Data Size

- **State-based (old):** ~100 bytes per plant for nativeRange
- **FIPS-based (new):** ~200-500 bytes per plant for detailed distribution
- **Optimization:** Use external distribution files for widespread plants
- **Compression:** Enable gzip compression on JSON files

### Filter Performance

- **FIPS code lookups:** O(n) where n = number of FIPS codes per plant
- **Optimization:** Pre-compute state FIPS for faster state-level queries
- **Caching:** Cache geocoding results in session storage
- **Indexing:** Consider pre-indexing plants by state/county for faster lookup

### Load Time

- **Lazy loading:** Load distribution data only when needed
- **Progressive enhancement:** Show state-level results immediately, refine to county-level
- **Service worker:** Cache distribution data for offline use

## References

- [USDA PLANTS Database](https://plants.usda.gov/)
- [US Census Bureau FIPS Codes](https://www.census.gov/library/reference/code-lists/ansi.html)
- [Census Geocoding Services](https://geocoding.geo.census.gov/)
- [iNaturalist API Documentation](https://api.inaturalist.org/v1/docs/)
- [i18next Documentation](https://www.i18next.com/)

## Change Log

### Version 2.0 (Current)
- Added `PlantDistribution` interface with FIPS codes
- Replaced state-based `nativeRange` with county-level distribution
- Added localization strategy for common names and descriptions
- Defined data minimization approach
- Added address-based filtering specification
- Documented migration path from v1.x

### Version 1.x (Legacy)
- State-based native range using state names
- No localization support for plant data
- Basic filter functionality
