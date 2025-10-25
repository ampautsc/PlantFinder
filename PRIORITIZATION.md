# Wildflower List Prioritization

This document describes how plants are prioritized in the PlantFinder application.

## Overview

Plants in the wildflower list are automatically sorted by priority to highlight plants based on their ecological value and seed sharing community engagement.

## Priority Ranking

Plants are prioritized based on a point system:

1. **Host plant species** - 3 points per species hosted
   - Each butterfly, moth, or other insect species that uses the plant as a host
   - Example: A plant hosting Monarch and Queen butterflies gets 6 points (2 species × 3 points)

2. **Food/shelter groups** - 1 point per group
   - Each category in the `foodFor` array (bees, butterflies, birds, etc.)
   - Example: A plant providing food for "butterflies" and "bees" gets 2 points (2 groups × 1 point)

3. **Seeds offered** - 100 points per seed packet
   - Plants with seeds available through the seed share program
   - Example: 3 seed packets available = 300 points

4. **Adoption requests** - 10 points per request
   - Plants that people are requesting through the seed share program
   - Example: 2 requests = 20 points

## How It Works

Each plant receives a priority score based on the above factors:

```
Priority Score = 
  (Hosted Species Count × 3) +
  (Food/Shelter Groups Count × 1) +
  (Seeds Offered × 100) +
  (Adoption Requests × 10)
```

Plants are then sorted from highest to lowest priority score.

### Example Scores

- **Butterfly Weed** (2 hosted species, 2 food groups) with 3 seeds offered:
  - Host species (6) + Food groups (2) + Seeds (300) = **308 points**

- **Swamp Milkweed** (2 hosted species, 2 food groups) with 1 adoption request:
  - Host species (6) + Food groups (2) + Request (10) = **18 points**

- **Black-Eyed Susan** (0 host species, 2 food groups) with 2 seeds offered:
  - Food groups (2) + Seeds (200) = **202 points**

- **Common Milkweed** (2 hosted species, 2 food groups, no seeds/requests):
  - Host species (6) + Food groups (2) = **8 points**

- **Regular plant** with no relationships or seed activity:
  - **0 points**

## Customizing Priority Weights

The prioritization system is easily customizable. To adjust how plants are ranked:

1. Open the file: `/src/config/plantPrioritization.ts`

2. Edit the `DEFAULT_PRIORITIZATION_CONFIG` values:

```typescript
export const DEFAULT_PRIORITIZATION_CONFIG: PlantPrioritizationConfig = {
  pointsPerHostedSpecies: 3,       // Points per species hosted
  pointsPerFoodOrShelterGroup: 1,  // Points per food/shelter group
  seedsOfferedWeight: 100,         // Seeds offered multiplier
  adoptionRequestWeight: 10,       // Adoption request multiplier
};
```

### Example Customizations

**Increase host plant priority:**
```typescript
{
  pointsPerHostedSpecies: 10,      // Now 10 points per species
  pointsPerFoodOrShelterGroup: 1,
  seedsOfferedWeight: 100,
  adoptionRequestWeight: 10,
}
```

**Prioritize seed sharing over ecology:**
```typescript
{
  pointsPerHostedSpecies: 1,
  pointsPerFoodOrShelterGroup: 1,
  seedsOfferedWeight: 1000,  // Seeds now highest priority
  adoptionRequestWeight: 100,
}
```

**Equal priority for all factors:**
```typescript
{
  pointsPerHostedSpecies: 1,
  pointsPerFoodOrShelterGroup: 1,
  seedsOfferedWeight: 1,
  adoptionRequestWeight: 1,
}
```

**Disable prioritization (alphabetical only):**
```typescript
{
  pointsPerHostedSpecies: 0,
  pointsPerFoodOrShelterGroup: 0,
  seedsOfferedWeight: 0,
  adoptionRequestWeight: 0,
}
```

## Technical Details

### Implementation

The prioritization system is implemented in:

- **Configuration**: `/src/config/plantPrioritization.ts`
  - Defines priority weights
  - Scoring calculation functions
  - Helper functions to count hosted species and food/shelter groups

- **API Integration**: `/src/api/MockPlantApi.ts`
  - `setSeedShareVolumes()`: Loads seed share data for scoring
  - `sortByPriority()`: Applies priority sorting to search results
  - `calculatePlantScore()`: Calculates individual plant scores

- **App Integration**: `/src/App.tsx`
  - Loads seed share data on startup
  - Passes data to plant API for prioritization

### Plant Scoring

**Hosted Species Count:**
- Counts the number of entries in `hostPlantTo` array
- Each species (Monarch butterfly, Queen butterfly, etc.) = 1 count
- Example: `hostPlantTo: ["Monarch butterfly", "Queen butterfly"]` = 2 species

**Food/Shelter Groups Count:**
- Counts the number of entries in `foodFor` array
- Each group (butterflies, bees, birds, etc.) = 1 count
- Example: `foodFor: ["butterflies", "bees"]` = 2 groups

### Sorting Behavior

1. Plants are first filtered based on user's selected filters
2. Filtered plants are then sorted by priority score (highest first)
3. Plants with equal scores are sorted alphabetically by common name

This ensures:
- Search and filter functionality still works normally
- Priority sorting only applies to the filtered results
- User always sees relevant plants in priority order

## Visual Indicators

Plants in the list show visual badges for:

- 🫘 **Seeds icon + number**: Shows how many seed packets are offered
- 🤲 **Hands icon + number**: Shows how many adoption requests exist

These indicators help users quickly identify which plants have active seed sharing activity.

## Future Enhancements

Potential improvements to the prioritization system:

1. **User preferences**: Allow users to customize their own priority weights
2. **Region-based priority**: Prioritize plants native to user's location
3. **Seasonal priority**: Boost plants that bloom in current season
4. **Rarity priority**: Highlight rare or endangered species
5. **Conservation status**: Integrate with conservation databases
6. **Dynamic weights**: Adjust priorities based on community needs
7. **Monarch-specific boost**: Add extra points for plants specifically listed as Monarch hosts

## Questions?

For questions or suggestions about the prioritization system, please submit feedback through the application or open an issue on GitHub.

## Related Documentation

- [Seed Share System](./SEED_SHARE_SYSTEM.md) - How the seed sharing program works
- [Data Model](./DATA_MODEL_SUMMARY.md) - Plant data structure
- [Architecture](./ARCHITECTURE.md) - Application architecture overview
