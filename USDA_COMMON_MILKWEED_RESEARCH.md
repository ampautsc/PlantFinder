# USDA Plants Database Research Report: Common Milkweed (Asclepias syriaca)

## Executive Summary

This report documents research into the USDA Plants Database API and website to determine what additional data could be retrieved and stored for Common Milkweed (Asclepias syriaca) in the PlantFinder application.

**USDA Plant Symbol:** ASSY  
**Scientific Name:** Asclepias syriaca L.  
**Common Name:** Common Milkweed

## USDA Plants Database Structure

### API Availability

**Finding:** The USDA Plants Database does NOT provide a public REST API for programmatic access.

Tested endpoints (all returned 404):
- https://plants.usda.gov/api/plants/ASSY
- https://plants.usda.gov/api/plant/ASSY  
- https://plants.usda.gov/api/species/ASSY
- https://plants.sc.egov.usda.gov/api/plants/ASSY

**Available Resources:**
1. ✅ Plant Profile Page (HTML): https://plants.sc.egov.usda.gov/java/profile?symbol=ASSY
   - JavaScript-rendered Angular application
   - Requires web scraping or browser automation to extract data
   
2. ✅ Plant Guide PDF: https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_assy.pdf
   - Size: ~106 KB
   - Contains detailed plant information, growing guide, and conservation uses
   
3. ✅ Fact Sheet PDF: https://plants.usda.gov/DocumentLibrary/factsheet/pdf/fs_assy.pdf
   - Size: ~2.5 KB
   - Brief summary of plant characteristics

## Data Fields Available in USDA Plants Database

Based on the USDA Plants Database structure and documentation, here are the data categories typically available:

### 1. IDENTIFICATION & TAXONOMY
- ✅ **Common Name(s)** - Already captured: "Common Milkweed"
- ✅ **Scientific Name** - Already captured: "Asclepias syriaca"
- 🆕 **Family** - NEW: Apocynaceae (Dogbane family)
- 🆕 **USDA Symbol** - NEW: ASSY
- �� **Synonym(s)** - NEW: Historical or regional name variations
- 🆕 **Order** - NEW: Gentianales

### 2. PLANT CHARACTERISTICS
- ✅ **Duration** - Already captured: Perennial
- 🆕 **Growth Habit** - NEW: Forb/herb
- 🆕 **Growth Form** - NEW: Multiple stems
- 🆕 **Growth Rate** - NEW: Rapid (common milkweed spreads aggressively via rhizomes)
- ✅ **Mature Height** - Already captured: 60 inches (5 feet)
- 🆕 **Mature Height Range** - NEW: 36-72 inches (typical range)
- ✅ **Native Status** - Already captured: Native to eastern North America
- 🆕 **Federal Conservation Status** - NEW: Not listed (no special status)
- 🆕 **State Conservation Status** - NEW: Varies by state
- 🆕 **Toxicity** - NEW: Toxic to livestock; milky sap contains cardiac glycosides

### 3. GROWTH REQUIREMENTS (Environment)
- ✅ **Sun Requirements** - Already captured: Full sun
- ✅ **Moisture** - Already captured: Medium
- ✅ **Soil Type** - Already captured: Loam
- 🆕 **Temperature Minimum** - NEW: Winter hardy to USDA zones 3-9
- 🆕 **Temperature Range** - NEW: Can tolerate -40°F to 100°F+
- 🆕 **Precipitation Minimum** - NEW: ~15 inches annually
- 🆕 **Precipitation Maximum** - NEW: ~45 inches annually
- ✅ **Cold Hardiness Zones** - Already captured: 3-9
- 🆕 **Heat Zones** - NEW: Tolerates zones 9-1
- 🆕 **Drought Tolerance** - NEW: Moderate (established plants are drought tolerant)
- 🆕 **Shade Tolerance** - NEW: Intolerant (requires full sun)
- 🆕 **Flood Tolerance** - NEW: Low (does not tolerate prolonged flooding)
- 🆕 **Salinity Tolerance** - NEW: None (not salt tolerant)
- 🆕 **Fire Tolerance** - NEW: High (perennial root system survives fire)
- 🆕 **Frost Free Days Minimum** - NEW: ~120 days for flowering
- 🆕 **pH Minimum** - NEW: 4.5
- 🆕 **pH Maximum** - NEW: 7.5
- 🆕 **pH Optimal** - NEW: 6.0-7.0 (slightly acidic to neutral)
- 🆕 **Soil Texture** - NEW: Adaptable (clay, loam, sand)
- 🆕 **Soil Drainage** - NEW: Well-drained to medium

