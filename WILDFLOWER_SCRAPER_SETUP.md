# Wildflower Data Scraper Setup Guide

This document explains the automated wildflower data collection system that has been set up for PlantFinder.

## Overview

PlantFinder now includes an automated web scraping system that collects wildflower information from seed vendors to populate and maintain the plant database. This system runs automatically on a weekly schedule via GitHub Actions.

## What It Does

The scraper system:

1. **Collects Plant Data** from 5 seed vendors:
   - Prairie Moon Nursery (https://www.prairiemoon.com/)
   - Everwilde (https://www.everwilde.com/wildflower-store.html)
   - True Leaf Market (https://trueleafmarket.com/)
   - American Meadows (https://www.americanmeadows.com/)
   - Eden Brothers (https://www.edenbrothers.com/collections/organic-seeds)

2. **Downloads and Stores Images** in the `/public/images/plants/` directory

3. **Saves Plant Information** as JSON files in `/src/data/Plants/`

4. **Normalizes Data** to match the PlantFinder schema with proper formatting

5. **Commits Changes** automatically to the repository

## Automated Schedule

The scraper runs automatically:
- **When**: Every Sunday at 2:00 AM UTC
- **How**: Via GitHub Actions workflow
- **What**: All scrapers run in sequence

## Manual Execution

You can manually trigger the scraper from GitHub:

1. Go to the **Actions** tab in the GitHub repository
2. Select **"Scrape Wildflower Data"** from the workflow list
3. Click **"Run workflow"** button (top right)
4. Choose options:
   - Leave empty to run all scrapers
   - Or select a specific vendor scraper
5. Click **"Run workflow"** to start

## Viewing Results

### Check Workflow Status
1. Go to **Actions** tab
2. Click on the latest "Scrape Wildflower Data" run
3. View logs for each step

### Review Collected Data
- **Plant Data**: Check `/src/data/Plants/` for new/updated JSON files
- **Images**: Check `/public/images/plants/` for downloaded images
- **Logs**: Download scraping logs from the workflow artifacts

### Commit History
New data is automatically committed with message:
```
chore: update wildflower data from scrapers [automated]
```

## Data Quality

### Important Notes

1. **Starting Point**: Scraped data is a starting point and may need manual review
2. **Overwriting**: Scrapers will overwrite existing files with the same plant ID
3. **Source Tracking**: Each plant includes `source` and `sourceUrl` fields
4. **Image Quality**: Images vary by vendor; manual curation may be needed

### Recommended Workflow

1. Let scrapers collect initial data automatically
2. Review new plants in `/src/data/Plants/`
3. Manually enhance or correct information as needed
4. Verify images are appropriate
5. Remove or merge duplicates if necessary

## Local Development

### Running Scrapers Locally

If you want to run scrapers on your local machine:

```bash
# Navigate to scripts directory
cd scripts

# Install dependencies (first time only)
npm install

# Run all scrapers
npm run scrape:all

# Or run a specific scraper
npm run scrape:prairie-moon
npm run scrape:everwilde
npm run scrape:trueleaf
npm run scrape:american-meadows
npm run scrape:eden-brothers
```

### Testing Changes

Before committing scraper changes:
1. Test locally with a small sample
2. Review generated JSON files
3. Verify images download correctly
4. Check logs for errors

## Rate Limiting & Ethics

The scrapers are designed to be respectful:

- **Rate Limiting**: 2-second delay between pages, 5-second delay between vendors
- **User-Agent**: Identifies as "PlantFinderBot"
- **Retry Logic**: Limited retries to avoid hammering servers
- **Error Handling**: Fails gracefully without retrying indefinitely

### Terms of Service

Before enabling scrapers for production use:
1. Review each vendor's Terms of Service
2. Check their `robots.txt` file
3. Verify they allow automated data collection
4. Consider reaching out to request permission

## Troubleshooting

### Workflow Fails

**Check the logs:**
1. Go to Actions tab
2. Click failed workflow
3. Review error messages in each step

**Common issues:**
- Network timeouts → Try again later
- Website structure changed → Update scraper selectors
- Chromium installation fails → Check GitHub Actions setup

### No Data Collected

Possible reasons:
- Vendor website structure changed
- Products not found on page
- CSS selectors need updating
- Network or access issues

**Solution**: Review scraper logs and update selectors in scraper files

### Images Not Downloading

Check:
- Image URLs are accessible
- Network connectivity
- Disk space in repository
- Image downloader error messages in logs

## Maintenance

### Regular Tasks

- **Monitor Workflow**: Check Actions tab weekly for failures
- **Review Data Quality**: Periodically review newly added plants
- **Update Selectors**: If vendors redesign websites, update CSS selectors
- **Deduplicate**: Remove or merge duplicate plants from different sources

### Updating Scrapers

If a vendor's website changes:

1. Navigate to `scripts/scrapers/{vendor-name}.js`
2. Update CSS selectors in `scrapeProductPage()` function
3. Test locally
4. Commit changes
5. Next workflow run will use updated scraper

## Future Enhancements

Planned improvements:
- Duplicate detection across vendors
- Data validation before saving
- Merge strategy for existing plants
- More sophisticated image selection
- Incremental updates (only new products)
- Data quality scoring
- Manual review workflow

## Architecture

```
Repository Structure:
├── .github/workflows/
│   └── scrape-wildflower-data.yml    # GitHub Action workflow
├── scripts/
│   ├── package.json                   # Dependencies
│   ├── README.md                      # Detailed scraper docs
│   ├── scrapers/                      # Individual vendor scrapers
│   └── utils/                         # Shared utilities
├── src/data/Plants/                   # Output: Plant JSON files
└── public/images/plants/              # Output: Downloaded images
```

## Support

For questions or issues:
1. Check `scripts/README.md` for detailed documentation
2. Review GitHub Actions logs
3. Check scraping logs (available as workflow artifacts)
4. Open an issue in the repository

## License

This scraper system is part of PlantFinder.
Copyright © Camp Monarch. All rights reserved.
