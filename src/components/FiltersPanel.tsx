import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { PlantFilters } from '../types/Plant';

interface FiltersPanelProps {
  filters: PlantFilters;
  filterOptions: {
    bloomColors: string[];
    bloomTimes: string[];
    nativeRanges: string[];
    hardinessZones: string[];
    hostPlantTo: string[];
  };
  onFiltersChange: (filters: PlantFilters) => void;
  onClearFilters: () => void;
  isVisible: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type FilterCategory = 'sun' | 'moisture' | 'soil' | 'bloomColor' | 'bloomTime' | 'nativeRange' | 'hardinessZones';

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
    const spacing = 10; // Spacing between filter panel and expansion
    
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
    
    // Calculate vertical position aligned with the button
    let top = buttonRect.top;
    
    // CRITICAL: Ensure the expansion panel NEVER covers the button
    // Check if positioning at buttonRect.top would cause overlap with the button
    const buttonBottom = buttonRect.bottom;
    const buttonTop = buttonRect.top;
    
    // Check if expansion panel would go off-screen to the bottom
    if (top + expansionMaxHeight > viewportHeight) {
      // Try positioning above the button first to avoid covering it
      const topAboveButton = buttonTop - expansionMaxHeight - spacing;
      
      // If there's enough space above the button, use that position
      if (topAboveButton >= spacing) {
        top = topAboveButton;
      } else {
        // Not enough space above; position below the button to avoid covering it
        top = buttonBottom + spacing;
        
        // If positioning below would go off-screen, position at the bottom edge
        // but still ensure we don't cover the button
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
    
    // Ensure minimum padding from top
    top = Math.max(spacing, top);
    
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
    { key: 'hardinessZones' as FilterCategory, icon: '🌡️', label: t('filters.hardinessZones') },
    { key: 'nativeRange' as FilterCategory, icon: '📍', label: t('filters.nativeRange') },
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
