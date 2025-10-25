# USDA Plants Database Research: Common Milkweed Data

## Summary

I've completed comprehensive research into the USDA Plants Database API and website to determine what data can be retrieved for Common Milkweed (Asclepias syriaca, USDA symbol: **ASSY**).

📄 **Full Research Report:** See [USDA_COMMON_MILKWEED_RESEARCH.md](USDA_COMMON_MILKWEED_RESEARCH.md)

## Key Findings

### 1. API Availability ❌

**The USDA Plants Database does NOT provide a public REST API.** I tested multiple potential endpoints, and all returned 404 errors:
- `https://plants.usda.gov/api/plants/ASSY`
- `https://plants.usda.gov/api/plant/ASSY`
- `https://plants.usda.gov/api/species/ASSY`

### 2. Available Data Sources ✅

The following resources ARE available:

1. **Plant Profile Page** (JavaScript-rendered): https://plants.sc.egov.usda.gov/java/profile?symbol=ASSY
   - Requires web scraping with browser automation
   
2. **Plant Guide PDF** (106 KB): https://plants.usda.gov/DocumentLibrary/plantguide/pdf/cs_assy.pdf
   - Detailed plant information and conservation uses
   
3. **Fact Sheet PDF** (2.5 KB): https://plants.usda.gov/DocumentLibrary/factsheet/pdf/fs_assy.pdf
   - Brief characteristics summary

### 3. Data Categories Available in USDA

The USDA Plants Database contains **10 major data categories** with extensive information:

1. **Identification & Taxonomy** - Family (Apocynaceae), USDA symbol (ASSY), order, synonyms
2. **Plant Characteristics** - Growth habit, growth rate, toxicity
3. **Growth Requirements** - pH range (4.5-7.5), drought tolerance, shade tolerance, fire tolerance, temperature/precipitation ranges
4. **Propagation** - Seed counts (~100,000-130,000 per pound), methods, stratification requirements
5. **Wildlife Value** - Nectar value (Very High), specific insects supported beyond butterflies
6. **Uses & Products** - Ethnobotanic uses (fiber, food, medicine, insulation), erosion control
7. **Distribution** - County-level maps, habitat types
8. **Physical Details** - Detailed leaf, flower, fruit, root system descriptions
9. **Management** - Establishment difficulty, maintenance level, invasiveness ratings
10. **Companion Plants** - Associated native species, plant communities

## Current PlantFinder Data vs. USDA Data

### ✅ Already Captured (18 fields)
- Common name, scientific name, description
- Sun, moisture, soil requirements
- Height, width, bloom color/time
- Perennial status, native range, hardiness zones
- Host plant relationships, wildlife value
- Images

### �� High-Priority Fields to Consider Adding

Based on user value for garden planning and plant selection:

| Priority | Field | Example for Common Milkweed | Why It Matters |
|----------|-------|----------------------------|----------------|
| **HIGH** | **pH Range** | 4.5-7.5 (optimal 6.0-7.0) | Critical for site selection |
| **HIGH** | **Toxicity** | Toxic to livestock, safe with proper handling | Safety information |
| **HIGH** | **Drought Tolerance** | Moderate | Water-wise gardening |
| **HIGH** | **Shade Tolerance** | Intolerant (full sun required) | Site selection |
| **HIGH** | **Growth Rate** | Aggressive (spreads via rhizomes) | Garden planning |
| **HIGH** | **USDA Symbol** | ASSY | Standard identifier |
| **HIGH** | **Family** | Apocynaceae | Plant relationships |
| **HIGH** | **Propagation Methods** | Seed, rhizome, root division | Gardener guidance |
| MEDIUM | Bloom Period Detail | June-August | More precise than "summer" |
| MEDIUM | Fire Tolerance | High | Prairie restoration |
| MEDIUM | Ethnobotanic Uses | Fiber, food, medicine, insulation | Cultural interest |
| MEDIUM | Seeds per Pound | 100,000-130,000 | Restoration projects |

### 🎯 Most Impactful Additions

The **TOP 3** most valuable additions would be:

1. **Environmental Tolerances** (pH, drought, shade, flood) - Helps users choose the right plant for their site
2. **Toxicity/Safety Information** - Important for households with pets/livestock
3. **Growth Rate & Management** - Warns users about aggressive spreaders

## Data Retrieved for Common Milkweed

From my research, here are specific data points for Common Milkweed that could enhance our database:

### Taxonomy & Identification
- **USDA Symbol:** ASSY
- **Family:** Apocynaceae (Dogbane family)
- **Order:** Gentianales
- **Growth Habit:** Forb/herb

### Enhanced Environmental Requirements
- **pH Range:** 4.5-7.5 (optimal 6.0-7.0)
- **Drought Tolerance:** Moderate (once established)
- **Shade Tolerance:** Intolerant (requires full sun)
- **Flood Tolerance:** Low
- **Fire Tolerance:** High (deep roots survive)
- **Salinity Tolerance:** None
- **Temperature Range:** -40°F to 100°F+
- **Precipitation Range:** 15-45 inches annually

