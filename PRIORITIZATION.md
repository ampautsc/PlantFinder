# Wildflower List Prioritization

This document describes how plants are prioritized in the PlantFinder application.

## Overview

Plants in the wildflower list are automatically sorted by priority to highlight the most important plants for Monarch butterfly conservation and seed sharing community.

## Priority Ranking

Plants are prioritized in the following order:

1. **Monarch butterfly host plants** (highest priority)
   - Asclepias species (milkweeds) and other plants that Monarch caterpillars feed on
   - These are essential for Monarch conservation

2. **Seeds offered**
   - Plants with seeds available through the seed share program
   - More seed packets available = higher priority

3. **Adoption requests**
   - Plants that people are requesting through the seed share program
   - More requests = higher priority

4. **Nectar sources**
   - Plants that provide nectar for adult butterflies and pollinators
   - Important for feeding adult Monarchs and other beneficial insects

## How It Works

Each plant receives a priority score based on the above factors:

```
Priority Score = 
  (Is Monarch Host? × 1000) +
  (Seeds Offered × 100) +
  (Adoption Requests × 10) +
  (Is Nectar Source? × 1)
```

Plants are then sorted from highest to lowest priority score.

### Example Scores

- **Butterfly Weed** with 2 seeds offered: 
  - Monarch host (1000) + 2 seeds (200) + nectar (1) = **1,201 points**

- **Swamp Milkweed** with 1 adoption request:
  - Monarch host (1000) + 1 request (10) + nectar (1) = **1,011 points**

- **Black-Eyed Susan** with 5 seeds offered:
  - 5 seeds (500) + nectar (1) = **501 points**

- **Regular nectar plant** with no seeds/requests:
  - Nectar (1) = **1 point**

## Customizing Priority Weights

The prioritization system is easily customizable. To adjust how plants are ranked:

1. Open the file: `/src/config/plantPrioritization.ts`

2. Edit the `DEFAULT_PRIORITIZATION_CONFIG` values:

```typescript
export const DEFAULT_PRIORITIZATION_CONFIG: PlantPrioritizationConfig = {
  monarchHostPlantWeight: 1000,    // Adjust Monarch host priority
  seedsOfferedWeight: 100,         // Adjust seeds offered priority
  adoptionRequestWeight: 10,       // Adjust adoption request priority
  nectarSourceWeight: 1,           // Adjust nectar source priority
};
```

### Example Customizations

**Prioritize seed sharing more than Monarch hosts:**
```typescript
{
  monarchHostPlantWeight: 100,
  seedsOfferedWeight: 1000,  // Now seeds are highest priority
  adoptionRequestWeight: 10,
  nectarSourceWeight: 1,
}
```

**Equal priority for all factors:**
```typescript
{
  monarchHostPlantWeight: 1,
  seedsOfferedWeight: 1,
  adoptionRequestWeight: 1,
  nectarSourceWeight: 1,
}
```

**Disable prioritization (alphabetical only):**
```typescript
{
  monarchHostPlantWeight: 0,
  seedsOfferedWeight: 0,
  adoptionRequestWeight: 0,
  nectarSourceWeight: 0,
}
```

## Technical Details

### Implementation

The prioritization system is implemented in:

- **Configuration**: `/src/config/plantPrioritization.ts`
  - Defines priority weights
  - Scoring calculation functions
  - Helper functions to identify Monarch hosts and nectar sources

- **API Integration**: `/src/api/MockPlantApi.ts`
  - `setSeedShareVolumes()`: Loads seed share data for scoring
  - `sortByPriority()`: Applies priority sorting to search results
  - `calculatePlantScore()`: Calculates individual plant scores

- **App Integration**: `/src/App.tsx`
  - Loads seed share data on startup
  - Passes data to plant API for prioritization

### Plant Identification

**Monarch Host Plants:**
- Identified by checking if "monarch" appears in the `hostPlantTo` array
- Example: `hostPlantTo: ["Monarch butterfly", "Queen butterfly"]`

**Nectar Sources:**
- Identified by checking if "nectar" appears in the plant description
- Or if "pollinator" appears in the `usefulFor` array
- Example: `description: "...excellent nectar source..."`

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

## Questions?

For questions or suggestions about the prioritization system, please submit feedback through the application or open an issue on GitHub.

## Related Documentation

- [Seed Share System](./SEED_SHARE_SYSTEM.md) - How the seed sharing program works
- [Data Model](./DATA_MODEL_SUMMARY.md) - Plant data structure
- [Architecture](./ARCHITECTURE.md) - Application architecture overview
