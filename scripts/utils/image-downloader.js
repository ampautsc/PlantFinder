import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Downloads an image from a URL and saves it to the public/images directory
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} plantId - The ID of the plant (for organizing images)
 * @param {string} source - The source vendor name
 * @returns {Promise<string|null>} - The relative path to the saved image, or null if failed
 */
export async function downloadImage(imageUrl, plantId, source) {
  try {
    // Create the target directory
    const targetDir = path.resolve(__dirname, '../../public/images/plants', plantId);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Download the image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PlantFinderBot/1.0; +https://github.com/ampautsc/PlantFinder)'
      }
    });
    
    // Determine file extension from content-type or URL
    let extension = 'jpg';
    const contentType = response.headers['content-type'];
    if (contentType) {
      if (contentType.includes('png')) extension = 'png';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = 'jpeg';
      else if (contentType.includes('webp')) extension = 'webp';
    }
    
    // Generate filename with timestamp and source
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${plantId}-${source}-${timestamp}.${extension}`;
    const filepath = path.join(targetDir, filename);
    
    // Save the image
    fs.writeFileSync(filepath, response.data);
    
    // Return the relative path for use in the JSON
    return `/images/plants/${plantId}/${filename}`;
  } catch (error) {
    console.error(`Failed to download image for ${plantId}: ${error.message}`);
    return null;
  }
}

/**
 * Downloads multiple images for a plant
 * @param {string[]} imageUrls - Array of image URLs
 * @param {string} plantId - The ID of the plant
 * @param {string} source - The source vendor name
 * @returns {Promise<string[]>} - Array of relative paths to saved images
 */
export async function downloadImages(imageUrls, plantId, source) {
  const downloadedPaths = [];
  
  for (const url of imageUrls) {
    const imagePath = await downloadImage(url, plantId, source);
    if (imagePath) {
      downloadedPaths.push(imagePath);
    }
  }
  
  return downloadedPaths;
}
