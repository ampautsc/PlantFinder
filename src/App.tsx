import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Plant, PlantFilters } from './types/Plant';
import { MockPlantApi } from './api/MockPlantApi';
import PlantCard from './components/PlantCard';
import FiltersPanel from './components/FiltersPanel';
import FeedbackButton from './components/FeedbackButton';
import FeedbackModal from './components/FeedbackModal';
import AddPlantImageButton from './components/AddPlantImageButton';
import AddPlantImageModal from './components/AddPlantImageModal';
import PlantDetailView from './components/PlantDetailView';

const plantApi = new MockPlantApi();

function App() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PlantFilters>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    bloomColors: [] as string[],
    bloomTimes: [] as string[],
    nativeRanges: [] as string[],
    hardinessZones: [] as string[],
    hostPlantTo: [] as string[],
    foodFor: [] as string[],
    usefulFor: [] as string[],
  });
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Load all plants and filter options on mount
  useEffect(() => {
    plantApi.getAllPlants().then(allPlantsData => {
      setAllPlants(allPlantsData);
    });
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

  // Scroll results to top when plants change
  useEffect(() => {
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollTop = 0;
    }
  }, [plants]);

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleFiltersChange = (newFilters: PlantFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🌸 PlantFinder</h1>
        <p>Camp Monarch's Wildflower Search</p>
      </header>

      <div className="main-content">
        <FiltersPanel
          filters={filters}
          filterOptions={filterOptions}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          isVisible={true}
          searchQuery={filters.searchQuery || ''}
          onSearchChange={handleSearchChange}
        />

        <div className="results-container" ref={resultsContainerRef}>
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
                <PlantCard 
                  key={plant.id} 
                  plant={plant} 
                  onClick={() => setSelectedPlant(plant)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddPlantImageButton onClick={() => setShowAddImageModal(true)} />
      <FeedbackButton onClick={() => setShowFeedbackModal(true)} />
      <AddPlantImageModal
        isOpen={showAddImageModal}
        onClose={() => setShowAddImageModal(false)}
        plants={allPlants}
      />
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
      {selectedPlant && (
        <PlantDetailView 
          plant={selectedPlant} 
          onClose={() => setSelectedPlant(null)} 
        />
      )}
    </div>
  );
}

export default App;
