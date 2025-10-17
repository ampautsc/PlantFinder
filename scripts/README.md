# Scripts

This directory contains batch job scripts for the PlantFinder application.

## Table of Contents

1. [Plant Image Fetcher](#plant-image-fetcher) - Downloads plant images from Wikipedia
2. [Wildflower Data Scraper](#wildflower-data-scraper) - Scrapes plant data from wildflower.org

---

## Plant Image Fetcher

**⚠️ Updated**: Now includes iNaturalist fallback support and automatic image optimization (resizing + compression) for better performance!

### Overview

The `fetch_plant_images.py` script is a batch job that downloads plant images from Wikipedia/Wikimedia Commons and iNaturalist. The script:

1. **Identifies plants without images** by scanning `src/data/Plants/` for JSON files missing `imageUrl`
2. **Searches Wikipedia** for high-quality images using both scientific and common names
3. **Falls back to iNaturalist** if Wikipedia doesn't have images
4. **Optimizes images** by resizing and compressing to reduce file size
5. **Downloads images** to the appropriate `public/images/plants/{plant-id}/` directory
6. **Updates plant JSON files** with the `imageUrl` field
7. **Skips plants** that already have images

### Features

- **Multi-Source Integration**: Queries Wikipedia API first, then falls back to iNaturalist API
- **Smart Search**: Tries both scientific and common plant names on each source
- **Image Optimization**: Resizes images to max 1200x1200px and compresses to JPEG (typically 70-90% file size reduction)
- **High-Quality Images**: Prefers full-size images over thumbnails
- **Automatic Directory Creation**: Creates plant-specific folders as needed
- **JSON Updates**: Automatically updates plant data files with image URLs
- **Skip Existing**: Won't re-download images for plants that already have them
- **Rate Limiting**: Respectful delays between requests
- **Test Mode**: Dry run mode for testing without downloads
- **Batch Limiting**: Can limit number of images per run to avoid rate limits
- **Detailed Logging**: Timestamped logs of all operations with file size metrics

### Image Optimization

All downloaded images are processed for optimal web performance:

- **Resizing**: Images larger than 1200x1200px are resized while maintaining aspect ratio
- **Format Conversion**: All images are converted to optimized JPEG format
- **Quality**: 85% JPEG quality for excellent visual quality at smaller file size
- **Typical Results**: 70-90% file size reduction (e.g., 1.6 MB → 168 KB)
- **Graceful Fallback**: If optimization fails, the original image is saved

### Usage

#### Manual Execution

Run the script manually from the repository root:

```bash
# Normal mode - fetch all missing images
python3 scripts/fetch_plant_images.py

# Limit to 10 images
python3 scripts/fetch_plant_images.py --limit 10

# Test mode - dry run without downloading
python3 scripts/fetch_plant_images.py --test

# Test mode with limit
python3 scripts/fetch_plant_images.py --test --limit 5
```

#### Automated Execution

The script runs automatically via GitHub Actions workflow:
- **Schedule**: Daily at 3:00 AM UTC (after wildflower data fetch)
- **Default Limit**: 50 images per day (to avoid rate limits)
- **Workflow File**: `.github/workflows/fetch-plant-images.yml`
- **Manual Trigger**: Can be triggered manually from the Actions tab with custom limit

### Output

The script creates:

1. **Image files**: `public/images/plants/{plant-id}/{plant-id}-{timestamp}.{ext}`
2. **Updated JSON files**: Adds `imageUrl` field to plant data in `src/data/Plants/`
3. **Log file**: `scripts/fetch_plant_images_log.txt` with timestamped operations

### Image Sources

The script prioritizes images from:

1. **Wikipedia articles**: Main article images for the plant (scientific name)
2. **Wikipedia articles**: Main article images using common name
3. **Wikimedia Commons**: High-quality plant photography

Images are sourced from Wikipedia/Commons which are typically licensed under Creative Commons or public domain.

### Data Format

After processing, plant JSON files are updated with:

```json
{
  "id": "cornus-florida",
  "commonName": "Flowering Dogwood",
  "scientificName": "Cornus florida",
  ...
  "imageUrl": "/images/plants/cornus-florida/cornus-florida-2025-10-17T01-00-39-829Z.jpg"
}
```

### Exit Codes

- `0`: Success - Images fetched and plant files updated
- `1`: Failure - More failures than successes

### Example Output

```
======================================================================
Plant Image Fetcher - Batch Job
======================================================================
Started at: 2025-10-17 01:00:39
Limit: 5 images

[2025-10-17 01:00:39] Batch job started (version 1.0.0)
[2025-10-17 01:00:39] Limit set to 5 images
[2025-10-17 01:00:39] Scanning for plants without images...
[2025-10-17 01:00:39] Found 454 plants without images
[2025-10-17 01:00:39] Processing 5 plants

[2025-10-17 01:00:39] [1/5] Processing: Flowering Dogwood
[2025-10-17 01:00:39]   Searching Wikipedia for: Cornus florida (Flowering Dogwood)
[2025-10-17 01:00:39]     Found image: https://upload.wikimedia.org/wikipedia/commons/b/b3/Cornus_florida_Arkansas.jpg
[2025-10-17 01:00:39]     Downloading to: public/images/plants/cornus-florida/cornus-florida-2025-10-17T01-00-39-829Z.jpg
[2025-10-17 01:00:40]     Successfully downloaded image
[2025-10-17 01:00:40]     Updated src/data/Plants/cornus-florida.json with imageUrl
[2025-10-17 01:00:40]   ✓ Successfully processed plant

...

======================================================================
[2025-10-17 01:00:40] Batch job completed
[2025-10-17 01:00:40] Successfully processed: 5 plants
[2025-10-17 01:00:40] Failed: 0 plants
[2025-10-17 01:00:40] Skipped: 0 plants
[2025-10-17 01:00:40] Total plants without images remaining: 449
```

### Configuration

Key configuration constants:

- `PLANTS_DATA_DIR`: Directory containing plant JSON files (`src/data/Plants`)
- `IMAGES_BASE_DIR`: Base directory for images (`public/images/plants`)
- `LOG_FILE`: Log file path (`scripts/fetch_plant_images_log.txt`)
- `TIMEOUT`: Request timeout in seconds (30)
- `USER_AGENT`: Identifies the script in HTTP requests

### Notes

- Images are sourced from Wikipedia/Wikimedia Commons (typically CC-licensed or public domain)
- The script is respectful with rate limiting and will not overwhelm Wikipedia servers
- Default nightly limit of 50 images means it will take ~9 days to fetch all 454 missing images
- You can manually trigger with higher limits if needed
- Test mode is useful for verifying behavior without actually downloading
- Logs are retained as GitHub Actions artifacts for 30 days

---

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

### Troubleshooting

#### 403 Forbidden Error in GitHub Actions

If you encounter `fatal: unable to access 'https://github.com/ampautsc/PlantFinder/': The requested URL returned error: 403` in GitHub Actions:

**Root Cause**: The workflow lacks the necessary permissions to push commits to the repository.

**Solution**: Ensure the workflow YAML file includes explicit permissions:

```yaml
jobs:
  fetch-data:
    runs-on: ubuntu-latest
    permissions:
      contents: write  # Required to commit and push changes
    steps:
      # ... rest of workflow
```

**Additional Checks**:
1. **Workflow Permissions**: Verify `permissions: contents: write` is set in the job configuration
2. **Repository Settings**: Check that Actions have write access at Settings → Actions → General → Workflow permissions
3. **Branch Protection**: Ensure the target branch allows Actions to push (Settings → Branches)
4. **Token Scope**: The default `GITHUB_TOKEN` has sufficient permissions when the workflow permissions are set correctly

**Verification**:
- The enhanced logging added to both workflows will show:
  - ✓ GITHUB_TOKEN is set
  - Repository permissions
  - Number of files staged
  - Push result with detailed error messages

#### 403 Forbidden from Wildflower.org

If the scraper gets 403 Forbidden when accessing wildflower.org (not GitHub):

**Symptoms**: Log shows "Failed to fetch collection page (Status: 403)" or similar error

**Root Cause**: The wildflower.org website is blocking automated requests using bot protection systems (like Cloudflare, Akamai, or similar Web Application Firewall). This is a common practice to prevent web scraping and protect server resources.

**What We've Already Done**:
The script includes several measures to avoid being blocked:
- ✅ Comprehensive browser-like HTTP headers (User-Agent, Accept, etc.)
- ✅ Cookie/session management to maintain state between requests
- ✅ Proper delays between requests (1-2 seconds)
- ✅ Retry logic with exponential backoff (up to 3 attempts)
- ✅ Referer headers for subsequent page requests
- ✅ Gzip/deflate encoding support

However, if the website has strong bot protection in place, these standard measures may not be sufficient.

**Solutions**:

1. **Use Test Mode (Recommended for Development)**
   ```bash
   python3 scripts/fetch_wildflower_data.py --test
   ```
   - Uses built-in mock data that simulates the website structure
   - No actual HTTP requests are made
   - Perfect for development and testing

2. **Contact Wildflower.org**
   - Request API access or permission to scrape their data
   - Email: info@wildflower.org
   - Explain your use case and ask if they have a preferred way to access their data
   - Many organizations provide APIs or data dumps for legitimate uses

3. **Wait and Retry**
   - The blocking may be temporary (rate limiting)
   - Wait several hours or a day before trying again
   - The script automatically retries with exponential backoff

4. **Use Alternative Data Sources**
   - USDA PLANTS Database (https://plants.usda.gov/)
   - Trefle.io Plant API (https://trefle.io/)
   - iNaturalist API (https://www.inaturalist.org/pages/api+reference)
   - GBIF - Global Biodiversity Information Facility (https://www.gbif.org/)

5. **Manual Data Collection**
   - Download HTML pages manually from a browser
   - Save them locally and modify the script to parse local files
   - This is suitable for one-time or small-scale data collection

**Why Standard Solutions Don't Always Work**:

Modern bot protection systems can detect automation through:
- Browser fingerprinting (canvas, WebGL, fonts)
- JavaScript execution and challenges
- TLS fingerprinting
- Behavioral analysis (mouse movements, timing patterns)
- IP reputation and blacklists

Simple header improvements and delays are often insufficient against these sophisticated systems.

**Error Messages**:

When a 403 error occurs, you'll see helpful guidance:
```
✗ Failed to fetch page (Status: 403)
  This website may be blocking automated requests.
  Possible solutions:
  1. Run with --test flag to use mock data
  2. Try again later (the site may have rate limiting)
  3. Check if the website requires API access or has changed their policies
```

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

- The script uses browser-like User-Agent headers and session management to appear more legitimate
- **Current Status**: Wildflower.org is blocking automated requests with 403 Forbidden errors due to bot protection systems
- **Recommended Approach**: Use test mode (`--test` flag) for development until API access is obtained or alternative data sources are implemented
- The script includes comprehensive error handling with retry logic and exponential backoff
- Rate limiting is built-in: 1 second initial delay, 2 seconds between pages, 1.5 seconds between plants
- Test mode provides realistic mock data for 3 plants (Butterfly Weed, Purple Coneflower, Black-eyed Susan)
- Data is stored in source control (`src/data/wildflower-org/`) for collaboration and versioning
- Results are uploaded as GitHub Actions artifacts for review (retained for 30 days)
- See the troubleshooting section above for detailed solutions to 403 errors
