# Scripts

This directory contains batch job scripts for the PlantFinder application.

## Wildflower Data Scraper

### Overview

The `fetch_wildflower_data.py` script is a batch job that scrapes plant data from the [Lady Bird Johnson Wildflower Center](https://www.wildflower.org/) database. The script:

1. **Fetches all collection pages** (with pagination support) to find individual plant links
2. **Parses HTML** to extract plant URLs from the collection pages
3. **Scrapes individual plant pages** to get detailed plant data
4. **Saves raw JSON** for each plant in source control

### Features

- **Pagination Support**: Automatically fetches all pages using start/pagecount parameters, detecting total results and iterating through all pages
- **HTML Parsing**: Extracts plant links from collection pages and data from plant detail pages
- **Source Control Storage**: Saves data in `src/data/wildflower-org/` (not in gitignored `data/` folder)
- **URL-Specific Folder**: Creates a folder specific to the wildflower.org source URL
- **Individual Plant Files**: Each plant gets its own JSON file named by plant ID
- **Timestamped Logs**: All operations are logged with timestamps
- **Rate Limiting**: Includes delays between requests to be respectful to the server
- **Test Mode**: Can use mock data when the website blocks requests
- **Error Handling**: Properly handles HTTP errors, timeouts, and connection issues

### Usage

#### Manual Execution

Run the script manually from the repository root:

```bash
# Normal mode - scrapes live data from website
python3 scripts/fetch_wildflower_data.py

# Test mode - uses mock data for development/testing
python3 scripts/fetch_wildflower_data.py --test
```

#### Automated Execution

The script runs automatically via GitHub Actions workflow:
- **Schedule**: Daily at 2:00 AM UTC
- **Workflow File**: `.github/workflows/fetch-wildflower-data.yml`
- **Manual Trigger**: Can be triggered manually from the Actions tab

### Output

The script creates the following output in the `src/data/wildflower-org/` directory:

1. **Plant JSON files**: Individual JSON files for each scraped plant (e.g., `asclepias-tuberosa.json`)
2. **fetch_log.txt**: Timestamped log of all fetch attempts and results

All files are stored in source control for versioning and collaboration.

### Data Format

Each plant JSON file contains:

```json
{
  "source_url": "URL of the plant detail page",
  "scraped_at": "ISO timestamp when scraped",
  "plant_data": {
    "raw_html": "Snippet of raw HTML for reference",
    "extracted_at": "ISO timestamp of extraction",
    "scientificName": "Scientific name",
    "commonName": "Common name",
    ...additional extracted fields...
  }
}
```

### Error Handling

The script handles various error scenarios:

- **HTTP Errors**: Logs specific HTTP error codes (e.g., 403 Forbidden, 404 Not Found)
- **Network Errors**: Catches URL errors and connection failures
- **Timeouts**: 30-second timeout with appropriate error messaging
- **Unexpected Errors**: Generic exception handling for unforeseen issues
- **Website Blocking**: Provides helpful suggestions and test mode option

### Exit Codes

- `0`: Success - Data fetched and saved successfully
- `1`: Failure - Request failed due to error or restriction

### Example Output

#### Test Mode (Mock Data)
```
======================================================================
Wildflower.org Data Scraper - Batch Job (TEST MODE)
======================================================================
Started at: 2025-10-16 16:40:49

✓ Output directory ready: src/data/wildflower-org
[2025-10-16 16:40:49] Batch job started (test mode)
🧪 TEST MODE: Using mock data
✓ Mock data loaded
✓ Found 3 plant links in test data

Processing 3 plants...

[1/3]
  🧪 Fetching test plant: /plant.php?id=asclepias-tuberosa
  ✓ Successfully loaded test plant data
[2025-10-16 16:40:49] Saved plant data: asclepias-tuberosa.json

...

✓ Successfully processed 3 plants
======================================================================
✓ Batch job completed successfully
```

#### Normal Mode (Website Blocked)
```
======================================================================
Wildflower.org Data Scraper - Batch Job
======================================================================
Started at: 2025-10-16 16:39:13

✓ Output directory ready: src/data/wildflower-org
[2025-10-16 16:39:13] Batch job started (normal mode)
Attempting to fetch collection page from: https://www.wildflower.org/collections/collection.php?all=true
✗ Failed to fetch collection page (Status: 403)

======================================================================
✗ Batch job completed with errors

Note: If the website is blocking requests, you may need to:
  1. Use a different data source
  2. Request API access from the website
  3. Manually download and provide HTML files for parsing
  4. Use --test flag to test with mock data
```

### Configuration

Key configuration constants in the script:

- `COLLECTION_NAME`: The collection to fetch (default: `"bamona"` - Butterflies and Moths of North America)
- `PAGECOUNT`: Number of results per page (default: `100`) - configurable for flexibility in pagination
- `TARGET_URL`: The collection page URL to scrape (constructed from `COLLECTION_NAME` and `PAGECOUNT`)
- `BASE_URL`: Base URL for resolving relative plant page links
- `OUTPUT_DIR`: Directory where data is saved (`src/data/wildflower-org`)
- `TIMEOUT`: Request timeout in seconds (30)

#### Pagination Configuration

The scraper uses manual pagination with `start` and `pagecount` parameters:

```python
# Example URLs generated by the scraper:
# Page 1: https://www.wildflower.org/collections/collection.php?start=0&collection=bamona&pagecount=100
# Page 2: https://www.wildflower.org/collections/collection.php?start=100&collection=bamona&pagecount=100
# Page 3: https://www.wildflower.org/collections/collection.php?start=200&collection=bamona&pagecount=100
```

The scraper will:
1. Extract the total number of results from the first page
2. Calculate how many pages are needed based on `PAGECOUNT`
3. Fetch each page sequentially until all results are retrieved
4. Stop when no new plant links are found or all results are fetched

### Notes

- The script uses a custom User-Agent to identify itself as the PlantFinder batch job
- Some websites may block automated requests, resulting in 403 Forbidden errors
- The script includes rate limiting (0.5 second delay) between plant requests
- Test mode is useful for development when the website blocks requests
- Data is stored in source control for collaboration and versioning
- Results are uploaded as GitHub Actions artifacts for review (retained for 30 days)