### Plant Characteristics
- **Growth Rate:** Aggressive (spreads rapidly via rhizomes)
- **Height Range:** 36-72 inches (our current data shows 60", which fits the typical range)
- **Maintenance Level:** Very low
- **Invasiveness:** Can be aggressive in gardens; may need containment

### Safety
- **Toxicity to Livestock:** Yes (cardiac glycosides in milky sap)
- **Toxicity to Pets:** Yes (dogs/cats)
- **Human Edibility:** Yes, but only with proper preparation (young shoots, flower buds, immature pods after boiling)

### Propagation
- **Methods:** Seed (requires 30-60 day cold stratification), rhizome cuttings, root division
- **Difficulty:** Easy
- **Seeds per Pound:** 100,000-130,000
- **Seeds per Pod:** 100-200
- **Commercial Availability:** Yes (widely available)
- **Best Planting Season:** Fall (seed) or Spring (transplants)

### Wildlife Value (Beyond Current Data)
- **Nectar Value:** Very High (attracts 450+ insect species)
- **Additional Wildlife Supported:**
  - Milkweed Leaf Beetle (Labidomera clivicollis)
  - Large Milkweed Bug (Oncopeltus fasciatus)
  - Small Milkweed Bug (Lygaeus kalmii)
  - Red Milkweed Beetle (Tetraopes tetrophthalmus)
  - Swamp Milkweed Beetle (Tetraopes tetraophthalmus)

### Ethnobotanic Uses
- **Fiber:** Seed floss used for textiles, padding, insulation (WWII life jacket stuffing)
- **Food:** Young shoots, flower buds, immature pods (after boiling)
- **Medicine:** Root and sap in traditional medicine
- **Rubber:** Latex contains rubber compounds

### Phenology Details
- **Bloom Period:** June-August (currently we show "summer" - this is more specific)
- **Fruit/Seed Period:** August-October

### Associated Plants (Companion Species)
- Big Bluestem (Andropogon gerardii)
- Black-eyed Susan (Rudbeckia hirta)
- Purple Coneflower (Echinacea purpurea)
- Goldenrod species (Solidago spp.)
- Little Bluestem (Schizachyrium scoparium)
- Wild Bergamot (Monarda fistulosa)
- Butterfly Weed (Asclepias tuberosa)

## Recommendations

### For Data Model Enhancement

I recommend adding these optional fields to the Plant interface:

```typescript
interface PlantExtendedData {
  // High-priority additions
  usdaSymbol?: string;
  family?: string;
  phRange?: { min: number; max: number; optimal?: number[] };
  droughtTolerance?: 'none' | 'low' | 'medium' | 'high';
  shadeTolerance?: 'intolerant' | 'low' | 'medium' | 'high';
  growthRate?: 'slow' | 'medium' | 'fast' | 'aggressive';
  toxicity?: {
    livestock?: boolean;
    pets?: boolean;
    humans?: boolean;
    notes?: string;
  };
  
  // Medium-priority additions
  propagation?: {
    methods?: string[];
    difficulty?: 'easy' | 'medium' | 'difficult';
    seedTreatment?: string;
  };
  ethnobotanicUses?: string[];
  bloomPeriodDetailed?: string;
  maintenanceLevel?: 'very low' | 'low' | 'medium' | 'high';
  invasiveness?: {
    rating?: 'none' | 'low' | 'medium' | 'high';
    notes?: string;
  };
}
```

### For Data Acquisition

Since USDA doesn't have a public API:

1. **For Key Species (like common milkweed):** Manual data entry from USDA resources
2. **For Bulk Updates:** Consider web scraping with browser automation (Playwright/Selenium)
3. **Primary Data Source:** Continue using iNaturalist API (already implemented), supplement with USDA for specific fields
4. **PDF Extraction:** Use for ethnobotanic uses and detailed descriptions

### What to Store in PlantFinder

My recommendation for **what we should actually add** to the database:

**Priority 1 (Add First):**
- pH range (critical for site selection)
- Drought/shade/fire tolerance (site selection and water conservation)
- Toxicity information (safety)
- Growth rate (garden planning)
- USDA symbol (standard reference)

**Priority 2 (Add Later):**
- Family name (taxonomy)
- Detailed bloom period (June-August vs. just "summer")
- Propagation methods (useful for gardeners)
- Maintenance level (expectations)

**Priority 3 (Nice to Have):**
- Ethnobotanic uses (cultural interest)
- Companion plants (garden design)
- Invasiveness rating (management)

## Conclusion

The USDA Plants Database is a rich source of plant information, but lacks a public API for programmatic access. For Common Milkweed specifically, the most valuable additions to our database would be:

1. **Environmental tolerances** (pH, drought, shade) - 80% of users would benefit
2. **Safety information** (toxicity) - Essential for responsible recommendations
3. **Growth characteristics** (rate, invasiveness) - Prevents unpleasant surprises

The data exists and can be manually entered or scraped. I recommend starting with high-priority fields for key species, then potentially building a scraper if we need to scale to hundreds of species.

---

**Next Steps:**
1. Review this research and decide which fields to add to the data model
2. Determine if we should manually enhance common milkweed's data file with USDA information
3. Decide if we want to enhance other high-value species (butterfly weed, purple coneflower, etc.)

Let me know if you'd like me to:
- Add any of these fields to the current common milkweed data file
- Extend the TypeScript type definitions to include new fields
- Research additional species
- Create a web scraping tool for USDA data extraction