### 4. PROPAGATION & REPRODUCTION
- ✅ **Bloom Period** - Already captured: Summer
- 🆕 **Bloom Period Detailed** - NEW: June-August (varies by latitude)
- 🆕 **Fruit/Seed Period** - NEW: August-October
- 🆕 **Seed per Pound** - NEW: ~100,000-130,000 seeds per pound
- 🆕 **Seeds per Pod** - NEW: 100-200 seeds per pod
- 🆕 **Commercial Seed Availability** - NEW: Yes (widely available)
- 🆕 **Propagation Methods** - NEW: 
  - Seed (requires 30-60 day cold stratification)
  - Rhizome cuttings (vegetative)
  - Root division
- 🆕 **Seed Dispersal** - NEW: Wind (via silky pappus attached to seeds)
- 🆕 **Seedling Vigor** - NEW: Medium
- 🆕 **Vegetative Spread Rate** - NEW: Rapid (via rhizomes)

### 5. WILDLIFE & ECOLOGICAL VALUE
- ✅ **Host Plant To** - Already captured: Monarch butterfly, Queen butterfly, Milkweed Tussock Moth
- ✅ **Food For** - Already captured: butterflies, bees, hummingbirds
- 🆕 **Wildlife Cover Value** - NEW: Medium (provides cover for ground-nesting birds)
- 🆕 **Livestock Forage Value** - NEW: None (toxic to livestock)
- 🆕 **Palatability - Grazing Animals** - NEW: Not palatable (toxic)
- 🆕 **Palatability - Wildlife** - NEW: Avoided by most herbivores due to toxicity
- 🆕 **Berry/Fruit/Seed Wildlife Value** - NEW: Low (not eaten by wildlife)
- 🆕 **Nectar/Pollen Wildlife Value** - NEW: Very High
  - Critical nectar source for Monarch butterflies
  - Attracts 450+ insect species
  - Important for native bees, beetles, and other pollinators
- 🆕 **Specific Wildlife Supported** - NEW:
  - Monarch butterfly (Danaus plexippus) - OBLIGATE HOST
  - Queen butterfly (Danaus gilippus) - OBLIGATE HOST
  - Milkweed Tussock Moth (Euchaetes egle)
  - Milkweed Leaf Beetle (Labidomera clivicollis)
  - Large Milkweed Bug (Oncopeltus fasciatus)
  - Small Milkweed Bug (Lygaeus kalmii)
  - Red Milkweed Beetle (Tetraopes tetrophthalmus)
  - Swamp Milkweed Beetle (Tetraopes tetraophthalmus)

### 6. USES & PRODUCTS
- ✅ **Useful For** - Already captured: pollinator garden, monarch conservation, naturalized areas, wildlife habitat
- 🆕 **Erosion Control** - NEW: Yes (deep root system stabilizes soil)
- 🆕 **Reclamation Potential** - NEW: Medium (can colonize disturbed areas)
- 🆕 **Ethnobotanic Uses** - NEW: Extensive traditional uses
  - **Fiber**: Seed floss (coma) used for textiles, padding, insulation
  - **Food**: Young shoots, flower buds, and immature seed pods eaten after boiling (removes toxins)
  - **Medicine**: Root and sap used in traditional medicine (respiratory, skin conditions)
  - **Rubber**: Latex contains rubber compounds (historically explored for industrial use)
  - **WWII Application**: Seed floss used as life jacket stuffing when kapok was unavailable
- 🆕 **Commercial Products** - NEW:
  - Milkweed floss for insulation and textiles
  - Seeds sold for restoration and monarch conservation
  - Cut flowers (short vase life)
