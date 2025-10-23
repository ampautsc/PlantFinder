# Filter Box Positioning Fix

## Issue
Filter boxes were appearing on top of filter buttons, especially on mobile devices, making it impossible to close the filter box. This created a very poor user experience.

## Solution
Updated the `calculateExpansionPosition` function in `src/components/FiltersPanel.tsx` to ensure that the filter expansion panel **NEVER** covers the filter button that triggered it.

## Changes Made

### Priority Order
Following the requirement stated in the issue: **Never cover button > Never go off-screen**

### Algorithm
1. **Initial Position**: Start by trying to position the expansion panel aligned with the top of the button
2. **Bottom Overflow Check**: If the panel would extend beyond the bottom of the viewport:
   - **Try Above**: First attempt to position the panel above the button
   - **Try Below**: If not enough space above, position it below the button with spacing
   - **Allow Off-Screen**: If neither position works perfectly, allow the panel to extend off-screen rather than covering the button
3. **Final Safeguard**: Ensure the panel never overlaps with the button, even if it means going partially off-screen

### Code Changes
The key change is in the vertical positioning logic (lines 127-157 in FiltersPanel.tsx):

```typescript
// CRITICAL: Ensure the expansion panel NEVER covers the button
const buttonBottom = buttonRect.bottom;
const buttonTop = buttonRect.top;

if (top + expansionMaxHeight > viewportHeight) {
  // Try positioning above the button first to avoid covering it
  const topAboveButton = buttonTop - expansionMaxHeight - spacing;
  
  if (topAboveButton >= spacing) {
    top = topAboveButton;
  } else {
    // Not enough space above; position below the button to avoid covering it
    top = buttonBottom + spacing;
    
    if (top + expansionMaxHeight > viewportHeight) {
      // Position at bottom edge, allowing off-screen if necessary
      // because the requirement is: never cover button > never go off-screen
      top = Math.max(buttonBottom + spacing, viewportHeight - expansionMaxHeight - spacing);
      
      // Final check: if this still overlaps the button, force it below
      if (top < buttonBottom + spacing) {
        top = buttonBottom + spacing;
      }
    }
  }
}
```

## Testing
- ✅ Code builds successfully
- ✅ Linter passes with no errors
- ✅ CodeQL security scan shows no vulnerabilities
- ✅ Dev server runs without issues

## Impact
This fix ensures that users can always close filter boxes on mobile devices by maintaining access to the filter button, even if it means the filter panel extends partially off-screen (which is scrollable).
