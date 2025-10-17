# iNaturalist Plant Data Crawler Implementation

## Overview

This document describes the implementation of a new plant data crawler that uses the iNaturalist API to fetch plant information for the PlantFinder application. This crawler was created as an alternative to the wildflower.org scraper, which has been blocked (403 errors).

## Problem Statement

The original `fetch_wildflower_data.py` script was designed to scrape plant data from the Lady Bird Johnson Wildflower Center (wildflower.org), but the website has implemented bot protection that blocks automated requests. This left the application without a reliable source for good plant data.

## Solution: iNaturalist API Crawler

### Why iNaturalist?

iNaturalist is an ideal data source for PlantFinder because:

1. **Public API**: No authentication required for read operations
2. **Comprehensive**: 130+ million observations, 400,000+ species
3. **Well-Documented**: Clear API documentation at https://api.inaturalist.org/v1/docs/
4. **Reliable**: Stable, production-grade infrastructure maintained by California Academy of Sciences
5. **Rich Data**: Community-contributed photos, Wikipedia descriptions, observation counts
6. **No Authentication**: Completely free to use for read operations
7. **Good Coverage**: 274,000+ plant species in North America alone

### What Was Built

#### 1. Python Script: `scripts/fetch_inaturalist_data.py`

A comprehensive data crawler with the following features:

**Core Functionality:**
- Fetches plant taxa from iNaturalist API using configurable search parameters
- Transforms iNaturalist data to PlantFinder's internal format
- Validates taxa to ensure only plants are processed (checks `iconic_taxon_name == 'Plantae'`)
- Saves individual JSON files for each plant species

**Configuration Options:**
- `--test`: Run in test mode with mock data
- `--limit N`: Fetch only N plants
- `--search "term"`: Search for specific plants by name

**Default Behavior:**
- Fetches native North American plant species
- Uses taxon_id=47126 (Plantae) to ensure only plants
- Place_id=97389 (North America) for geographic filtering
- Rank=species to get species-level taxa only

**Data Quality:**
- ✅ **Strong**: Scientific names, common names, Wikipedia descriptions, photos, observation counts
- ✅ **Enhanced**: State-level native range data (v1.1.0+) - queries all 50 US states
- ⚠️ **Partial**: Native range availability depends on community observations
- ❌ **Missing**: Horticultural details (sun/water requirements, bloom times, hardiness zones)

All missing fields are marked with TODO comments and use sensible defaults.

**State-Level Native Range (v1.1.0+):**
- Queries iNaturalist establishment_means for all 50 US states
- Filters for "native" vs "introduced" species
- Processing time: ~50 seconds per plant (50 states × 1 second rate limit)
- See [STATE_NATIVE_RANGE_IMPLEMENTATION.md](STATE_NATIVE_RANGE_IMPLEMENTATION.md) for details

**Error Handling:**
- Retry logic with exponential backoff
- Rate limiting (1 second between requests)
- Comprehensive logging to `src/data/inaturalist/fetch_log.txt`
- Graceful handling of network errors

#### 2. GitHub Actions Workflow: `.github/workflows/fetch-inaturalist-data.yml`

Automated data fetching workflow with:

**Schedule:**
- Weekly runs on Sundays at 3 AM UTC
- Allows time for new observations to accumulate

**Manual Trigger:**
- Customizable test mode (true/false)
- Adjustable limit for batch size
- Optional search term for specific plants

**Features:**
- Commits and pushes scraped data back to repository
- Uploads artifacts for review (retained 30 days)
- Proper permissions for committing (contents: write)
- Detailed logging for debugging

#### 3. Documentation: `scripts/README.md`

Comprehensive documentation including:
- Feature overview and benefits
- Usage examples for all modes
- Configuration options
- Data format specifications
- Troubleshooting guidance

## Data Format

Each plant is saved as `src/data/inaturalist/inaturalist-{taxon_id}.json`:

```json
{
  "scraped_at": "2025-10-17T17:38:25.123456",
  "scraper_version": "1.1.0",
  "source": "inaturalist",
  "plant_data": {
    "id": "inaturalist-47604",
    "commonName": "Butterfly Weed",
    "scientificName": "Asclepias tuberosa",
    "description": "Wikipedia description text...",
    "requirements": {
      "sun": "full-sun",      // TODO: from additional source
      "moisture": "medium",   // TODO: from additional source
      "soil": "loam"          // TODO: from additional source
    },
    "characteristics": {
      "height": 24,           // TODO: from additional source
      "width": 18,            // TODO: from additional source
      "bloomColor": [],       // TODO: from additional source
      "bloomTime": [],        // TODO: from additional source
      "perennial": true,
      "nativeRange": [        // ✅ v1.1.0+: State-level data
        "Alabama",
        "Connecticut",
        "Georgia",
        "Kentucky",
        "Maryland",
        "Michigan",
        "Minnesota",
        "Nebraska",
        "New York",
        "North Carolina",
        "Texas",
        "Utah",
        "Virginia"
      ],
      "hardinessZones": []    // TODO: from additional source
    },
    "relationships": {
      "hostPlantTo": [],
      "foodFor": ["butterflies", "bees"],
      "usefulFor": ["pollinator garden", "native garden"]
    },
    "imageUrl": "https://inaturalist-open-data.s3.amazonaws.com/photos/.../medium.jpg",
    "metadata": {
      "source": "inaturalist",
      "taxon_id": 47604,
      "observations_count": 15234,
      "rank": "species",
      "iconic_taxon_name": "Plantae"
    }
  }
}
```

