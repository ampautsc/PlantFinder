# Animals Data - Missouri Butterflies, Skippers, and Moths

This directory contains data about butterflies, skippers, and moths native to Missouri.

## Data Source

Data compiled from the Missouri Department of Conservation (MDC) Field Guide:
- [Butterflies and Skippers Field Guide](https://mdc.mo.gov/discover-nature/field-guide/butterflies-skippers)

## Data Structure

Each animal entry includes:

### Core Information
- **id**: Unique identifier
- **commonName**: Common English name
- **scientificName**: Scientific (Latin) name
- **type**: Classification (butterfly, moth, or skipper)
- **description**: Physical description and notable characteristics

### Characteristics
- **wingspan**: Wing measurement in inches (where applicable)
- **size**: Relative size category (small, medium, large, very large)
- **flightSeason**: Active periods throughout the year
- **lifespan**: Typical adult lifespan

### Relationships
- **hostPlants**: Critical - Plants required for caterpillars to feed and complete their life cycle
- **nectarPlants**: Plants that adults feed on for energy (if applicable)
- **habitat**: Preferred habitats and environments

### Geographic Range
- **nativeRange**: List of US states where the species is native, with focus on Missouri and surrounding states

## Key Information for Plant Selection

The **hostPlants** field is particularly important for conservation and gardening. These are the specific plants that caterpillars must have to survive. Without host plants, butterflies and moths cannot complete their life cycle in an area, no matter how many nectar plants are available.

### Notable Host Plant Relationships

- **Monarch**: Exclusively uses milkweed species (Asclepias)
- **Swallowtails**: Various species use different host plants
  - Eastern Black: Parsley family plants
  - Spicebush: Spicebush and Sassafras
  - Tiger: Trees like Cherry, Willow, Ash
- **Fritillaries**: Use various violet species
- **Large Moths** (Cecropia, Luna, Polyphemus): Use native trees
- **Skippers**: Often use grasses and legumes

## Usage

This data can be used to:
1. Identify butterflies and moths in Missouri
2. Plan native plantings to support specific species
3. Understand the critical relationship between host plants and lepidoptera
4. Create conservation-focused gardens that support complete life cycles
5. Educate about native pollinators and their requirements

## Future Enhancements

Potential additions could include:
- Additional species from Missouri
- Images/photos
- Flight period details (specific months)
- Conservation status
- Larval (caterpillar) descriptions
- Links to detailed species profiles
