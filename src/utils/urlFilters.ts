import { PlantFilters } from '../types/Plant';

/**
 * Serializes PlantFilters to URL search parameters
 * Handles arrays, booleans, numbers, and strings
 */
export function filtersToUrlParams(filters: PlantFilters): URLSearchParams {
  const params = new URLSearchParams();

  // Helper to add array values
  const addArrayParam = (key: string, values: string[] | undefined) => {
    if (values && values.length > 0) {
      values.forEach(value => params.append(key, value));
    }
  };

  // Helper to add single value
  const addParam = (key: string, value: string | number | boolean | undefined) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  };

  // Array filters
  addArrayParam('sun', filters.sun);
  addArrayParam('moisture', filters.moisture);
  addArrayParam('soil', filters.soil);
  addArrayParam('bloomColor', filters.bloomColor);
  addArrayParam('bloomTime', filters.bloomTime);
  addArrayParam('hostPlantTo', filters.hostPlantTo);
  addArrayParam('foodFor', filters.foodFor);
  addArrayParam('shelterFor', filters.shelterFor);
  addArrayParam('usefulFor', filters.usefulFor);
  addArrayParam('countyFips', filters.countyFips);
  addArrayParam('stateFips', filters.stateFips);

  // Single value filters
  addParam('searchQuery', filters.searchQuery);
  addParam('location', filters.location);
  addParam('perennial', filters.perennial);
  addParam('minHeight', filters.minHeight);
  addParam('maxHeight', filters.maxHeight);
  addParam('minWidth', filters.minWidth);
  addParam('maxWidth', filters.maxWidth);
  addParam('inMyGarden', filters.inMyGarden);
  addParam('seedsOffered', filters.seedsOffered);
  addParam('adoptionOffered', filters.adoptionOffered);

  return params;
}

/**
 * Deserializes URL search parameters to PlantFilters
 */
export function urlParamsToFilters(params: URLSearchParams): PlantFilters {
  const filters: PlantFilters = {};

  // Helper to get array values
  const getArrayParam = (key: string): string[] | undefined => {
    const values = params.getAll(key);
    return values.length > 0 ? values : undefined;
  };

  // Helper to get boolean value
  const getBooleanParam = (key: string): boolean | undefined => {
    const value = params.get(key);
    if (value === null) return undefined;
    return value === 'true';
  };

  // Helper to get number value
  const getNumberParam = (key: string): number | undefined => {
    const value = params.get(key);
    if (value === null) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  };

  // Array filters
  filters.sun = getArrayParam('sun') as PlantFilters['sun'];
  filters.moisture = getArrayParam('moisture') as PlantFilters['moisture'];
  filters.soil = getArrayParam('soil') as PlantFilters['soil'];
  filters.bloomColor = getArrayParam('bloomColor');
  filters.bloomTime = getArrayParam('bloomTime');
  filters.hostPlantTo = getArrayParam('hostPlantTo');
  filters.foodFor = getArrayParam('foodFor');
  filters.shelterFor = getArrayParam('shelterFor');
  filters.usefulFor = getArrayParam('usefulFor');
  filters.countyFips = getArrayParam('countyFips');
  filters.stateFips = getArrayParam('stateFips');

  // Single value filters
  filters.searchQuery = params.get('searchQuery') || undefined;
  filters.location = params.get('location') || undefined;
  filters.perennial = getBooleanParam('perennial');
  filters.minHeight = getNumberParam('minHeight');
  filters.maxHeight = getNumberParam('maxHeight');
  filters.minWidth = getNumberParam('minWidth');
  filters.maxWidth = getNumberParam('maxWidth');
  filters.inMyGarden = getBooleanParam('inMyGarden');
  filters.seedsOffered = getBooleanParam('seedsOffered');
  filters.adoptionOffered = getBooleanParam('adoptionOffered');

  return filters;
}

/**
 * Updates the browser URL with filter parameters without triggering a page reload
 */
export function updateUrlWithFilters(filters: PlantFilters): void {
  const params = filtersToUrlParams(filters);
  const newUrl = params.toString() 
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  
  window.history.replaceState({}, '', newUrl);
}

/**
 * Gets filters from the current URL
 */
export function getFiltersFromUrl(): PlantFilters {
  const params = new URLSearchParams(window.location.search);
  return urlParamsToFilters(params);
}
