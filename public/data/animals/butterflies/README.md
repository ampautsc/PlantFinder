# Butterfly Data

This directory contains JSON data files for butterfly species, particularly those documented as larval hosts for native plants in the PlantFinder application.

## Directory Structure

```
public/data/animals/butterflies/
├── danaus-plexippus.json          # Monarch
├── eurytides-marcellus.json       # Zebra Swallowtail
├── battus-philenor.json           # Pipevine Swallowtail
├── papilio-troilus.json           # Spicebush Swallowtail
├── heraclides-cresphontes.json    # Giant Swallowtail
├── papilio-glaucus.json           # Eastern Tiger Swallowtail
├── papilio-polyxenes-asterius.json # Black Swallowtail
├── speyeria-cybele.json           # Great Spangled Fritillary
├── speyeria-idalia.json           # Regal Fritillary
├── junonia-coenia.json            # Buckeye
├── vanessa-virginiensis.json      # American Painted Lady
├── limenitis-arthemis-astyanax.json # Red-spotted Purple
├── limenitis-archippus.json       # Viceroy
├── asterocampa-celtis.json        # Hackberry Emperor
├── phoebis-sennae.json            # Cloudless Sulphur
└── zerene-cesonia.json            # Southern Dogface
```

## Data Format

Each butterfly file follows the `Animal` interface defined in `src/types/Animal.ts`:

```json
{
  "id": "danaus-plexippus",
  "commonName": "Monarch",
  "scientificName": "Danaus plexippus",
  "description": "Description text...",
  "type": "butterfly",
  "characteristics": {
    "flightSeason": ["summer", "fall"],
    "size": "medium"
  },
  "relationships": {
    "hostPlants": ["Asclepias tuberosa", "Asclepias syriaca", ...],
    "nectarPlants": [],
    "habitat": ["woodlands", "meadows", "gardens"]
  },
  "nativeRange": ["Maine", "New York", ...]
}
```

## Field Descriptions

### Basic Information
- **id**: Lowercase scientific name with hyphens (e.g., "danaus-plexippus")
- **commonName**: Common English name
- **scientificName**: Binomial nomenclature (Genus species)
- **description**: 2-3 sentences about the butterfly, including host plant relationships
- **type**: Always "butterfly" for this directory

### Characteristics
- **flightSeason**: Array of seasons when adults are active (spring, summer, fall)
- **size**: Relative size (small, medium, large)
- **wingspan**: Optional, in inches
- **lifespan**: Optional, typical adult lifespan

### Relationships
- **hostPlants**: Array of plant species (scientific names) that caterpillars feed on
- **nectarPlants**: Array of plants that adults use for nectar (to be populated)
- **habitat**: Array of preferred habitat types

### Geographic Information
- **nativeRange**: Array of US states where the butterfly is native

## Images

Butterfly images should be placed in:
```
public/images/animals/butterflies/{butterfly-id}/
```

File naming convention:
- Full image: `{butterfly-id}-{timestamp}.jpg`
- Thumbnail: `{butterfly-id}-{timestamp}-thumb.jpg`

## Butterfly-Plant Relationships

The data in this directory cross-references with plant data:
- Plants list butterflies in their `hostPlantTo` field
- Butterflies list plants in their `hostPlants` field

This bidirectional relationship enables:
1. Finding which butterflies use a particular plant
2. Finding which plants support a particular butterfly
3. Building complete pollinator garden recommendations

## Data Sources

Butterfly-plant relationships are documented from:
- Xerces Society for Invertebrate Conservation
- National Wildlife Federation
- Butterflies and Moths of North America (BAMONA)
- State-specific butterfly guides
- Scientific literature

## Adding New Butterflies

When adding a new butterfly species:

1. **Research host plants** - Identify all documented host plant species
2. **Create JSON file** - Follow the naming convention and data structure
3. **Add images** - Place images in the appropriate directory
4. **Update plant data** - Add the butterfly's scientific name to all host plants' `hostPlantTo` arrays
5. **Verify bidirectional links** - Ensure consistency between butterfly and plant data

## Notes

- All 16 butterflies in this directory correspond to the species mentioned in the project requirements
- Each butterfly has at least one host plant documented in the PlantFinder database
- Some butterflies (like Monarch on milkweed) are obligate - they ONLY use specific host plants
- Images are not yet populated but directories are prepared for them

## Future Enhancements

- Add wingspan measurements
- Add more detailed life cycle information
- Add conservation status
- Populate nectarPlants arrays with adult food sources
- Add larval images in addition to adult butterflies
- Add migration information (especially for Monarchs)