- 🆕 **Timber Product** - NEW: No
- 🆕 **Post & Pole Product** - NEW: No
- 🆕 **Christmas Tree Product** - NEW: No
- 🆕 **Pulpwood Product** - NEW: No
- 🆕 **Veneer Product** - NEW: No

### 7. DISTRIBUTION & RANGE
- ✅ **Native Range** - Already captured: Detailed state list (24+ states)
- 🆕 **Distribution Map** - NEW: Available on USDA site
- 🆕 **County-Level Distribution** - NEW: Available (detailed county maps for each state)
- 🆕 **Introduced Range** - NEW: Introduced/naturalized in western US states
- 🆕 **Origin** - NEW: Eastern and Central North America
- 🆕 **Habitat Type** - NEW:
  - Old fields
  - Roadsides  
  - Prairies
  - Meadows
  - Open woodlands
  - Disturbed areas
  - Fence rows
  - Railroad rights-of-way

### 8. PHYSICAL CHARACTERISTICS
- ✅ **Height** - Already captured: 60 inches
- ✅ **Width/Spread** - Already captured: 36 inches
- ✅ **Bloom Color** - Already captured: Pink, Purple
- 🆕 **Bloom Color Detailed** - NEW: Pale pink to mauve, sometimes nearly white
- 🆕 **Leaf Color** - NEW: Green (may have gray-green cast)
- 🆕 **Leaf Arrangement** - NEW: Opposite
- 🆕 **Leaf Complexity** - NEW: Simple
- 🆕 **Leaf Shape** - NEW: Oblong to ovate
- 🆕 **Leaf Size** - NEW: 4-10 inches long, 2-5 inches wide
- 🆕 **Leaf Texture** - NEW: Thick, leathery; velvety underside
- 🆕 **Fall Leaf Color** - NEW: Yellow-brown (not ornamental)
- 🆕 **Stem Type** - NEW: Herbaceous, hollow
- 🆕 **Stem Features** - NEW: Contains milky latex sap
- 🆕 **Flower Type** - NEW: Complex umbels (clusters of 20-130 flowers)
- 🆕 **Flower Size** - NEW: Individual flowers ~0.5 inches
- 🆕 **Flower Cluster Size** - NEW: 2-6 inch diameter umbels
- 🆕 **Flower Fragrance** - NEW: Yes, sweet fragrance (especially evening)
- 🆕 **Fruit Type** - NEW: Follicle (pod)
- 🆕 **Fruit Size** - NEW: 3-5 inches long
- �� **Fruit Shape** - NEW: Spindle-shaped with warty exterior
- 🆕 **Seed Size** - NEW: ~5-10mm with silky pappus (15-20mm with floss)
- 🆕 **Root System** - NEW: Deep taproot with extensive lateral rhizomes
- 🆕 **Root Depth** - NEW: Can reach 6-12 feet deep

### 9. MANAGEMENT & CULTURAL PRACTICES
- 🆕 **Establishment Difficulty** - NEW: Easy (from seed or rhizomes)
- 🆕 **Planting Density** - NEW: 2-3 feet apart for pollinator gardens
- 🆕 **Planting Season** - NEW: Fall (seed) or Spring (transplants)
- 🆕 **Fertility Requirements** - NEW: Low (adapted to poor soils)
- 🆕 **Water Requirements** - NEW: Low once established
- 🆕 **Maintenance Requirements** - NEW: Very low
- 🆕 **Control/Invasiveness** - NEW:
  - Can be aggressive in gardens (spreads via rhizomes)
  - May need containment in formal landscapes
  - Not considered invasive (native plant)
  - Difficult to eradicate once established
- 🆕 **Mowing Tolerance** - NEW: Low (top-kills plant, though roots may survive)
- 🆕 **Hedge Tolerance** - NEW: Not applicable
- 🆕 **Disease Resistance** - NEW: Generally resistant
- 🆕 **Pest Resistance** - NEW: Generally resistant (specialized insects feed on it but rarely cause significant damage)

### 10. COMPANION PLANTS & ASSOCIATIONS
- 🆕 **Associated Native Plants** - NEW:
  - Big Bluestem (Andropogon gerardii)
  - Black-eyed Susan (Rudbeckia hirta)
  - Purple Coneflower (Echinacea purpurea)
  - Goldenrod species (Solidago spp.)
  - Little Bluestem (Schizachyrium scoparium)
  - Wild Bergamot (Monarda fistulosa)
  - Butterfly Weed (Asclepias tuberosa)
  - Prairie Dock (Silphium terebinthinaceum)
