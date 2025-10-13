import { useState, useEffect } from 'react';
import './App.css';
import { Plant, PlantFilters } from './types/Plant';
import { MockPlantApi } from './api/MockPlantApi';
import PlantCard from './components/PlantCard';
import FiltersPanel from './components/FiltersPanel';
import SearchBar from './components/SearchBar';

const plantApi = new MockPlantApi();

function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PlantFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    bloomColors: [] as string[],
    bloomTimes: [] as string[],
    nativeRanges: [] as string[],
    hardinessZones: [] as string[],
    hostPlantTo: [] as string[],
    foodFor: [] as string[],
    usefulFor: [] as string[],
  });

  // Load filter options on mount
  useEffect(() => {
    plantApi.getFilterOptions().then(options => {
      setFilterOptions(options);
    });
  }, []);

  // Load plants based on filters
  useEffect(() => {
    setLoading(true);
    plantApi.searchPlants(filters).then(results => {
      setPlants(results);
      setLoading(false);
    });
  }, [filters]);

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleFiltersChange = (newFilters: PlantFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof PlantFilters];
    if (key === 'searchQuery') return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined;
  }).length;

  return (
    <div className="app">
      <header className="header">
        <h1>🌸 PlantFinder</h1>
        <p>Camp Monarch's Wildflower Search</p>
      </header>

      <SearchBar 
        searchQuery={filters.searchQuery || ''} 
        onSearchChange={handleSearchChange}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFilterCount={activeFilterCount}
      />

      <div className="main-content">
        <FiltersPanel
          filters={filters}
          filterOptions={filterOptions}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          isVisible={showFilters}
        />

        <div className="results-container">
          <div className="results-header">
            {loading ? (
              'Searching...'
            ) : (
              `${plants.length} wildflower${plants.length !== 1 ? 's' : ''} found`
            )}
          </div>

          {loading ? (
            <div className="loading">Loading plants...</div>
          ) : plants.length === 0 ? (
            <div className="empty-state">
              <h3>No plants found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="results-grid">
              {plants.map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
