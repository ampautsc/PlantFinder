/**
 * Utility functions for working with FIPS codes (Federal Information Processing Standards)
 * 
 * FIPS codes are used to identify US states and counties:
 * - 2-digit state codes: "01" (Alabama) through "56" (Wyoming)
 * - 5-digit county codes: state code + 3-digit county code (e.g., "48201" = Harris County, TX)
 * 
 * References:
 * - https://www.census.gov/library/reference/code-lists/ansi.html
 * - https://en.wikipedia.org/wiki/FIPS_county_code
 */

import { PlantDistribution } from '../types/Plant';

/**
 * State FIPS codes to state names mapping
 */
export const FIPS_TO_STATE: Record<string, string> = {
  '01': 'Alabama',
  '02': 'Alaska',
  '04': 'Arizona',
  '05': 'Arkansas',
  '06': 'California',
  '08': 'Colorado',
  '09': 'Connecticut',
  '10': 'Delaware',
  '11': 'District of Columbia',
  '12': 'Florida',
  '13': 'Georgia',
  '15': 'Hawaii',
  '16': 'Idaho',
  '17': 'Illinois',
  '18': 'Indiana',
  '19': 'Iowa',
  '20': 'Kansas',
  '21': 'Kentucky',
  '22': 'Louisiana',
  '23': 'Maine',
  '24': 'Maryland',
  '25': 'Massachusetts',
  '26': 'Michigan',
  '27': 'Minnesota',
  '28': 'Mississippi',
  '29': 'Missouri',
  '30': 'Montana',
  '31': 'Nebraska',
  '32': 'Nevada',
  '33': 'New Hampshire',
  '34': 'New Jersey',
  '35': 'New Mexico',
  '36': 'New York',
  '37': 'North Carolina',
  '38': 'North Dakota',
  '39': 'Ohio',
  '40': 'Oklahoma',
  '41': 'Oregon',
  '42': 'Pennsylvania',
  '44': 'Rhode Island',
  '45': 'South Carolina',
  '46': 'South Dakota',
  '47': 'Tennessee',
  '48': 'Texas',
  '49': 'Utah',
  '50': 'Vermont',
  '51': 'Virginia',
  '53': 'Washington',
  '54': 'West Virginia',
  '55': 'Wisconsin',
  '56': 'Wyoming',
};

/**
 * State names to FIPS codes mapping (inverse of FIPS_TO_STATE)
 */
