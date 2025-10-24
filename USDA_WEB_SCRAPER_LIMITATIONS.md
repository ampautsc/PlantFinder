# USDA Web Scraper Implementation and Limitations

## What Was Implemented

Created a **real web scraper** (`scripts/fetch_usda_data.py`) that:
- ✅ Makes actual HTTP requests to USDA Plants Database
- ✅ Fetches plant profile HTML pages
- ✅ Downloads Plant Guide PDFs (comprehensive data source)
- ✅ Downloads Fact Sheet PDFs (when available)
- ✅ Stores raw data in original format (not transformed)
- ✅ Saves metadata JSON with URLs, timestamps, file sizes
- ✅ Supports batch processing (multiple plants at once)
- ✅ Includes rate limiting to respect USDA servers

## Critical Limitations

### 1. USDA Does NOT Provide a Public REST API

**Tested endpoints - all returned 404:**
- `https://plants.usda.gov/api/plants/ASSY`
- `https://plants.usda.gov/api/plant/ASSY`
- `https://plants.usda.gov/api/species/ASSY`

There is no programmatic API for querying or searching plants.

### 2. Cannot Search by Scientific Name

**Problem:** The scraper requires USDA plant symbols (e.g., "ASSY" for Asclepias syriaca).

**Why:** USDA's search functionality is implemented in their JavaScript UI, not accessible via HTTP requests.

**Impact:** We cannot automatically look up USDA symbols for our 358 plant species. Each symbol must be provided manually.

### 3. HTML Pages are JavaScript-Rendered

**Problem:** Plant data is loaded dynamically via JavaScript, not in the HTML source.

**What we can extract from HTML:**
- ❌ Plant characteristics (height, bloom time, etc.)
- ❌ Distribution maps
- ❌ Associated species
- ❌ Growth requirements
- ✅ Only: Page title and meta description

**What this means:** The HTML fetch provides minimal usable data.

### 4. PDFs Contain the Most Data

**Plant Guide PDFs** (e.g., 105 KB for Common Milkweed) contain:
- ✅ Comprehensive plant information
- ✅ Growing requirements
- ✅ Wildlife value
- ✅ Distribution information
- ✅ Propagation details

**But:** Extracting this data requires PDF parsing (not yet implemented).

## What IS Being Fetched (Currently)

For each USDA symbol provided:

1. **Plant Profile HTML Page**
   - URL: `https://plants.usda.gov/home/plantProfile?symbol=ASSY`
   - Status: Fetched successfully
   - Extractable data: Minimal (title only)
   - Storage: Metadata only (HTML not stored to save space)

2. **Plant Guide PDF** (when available)
   - URL: `https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_assy.pdf`
   - Status: Downloaded (105 KB for Common Milkweed)
   - Content: Comprehensive plant information
   - Storage: Saved as separate file (gitignored)
   - **Requires PDF parsing to extract structured data**

3. **Fact Sheet PDF** (when available)
   - URL: `https://plants.usda.gov/DocumentLibrary/factsheet/pdf/fs_assy.pdf`
   - Status: Not available for all plants
   - Content: Brief summary when available
   - Storage: Saved as separate file (gitignored)

## Example: What We Got for Common Milkweed (ASSY)

### JSON Metadata (`usda-assy.json`)
```json
{
  "scraped_at": "2025-10-24T17:22:28.331071+00:00",
  "scraper_version": "1.0.0",
  "source": "usda",
  "usda_symbol": "ASSY",
  "data": {
    "profile": {
      "title": "USDA Plants Database",
      "note": "JavaScript-rendered - limited extraction"
    }
  },
  "raw_data": {
    "profile_page": {
      "url": "https://plants.usda.gov/home/plantProfile?symbol=ASSY",
      "status_code": 200,
      "html_length": 7611
    },
    "plant_guide_pdf": {
      "url": "https://plants.usda.gov/.../cs_assy.pdf",
      "size_bytes": 106814,
      "stored_at": "src/data/usda/usda-assy-plantguide.pdf"
    }
  }
}
```

