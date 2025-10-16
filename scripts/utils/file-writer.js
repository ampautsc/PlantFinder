import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Saves plant data to a JSON file
 * @param {Object} plantData - The formatted plant data
 * @returns {Promise<void>}
 */
export async function savePlantData(plantData) {
  const targetDir = path.resolve(__dirname, '../../src/data/Plants');
  const filename = `${plantData.id}.json`;
  const filepath = path.join(targetDir, filename);
  
  try {
    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`Plant ${plantData.id} already exists, updating...`);
    }
    
    // Write the JSON file with pretty formatting
    fs.writeFileSync(filepath, JSON.stringify(plantData, null, 2));
    console.log(`Saved plant data: ${filename}`);
  } catch (error) {
    console.error(`Failed to save plant data for ${plantData.id}: ${error.message}`);
    throw error;
  }
}

/**
 * Saves multiple plant data objects
 * @param {Object[]} plants - Array of formatted plant data
 * @returns {Promise<number>} - Number of plants saved
 */
export async function savePlants(plants) {
  let savedCount = 0;
  
  for (const plant of plants) {
    try {
      await savePlantData(plant);
      savedCount++;
    } catch (error) {
      console.error(`Failed to save plant ${plant.id}:`, error);
    }
  }
  
  return savedCount;
}

/**
 * Creates a log entry for the scraping run
 * @param {string} source - The source vendor name
 * @param {Object} stats - Statistics about the scraping run
 */
export function logScrapingRun(source, stats) {
  const logDir = path.resolve(__dirname, '../../scripts/logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    source,
    stats
  };
  
  const logFile = path.join(logDir, `scraping-${timestamp.split('T')[0]}.json`);
  let logs = [];
  
  if (fs.existsSync(logFile)) {
    logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  }
  
  logs.push(logEntry);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  
  console.log(`Logged scraping run for ${source}`);
}
