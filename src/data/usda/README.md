# USDA Plants Database Data Store

This directory contains plant data sourced from the USDA Plants Database (https://plants.usda.gov/). The data is stored in its raw/source form with minimal processing, following a consistent structure.

## Purpose

This is a **source data store** that:
- Fetches and preserves raw data from USDA in original format
- Makes actual HTTP requests to USDA website (not hardcoded data)
- Downloads PDFs for offline processing
- Can be updated via batch jobs or GitHub Actions
- Serves as input for future data extraction and transformation
- Maintains data lineage and traceability

## Important Limitations

**USDA Plants Database does NOT provide a public REST API**

The current scraper has these limitations:
1. **HTML Pages are JavaScript-rendered**: Most plant data is loaded dynamically and not available in the raw HTML
2. **Limited HTML Parsing**: Only page title and meta tags can be extracted from HTML
3. **PDFs are Main Data Source**: Plant Guide PDFs contain the most comprehensive data
4. **Manual USDA Symbols Needed**: Cannot search by scientific name - must provide USDA symbols
5. **Browser Automation Needed for Full Data**: Complete extraction requires Playwright/Selenium

### What IS Fetched
- ✅ Plant profile HTML page (limited data extractable)
- ✅ Plant Guide PDF (comprehensive data, needs PDF parsing)
- ✅ Fact Sheet PDF (brief data, when available)
- ✅ Metadata about all fetches (URLs, timestamps, file sizes)

### What IS NOT Fetched (Yet)
- ❌ Structured plant data from JavaScript-rendered pages
- ❌ Parsed/extracted content from PDFs
- ❌ Plant characteristics tables
- ❌ Distribution maps
- ❌ Associated species data

## File Naming Convention

- Format: `usda-{SYMBOL}.json`
- Where `{SYMBOL}` is the USDA plant symbol (e.g., ASSY for Asclepias syriaca)
- All lowercase
- Examples:
  - `usda-assy.json` - Common Milkweed (Asclepias syriaca)
  - `usda-astu.json` - Butterfly Weed (Asclepias tuberosa)

## Data Structure

Each USDA data file contains fetched metadata and references to raw data:

```json
{
  "scraped_at": "ISO 8601 timestamp",
  "scraper_version": "1.0.0",
  "source": "usda",
  "usda_symbol": "ASSY",
  "data": {
    // Parsed/extracted data (limited without browser automation)
    "profile": {
      "title": "...",
      "meta_description": "...",
      "note": "..."
    }
  },
  "raw_data": {
    // References to raw data files
    "profile_page": {
      "url": "https://plants.usda.gov/home/plantProfile?symbol=ASSY",
      "fetched_at": "timestamp",
      "status_code": 200,
      "html_length": 7611,
      "html_stored": false,
      "note": "Full HTML not stored in JSON"
    },
    "plant_guide_pdf": {
      "url": "https://plants.usda.gov/DocumentLibrary/...",
      "size_bytes": 106814,
      "stored_at": "src/data/usda/usda-assy-plantguide.pdf",
      "note": "PDF stored separately, use PDF parser to extract"
    },
    "fact_sheet_pdf": {
      // Similar structure if available
    }
  }
}
```

**Note**: Raw data is stored in original format (HTML, PDF) to avoid data loss during transformation. Future processing can extract structured data from these files.

## Data Sections

The JSON file contains two main sections:

### `data`
Contains any parsed/extracted data from the HTML (limited without browser automation):
- Page title
- Meta description (if available)
- Notes about extraction limitations

### `raw_data`
Contains metadata about the raw files that were downloaded:
- **profile_page**: Information about the HTML page fetch
- **plant_guide_pdf**: Information about the Plant Guide PDF (if available)
- **fact_sheet_pdf**: Information about the Fact Sheet PDF (if available)

Each entry includes:
- URL of the source
- Fetch timestamp
- File size and storage location
- Notes about the data format and extraction recommendations

## Data Collection Methods

Since USDA Plants Database doesn't provide a public API, data is collected through:

1. **Web Scraping** - Using `scripts/fetch_usda_data.py`
   - Fetches plant profile HTML pages
   - Downloads Plant Guide PDFs (when available)
   - Downloads Fact Sheet PDFs (when available)
   - Stores raw data in original format
   
2. **PDF Parsing** - For detailed information (future enhancement)
   - Plant Guide PDFs are already downloaded
   - Can extract text and structured data using PDF parsing libraries
   - Would provide most comprehensive data
   
3. **Browser Automation** - For full data extraction (future enhancement)
   - USDA pages are JavaScript-rendered
   - Current scraper gets limited HTML data
   - Full extraction would require Playwright/Selenium

## Usage

### Adding New Plants

Run the fetch script with USDA plant symbols:

```bash
# Fetch single plant
python3 scripts/fetch_usda_data.py ASSY

# Fetch multiple plants
python3 scripts/fetch_usda_data.py ASSY ASTU ECPU

# Specify custom output directory
python3 scripts/fetch_usda_data.py ASSY --output-dir data/usda

# Quiet mode (suppress output)
python3 scripts/fetch_usda_data.py ASSY --quiet
```

The script will:
1. Fetch the plant profile HTML page
2. Download Plant Guide PDF (if available)
3. Download Fact Sheet PDF (if available)
4. Save metadata JSON file with fetch information
5. Store PDFs separately for later parsing

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

The current implementation:

### Raw Data Quality: High
- ✅ Authentic HTTP requests to USDA
- ✅ PDFs downloaded directly from source
- ✅ Timestamps and metadata tracked
- ✅ Original format preserved

### Extracted Data Quality: Low (Currently)
- ⚠️ HTML parsing extracts minimal data
- ⚠️ PDF content not yet parsed
- ⚠️ No structured plant characteristics yet
- ⚠️ Browser automation not implemented

### Future Improvements Needed
1. **PDF Parsing**: Extract structured data from Plant Guide PDFs
2. **Browser Automation**: Use Playwright/Selenium for JavaScript-rendered content
3. **Data Transformation**: Convert extracted data to PlantFinder schema
4. **Quality Validation**: Cross-reference with other sources

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