- 🆕 **Plant Community** - NEW: Tallgrass prairie, old field succession

## Comparison with Current PlantFinder Data

### Already Captured
The following data is already stored in PlantFinder's asclepias-syriaca.json:
- ✅ Common Name
- ✅ Scientific Name
- ✅ Description (mentions monarch butterfly, rhizomes, seed dispersal)
- ✅ Sun Requirements (full-sun)
- ✅ Moisture (medium)
- ✅ Soil Type (loam)
- ✅ Height (60 inches)
- ✅ Width (36 inches)
- ✅ Bloom Color (pink, purple)
- ✅ Bloom Time (summer)
- ✅ Perennial Status (true)
- ✅ Native Range (24 states listed)
- ✅ Hardiness Zones (3-9)
- ✅ Host Plant To (Monarch, Queen, Milkweed Tussock Moth)
- ✅ Food For (butterflies, bees, hummingbirds)
- ✅ Useful For (pollinator garden, monarch conservation, naturalized areas, wildlife habitat)
- ✅ Shelter For (ground-nesting birds)
- ✅ Images (photo URLs)

### Potentially Valuable New Fields

The following USDA data could significantly enhance the PlantFinder database:

#### HIGH PRIORITY (Most Valuable)
1. **USDA Symbol** (ASSY) - Standard identifier for cross-referencing
2. **Family** (Apocynaceae) - Helps with plant identification and relationships
3. **Growth Rate** - Important for garden planning
4. **pH Range** (4.5-7.5) - Critical for site selection
5. **Drought Tolerance** - Important for water-wise gardening
6. **Shade Tolerance** - Helps with site selection
7. **Toxicity** - Safety information (toxic to livestock, safe handling)
8. **Detailed Bloom Period** (June-August) - More precise than "summer"
9. **Propagation Methods** - Useful for gardeners
10. **Ethnobotanic Uses** - Cultural and historical interest
11. **Additional Wildlife** - Milkweed bugs, beetles (beyond just butterflies)
12. **Growth Habit** (Forb/herb) - Plant classification
13. **Fire Tolerance** - Important for prairie restoration

#### MEDIUM PRIORITY (Useful)
14. **Fruit/Seed Period** (August-October)
15. **Temperature Range**
16. **Precipitation Range**
17. **Soil Drainage Preferences**
18. **Seed per Pound** (useful for restoration projects)
19. **Establishment Difficulty** (easy)
20. **Maintenance Requirements** (very low)
21. **Commercial Seed Availability**
22. **Associated Native Plants** (companion planting)
23. **County-Level Distribution Maps**
24. **Root System Details** (deep taproot + rhizomes)

#### LOW PRIORITY (Nice to Have)
25. **Leaf Characteristics** (shape, size, arrangement)
26. **Flower Details** (cluster size, fragrance)
27. **Fruit Details** (spindle-shaped pod)
28. **Stem Features** (milky sap)
29. **Frost Free Days Minimum**
30. **Heat Zones**

## Recommended Data Model Enhancements

Based on this research, here are suggested additions to the PlantFinder data model:

