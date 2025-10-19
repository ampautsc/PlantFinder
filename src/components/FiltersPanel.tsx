import { useState } from 'react';
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
}

type FilterCategory = 'sun' | 'moisture' | 'soil' | 'bloomColor' | 'bloomTime' | 'height' | 'width' | 'perennial' | 'nativeRange' | 'hardinessZones' | 'foodFor' | 'usefulFor';

function FiltersPanel({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  isVisible,
}: FiltersPanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<FilterCategory | null>(null);

  const toggleArrayFilter = (key: keyof PlantFilters, value: string) => {
    const currentValues = (filters[key] as string[] | undefined) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [key]: newValues.length > 0 ? newValues : undefined,
    });
    
    // Auto-collapse after selection
    setExpandedCategory(null);
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
    
    // Auto-collapse after selection
    setExpandedCategory(null);
  };

  const toggleCategory = (category: FilterCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
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
    { key: 'sun' as FilterCategory, icon: '☀️', label: 'Sun' },
    { key: 'moisture' as FilterCategory, icon: '💧', label: 'Moisture' },
    { key: 'soil' as FilterCategory, icon: '🌱', label: 'Soil' },
    { key: 'bloomColor' as FilterCategory, icon: '🎨', label: 'Color' },
    { key: 'bloomTime' as FilterCategory, icon: '📅', label: 'Bloom' },
    { key: 'height' as FilterCategory, icon: '📏', label: 'Height' },
    { key: 'width' as FilterCategory, icon: '↔️', label: 'Width' },
    { key: 'perennial' as FilterCategory, icon: '🌿', label: 'Type' },
    { key: 'nativeRange' as FilterCategory, icon: '📍', label: 'Range' },
    { key: 'hardinessZones' as FilterCategory, icon: '🌡️', label: 'Zones' },
    { key: 'foodFor' as FilterCategory, icon: '🦋', label: 'Food' },
    { key: 'usefulFor' as FilterCategory, icon: '🌻', label: 'Use' },
  ];

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof PlantFilters];
    if (key === 'searchQuery') return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined;
  }).length;

  return (
    <div className={`filters-panel-new ${isVisible ? '' : 'hidden'}`}>
      <div className="filter-buttons">
        {filterCategories.map(category => (
          <button
            key={category.key}
            className={`filter-icon-btn ${hasActiveFilters(category.key) ? 'active' : ''} ${expandedCategory === category.key ? 'expanded' : ''}`}
            onClick={() => toggleCategory(category.key)}
            title={category.label}
          >
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-label">{category.label}</span>
          </button>
        ))}
        
        {activeFilterCount > 0 && (
          <button className="clear-filters-icon-btn" onClick={onClearFilters} title="Clear All">
            ✕
          </button>
        )}
      </div>

      {/* Expanded filter options */}
      {expandedCategory && (
        <div className="filter-expansion">
          {expandedCategory === 'sun' && (
            <div className="filter-options-row">
              {(['full-sun', 'partial-sun', 'partial-shade', 'full-shade'] as const).map(sun => (
                <button
                  key={sun}
                  className={`filter-chip ${(filters.sun || []).includes(sun) ? 'selected' : ''}`}
                  onClick={() => toggleArrayFilter('sun', sun)}
                >
                  {sun.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                  {moisture.charAt(0).toUpperCase() + moisture.slice(1)}
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
                  {soil.charAt(0).toUpperCase() + soil.slice(1)}
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
                  {color.charAt(0).toUpperCase() + color.slice(1)}
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
                  {time.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          )}

          {expandedCategory === 'height' && (
            <div className="filter-range-row">
              <label>Height (inches):</label>
              <div className="range-inputs">
                <input
                  type="number"
                  className="range-input"
                  placeholder="Min"
                  value={filters.minHeight || ''}
                  onChange={(e) => handleRangeChange('minHeight', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  className="range-input"
                  placeholder="Max"
                  value={filters.maxHeight || ''}
                  onChange={(e) => handleRangeChange('maxHeight', e.target.value)}
                />
              </div>
            </div>
          )}

          {expandedCategory === 'width' && (
            <div className="filter-range-row">
              <label>Width (inches):</label>
              <div className="range-inputs">
                <input
                  type="number"
                  className="range-input"
                  placeholder="Min"
                  value={filters.minWidth || ''}
                  onChange={(e) => handleRangeChange('minWidth', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  className="range-input"
                  placeholder="Max"
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
                Perennial
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
                  {range}
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
                  Zone {zone}
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
                  {food.charAt(0).toUpperCase() + food.slice(1)}
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
                  {use.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FiltersPanel;