export const STATE_TO_FIPS: Record<string, string> = Object.entries(FIPS_TO_STATE).reduce(
  (acc, [fips, name]) => {
    acc[name] = fips;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Extract state FIPS code from a county FIPS code
 * @param countyFips 5-digit county FIPS code (e.g., "48201")
 * @returns 2-digit state FIPS code (e.g., "48")
 */
export function getStateFipsFromCounty(countyFips: string): string {
  if (!countyFips || countyFips.length < 2) {
    throw new Error(`Invalid county FIPS code: ${countyFips}`);
  }
  return countyFips.substring(0, 2);
}

/**
 * Get unique state FIPS codes from a list of county FIPS codes
 * @param countyFips Array of 5-digit county FIPS codes
 * @returns Array of unique 2-digit state FIPS codes
 */
export function getStateFipsFromCounties(countyFips: string[]): string[] {
  const stateFips = new Set<string>();
  
  countyFips.forEach(code => {
    try {
      const state = getStateFipsFromCounty(code);
      stateFips.add(state);
    } catch (error) {
      console.warn(`Skipping invalid county FIPS code: ${code}`);
    }
  });
  
  return Array.from(stateFips).sort();
}

/**
 * Get state name from FIPS code
 * @param stateFips 2-digit state FIPS code
 * @returns State name or undefined if not found
 */
export function getStateName(stateFips: string): string | undefined {
  return FIPS_TO_STATE[stateFips];
}

/**
 * Get state FIPS code from state name
 * @param stateName State name (case-insensitive)
 * @returns 2-digit state FIPS code or undefined if not found
 */
export function getStateFips(stateName: string): string | undefined {
  return STATE_TO_FIPS[stateName];
}

/**
 * Convert state names to FIPS codes
 * @param stateNames Array of state names
 * @returns Array of 2-digit state FIPS codes
 */
export function stateNamesToFips(stateNames: string[]): string[] {
  return stateNames
    .map(name => getStateFips(name))
    .filter((fips): fips is string => fips !== undefined);
}

/**
 * Convert FIPS codes to state names
 * @param stateFips Array of 2-digit state FIPS codes
 * @returns Array of state names
 */
export function fipsToStateNames(stateFips: string[]): string[] {
  return stateFips
    .map(fips => getStateName(fips))
    .filter((name): name is string => name !== undefined);
}

/**
 * Check if a county FIPS code is in a specific state
 * @param countyFips 5-digit county FIPS code
 * @param stateFips 2-digit state FIPS code
 * @returns true if county is in the state
 */
export function isCountyInState(countyFips: string, stateFips: string): boolean {
  return countyFips.startsWith(stateFips);
}

/**
 * Filter county FIPS codes by state
 * @param countyFips Array of 5-digit county FIPS codes
 * @param stateFips 2-digit state FIPS code
 * @returns Array of county FIPS codes in the specified state
 */
export function filterCountiesByState(countyFips: string[], stateFips: string): string[] {
  return countyFips.filter(code => isCountyInState(code, stateFips));
}

/**
 * Validate a FIPS code format
 * @param fips FIPS code to validate
 * @param type Expected type: 'state' (2 digits) or 'county' (5 digits)
 * @returns true if valid format
 */
export function isValidFips(fips: string, type: 'state' | 'county'): boolean {
  if (type === 'state') {
    return /^\d{2}$/.test(fips) && FIPS_TO_STATE[fips] !== undefined;
  } else {
    return /^\d{5}$/.test(fips) && FIPS_TO_STATE[fips.substring(0, 2)] !== undefined;
  }
}

/**
 * Get state FIPS codes from a PlantDistribution object
 * If statesFips is not provided, derives it from fipsCodes
 * @param distribution PlantDistribution object
 * @returns Array of unique 2-digit state FIPS codes
 */
export function getStatesFromDistribution(distribution: PlantDistribution): string[] {
  if (distribution.statesFips && distribution.statesFips.length > 0) {
    return distribution.statesFips;
  }
  
  if (distribution.fipsCodes && distribution.fipsCodes.length > 0) {
    return getStateFipsFromCounties(distribution.fipsCodes);
  }
  
  return [];
}

/**
 * Check if a plant is native to a specific state
 * @param distribution PlantDistribution object
 * @param stateFips 2-digit state FIPS code or state name
 * @returns true if plant is native to the state
 */
export function isNativeToState(distribution: PlantDistribution | undefined, stateFips: string): boolean {
  if (!distribution) {
    return false;
  }
  
  // Convert state name to FIPS if needed
  const fipsCode = stateFips.length === 2 ? stateFips : getStateFips(stateFips);
  if (!fipsCode) {
    return false;
  }
  
  const states = getStatesFromDistribution(distribution);
  return states.includes(fipsCode);
}

/**
 * Check if a plant is native to a specific county
 * @param distribution PlantDistribution object
 * @param countyFips 5-digit county FIPS code
 * @returns true if plant is native to the county
 */
export function isNativeToCounty(distribution: PlantDistribution | undefined, countyFips: string): boolean {
  if (!distribution || !distribution.fipsCodes) {
    return false;
  }
  
  return distribution.fipsCodes.includes(countyFips);
}

/**
 * Check if a plant is native to any of the specified locations
 * @param distribution PlantDistribution object
 * @param stateFips Array of 2-digit state FIPS codes
 * @param countyFips Optional array of 5-digit county FIPS codes
 * @returns true if plant is native to any of the locations
 */
export function isNativeToAnyLocation(
  distribution: PlantDistribution | undefined,
  stateFips?: string[],
  countyFips?: string[]
): boolean {
  if (!distribution) {
    return false;
  }
  
  // Check county-level match first (more specific)
  if (countyFips && countyFips.length > 0) {
    return countyFips.some(code => isNativeToCounty(distribution, code));
  }
  
  // Check state-level match
  if (stateFips && stateFips.length > 0) {
    return stateFips.some(code => isNativeToState(distribution, code));
  }
  
  return false;
}

/**
 * Migrate legacy nativeRange (state names) to PlantDistribution
 * This is a helper for backward compatibility
 * @param nativeRange Array of state names
 * @returns PlantDistribution object with state FIPS codes
 */
export function migrateNativeRangeToDistribution(nativeRange: string[]): PlantDistribution {
  const stateFips = stateNamesToFips(nativeRange);
  
  return {
    fipsCodes: [], // Empty - county data not available from state names
    statesFips: stateFips,
  };
}

/**
 * Get a display string for distribution (for UI)
 * @param distribution PlantDistribution object
 * @param maxStates Maximum number of states to show (default: 5)
 * @returns Human-readable string like "Texas, Oklahoma, and 3 more states"
 */
export function getDistributionDisplayString(
  distribution: PlantDistribution | undefined,
  maxStates: number = 5
): string {
  if (!distribution) {
    return 'Distribution data not available';
  }
  
  const states = getStatesFromDistribution(distribution);
  if (states.length === 0) {
    return 'Distribution data not available';
  }
  
  const stateNames = fipsToStateNames(states);
  
  if (stateNames.length <= maxStates) {
    if (stateNames.length === 1) {
      return stateNames[0];
    } else if (stateNames.length === 2) {
      return `${stateNames[0]} and ${stateNames[1]}`;
    } else {
      const lastState = stateNames[stateNames.length - 1];
      const otherStates = stateNames.slice(0, -1).join(', ');
      return `${otherStates}, and ${lastState}`;
    }
  } else {
    const displayStates = stateNames.slice(0, maxStates).join(', ');
    const remaining = stateNames.length - maxStates;
    return `${displayStates}, and ${remaining} more state${remaining > 1 ? 's' : ''}`;
  }
}
