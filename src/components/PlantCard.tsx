import { Plant } from '../types/Plant';

interface PlantCardProps {
  plant: Plant;
}

function PlantCard({ plant }: PlantCardProps) {
  const getSunLabel = (sun: string) => {
    const labels = {
      'full-sun': '☀️ Full Sun',
      'partial-sun': '⛅ Partial Sun',
      'partial-shade': '🌤️ Partial Shade',
      'full-shade': '☁️ Full Shade',
    };
    return labels[sun as keyof typeof labels] || sun;
  };

  const getMoistureLabel = (moisture: string) => {
    const labels = {
      'dry': '🏜️ Dry',
      'medium': '💧 Medium',
      'moist': '💦 Moist',
      'wet': '🌊 Wet',
    };
    return labels[moisture as keyof typeof labels] || moisture;
  };

  return (
    <div className="plant-card">
      <h2>{plant.commonName}</h2>
      <div className="scientific-name">{plant.scientificName}</div>
      <p className="description">{plant.description}</p>

      <div className="plant-details">
        <div className="detail-row">
          <span className="detail-label">Sun:</span>
          <span className="detail-value">{getSunLabel(plant.requirements.sun)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Moisture:</span>
          <span className="detail-value">{getMoistureLabel(plant.requirements.moisture)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Soil:</span>
          <span className="detail-value">{plant.requirements.soil}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Size:</span>
          <span className="detail-value">{plant.characteristics.height}" H × {plant.characteristics.width}" W</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Bloom:</span>
          <span className="detail-value">{plant.characteristics.bloomTime.join(', ')}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Zones:</span>
          <span className="detail-value">{plant.characteristics.hardinessZones.join(', ')}</span>
        </div>
      </div>

      <div className="tags">
        {plant.characteristics.bloomColor.map(color => (
          <span key={color} className="tag">{color}</span>
        ))}
        {plant.relationships.foodFor.map(food => (
          <span key={food} className="tag">{food}</span>
        ))}
      </div>
    </div>
  );
}

export default PlantCard;
