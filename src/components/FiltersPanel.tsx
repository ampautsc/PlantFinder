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

function FiltersPanel({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
  isVisible,
}: FiltersPanelProps) {
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

  return (
    <div className={`filters-panel ${isVisible ? '' : 'hidden'}`}>
      {/* Plant Requirements */}
      <div className="filter-section">
        <h3>☀️ Sun Requirements</h3>
        <div className="filter-options">
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
      </div>

      <div className="filter-section">
        <h3>💧 Moisture Requirements</h3>
        <div className="filter-options">
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
      </div>

      <div className="filter-section">
        <h3>🌱 Soil Type</h3>
        <div className="filter-options">
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
      </div>

      {/* Plant Characteristics */}
      <div className="filter-section">
        <h3>🎨 Bloom Color</h3>
        <div className="filter-options">
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
      </div>

      <div className="filter-section">
        <h3>📅 Bloom Time</h3>
        <div className="filter-options">
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
      </div>

      <div className="filter-section">
        <h3>📏 Height (inches)</h3>
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

      <div className="filter-section">
        <h3>↔️ Width (inches)</h3>
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

      <div className="filter-section">
        <h3>🌿 Plant Type</h3>
        <div className="filter-options">
          <button
            className={`filter-chip ${filters.perennial === true ? 'selected' : ''}`}
            onClick={() => toggleBooleanFilter('perennial')}
          >
            Perennial
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h3>📍 Native Range</h3>
        <div className="filter-options">
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
      </div>

      <div className="filter-section">
        <h3>🌡️ Hardiness Zones</h3>
        <div className="filter-options">
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
      </div>

      {/* Plant Relationships */}
      <div className="filter-section">
        <h3>🦋 Food For</h3>
        <div className="filter-options">
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
      </div>

      <div className="filter-section">
        <h3>🌻 Useful For</h3>
        <div className="filter-options">
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
      </div>

      <button className="clear-filters-btn" onClick={onClearFilters}>
        Clear All Filters
      </button>
    </div>
  );
}

export default FiltersPanel;
