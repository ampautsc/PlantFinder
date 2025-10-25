# Batch USDA Data Fetch Results

## Summary

Successfully fetched USDA Plants Database data for **all 352 PlantFinder plants** that have USDA Plant IDs.

**Execution Date:** 2025-10-24  
**Duration:** ~18 minutes  
**Success Rate:** 100% (341 new + 11 existing)

## Results

### Total Data Fetched
- **345 JSON metadata files** - References to fetched data with URLs and timestamps
- **61 PDFs downloaded** - Plant Guides and Fact Sheets
  - 28 Plant Guide PDFs
  - 33 Fact Sheet PDFs
- **406 total files** (plus README)

### Fetch Statistics
- Total plants processed: 352
- Successfully fetched: 341 (96.9%)
- Skipped (already existed): 11 (3.1%)
- Failed: 0 (0%)

## Data Storage

All fetched data is stored in `src/data/usda/`:

```
src/data/usda/
├── README.md                           # Documentation
├── usda-{symbol}.json                  # Metadata for each plant (345 files)
├── usda-{symbol}-plantguide.pdf        # Plant Guide PDFs (28 files)
└── usda-{symbol}-factsheet.pdf         # Fact Sheet PDFs (33 files)
```

**Note:** PDF files and JSON metadata files are gitignored and NOT committed to source control. Only the batch script itself is tracked.

## Sample USDA Symbols Fetched

Here are some examples of plants that were fetched:

- ASSY - Asclepias syriaca (Common Milkweed)
- ASTU - Asclepias tuberosa (Butterfly Weed)
- ASIN - Asclepias incarnata (Swamp Milkweed)
- ACMIP2 - Achillea millefolium (Common Yarrow)
- ECPU - Echinacea purpurea (Purple Coneflower)
- RHIR4 - Rudbeckia hirta (Black-eyed Susan)
- And 346 more...

## PDFs Downloaded

61 plants had downloadable PDFs:

### Plant Guide PDFs (28 plants)
Plant Guides contain comprehensive information including:
- Detailed plant descriptions
- Growing requirements and conditions
- Wildlife value and ecological relationships
- Propagation methods
- Distribution information
- Ethnobotanic uses
- Management recommendations

Examples with Plant Guides:
- AECA - Aesculus californica
- APAM - Apocynum androsaemifolium  
- APCA - Apocynum cannabinum
- ARDO3 - Arctostaphylos uva-ursi
- And 24 more...

### Fact Sheet PDFs (33 plants)
Fact Sheets provide brief summaries of plant characteristics.

## Data Format

Each JSON metadata file contains:

```json
{
  "scraped_at": "ISO timestamp",
  "scraper_version": "1.0.0",
  "source": "usda",
  "usda_symbol": "ASSY",
  "data": {
    "profile": {
      "title": "Page title",
      "note": "JavaScript-rendered pages have limited extraction"
    }
  },
  "raw_data": {
    "profile_page": {
      "url": "https://plants.usda.gov/home/plantProfile?symbol=ASSY",
      "fetched_at": "timestamp",
      "status_code": 200,
      "html_length": 7611
    },
    "plant_guide_pdf": {
      "url": "PDF download URL",
      "size_bytes": 106814,
      "stored_at": "src/data/usda/usda-assy-plantguide.pdf"
    }
  }
}
```

## Key Findings

### PDF Availability
- Only 17% of plants (61/352) have downloadable PDFs
- 28 plants have comprehensive Plant Guide PDFs
- 33 plants have brief Fact Sheet PDFs
- Most plants (291/352 = 83%) only have JavaScript-rendered profile pages

### Data Extraction Challenges
1. **JavaScript-rendered pages** - Most plant data is loaded dynamically and not in raw HTML
2. **Limited PDF coverage** - Only 17% of plants have downloadable comprehensive documentation
3. **Structured data extraction needed** - PDFs require parsing to extract usable plant data
4. **Browser automation recommended** - For full data extraction from the remaining 83% of plants

## Next Steps

### Immediate
- ✅ Batch fetch completed for all 352 plants
- ✅ Raw data stored in original format
- ✅ Metadata JSON tracks what was fetched

### Short Term
1. **PDF Parsing** - Implement parser to extract structured data from the 61 PDFs
2. **Browser Automation** - Use Playwright/Selenium to scrape JavaScript-rendered pages
3. **Data Transformation** - Convert extracted USDA data to PlantFinder schema

### Long Term
1. **Automated Updates** - Set up GitHub Actions to periodically refresh USDA data
2. **Data Merging** - Combine USDA data with iNaturalist and other sources
3. **Deployment Package** - Selective extraction for production use

## Usage

To re-fetch or update data:

```bash
# Fetch all plants
python3 scripts/batch_fetch_usda_data.py --yes

# Fetch with confirmation prompt
python3 scripts/batch_fetch_usda_data.py

# Fetch limited number for testing
python3 scripts/batch_fetch_usda_data.py --yes --limit 10
```

The script automatically:
- Skips already-fetched plants (resume capability)
- Includes rate limiting (2 second delays between requests)
- Stores data in original format
- Provides progress indicators

## Storage Size

Approximate storage footprint:
- JSON metadata files: ~400 KB (345 files @ ~1 KB each)
- Plant Guide PDFs: ~3.5 MB (28 PDFs @ ~100-150 KB each)
- Fact Sheet PDFs: ~2.5 MB (33 PDFs @ ~70-90 KB each)
- **Total: ~6.4 MB**

All data files are gitignored and not committed to the repository.

## Conclusion

Successfully fetched raw USDA data for all 352 PlantFinder plants in their original format. The data is ready for:
1. PDF parsing to extract comprehensive plant information (61 plants)
2. Browser automation for JavaScript page scraping (291 plants)
3. Transformation into PlantFinder schema
4. Merging with other data sources

The batch fetch script provides a solid foundation for automated USDA data updates via GitHub Actions.
