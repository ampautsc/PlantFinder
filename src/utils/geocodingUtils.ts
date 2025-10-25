/**
 * Utility functions for geocoding addresses to FIPS codes
 * Uses the US Census Bureau Geocoding API (free, no API key required)
 * 
 * References:
 * - https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html
 */

export interface GeocodingResult {
  address: string;
  countyFips: string;
  stateFips: string;
  county: string;
  state: string;
}

/**
 * Geocode an address to get county and state FIPS codes
 * @param address Address string (e.g., "4600 Silver Hill Rd, Washington, DC 20233")
 * @returns GeocodingResult with FIPS codes or null if not found
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    // Use Census Bureau Geocoding API (free, no API key)
    // Format: https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress
    const params = new URLSearchParams({
      address: address,
      benchmark: 'Public_AR_Current',
      vintage: 'Current_Current',
      format: 'json',
    });

    const url = `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?${params.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Geocoding API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Check if we got results
    if (!data.result?.addressMatches || data.result.addressMatches.length === 0) {
      console.warn('No geocoding results found for address:', address);
      return null;
    }

    // Get the first (best) match
    const match = data.result.addressMatches[0];
    const geographies = match.geographies;
    
    // Extract county information
    const county = geographies?.['Counties']?.[0];
    if (!county) {
      console.warn('No county information in geocoding result');
      return null;
    }

    // County FIPS is state FIPS (2 digits) + county FIPS (3 digits)
    const stateFips = county.STATE;
    const countyFips = county.COUNTY;
    const fullCountyFips = stateFips + countyFips;

    return {
      address: match.matchedAddress,
      countyFips: fullCountyFips,
      stateFips: stateFips,
      county: county.NAME,
      state: county.STATE,
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

/**
 * Geocode a ZIP code to get county and state FIPS codes
 * Note: A ZIP code can span multiple counties. This returns the first match.
 * @param zipCode 5-digit ZIP code
 * @returns GeocodingResult with FIPS codes or null if not found
 */
export async function geocodeZipCode(zipCode: string): Promise<GeocodingResult | null> {
  // Validate ZIP code format
  if (!/^\d{5}$/.test(zipCode)) {
    console.warn('Invalid ZIP code format:', zipCode);
    return null;
  }

  // Use the address geocoding with just the ZIP code
  // The Census API can handle ZIP codes
  return geocodeAddress(zipCode);
}

/**
 * Parse a location string and attempt to geocode it
 * Handles various formats: full address, ZIP code, city + state, etc.
 * @param location Location string from user input
 * @returns GeocodingResult with FIPS codes or null if not found
 */
export async function parseAndGeocodeLocation(location: string): Promise<GeocodingResult | null> {
  if (!location || !location.trim()) {
    return null;
  }

  const trimmed = location.trim();

  // Check if it's just a ZIP code
  if (/^\d{5}$/.test(trimmed)) {
    return geocodeZipCode(trimmed);
  }

  // Otherwise, try to geocode as a full address
  return geocodeAddress(trimmed);
}
