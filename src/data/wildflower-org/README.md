# Wildflower.org Plant Data

This directory contains plant data scraped from [wildflower.org](https://www.wildflower.org/).

## Overview

The batch job script (`scripts/fetch_wildflower_data.py`) scrapes plant data from wildflower.org's collection and saves individual plant records as JSON files in this directory.

## Directory Structure

- **Plant JSON files**: Each file contains data for a single plant, named by plant ID (e.g., `asclepias-tuberosa.json`)
- **fetch_log.txt**: Log file tracking all scraping operations with timestamps

## Data Format

Each plant JSON file contains:

```json
{
  "source_url": "URL of the plant detail page",
  "scraped_at": "ISO timestamp of when data was scraped",
  "plant_data": {
    "raw_html": "Snippet of the raw HTML for reference",
    "extracted_at": "ISO timestamp of extraction",
    "scientificName": "Scientific name of the plant",
    "commonName": "Common name of the plant",
    ...additional fields as available...
  }
}
```

## Usage

### Run the scraper normally (live data from website):
```bash
python3 scripts/fetch_wildflower_data.py
```

### Run the scraper in test mode (uses mock data):
```bash
python3 scripts/fetch_wildflower_data.py --test
```

## Notes

- The data is stored in source control for versioning and collaboration
- The batch job limits fetches to prevent overwhelming the source website
- If the website blocks requests (403 Forbidden), use test mode for development
- The log file tracks all operations for debugging and monitoring
