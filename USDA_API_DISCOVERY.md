# USDA PLANTS API Discovery

## Summary

I have successfully discovered and accessed the USDA PLANTS API!

## API Configuration

Found in `https://plants.usda.gov/assets/config.json`:

```json
{
  "serviceUrls": {
    "mapServerUrl": "https://nrcsgeoservices.sc.egov.usda.gov/arcgis/rest/services/land_use_land_cover/plants/MapServer",
    "mapBoundaryUrl": "https://nrcsgeoservices.sc.egov.usda.gov/arcgis/rest/services/government_units/plants_boundaries/MapServer",
    "plantsServicesUrl": "https://plantsservices.sc.egov.usda.gov/api/",
    "plantsUrl": "https://plants.sc.egov.usda.gov",
    "imageLibraryUrl": "..."
  }
}
```

## Working API Endpoint

**Base URL**: `https://plantsservices.sc.egov.usda.gov/api/`

### Plant Profile Endpoint

✅ **CONFIRMED WORKING**

**URL**: `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol={SYMBOL}`

**Example**: `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=ASSY`

**Response includes**:
- Plant ID
- Scientific name
- Common name
- Symbol
- `HasDistributionData: true` (confirms distribution data exists)
- Map coordinates
- Native status
- Taxonomy
- And more...

**Example Response**:
```json
{
  "Id": 43599,
  "Symbol": "ASSY",
  "ScientificName": "<i>Asclepias syriaca</i> L.",
  "CommonName": "common milkweed",
  "HasDistributionData": true,
  "NativeStatuses": [
    {"Region": "CAN", "Status": "N", "Type": "Native"},
    {"Region": "L48", "Status": "N", "Type": "Native"}
  ]
}
```

## Distribution Data Endpoint - IN PROGRESS

⚠️ **STILL INVESTIGATING**

The `PlantProfile` endpoint shows `"HasDistributionData": true` but returns `"PlantsDistributionResults": null`.

This indicates distribution data is available but requires a separate API call. Possible patterns being tested:

- `PlantProfile/Distribution?Id={ID}`
- `PlantDistribution?symbol={SYMBOL}`
- `PlantDistribution?Id={ID}`
- Additional query parameters on PlantProfile endpoint

The website loads distribution data dynamically via JavaScript, so the exact endpoint is embedded in the minified application code.

## Next Steps

Need to determine the correct distribution data endpoint by either:

1. **Browser DevTools Method** (User can help):
   - Open https://plants.usda.gov/home/plantProfile?symbol=ASSY
   - Open DevTools (F12) → Network tab
   - Look for XHR/Fetch requests when distribution data loads
   - Share the URL that fetches distribution data

2. **Reverse Engineering** (Continue investigation):
   - Analyze minified JavaScript more thoroughly
   - Test additional endpoint patterns
   - Use browser automation if domain access is granted

3. **USDA Documentation** (If available):
   - Check for official API documentation
   - Contact USDA PLANTS team for API access details

## Current Status

✅ Can access USDA PLANTS API  
✅ Can fetch plant profiles by symbol  
✅ Can get plant IDs programmatically  
✅ Confirmed distribution data exists for plants  
⏳ Need exact endpoint for distribution data (Symbol, Country, State, State FIP, County, County FIP)

## Implementation Plan

Once distribution endpoint is confirmed:
1. Update `fetch_usda_distribution.py` to use the real API
2. Add method to fetch distribution data for a plant symbol
3. Parse and format distribution data
4. Enable batch processing for 400+ plants
5. Add rate limiting and error handling
6. Test with multiple plant symbols

## Testing

Already tested and working:
```bash
# Get plant profile
curl "https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=ASSY"

# Get plant ID
curl -s "https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=ASSY" | \
  python3 -c "import json, sys; print(json.load(sys.stdin)['Id'])"
# Output: 43599
```

## User Action Required

To complete the implementation, please:

1. Visit: https://plants.usda.gov/home/plantProfile?symbol=ASSY
2. Open Browser DevTools (F12)
3. Go to Network tab
4. Filter by XHR or Fetch
5. Look for requests that load distribution data
6. Share the complete URL of that request

OR

If you know how to export distribution data from the website, share those steps so I can identify the correct API endpoint.
