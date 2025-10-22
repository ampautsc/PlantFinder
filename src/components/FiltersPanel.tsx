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
    foodFor: string[];
    usefulFor: string[];
  };
  onFiltersChange: (filters: PlantFilters) => void;
  onClearFilters: () => void;
  isVisible: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type FilterCategory = 'sun' | 'moisture' | 'soil' | 'bloomColor' | 'bloomTime' | 'height' | 'width' | 'perennial' | 'nativeRange' | 'hardinessZones' | 'foodFor' | 'usefulFor';

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

  const handleRangeChange = (key: keyof PlantFilters, value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    onFiltersChange({
      ...filters,
      [key]: numValue,
    });
  };

  const toggleBooleanFilter = (key: keyof PlantFilters) => {
    onFiltersChange({
      ...filters,
      [key]: filters[key] === undefined ? true : undefined,
    });
  };

  const calculateExpansionPosition = (category: FilterCategory) => {
    const buttonElement = buttonRefs.current[category];
    if (!buttonElement) return { top: 0, left: 180 };

    const buttonRect = buttonElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Expansion panel dimensions (from CSS)
    const expansionWidth = 280;
    const expansionMaxHeight = 400;
    
    // On mobile (< 768px), center the expansion panel as a modal
    const isMobile = viewportWidth < 768;
    
    if (isMobile) {
      // Center horizontally with padding
      const left = Math.max(10, (viewportWidth - expansionWidth) / 2);
      
      // Position below the button, but ensure it's visible
      let top = buttonRect.bottom + 10;
      
      // If it would go off-screen, position it in the center of viewport
      if (top + expansionMaxHeight > viewportHeight - 10) {
        top = Math.max(10, (viewportHeight - expansionMaxHeight) / 2);
      }
      
      return { top, left };
    }
    
    // Desktop positioning (original logic)
    // Get the filters panel width
    const filtersPanelWidth = filtersPanelRef.current?.getBoundingClientRect().width || 180;
    
    // Calculate horizontal position
    let left = filtersPanelWidth;
    
    // Check if expansion panel would go off-screen to the right
    if (left + expansionWidth > viewportWidth) {
      // Try positioning to the left of the filter panel
      left = Math.max(0, buttonRect.left - expansionWidth);
      
      // If still doesn't fit, position at the right edge with some padding
      if (left < 0) {
        left = Math.max(10, viewportWidth - expansionWidth - 10);
      }
    }
    
    // Calculate vertical position
    let top = buttonRect.top;
    
    // Check if expansion panel would go off-screen to the bottom
    if (top + expansionMaxHeight > viewportHeight) {
      // Try positioning above the button
      top = Math.max(10, buttonRect.bottom - expansionMaxHeight);
      
      // If still doesn't fit, position at the bottom with some padding
      if (top < 10) {
        top = Math.max(10, viewportHeight - expansionMaxHeight - 10);
      }
    }
    
    // Ensure minimum padding from top
    top = Math.max(10, top);
    
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
      case 'foodFor':
      case 'usefulFor':
        return ((filters[category] as string[] | undefined) || []).length > 0;
      case 'height':
        return filters.minHeight !== undefined || filters.maxHeight !== undefined;
      case 'width':
        return filters.minWidth !== undefined || filters.maxWidth !== undefined;
      case 'perennial':
        return filters.perennial === true;
      default:
        return false;
    }
  };

  const filterCategories = [
    { key: 'sun' as FilterCategory, icon: '☀️', label: t('filters.sun') },
    { key: 'moisture' as FilterCategory, icon: '💧', label: t('filters.moisture') },
    { key: 'soil' as FilterCategory, icon: '🌱', label: t('filters.soil') },
    { key: 'bloomColor' as FilterCategory, icon: '🎨', label: t('filters.bloomColor') },
    { key: 'bloomTime' as FilterCategory, icon: '📅', label: t('filters.bloomTime') },
    { key: 'height' as FilterCategory, icon: '📏', label: t('filters.height') },
    { key: 'width' as FilterCategory, icon: '↔️', label: t('filters.width') },
    { key: 'perennial' as FilterCategory, icon: '🌿', label: t('filters.type') },
    { key: 'nativeRange' as FilterCategory, icon: '📍', label: t('filters.nativeRange') },
    { key: 'hardinessZones' as FilterCategory, icon: '🌡️', label: t('filters.hardinessZones') },
    { key: 'foodFor' as FilterCategory, icon: '🦋', label: t('filters.foodFor') },
    { key: 'usefulFor' as FilterCategory, icon: '🌻', label: t('filters.usefulFor') },
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
        <>
          {/* Backdrop for mobile - only show on screens < 768px */}
          {window.innerWidth < 768 && (
            <div 
              className="filter-backdrop" 
              onClick={() => setExpandedCategory(null)}
            />
          )}
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

          {expandedCategory === 'height' && (
            <div className="filter-range-row">
              <label>{t('filters.heightLabel')}</label>
              <div className="range-inputs">
                <input
                  type="number"
                  className="range-input"
                  placeholder={t('filters.min')}
                  value={filters.minHeight || ''}
                  onChange={(e) => handleRangeChange('minHeight', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  className="range-input"
                  placeholder={t('filters.max')}
                  value={filters.maxHeight || ''}
                  onChange={(e) => handleRangeChange('maxHeight', e.target.value)}
                />
              </div>
            </div>
          )}

          {expandedCategory === 'width' && (
            <div className="filter-range-row">
              <label>{t('filters.widthLabel')}</label>
              <div className="range-inputs">
                <input
                  type="number"
                  className="range-input"
                  placeholder={t('filters.min')}
                  value={filters.minWidth || ''}
                  onChange={(e) => handleRangeChange('minWidth', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  className="range-input"
                  placeholder={t('filters.max')}
                  value={filters.maxWidth || ''}
                  onChange={(e) => handleRangeChange('maxWidth', e.target.value)}
                />
              </div>
            </div>
          )}

          {expandedCategory === 'perennial' && (
            <div className="filter-options-row">
              <button
                className={`filter-chip ${filters.perennial === true ? 'selected' : ''}`}
                onClick={() => toggleBooleanFilter('perennial')}
              >
                {t('filters.perennial')}
              </button>
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

          {expandedCategory === 'foodFor' && (
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
          )}

          {expandedCategory === 'usefulFor' && (
            <div className="filter-options-row">
              {filterOptions.usefulFor.map(use => (
                <button
                  key={use}
                  className={`filter-chip ${(filters.usefulFor || []).includes(use) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('usefulFor', use)}
                >
                  {translateFilterValue(use)}
                </button>
              ))}
            </div>
          )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default FiltersPanel;