### Downloaded Files
- `usda-assy.json` - Metadata (1.1 KB)
- `usda-assy-plantguide.pdf` - Plant Guide PDF (105 KB) - **Contains actual data**

## Why We Can't "Just Fetch All Flowers"

### Problem 1: No USDA Symbols in Our Database

Our 358 plant files in `public/data/plants/` contain:
- Scientific names (e.g., "Asclepias syriaca")
- Common names (e.g., "Common Milkweed")
- **But NOT USDA symbols** (e.g., "ASSY")

### Problem 2: No Way to Look Up Symbols Automatically

Since USDA doesn't provide a search API:
- Cannot query "What is the symbol for Asclepias syriaca?"
- Must manually look up each plant on USDA website
- Or maintain a manual mapping file

### Problem 3: Not All Plants Are in USDA Database

USDA Plants Database focuses on:
- Native North American plants
- Plants with conservation/agricultural significance
- Common naturalized species

Many ornamental or non-native plants may not have USDA records.

## What Would Be Needed to Fetch "All Flowers"

### Option A: Manual Symbol Mapping (Most Realistic)

1. **Create mapping file** of scientific name → USDA symbol
2. **Manually look up** symbols on USDA website for our 358 plants
3. **Run batch fetch** with all symbols
4. **Implement PDF parsing** to extract structured data

**Effort:** ~2-4 hours of manual lookups + PDF parser implementation

### Option B: Browser Automation (More Complete but Complex)

1. **Implement Playwright/Selenium** to render JavaScript
2. **Automate search** by scientific name on USDA website
3. **Extract symbols** from search results
4. **Scrape rendered page** for structured data
5. **Download PDFs** as backup

**Effort:** ~8-16 hours of development + testing

### Option C: Hybrid Approach (Recommended)

1. **Start with known symbols** (e.g., milkweeds, common natives)
2. **Implement PDF parser** to extract structured data from downloaded PDFs
3. **Gradually build mapping** as plants are looked up
4. **Consider browser automation** only if PDF parsing insufficient

**Effort:** Incremental, start small and expand

## Current Status

### ✅ What Works Now
- Web scraper makes real HTTP requests to USDA
- Downloads PDFs successfully
- Stores raw data in original format
- Can process multiple plants if symbols provided
- Respects rate limiting

### ⚠️ What's Limited
- HTML parsing extracts minimal data (JavaScript rendering)
- Requires manual USDA symbol lookup
- No PDF parsing yet (PDFs contain most data)
- No automated scientific name → symbol lookup

### ❌ What's Not Possible (Without Browser Automation)
- Cannot search USDA by scientific name via HTTP
- Cannot extract structured data from JavaScript-rendered pages
- Cannot automatically find USDA symbols for all plants

## Next Steps Recommendations

1. **Immediate (Low Effort)**
   - Document USDA symbols for high-priority plants (milkweeds, monarchs hosts)
   - Run scraper for those plants
   - Review downloaded PDFs to confirm data availability

2. **Short Term (Medium Effort)**
   - Implement PDF parsing using `pdfplumber` or similar
   - Extract structured data from Plant Guide PDFs
   - Transform to PlantFinder schema

3. **Long Term (High Effort)**
   - Consider browser automation if needed
   - Build comprehensive scientific name → USDA symbol mapping
   - Automated batch updates via GitHub Actions

## Conclusion

The web scraper now makes **real HTTP requests** and fetches **actual data from USDA** in its **original format**. However, due to USDA's lack of a public API and JavaScript-rendered pages, the primary data source is the **Plant Guide PDFs**, which require parsing to extract structured information.

To fetch data for "all flowers," we need:
1. USDA symbols for our plants (manual lookup or existing reference)
2. PDF parsing implementation
3. Or browser automation for full extraction

The current implementation provides the foundation for USDA data fetching, but **cannot automatically process all 358 plants without USDA symbols or additional development**.
