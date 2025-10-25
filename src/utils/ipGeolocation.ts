/**
 * Utility for IP-based geolocation to detect user's state and county
 * Uses ipapi.co free API (no API key required for reasonable usage)
 */

import { STATE_TO_FIPS } from './fipsUtils';

export interface IPGeolocationResult {
  state: string; // State name (e.g., "Texas")
  stateFips: string; // 2-digit state FIPS code
  county?: string; // County name if available
  countyFips?: string; // 5-digit county FIPS if available
}

/**
 * Get user's location (state and county) from their IP address
 * @returns IPGeolocationResult or null if detection fails
 */
export async function detectLocationFromIP(): Promise<IPGeolocationResult | null> {
  try {
    // Use ipapi.co free API - allows 1,000 requests per day without API key
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      console.warn('IP geolocation API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Check if we got state information
    if (!data.region) {
      console.warn('No region information from IP geolocation');
      return null;
    }

    const stateName = data.region;
    const stateFips = STATE_TO_FIPS[stateName];
    
    if (!stateFips) {
      console.warn('Unknown state from IP geolocation:', stateName);
      return null;
    }

    // Note: IP geolocation typically doesn't provide county-level data
    // We only get state-level information
    return {
      state: stateName,
      stateFips: stateFips,
    };
  } catch (error) {
    console.error('Error detecting location from IP:', error);
    return null;
  }
}

/**
 * Get cached location from localStorage
 * Returns cached location if it was detected recently (within 24 hours)
 */
export function getCachedLocation(): IPGeolocationResult | null {
  try {
    const cached = localStorage.getItem('detectedLocation');
    if (!cached) return null;

    const { location, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (age > maxAge) {
      localStorage.removeItem('detectedLocation');
      return null;
    }

    return location;
  } catch (error) {
    console.error('Error reading cached location:', error);
    return null;
  }
}

/**
 * Cache detected location in localStorage
 */
export function cacheLocation(location: IPGeolocationResult): void {
  try {
    localStorage.setItem('detectedLocation', JSON.stringify({
      location,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching location:', error);
  }
}

/**
 * Detect user's location with caching
 * First checks cache, then makes API call if needed
 */
export async function detectLocationWithCache(): Promise<IPGeolocationResult | null> {
  // Check cache first
  const cached = getCachedLocation();
  if (cached) {
    console.log('Using cached location:', cached);
    return cached;
  }

  // Detect from IP
  const detected = await detectLocationFromIP();
  if (detected) {
    cacheLocation(detected);
  }

  return detected;
}
