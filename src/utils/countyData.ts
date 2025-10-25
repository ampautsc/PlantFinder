/**
 * County data structure for US states
 * Note: This is a minimal implementation. For full county support,
 * county data should be loaded from an external API or data file.
 */

export interface County {
  name: string;
  fips: string; // 5-digit county FIPS code (state + county)
}

/**
 * Get counties for a specific state
 * @param stateFips 2-digit state FIPS code
 * @returns Array of counties for the state
 * 
 * Note: This currently returns an empty array.
 * In a full implementation, this would load county data from an external source.
 * For now, we'll focus on state-level filtering only.
 */
export async function getCountiesForState(stateFips: string): Promise<County[]> {
  // TODO: Implement county data loading
  // This could load from:
  // 1. A local JSON file with county data
  // 2. An external API
  // 3. The Census Bureau API
  
  // Suppress unused parameter warning - will be used when counties are implemented
  void stateFips;
  
  // For now, return empty array - county selection will be optional
  return [];
}

/**
 * Search counties by name within a state
 * @param stateFips 2-digit state FIPS code
 * @param searchQuery Search query
 * @returns Array of matching counties
 */
export async function searchCounties(stateFips: string, searchQuery: string): Promise<County[]> {
  const counties = await getCountiesForState(stateFips);
  const query = searchQuery.toLowerCase();
  
  return counties.filter(county => 
    county.name.toLowerCase().includes(query)
  );
}
