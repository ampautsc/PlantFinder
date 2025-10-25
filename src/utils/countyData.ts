/**
 * County data structure for US states
 * County data is loaded from a static JSON file extracted from USDA distribution data
 */

export interface County {
  name: string;
  fips: string; // 5-digit county FIPS code (state + county)
}

// Cache for county data to avoid repeated fetches
let countyDataCache: Record<string, County[]> | null = null;

/**
 * Load county data from the static JSON file
 * @returns Record of state FIPS to counties array
 */
async function loadCountyData(): Promise<Record<string, County[]>> {
  if (countyDataCache) {
    return countyDataCache;
  }
  
  try {
    const response = await fetch('/data/us-counties.json');
    if (!response.ok) {
      console.error('Failed to load county data:', response.statusText);
      return {};
    }
    
    const data = await response.json();
    countyDataCache = data;
    return data;
  } catch (error) {
    console.error('Error loading county data:', error);
    return {};
  }
}

/**
 * Get counties for a specific state
 * @param stateFips 2-digit state FIPS code
 * @returns Array of counties for the state
 */
export async function getCountiesForState(stateFips: string): Promise<County[]> {
  const countyData = await loadCountyData();
  return countyData[stateFips] || [];
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