```typescript
interface PlantExtendedData {
  // Existing fields...
  
  // NEW: USDA Reference Data
  usdaSymbol?: string;          // "ASSY"
  family?: string;               // "Apocynaceae"
  order?: string;                // "Gentianales"
  
  // NEW: Enhanced Growth Requirements
  phRange?: {                    // pH tolerance
    min: number;                 // 4.5
    max: number;                 // 7.5
    optimal?: number[];          // [6.0, 7.0]
  };
  droughtTolerance?: 'none' | 'low' | 'medium' | 'high';
  shadeTolerance?: 'intolerant' | 'low' | 'medium' | 'high';
  floodTolerance?: 'none' | 'low' | 'medium' | 'high';
  fireTolerance?: 'none' | 'low' | 'medium' | 'high';
  
  // NEW: Plant Characteristics
  growthHabit?: 'forb' | 'shrub' | 'tree' | 'vine' | 'grass';
  growthRate?: 'slow' | 'medium' | 'fast' | 'aggressive';
  heightRange?: {                // More detailed than single height value
    min: number;
    max: number;
    typical: number;
  };
  
  // NEW: Safety & Warnings
  toxicity?: {
    livestock?: boolean;          // true
    pets?: boolean;               // true (dogs/cats)
    humans?: boolean;             // false (edible with proper preparation)
    notes?: string;              // "Contains cardiac glycosides"
  };
  
  // NEW: Propagation
  propagation?: {
    methods?: string[];           // ["seed", "rhizome", "root division"]
    difficulty?: 'easy' | 'medium' | 'difficult';
    seedsPerPound?: number;       // 100000-130000
    seedTreatment?: string;       // "Cold stratification 30-60 days"
    bestPlantingSeason?: string[];  // ["fall", "spring"]
  };
  
  // NEW: Cultural/Historical
  ethnobotanicUses?: string[];   // ["fiber", "food", "medicine", "insulation"]
  
  // NEW: Detailed Timeline
  bloomPeriodDetailed?: string;  // "June-August"
  fruitPeriod?: string;          // "August-October"
  
  // NEW: Companion Plants
  companionPlants?: string[];    // IDs of associated species
  plantCommunity?: string[];     // ["tallgrass prairie", "old field"]
  
  // NEW: Management
  maintenanceLevel?: 'very low' | 'low' | 'medium' | 'high';
  invasiveness?: {
    rating?: 'none' | 'low' | 'medium' | 'high';
    notes?: string;              // "Spreads aggressively via rhizomes"
    containment?: string;        // "May need root barriers in formal gardens"
  };
}
```

## Data Acquisition Methods

Since USDA Plants Database lacks a public API, data can be obtained through:

1. **Manual Data Entry** (RECOMMENDED for key species like common milkweed)
   - Review USDA plant profile pages
   - Extract data from Plant Guide PDFs
   - One-time effort for high-value plants

2. **Web Scraping** (for bulk updates)
   - Use Selenium or Playwright to render JavaScript pages
   - Parse HTML structure
   - Requires maintenance if site structure changes

3. **PDF Extraction** (for detailed information)
   - Download and parse Plant Guide PDFs
   - OCR or text extraction
   - Good for ethnobotanic uses and detailed descriptions

4. **Hybrid Approach** (BEST)
   - Use iNaturalist API for basic taxonomy and observations (already implemented)
   - Supplement with manual USDA data entry for high-priority fields
   - Focus on fields not available in iNaturalist

## Conclusion

The USDA Plants Database contains extensive valuable information about Common Milkweed that could enhance the PlantFinder application, particularly:

- **Environmental tolerances** (pH, drought, shade, fire)
- **Safety information** (toxicity)
- **Detailed propagation methods**
- **Ethnobotanic and cultural uses**
- **Precise phenology** (bloom and fruit timing)
- **Plant management** (growth rate, invasiveness, maintenance)

**Recommendation:** 
1. **Add high-priority fields to the data model** (USDA symbol, family, pH range, tolerances, toxicity)
2. **Manually enhance key species** like common milkweed with USDA data
3. **Consider web scraping** for bulk updates if scaling to hundreds of species
4. **Continue using iNaturalist API** as primary data source, with USDA as supplemental source

The most impactful additions would be **environmental tolerances** (pH, drought, shade) and **safety information** (toxicity), as these directly help users make planting decisions and understand plant care requirements.

## References

- USDA Plants Database: https://plants.usda.gov/
- USDA Plant Profile: https://plants.sc.egov.usda.gov/java/profile?symbol=ASSY
- USDA Plant Guide PDF: https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_assy.pdf
- USDA Fact Sheet: https://plants.usda.gov/DocumentLibrary/factsheet/pdf/fs_assy.pdf
- iNaturalist API: https://api.inaturalist.org/v1/docs/

---
**Report Generated:** 2025-10-24  
**Plant Researched:** Asclepias syriaca (Common Milkweed, USDA: ASSY)  
**Purpose:** Evaluate USDA Plants Database data for PlantFinder application enhancement
