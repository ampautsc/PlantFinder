import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { PlantFilters } from '../types/Plant';
import { parseAndGeocodeLocation } from '../utils/geocodingUtils';

interface FiltersPanelProps {
  filters: PlantFilters;
  filterOptions: {
    bloomColors: string[];
    bloomTimes: string[];
    nativeRanges: string[];
    hardinessZones: string[];
    hostPlantTo: string[];
    foodFor: string[];
    shelterFor: string[];
  };
  onFiltersChange: (filters: PlantFilters) => void;
  onClearFilters: () => void;
  isVisible: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type FilterCategory = 'location' | 'wildlife' | 'sun' | 'moisture' | 'soil' | 'bloomColor' | 'bloomTime' | 'nativeRange' | 'hardinessZones';

function FiltersPanel({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  isVisible,
  searchQuery,
  onSearchChange,
}: FiltersPanelProps) {
  const { t } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState<FilterCategory | null>(null);
  const [expansionPosition, setExpansionPosition] = useState<{ top: number; left: number }>({ top: 0, left: 180 });
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const expansionPanelRef = useRef<HTMLDivElement | null>(null);
  const filtersPanelRef = useRef<HTMLDivElement | null>(null);
  
  // Location filter state
  const [locationInput, setLocationInput] = useState<string>(filters.location || '');
  const [geocodingStatus, setGeocodingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Sync locationInput with filters.location when filters change externally
  useEffect(() => {
    setLocationInput(filters.location || '');
    if (!filters.location) {
      setGeocodingStatus('idle');
    }
  }, [filters.location]);

  // Handle click outside to close expansion panel
  useEffect(() => {
    if (!expandedCategory) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedInsideExpansion = expansionPanelRef.current?.contains(target);
      const clickedInsideFiltersPanel = filtersPanelRef.current?.contains(target);
      
      if (!clickedInsideExpansion && !clickedInsideFiltersPanel) {
        setExpandedCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedCategory]);

  // Handle window resize and orientation change to reposition expansion panel
  useEffect(() => {
    if (!expandedCategory) return;

    const handleResize = () => {
      const position = calculateExpansionPosition(expandedCategory);
      setExpansionPosition(position);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [expandedCategory]);

  const toggleArrayFilter = (key: keyof PlantFilters, value: string) => {
    const currentValues = (filters[key] as string[] | undefined) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [key]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const calculateExpansionPosition = (category: FilterCategory) => {
    const buttonElement = buttonRefs.current[category];
    if (!buttonElement) return { top: 0, left: 180 };

    const buttonRect = buttonElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get the filters panel dimensions
    const filtersPanelRect = filtersPanelRef.current?.getBoundingClientRect();
    const filtersPanelRight = filtersPanelRect?.right || 180;
    
    // Expansion panel dimensions (from CSS)
    const expansionWidth = 280;
    const expansionMaxHeight = 400;
    const spacing = 10; // Spacing between elements
    const minSafeSpacing = 5; // Minimum spacing to ensure no visual overlap
    
    // Calculate horizontal position
    // Position to the right of the filter panel with spacing
    let left = filtersPanelRight + spacing;
    
    // Check if expansion panel would go off-screen to the right
    if (left + expansionWidth > viewportWidth) {
      // Try positioning to the left of the filter panel
      left = Math.max(spacing, buttonRect.left - expansionWidth - spacing);
      
      // If still doesn't fit, position at the right edge with padding
      if (left < spacing) {
        left = Math.max(spacing, viewportWidth - expansionWidth - spacing);
      }
    }
    
    // ENHANCED VERTICAL POSITIONING ALGORITHM
    // Priority: Never cover button > Make panel scrollable > Optimize position
    
    const buttonTop = buttonRect.top;
    const buttonBottom = buttonRect.bottom;
    const buttonHeight = buttonRect.height;
    
    // Calculate available space in different regions
    const spaceAboveButton = buttonTop - spacing;
    const spaceBelowButton = viewportHeight - buttonBottom - spacing;
    
    // Strategy 1: Try to position below the button (most intuitive for users)
    let top = buttonBottom + spacing;
    
    // Check if positioning below would cause panel to overlap with button
    // This can happen if button is very close to bottom of viewport
    if (top < buttonBottom + minSafeSpacing) {
      top = buttonBottom + minSafeSpacing;
    }
    
    // Strategy 2: If not enough space below, try positioning above
    if (spaceBelowButton < expansionMaxHeight && spaceAboveButton >= expansionMaxHeight) {
      // There's enough space above the button for the full panel
      top = buttonTop - expansionMaxHeight - spacing;
    } else if (spaceBelowButton < expansionMaxHeight && spaceAboveButton < expansionMaxHeight) {
      // Not enough space either above or below for full panel
      // Choose the side with more space and make the panel scrollable
      
      if (spaceAboveButton > spaceBelowButton && spaceAboveButton > buttonHeight + spacing * 2) {
        // More space above the button - position above
        // Position as high as possible while staying on screen
        top = Math.max(spacing, buttonTop - spaceAboveButton);
        // Panel height will be limited by CSS max-height and overflow-y: auto
      } else {
        // More space below the button (or equal) - position below
        // This ensures we never cover the button (primary requirement)
        top = buttonBottom + spacing;
        // Panel will be scrollable due to CSS max-height and overflow-y: auto
      }
    }
    
    // CRITICAL SAFEGUARDS: Ensure panel never overlaps the button
    // Check if the calculated position would cause overlap
    if (top < buttonBottom && top + expansionMaxHeight > buttonTop) {
      // Panel would overlap button - force it below the button
      top = buttonBottom + minSafeSpacing;
    }
    
    // Ensure the panel doesn't go above the viewport
    if (top < spacing) {
      // If button is at the very top, position below it
      if (buttonTop < spacing + buttonHeight) {
        top = buttonBottom + spacing;
      } else {
        top = spacing;
      }
    }
    
    // Final validation: If panel would still cover button, force it below
    if (top < buttonBottom + minSafeSpacing) {
      top = buttonBottom + minSafeSpacing;
    }
    
    return { top, left };
  };

  const toggleCategory = (category: FilterCategory) => {
    const newExpandedCategory = expandedCategory === category ? null : category;
    setExpandedCategory(newExpandedCategory);
    
    // Update position for expansion panel
    if (newExpandedCategory) {
      const position = calculateExpansionPosition(category);
      setExpansionPosition(position);
    }
  };

  // Handle location search with geocoding
  const handleLocationSearch = async () => {
    if (!locationInput.trim()) {
      // Clear location filter
      onFiltersChange({
        ...filters,
        location: undefined,
        countyFips: undefined,
        stateFips: undefined,
      });
      setGeocodingStatus('idle');
      return;
    }

    setGeocodingStatus('loading');
    
    try {
      const result = await parseAndGeocodeLocation(locationInput);
      
      if (result) {
        // Successfully geocoded - apply filter
        onFiltersChange({
          ...filters,
          location: locationInput,
          countyFips: [result.countyFips],
          stateFips: [result.stateFips],
        });
        setGeocodingStatus('success');
      } else {
        // Failed to geocode
        setGeocodingStatus('error');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocodingStatus('error');
    }
  };

  const handleLocationClear = () => {
    setLocationInput('');
    onFiltersChange({
      ...filters,
      location: undefined,
      countyFips: undefined,
      stateFips: undefined,
    });
    setGeocodingStatus('idle');
  };

  // Helper function to translate filter values
  const translateFilterValue = (value: string): string => {
    // Try to find a translation key for the value
    const normalizedValue = value.toLowerCase().replace(/\s+/g, '');
    const translationKeys = [
      `filters.${normalizedValue}`,
      `filters.${value.toLowerCase().replace(/\s+/g, '')}`,
      `filters.${value.replace(/\s+/g, '')}`,
    ];
    
    for (const key of translationKeys) {
      const translated = t(key);
      if (translated !== key) {
        return translated;
      }
    }
    
    // If no translation found, capitalize the value
    return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const hasActiveFilters = (category: FilterCategory): boolean => {
    switch (category) {
      case 'location':
        return !!(filters.location || filters.countyFips || filters.stateFips);
      case 'wildlife':
        return (
          ((filters.hostPlantTo as string[] | undefined) || []).length > 0 ||
          ((filters.foodFor as string[] | undefined) || []).length > 0 ||
          ((filters.shelterFor as string[] | undefined) || []).length > 0
        );
      case 'sun':
      case 'moisture':
      case 'soil':
      case 'bloomColor':
      case 'bloomTime':
      case 'nativeRange':
      case 'hardinessZones':
        return ((filters[category] as string[] | undefined) || []).length > 0;
      default:
        return false;
    }
  };

  const filterCategories = [
    { key: 'location' as FilterCategory, icon: '📍', label: t('filters.location') },
    { key: 'wildlife' as FilterCategory, icon: '🦋', label: t('filters.wildlife') },
    { key: 'hardinessZones' as FilterCategory, icon: '🌡️', label: t('filters.hardinessZones') },
    { key: 'nativeRange' as FilterCategory, icon: '🌎', label: t('filters.nativeRange') },
    { key: 'sun' as FilterCategory, icon: '☀️', label: t('filters.sun') },
    { key: 'moisture' as FilterCategory, icon: '💧', label: t('filters.moisture') },
    { key: 'soil' as FilterCategory, icon: '🌱', label: t('filters.soil') },
    { key: 'bloomColor' as FilterCategory, icon: '🎨', label: t('filters.bloomColor') },
    { key: 'bloomTime' as FilterCategory, icon: '📅', label: t('filters.bloomTime') },
  ];

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof PlantFilters];
    if (key === 'searchQuery') return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined;
  }).length;

  return (
    <>
      <div ref={filtersPanelRef} className={`filters-panel-new ${isVisible ? '' : 'hidden'} ${expandedCategory ? 'expanded' : ''}`}>
        <div className="filter-buttons">
          <div className="filter-search-container">
            <input
              type="text"
              className="filter-search-input"
              placeholder={t('filters.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {filterCategories.map(category => (
            <button
              key={category.key}
              ref={(el) => { buttonRefs.current[category.key] = el; }}
              className={`filter-icon-btn ${hasActiveFilters(category.key) ? 'active' : ''} ${expandedCategory === category.key ? 'expanded' : ''}`}
              onClick={() => toggleCategory(category.key)}
              title={category.label}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-label">{category.label}</span>
            </button>
          ))}
          
          {activeFilterCount > 0 && (
            <button className="clear-filters-icon-btn" onClick={onClearFilters} title={t('filters.clearAll')}>
              <span>✕</span>
              <span>{t('filters.clearAll')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded filter options - rendered via portal to document body */}
      {expandedCategory && document.body && createPortal(
        <div ref={expansionPanelRef} className="filter-expansion" style={{ top: `${expansionPosition.top}px`, left: `${expansionPosition.left}px` }}>
          {expandedCategory === 'location' && (
            <div className="filter-options-column">
              <div className="filter-section">
                <div className="filter-section-title">{t('filters.locationHelp')}</div>
                <div className="location-input-container">
                  <input
                    type="text"
                    className="location-input"
                    placeholder={t('filters.locationPlaceholder')}
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleLocationSearch();
                      }
                    }}
                  />
                  <div className="location-buttons">
                    <button
                      className="location-search-btn"
                      onClick={handleLocationSearch}
                      disabled={geocodingStatus === 'loading'}
                    >
                      {geocodingStatus === 'loading' ? t('filters.searching') : t('filters.search')}
                    </button>
                    {(filters.location || locationInput) && (
                      <button
                        className="location-clear-btn"
                        onClick={handleLocationClear}
                      >
                        {t('filters.clear')}
                      </button>
                    )}
                  </div>
                </div>
                {geocodingStatus === 'success' && filters.location && (
                  <div className="location-status location-success">
                    ✓ {t('filters.locationFound')}: {filters.location}
                  </div>
                )}
                {geocodingStatus === 'error' && (
                  <div className="location-status location-error">
                    ✗ {t('filters.locationNotFound')}
                  </div>
                )}
              </div>
            </div>
          )}

          {expandedCategory === 'wildlife' && (
            <div className="filter-options-column">
              <div className="filter-section">
                <div className="filter-section-title">{t('filters.hostPlantTo')}</div>
                <div className="filter-options-row">
                  {filterOptions.hostPlantTo.map(host => (
                    <button
                      key={host}
                      className={`filter-chip ${(filters.hostPlantTo || []).includes(host) ? 'selected' : ''}`}
                      onClick={() => toggleArrayFilter('hostPlantTo', host)}
                    >
                      {translateFilterValue(host)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <div className="filter-section-title">{t('filters.foodFor')}</div>
                <div className="filter-options-row">
                  {filterOptions.foodFor.map(food => (
                    <button
                      key={food}
                      className={`filter-chip ${(filters.foodFor || []).includes(food) ? 'selected' : ''}`}
                      onClick={() => toggleArrayFilter('foodFor', food)}
                    >
                      {translateFilterValue(food)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-section">
                <div className="filter-section-title">{t('filters.shelterFor')}</div>
                <div className="filter-options-row">
                  {filterOptions.shelterFor.map(shelter => (
                    <button
                      key={shelter}
                      className={`filter-chip ${(filters.shelterFor || []).includes(shelter) ? 'selected' : ''}`}
                      onClick={() => toggleArrayFilter('shelterFor', shelter)}
                    >
                      {translateFilterValue(shelter)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {expandedCategory === 'sun' && (
            <div className="filter-options-row">
              {(['full-sun', 'partial-sun', 'partial-shade', 'full-shade'] as const).map(sun => (
                <button
                  key={sun}
                  className={`filter-chip ${(filters.sun || []).includes(sun) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('sun', sun)}
                >
                  {t(`filters.${sun.replace(/-/g, '')}`)}
                </button>
              ))}
            </div>
          )}

          {expandedCategory === 'moisture' && (
            <div className="filter-options-row">
              {(['dry', 'medium', 'moist', 'wet'] as const).map(moisture => (
                <button
                  key={moisture}
                  className={`filter-chip ${(filters.moisture || []).includes(moisture) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('moisture', moisture)}
                >
                  {t(`filters.${moisture}`)}
                </button>
              ))}
            </div>
          )}

          {expandedCategory === 'soil' && (
            <div className="filter-options-row">
              {(['clay', 'loam', 'sand', 'rocky'] as const).map(soil => (
                <button
                  key={soil}
                  className={`filter-chip ${(filters.soil || []).includes(soil) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('soil', soil)}
                >
                  {t(`filters.${soil}`)}
                </button>
              ))}
            </div>
          )}

          {expandedCategory === 'bloomColor' && (
            <div className="filter-options-row">
              {filterOptions.bloomColors.map(color => (
                <button
                  key={color}
                  className={`filter-chip ${(filters.bloomColor || []).includes(color) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('bloomColor', color)}
                >
                  {translateFilterValue(color)}
                </button>
              ))}
            </div>
          )}

          {expandedCategory === 'bloomTime' && (
            <div className="filter-options-row">
              {filterOptions.bloomTimes.map(time => (
                <button
                  key={time}
                  className={`filter-chip ${(filters.bloomTime || []).includes(time) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('bloomTime', time)}
                >
                  {translateFilterValue(time)}
                </button>
              ))}
            </div>
          )}

          {expandedCategory === 'nativeRange' && (
            <div className="filter-options-row">
              {filterOptions.nativeRanges.map(range => (
                <button
                  key={range}
                  className={`filter-chip ${(filters.nativeRange || []).includes(range) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('nativeRange', range)}
                >
                  {translateFilterValue(range)}
                </button>
              ))}
            </div>
          )}

          {expandedCategory === 'hardinessZones' && (
            <div className="filter-options-row">
              {filterOptions.hardinessZones.map(zone => (
                <button
                  key={zone}
                  className={`filter-chip ${(filters.hardinessZones || []).includes(zone) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('hardinessZones', zone)}
                >
                  {t('filters.zone')} {zone}
                </button>
              ))}
            </div>
          )}


        </div>,
        document.body
      )}
    </>
  );
}

export default FiltersPanel;
