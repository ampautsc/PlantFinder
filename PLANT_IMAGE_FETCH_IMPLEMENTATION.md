# Plant Image Fetch Implementation Summary

## Overview

This document summarizes the implementation of the automated plant image fetching system for the PlantFinder application.

## Problem Statement

The PlantFinder application needed a batch job/action that:
- Identifies plants we have data for
- Searches for images (prioritizing Wikipedia as a source)
- Downloads images to `public/images/plants/plantX` folders
- Shows images on plant cards
- Runs nightly
- Skips plants that already have images

## Solution

### 1. Python Script: `scripts/fetch_plant_images.py`

A comprehensive Python script that:

**Features:**
- Scans `src/data/Plants/` directory for JSON files without `imageUrl` field
- Uses Wikipedia API to search for plant images by scientific name and common name
- Downloads full-resolution images from Wikipedia/Wikimedia Commons
- Creates plant-specific directories in `public/images/plants/{plant-id}/`
- Updates plant JSON files with the `imageUrl` field
- Skips plants that already have images (checks both JSON field and directory)
- Includes comprehensive error handling and logging
- Supports test mode for dry runs (`--test`)
- Supports batch limiting (`--limit N`)

**Usage:**
```bash
# Normal mode - fetch all missing images
python3 scripts/fetch_plant_images.py

# Limit to 10 images
python3 scripts/fetch_plant_images.py --limit 10

# Test mode - dry run
python3 scripts/fetch_plant_images.py --test
```

**Image Search Strategy:**
1. Try Wikipedia API with scientific name to get main article image
2. Fall back to common name if scientific name yields no results
3. Prefer full-resolution images over thumbnails
4. Use Wikipedia's thumbnail API and convert to full-size URLs

**Output:**
- Images: `public/images/plants/{plant-id}/{plant-id}-{timestamp}.{ext}`
- Updated JSON: Adds `"imageUrl": "/images/plants/{plant-id}/{filename}"` to plant data
- Log file: `scripts/fetch_plant_images_log.txt` with timestamped operations

### 2. GitHub Actions Workflow: `.github/workflows/fetch-plant-images.yml`

An automated workflow that:

**Scheduling:**
- Runs daily at 3:00 AM UTC (after the wildflower data fetch at 2:00 AM)
- Default limit of 50 images per day to respect Wikipedia's rate limits
- Can be manually triggered with custom parameters

**Features:**
- Sets up Python 3.x environment
- Runs the fetch script with configurable parameters
- Commits and pushes downloaded images and updated JSON files
- Uploads log files as GitHub Actions artifacts (30-day retention)
- Displays log summary in action output
- Includes explicit permissions for security (`contents: write`)

**Manual Trigger Options:**
- `limit`: Maximum number of images to fetch (default: 50 for scheduled runs)
- `test_mode`: Run in dry-run mode without downloading (default: false)

### 3. Documentation: `scripts/README.md`

Updated the scripts README with:
- Complete overview of the image fetcher
- Usage instructions (manual and automated)
- Configuration details
- Example output
- Notes on rate limiting and Wikipedia licensing

## Testing Results

Successfully tested with 8 different plants:
1. **cornus-florida** (Flowering Dogwood) - ✓ Downloaded
2. **solidago-odora** (Anise-scented goldenrod) - ✓ Downloaded
3. **bouteloua-curtipendula** (Sideoats Grama) - ✓ Downloaded
4. **amelanchier-alnifolia** (Saskatoon serviceberry) - ✓ Downloaded
5. **fagus-grandifolia** (American Beech) - ✓ Downloaded
6. **trifolium-repens** (White Clover) - ✓ Downloaded
7. **rudbeckia-occidentalis** (Western coneflower) - ✓ Downloaded
8. **agave-deserti** (Desert Agave) - ✓ Downloaded

**Verified:**
- ✓ Images downloaded to correct folders
- ✓ JSON files updated with imageUrl
- ✓ Script skips plants with existing images
- ✓ Handles Wikipedia API properly (both success and no-image cases)
- ✓ No security vulnerabilities (CodeQL verified)
- ✓ YAML syntax valid

## Current Status

- **Total plants**: ~479
- **Plants with images**: 33 (before this work) + 8 (from testing) = 41
- **Plants without images**: 446 remaining
- **Estimated completion**: ~9 days at 50 images/day (some plants may not have Wikipedia images)

## Implementation Details

### Image Sources

Images are sourced from:
- Wikipedia articles (en.wikipedia.org)
- Wikimedia Commons (commons.wikimedia.org)

These sources typically provide:
- High-quality plant photography
- Images under Creative Commons or public domain licenses
- Properly attributed content

### Rate Limiting

To be respectful to Wikipedia's servers:
- 50 images per day maximum (configurable)
- 0.5 second delay between requests
- User-Agent identifies the script and project
- Proper timeout handling (30 seconds)

### Error Handling

The script handles:
- Plants without Wikipedia articles
- HTTP errors and timeouts
- Network failures
- Invalid JSON files
- Missing directory permissions
- Partial downloads (cleaned up automatically)

### Security

- Uses explicit permissions in GitHub Actions (`contents: write`)
- No sensitive credentials required
- All API calls are read-only (except GitHub pushes)
- CodeQL verified with zero vulnerabilities

## Files Changed

### New Files
- `scripts/fetch_plant_images.py` - Main image fetching script
- `.github/workflows/fetch-plant-images.yml` - GitHub Actions workflow
- `scripts/fetch_plant_images_log.txt` - Log file (updated by script)

### Modified Files
- `scripts/README.md` - Added documentation for image fetcher
- `src/data/Plants/*.json` - 8 plant files updated with imageUrl
- `public/images/plants/*/` - 8 new image directories with downloaded images

### Not Changed
- Application code (React/TypeScript)
- Plant card rendering (already supports imageUrl field)
- Build or deployment configuration

## Future Improvements (Optional)

Potential enhancements that could be made in the future:
1. Support additional image sources (iNaturalist, USDA PLANTS, etc.)
2. Image quality validation
3. Multiple images per plant
4. Automatic image optimization/resizing
5. Fallback search strategies for plants without Wikipedia articles
6. Image attribution tracking

## Conclusion

The implementation successfully meets all requirements from the problem statement:
- ✅ Identifies plants we have data for (scans JSON files)
- ✅ Searches for images prioritizing Wikipedia
- ✅ Downloads images to appropriate folders
- ✅ Images display on plant cards (existing functionality)
- ✅ Runs nightly (3 AM UTC)
- ✅ Skips plants with existing images

The batch job is production-ready and will begin running automatically on the next scheduled time (3 AM UTC).
