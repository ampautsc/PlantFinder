# USDA Distribution Data

This directory contains plant distribution data fetched from the [USDA PLANTS Database](https://plants.usda.gov/).

## Data Source

Distribution data is obtained from USDA PLANTS, which provides comprehensive geographic distribution information for plants across:
- United States (by state and county)
- Canada (by province)

## Data Format

Each plant has its own distribution file named `{symbol}-distribution.json` or `{symbol}-distribution.csv`.

### JSON Format

```json
{
  "fetched_at": "2025-10-23T22:58:40.351390",
  "script_version": "1.0.0",
  "source": "usda-plants",
  "symbol": "ASTU",
  "distribution_count": 8,
  "distribution": [
    {
      "symbol": "ASTU",
      "country": "United States",
      "state": "Alabama",
      "state_fip": "01",
      "county": "",
      "county_fip": ""
    }
  ]
}
```

### CSV Format

```csv
symbol,country,state,state_fip,county,county_fip
ASTU,United States,Alabama,01,,
ASTU,United States,Arizona,04,,
```

## Fields

- **symbol**: USDA plant symbol (e.g., "ASSY", "ASTU")
- **country**: "United States" or "Canada"
- **state**: State or province name
- **state_fip**: Federal Information Processing Standard (FIPS) code for state
- **county**: County name (empty if state-level only)
- **county_fip**: FIPS code for county (empty if state-level only)

## State and County Level Data

Distribution data can be at two levels:

1. **State-level**: Shows the plant is present in a state (county fields are empty)
2. **County-level**: Shows specific counties where the plant has been documented

Example:
```csv
ASSY,United States,Arkansas,05,,           # State-level
ASSY,United States,Arkansas,05,Benton,007  # County-level
```

## How to Add More Data

To fetch distribution data for additional plants:

1. **Download CSV from USDA PLANTS**:
   - Visit https://plants.usda.gov/
   - Search for your plant
   - Export/download the distribution data as CSV

2. **Process the CSV file**:
   ```bash
   python3 scripts/fetch_usda_distribution.py --csv-file your_file.csv
   ```

3. **Or use test mode**:
   ```bash
   python3 scripts/fetch_usda_distribution.py --test --symbol YOURSYMBOL
   ```

See `scripts/README.md` for complete documentation of the fetch script.

## Example Plants

Current data includes:
- **ASSY**: Asclepias syriaca (Common Milkweed)
- **ASTU**: Asclepias tuberosa (Butterfly Weed)

## Integration with PlantFinder

This distribution data can be used to:
- Show detailed native range maps
- Filter plants by state or county
- Display county-level distribution information
- Cross-reference with iNaturalist native range data
- Provide FIP codes for geographic analysis

## Notes

- Data is from the USDA PLANTS Database, a trusted authoritative source
- FIPS codes are standard US government geographic identifiers
- Some plants have state-level data only, others have county-level detail
- The blob URL issue mentioned in documentation refers to browser-generated temporary URLs that can't be accessed programmatically
