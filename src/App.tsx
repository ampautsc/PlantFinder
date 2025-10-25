import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import { Plant, PlantFilters } from './types/Plant';
import { MockPlantApi } from './api/MockPlantApi';
import { mockSeedShareService } from './api/MockSeedShareService';
import { mockGardenService } from './api/MockGardenService';
import { PlantSeedShareVolume, UserPlantSeedShare } from './types/SeedShare';
import PlantCard from './components/PlantCard';
import FiltersPanel from './components/FiltersPanel';
import FeedbackButton from './components/FeedbackButton';
import FeedbackModal from './components/FeedbackModal';
import AddPlantImageButton from './components/AddPlantImageButton';
import AddPlantImageModal from './components/AddPlantImageModal';
import PlantDetailView from './components/PlantDetailView';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import { useTheme } from './contexts/ThemeContext';
import { detectLocationWithCache } from './utils/ipGeolocation';

const plantApi = new MockPlantApi();
const CURRENT_USER_ID = 'current';

function App() {
  const { theme } = useTheme();
  const { t } = useTranslation();
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
    shelterFor: [] as string[],
  });
  const [plantVolumes, setPlantVolumes] = useState<Map<string, PlantSeedShareVolume>>(new Map());
  const [userActivities, setUserActivities] = useState<Map<string, UserPlantSeedShare>>(new Map());
  const [gardenPlants, setGardenPlants] = useState<Set<string>>(new Set());
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const hasDetectedLocation = useRef(false);

  // Load garden data
  const loadGardenData = async () => {
    try {
      const allGardenPlants = await mockGardenService.getAllGardenPlants();
      const gardenSet = new Set<string>();
      allGardenPlants.forEach(plant => {
        gardenSet.add(plant.plantId);
      });
      setGardenPlants(gardenSet);
    } catch (error) {
      console.error('Error loading garden data:', error);
    }
  };

  // Auto-detect location from IP on mount
  useEffect(() => {
    // Only detect once and only if we haven't already detected
    if (hasDetectedLocation.current) return;
    
    detectLocationWithCache().then(location => {
      // Mark as detected after the async operation completes
      hasDetectedLocation.current = true;
      
      if (location) {
        console.log('Auto-detected location:', location);
        // Set the detected state in filters (only if user hasn't manually set one)
        setFilters(prev => 
          (!prev.stateFips && !prev.countyFips)
            ? { ...prev, stateFips: [location.stateFips] }
            : prev
        );
      }
    }).catch(error => {
      hasDetectedLocation.current = true;
      console.error('Failed to auto-detect location:', error);
    });
  }, []); // Run only once on mount

  // Load all plants, filter options, and seed share data on mount
  useEffect(() => {
    plantApi.getAllPlants().then(allPlantsData => {
      setAllPlants(allPlantsData);
    });
    plantApi.getFilterOptions().then(options => {
      setFilterOptions(options);
    });
    
    // Load seed share data in bulk for better performance
    mockSeedShareService.getAllPlantsVolume().then(volumes => {
      const volumeMap = new Map<string, PlantSeedShareVolume>();
      volumes.forEach(volume => {
        volumeMap.set(volume.plantId, volume);
      });
      setPlantVolumes(volumeMap);
      
      // Set seed share volumes in plant API for prioritization
      plantApi.setSeedShareVolumes(volumes);
    });
    
    mockSeedShareService.getUserAllPlantsActivity(CURRENT_USER_ID).then(activities => {
      const activityMap = new Map<string, UserPlantSeedShare>();
      activities.forEach(activity => {
        activityMap.set(activity.plantId, activity);
      });
      setUserActivities(activityMap);
    });

    // Load garden data
    loadGardenData();
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

  const handleAddToGarden = async (plantId: string) => {
    try {
      await mockGardenService.addToGarden(plantId);
      await loadGardenData();
    } catch (error) {
      console.error('Error adding to garden:', error);
    }
  };

  const handleRemoveFromGarden = async (plantId: string) => {
    try {
      await mockGardenService.removeFromGarden(plantId);
      await loadGardenData();
    } catch (error) {
      console.error('Error removing from garden:', error);
    }
  };


  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleFiltersChange = (newFilters: PlantFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const logoSrc = theme === 'light' 
    ? '/images/Camp Monarch_LOGO B1 square.png'
    : '/images/Camp Monarch_LOGO B1_gold.png';

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <img src={logoSrc} alt="Camp Monarch" className="header-logo" />
            <div className="header-text">
              <h1>{t('header.title')}</h1>
              <p>{t('header.subtitle')}</p>
            </div>
          </div>
          <div className="header-controls">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
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
              t('search.searching')
            ) : (
              t('search.results', { count: plants.length })
            )}
          </div>

          {loading ? (
            <div className="loading">{t('plant.loading')}</div>
          ) : plants.length === 0 ? (
            <div className="empty-state">
              <h3>{t('search.noResults')}</h3>
              <p>{t('search.noResultsHint')}</p>
            </div>
          ) : (
            <div className="results-grid">
              {plants.map(plant => (
                <PlantCard 
                  key={plant.id} 
                  plant={plant} 
                  plantVolume={plantVolumes.get(plant.id) || null}
                  userActivity={userActivities.get(plant.id) || null}
                  isInGarden={gardenPlants.has(plant.id)}
                  onAddToGarden={() => handleAddToGarden(plant.id)}
                  onRemoveFromGarden={() => handleRemoveFromGarden(plant.id)}
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