## Testing Results

### Test Mode (Mock Data)
✅ Successfully processes 3 mock plant species
✅ Validates plant taxa correctly
✅ Creates properly formatted JSON files

### Real API Calls
✅ Successfully fetches from iNaturalist API (status 200)
✅ Correctly filters for plants only (taxon_id=47126)
✅ Processes multiple species in batch
✅ Rate limiting works (1 second between requests)
✅ Error handling manages failures gracefully

### Sample Species Tested
- Achillea millefolium (Common Yarrow) - 284,069 observations
- Taraxacum officinale (Common Dandelion) - observations
- Trifolium repens (White Clover)
- Asclepias tuberosa (Butterfly Weed) - 65,036 observations
- Echinacea purpurea (Purple Coneflower)
- Rudbeckia hirta (Black-eyed Susan)

## Security

✅ **CodeQL Scan**: Passed with no vulnerabilities
✅ **No Credentials**: Uses public API, no authentication
✅ **Rate Limiting**: Prevents API abuse
✅ **Error Handling**: No information leakage

## Future Enhancements

### Short Term
1. Complete Dataset: Run initial batch to populate full dataset with state-level native range
2. Monitor API Usage: Adjust rate limiting based on API performance
3. Data Quality Review: Review accuracy of state-level native range data

### Medium Term
1. Integrate additional data sources for horticultural information:
   - USDA PLANTS Database (plants.usda.gov) - validate native range, hardiness zones
   - Trefle.io API - growing requirements, characteristics
   - Wikipedia/Wikidata - structured plant data

2. Enhance native range parsing:
   - Cross-reference iNaturalist with USDA native range
   - Add confidence scores for native status
   - Track historical vs. current native range

3. Add bloom time/color extraction:
   - Parse from Wikipedia descriptions
   - Use computer vision on iNaturalist photos
   - Integrate Trefle.io data

### Long Term
1. Build data quality pipeline:
   - Validate completeness of plant records
   - Flag records needing manual curation
   - Community contributions for missing data

2. Implement data merging:
   - Combine data from multiple sources
   - Resolve conflicts intelligently
   - Maintain data provenance

3. Add image selection:
   - Filter for high-quality photos
   - Select images showing key features
   - Optimize for web delivery

## Usage Examples

### Fetch 10 Plants
```bash
python3 scripts/fetch_inaturalist_data.py --limit 10
```

### Search for Specific Plant
```bash
python3 scripts/fetch_inaturalist_data.py --search "butterfly weed" --limit 5
```

### Test Mode
```bash
python3 scripts/fetch_inaturalist_data.py --test --limit 3
```

### Manual GitHub Actions Trigger
1. Go to Actions tab in GitHub
2. Select "Fetch iNaturalist Data" workflow
3. Click "Run workflow"
4. Configure parameters (test mode, limit, search)
5. Click "Run workflow"

## Comparison with Wildflower.org Scraper

| Feature | Wildflower.org | iNaturalist |
|---------|---------------|-------------|
| **Access** | ❌ Blocked (403) | ✅ Public API |
| **Authentication** | N/A (scraping) | ✅ None required |
| **Reliability** | ❌ Unpredictable | ✅ High |
| **Data Quality** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐☆ Very Good |
| **Horticultural Info** | ✅ Complete | ❌ Missing |
| **Taxonomy** | ✅ Good | ✅ Excellent |
| **Photos** | ⭐⭐⭐ Fair | ⭐⭐⭐⭐⭐ Excellent |
| **Descriptions** | ✅ Good | ✅ Wikipedia-based |
| **Coverage** | Regional | 🌍 Global |
| **Rate Limits** | N/A | ✅ Generous |
| **Maintenance** | High | Low |

## Conclusion

The iNaturalist crawler provides a reliable, maintainable alternative to the blocked wildflower.org scraper. While horticultural details need enhancement through additional data sources, the taxonomic data, descriptions, and photos are excellent quality.

The implementation is production-ready and can begin populating the PlantFinder database immediately.

## References

- **iNaturalist API Documentation**: https://api.inaturalist.org/v1/docs/
- **iNaturalist Website**: https://www.inaturalist.org/
- **USDA PLANTS Database**: https://plants.usda.gov/
- **Trefle.io Plant API**: https://trefle.io/
- **Wikipedia API**: https://www.mediawiki.org/wiki/API:Main_page
