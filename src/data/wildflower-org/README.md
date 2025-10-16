# Wildflower.org Plant Data

This directory contains comprehensive plant data scraped from [wildflower.org](https://www.wildflower.org/).

## Overview

The batch job script (`scripts/fetch_wildflower_data.py`) scrapes plant data from wildflower.org's collection and saves individual plant records as JSON files in this directory. The scraper extracts **all available data fields** according to the comprehensive data model defined in `WILDFLOWER_DATA_MODEL.md`.

## Directory Structure

- **Plant JSON files**: Each file contains data for a single plant, named by plant ID (e.g., `asclepias-tuberosa.json`)
- **fetch_log.txt**: Log file tracking all scraping operations with timestamps

## Data Format

Each plant JSON file follows the comprehensive data model with the following structure:

```json
{
  "source_url": "URL of the plant detail page",
  "scraped_at": "ISO timestamp of when data was scraped",
  "scraper_version": "2.0.0",
  "plant_data": {
    "raw_html": "Snippet of the raw HTML for reference",
    "extracted_at": "ISO timestamp of extraction",
    
    // Basic Identification
    "scientificName": "Scientific name",
    "commonName": "Common name",
    "family": "Plant family",
    
    // Physical Characteristics
    "characteristics": {
      "height": { "min": 12, "max": 36, "unit": "inches" },
      "bloomColor": ["Orange", "Yellow"],
      "bloomPeriod": ["Summer", "Early Fall"],
      "lifespan": "perennial"
    },
    
    // Growing Requirements
    "requirements": {
      "light": { "full_sun": true, "partial_sun": true },
      "moisture": { "dry": true, "droughtTolerant": true },
      "soil": { "types": ["sand", "loam", "rocky"] },
      "hardiness": { "zones": ["3", "4", "5", "6", "7", "8", "9"] }
    },
    
    // Geographic Information
    "distribution": {
      "nativeRange": ["Nebraska", "Oklahoma", "Texas", "Kansas"]
    },
    
    // Ecological Relationships
    "ecology": {
      "pollinators": ["bees", "butterflies", "hummingbirds"],
      "hostPlantFor": ["Monarch Butterfly"],
      "foodFor": ["birds"],
      "suitableFor": ["pollinator garden", "xeriscaping", "native garden"]
    }
  }
}
```

## Comprehensive Data Model

The scraper now extracts all available fields according to the comprehensive data model:

### Fields Extracted

1. **Basic Identification**
   - Scientific name, common name, family, genus, species

2. **Physical Characteristics**
   - Height (min/max range)
   - Bloom colors (multiple colors)
   - Bloom periods (spring, summer, fall)
   - Lifespan (annual, biennial, perennial)
   - Growth rate and form
   - Foliage and fruit details

3. **Growing Requirements**
   - Light requirements (full sun to full shade)
   - Moisture needs (dry to wet, drought tolerance)
   - Soil types (sand, loam, clay, rocky, etc.)
   - Hardiness zones (USDA zones)

4. **Geographic Information**
   - Native range (states and regions)
   - Natural habitat types
   - Invasive status

5. **Ecological Relationships**
   - Pollinators attracted
   - Host plant relationships
   - Wildlife food value
   - Landscape uses
   - Conservation status

See `WILDFLOWER_DATA_MODEL.md` in the root directory for complete documentation.

## Usage

### Run the scraper normally (live data from website):
```bash
python3 scripts/fetch_wildflower_data.py
```

### Run the scraper in test mode (uses mock data):
```bash
python3 scripts/fetch_wildflower_data.py --test
```

## Data Transformation

The scraped data can be transformed to the application's `Plant` interface using the utility function:

```typescript
import { transformWildflowerOrgToPlant } from '../utils/wildflowerOrgTransform';

// Load scraped data
const scrapedData = await import('./asclepias-tuberosa.json');

// Transform to Plant interface
const plant = transformWildflowerOrgToPlant(scrapedData);
```

## Scraper Version History

- **v2.0.0**: Comprehensive data extraction - extracts all available fields according to WildflowerOrgPlantData model
- **v1.0.0**: Initial implementation - extracted only basic fields (scientific name, common name)

## Notes

- The data is stored in source control for versioning and collaboration
- The batch job limits fetches to prevent overwhelming the source website
- If the website blocks requests (403 Forbidden), use test mode for development
- The log file tracks all operations for debugging and monitoring
- All extracted data follows the comprehensive data model defined in `src/types/WildflowerOrgData.ts`
