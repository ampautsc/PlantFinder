# Wildflower Data Scrapers

This directory contains web scrapers that collect wildflower data from various seed vendors to populate the PlantFinder database.

## Overview

The scrapers pull information about wildflowers including:
- Common and scientific names
- Growing requirements (sun, moisture, soil)
- Plant characteristics (height, width, bloom color, bloom time)
- Wildlife relationships (pollinators, host plants)
- Images

## Supported Vendors

1. **Prairie Moon Nursery** - https://www.prairiemoon.com/
2. **Everwilde** - https://www.everwilde.com/wildflower-store.html
3. **True Leaf Market** - https://trueleafmarket.com/
4. **American Meadows** - https://www.americanmeadows.com/
5. **Eden Brothers** - https://www.edenbrothers.com/collections/organic-seeds

## Architecture

```
scripts/
├── package.json           # Scraper dependencies
├── scrapers/              # Individual scraper implementations
│   ├── index.js          # Main orchestrator
│   ├── prairie-moon.js
│   ├── everwilde.js
│   ├── trueleaf.js
│   ├── american-meadows.js
│   └── eden-brothers.js
└── utils/                 # Shared utilities
    ├── plant-data-formatter.js  # Data normalization
    ├── image-downloader.js      # Image downloading
    └── file-writer.js           # JSON file writing
```

## Local Development

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

```bash
cd scripts
npm install
```

### Running Scrapers

Run all scrapers:
```bash
npm run scrape:all
```

Run a specific scraper:
```bash
npm run scrape:prairie-moon
npm run scrape:everwilde
npm run scrape:trueleaf
npm run scrape:american-meadows
npm run scrape:eden-brothers
```

Or use the index file directly:
```bash
node scrapers/index.js                    # Run all
node scrapers/index.js prairie-moon       # Run specific
```

## GitHub Actions

The scrapers run automatically via GitHub Actions:

- **Schedule**: Weekly on Sundays at 2 AM UTC
- **Manual**: Can be triggered manually from the Actions tab
- **Workflow**: `.github/workflows/scrape-wildflower-data.yml`

### Manual Trigger

1. Go to the Actions tab in GitHub
2. Select "Scrape Wildflower Data" workflow
3. Click "Run workflow"
4. Optionally select a specific scraper to run
5. Click "Run workflow" button

## Output

### Plant Data
Scraped data is saved to `/src/data/Plants/` as JSON files:
- Filename: `{plant-id}.json` (e.g., `asclepias-tuberosa.json`)
- Format: Matches the Plant interface schema

### Images
Images are downloaded to `/public/images/plants/{plant-id}/`:
- Organized by plant ID
- Filename includes source and timestamp
- Referenced in the plant JSON via `imageUrl` field

### Logs
Scraping logs are saved to `/scripts/logs/`:
- One file per day: `scraping-{date}.json`
- Contains statistics for each scraping run
- Uploaded as artifacts in GitHub Actions

## Data Schema

The scrapers format data to match the PlantFinder schema:

```typescript
interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  requirements: {
    sun: 'full-sun' | 'partial-sun' | 'partial-shade' | 'full-shade';
    moisture: 'dry' | 'medium' | 'moist' | 'wet';
    soil: 'clay' | 'loam' | 'sand' | 'rocky';
  };
  characteristics: {
    height: number;        // in inches
    width: number;         // in inches
    bloomColor: string[];
    bloomTime: string[];
    perennial: boolean;
    nativeRange: string[];
    hardinessZones: string[];
  };
  relationships: {
    hostPlantTo: string[];
    foodFor: string[];
    usefulFor: string[];
  };
  imageUrl?: string;
  source?: string;         // Added by scrapers
  sourceUrl?: string;      // Added by scrapers
}
```

## Rate Limiting

The scrapers include rate limiting to be respectful to vendor websites:
- 2 second delay between product pages
- 5 second delay between different vendors
- User-Agent identifies as PlantFinderBot

## Error Handling

- Each scraper logs errors without stopping the entire process
- Failed products are counted in statistics
- Logs include error messages for debugging
- GitHub Actions uploads logs even if some scrapers fail

## Customization

### Adding a New Vendor

1. Create a new scraper file in `scripts/scrapers/`
2. Implement the scraping logic following existing examples
3. Export the main scraper function
4. Add to `scrapers/index.js`
5. Add npm script to `package.json`
6. Add to workflow options in `.github/workflows/scrape-wildflower-data.yml`

### Modifying Data Extraction

Edit the scraper-specific `scrapeProductPage()` function to:
- Update CSS selectors for the website structure
- Extract additional fields
- Improve data parsing

### Adjusting Rate Limits

Modify the `sleep()` calls in scraper files:
- Between products: default 2000ms
- Between vendors: default 5000ms

## Important Notes

### Terms of Service
Before running scrapers, ensure compliance with each vendor's:
- Terms of Service
- robots.txt
- Rate limiting requirements
- Data usage policies

### Data Quality
Scraped data is treated as a starting point and may need:
- Manual review and correction
- Additional information filling
- Image quality verification
- Deduplication across sources

### Existing Data
By default, scrapers will **overwrite** existing plant files with the same ID. To preserve manual edits, consider:
- Using different IDs for scraped vs. curated data
- Implementing merge logic
- Manual review before committing

## Troubleshooting

### Scraper Fails to Start
```bash
# Ensure dependencies are installed
cd scripts
npm install
```

### Images Not Downloading
- Check network connectivity
- Verify image URLs are accessible
- Check disk space in `public/images/plants/`

### Data Not Saving
- Verify write permissions to `src/data/Plants/`
- Check console output for errors
- Review logs in `scripts/logs/`

### GitHub Action Fails
- Check workflow logs in Actions tab
- Verify secrets are configured (if needed)
- Ensure main branch is not protected from bot commits

## Future Enhancements

- [ ] Implement duplicate detection across vendors
- [ ] Add data validation before saving
- [ ] Create merge strategy for existing data
- [ ] Add more sophisticated image selection
- [ ] Implement incremental updates (only new products)
- [ ] Add data quality scoring
- [ ] Create manual review workflow
- [ ] Add support for more vendors

## License

This code is part of the PlantFinder project.
Copyright © Camp Monarch. All rights reserved.

## Support

For issues or questions about the scrapers:
1. Check the logs in `scripts/logs/`
2. Review the GitHub Actions output
3. Open an issue in the repository
