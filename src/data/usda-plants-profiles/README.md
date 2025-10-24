# USDA PLANTS API Profile Data

This directory contains plant profile data downloaded from the USDA PLANTS API.

## Data Source

**API**: `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol={SYMBOL}`

## Files

Each file contains the complete plant profile data for a specific plant symbol:

- `assy-profile.json` - Asclepias syriaca (common milkweed)
- `astu-profile.json` - Asclepias tuberosa (butterfly milkweed)
- `asvi-profile.json` - Asclepias viridiflora (green comet milkweed)

## Data Format

Each JSON file contains:

```json
{
  "downloaded_at": "ISO timestamp",
  "source": "usda-plants-api",
  "api_url": "API endpoint used",
  "data": {
    "Id": 43599,
    "Symbol": "ASSY",
    "ScientificName": "<i>Asclepias syriaca</i> L.",
    "CommonName": "common milkweed",
    "Group": "Dicot",
    "Rank": "Species",
    "Durations": ["Perennial"],
    "GrowthHabits": ["Forb/herb"],
    "NativeStatuses": [
      {"Region": "CAN", "Status": "N", "Type": "Native"},
      {"Region": "L48", "Status": "N", "Type": "Native"}
    ],
    "MapCoordinates": [...],
    "HasDistributionData": true,
    "Ancestors": [...],
    "HasWetlandData": true,
    "HasImages": true,
    ...
  }
}
```

## Available Data

The plant profile includes:
- **Taxonomy**: Scientific name, common name, rank, family, ancestors
- **Characteristics**: Growth habit, duration (annual/perennial), group
- **Native Status**: Regional native status (CAN, L48, etc.)
- **Map Coordinates**: Bounding boxes for geographic regions
- **Metadata Flags**: HasDistributionData, HasWetlandData, HasImages, etc.
- **Document Links**: Plant guides, fact sheets

## Limitations

**Note**: The API indicates `HasDistributionData: true` but returns `PlantsDistributionResults: null` in the profile endpoint. The detailed distribution table (Symbol, Country, State, State FIP, County, County FIP) requires a separate endpoint that has not yet been identified.

## Download Verification

✅ **Confirmed**: USDA PLANTS API is accessible
✅ **Confirmed**: Can download plant profile data programmatically
✅ **Confirmed**: Data includes plant IDs, taxonomy, native status
⏳ **Pending**: County-level distribution data endpoint

## Next Steps

To get the full distribution table data, one of the following approaches is needed:
1. Identify the correct API endpoint for distribution data via browser DevTools inspection
2. Use alternative data sources (BONAP, POWO, etc.) for county-level distribution
3. Download CSV exports from the USDA website manually and process them
