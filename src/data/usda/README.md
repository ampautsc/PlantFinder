# USDA Plants Database Data Store

This directory contains plant data sourced from the USDA Plants Database (https://plants.usda.gov/). The data is stored in its raw/source form with minimal processing, following a consistent structure.

## Purpose

This is a **source data store** that:
- Preserves data from USDA in a structured format
- Can be updated via batch jobs or GitHub Actions
- Serves as input for selective extraction into deployment packages
- Maintains data lineage and traceability
- Supports merging with data from other sources (iNaturalist, etc.)

## File Naming Convention

- Format: `usda-{SYMBOL}.json`
- Where `{SYMBOL}` is the USDA plant symbol (e.g., ASSY for Asclepias syriaca)
- All lowercase
- Examples:
  - `usda-assy.json` - Common Milkweed (Asclepias syriaca)
  - `usda-astu.json` - Butterfly Weed (Asclepias tuberosa)

## Data Structure

Each USDA data file follows this structure:

```json
{
  "scraped_at": "ISO 8601 timestamp",
  "scraper_version": "1.0.0",
  "source": "usda",
  "usda_symbol": "ASSY",
  "plant_data": {
    // Standard fields matching PlantFinder data model
    "commonName": "...",
    "scientificName": "...",
    "family": "...",
    "description": "...",
    "requirements": { ... },
    "characteristics": { ... },
    "relationships": { ... },
    "toxicity": { ... },
    "propagation": { ... },
    "management": { ... },
    "ethnobotanicUses": [ ... ],
    "companionPlants": [ ... ]
  },
  "extra": {
    // USDA-specific or non-standard fields that don't fit the standard model
    "usdaGrowthForm": "...",
    "temperatureMinimum_F": ...,
    "physicalCharacteristics": { ... },
    "habitatTypes": [ ... ],
    // ... any other USDA-specific data
  },
  "metadata": {
    "source": "usda",
    "usdaSymbol": "ASSY",
    "dataCollectionMethod": "...",
    "primaryReferences": [ ... ],
    "lastUpdated": "ISO 8601 timestamp",
    "dataQuality": "high|medium|low",
    "completeness": "comprehensive|partial|minimal"
  }
}
```

## Data Sections

### `plant_data`
Contains standard fields that map to the PlantFinder data model:

- **Basic Info**: commonName, scientificName, family, description
- **Requirements**: sun, moisture, soil, pH range, tolerances (drought, shade, flood, fire, salinity)
- **Characteristics**: height, width, bloom colors/time, growth habit/rate, native range, hardiness zones
- **Relationships**: host plants, food sources, wildlife value, garden uses
- **Safety**: toxicity information for livestock, pets, humans
- **Propagation**: methods, difficulty, seed information
- **Management**: maintenance level, invasiveness, establishment
- **Cultural**: ethnobotanic uses
- **Ecology**: companion plants, plant communities

### `extra`
Contains USDA-specific data or fields that don't fit the standard model:

- Detailed physical characteristics (leaf, flower, fruit, root descriptions)
- USDA-specific classifications and terminology
- Precise environmental ranges (temperature, precipitation)
- Wildlife details beyond standard categories
- Habitat types and associations
- Commercial product information
- Any other USDA-specific metadata

This allows preserving all USDA data without forcing it into a predefined schema.

### `metadata`
Contains information about the data itself:

- Source and collection method
- References to original USDA resources
- Data quality and completeness assessments
- Timestamps for tracking updates

## Data Collection Methods

Since USDA Plants Database doesn't provide a public API, data is collected through:

1. **Manual Extraction** - For high-priority species
   - Review USDA plant profile pages
   - Extract data from Plant Guide PDFs
   - Extract data from Fact Sheet PDFs
   
2. **Web Scraping** - For bulk updates (future)
   - Use browser automation (Playwright/Selenium)
   - Parse JavaScript-rendered pages
   - Extract structured data

3. **PDF Parsing** - For detailed information (future)
   - Download Plant Guide and Fact Sheet PDFs
   - Extract text and structured data
   - OCR if needed for older documents

## Usage

### Adding New Plants

Run the fetch script:

```bash
python3 scripts/fetch_usda_data.py
```

Currently, the script contains manually-curated data. In the future, it can be extended to:
- Accept command-line arguments for specific plants
- Scrape data from USDA website automatically
- Parse PDF documents for additional details

### Updating Existing Plants

Re-run the fetch script for the specific plant. The `scraped_at` and `lastUpdated` timestamps will be updated.

### Integration with PlantFinder

This data store is **not directly used** by the PlantFinder application. Instead:

1. **Source Data** (this directory) - Raw data from USDA, preserved in full
2. **Transformation** - Selective extraction and merging with other sources
3. **Deployment Package** - Optimized subset in `public/data/plants/`

This allows:
- Keeping complete source data for reference
- Updating source data independently
- Creating optimized deployment packages
- Merging multiple data sources intelligently

## Data Quality

### High Quality
- Manually reviewed and curated
- Cross-referenced with USDA resources
- All major fields populated
- Includes comprehensive extra data

### Medium Quality
- Programmatically extracted
- Basic validation performed
- Some fields may be missing
- Limited extra data

### Low Quality
- Automated extraction only
- Minimal validation
- Many missing fields
- No extra data

## References

- USDA Plants Database: https://plants.usda.gov/
- Plant Profile Pages: https://plants.usda.gov/home/plantProfile?symbol={SYMBOL}
- Plant Guides: https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_{symbol}.pdf
- Fact Sheets: https://plants.usda.gov/DocumentLibrary/factsheet/pdf/fs_{symbol}.pdf

## Maintenance

This data store should be updated:
- When new plants are added to PlantFinder
- When USDA updates plant information
- When data quality issues are identified
- Periodically via automated batch jobs (future)

## See Also

- `src/data/inaturalist/` - iNaturalist data store (similar structure)
- `public/data/plants/` - Deployment plant data (optimized subset)
- `scripts/fetch_usda_data.py` - USDA data fetcher script
- `USDA_COMMON_MILKWEED_RESEARCH.md` - Research documentation
