/**
 * True Leaf Market Scraper
 * Scrapes wildflower data from https://trueleafmarket.com/
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatPlantData } from '../utils/plant-data-formatter.js';
import { downloadImage } from '../utils/image-downloader.js';
import { savePlants, logScrapingRun } from '../utils/file-writer.js';

const BASE_URL = 'https://trueleafmarket.com';

async function scrapeTrueLeaf() {
  console.log('Starting True Leaf Market scraper...');
  const plants = [];
  const stats = { attempted: 0, successful: 0, failed: 0, images: 0 };
  
  try {
    // True Leaf Market - wildflower section
    const categoryUrl = `${BASE_URL}/collections/wildflower-seeds`;
    console.log('Fetching from True Leaf Market...');
    
    const response = await axios.get(categoryUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PlantFinderBot/1.0)' },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    const productLinks = [];
    
    $('a.product-link, a[href*="/products/"]').each((i, elem) => {
      const link = $(elem).attr('href');
      if (link && link.includes('wildflower')) {
        productLinks.push(link.startsWith('http') ? link : `${BASE_URL}${link}`);
      }
    });
    
    console.log(`Found ${productLinks.length} products`);
    
    const limit = Math.min(productLinks.length, 10);
    for (let i = 0; i < limit; i++) {
      stats.attempted++;
      try {
        const plant = await scrapeProductPage(productLinks[i]);
        if (plant) {
          plants.push(plant);
          stats.successful++;
          if (plant.imageUrl) stats.images++;
        }
      } catch (error) {
        console.error(`Failed:`, error.message);
        stats.failed++;
      }
      await sleep(2000);
    }
    
    if (plants.length > 0) {
      await savePlants(plants);
    }
    
    logScrapingRun('trueleaf', stats);
    console.log('True Leaf Market complete!', stats);
  } catch (error) {
    console.error('True Leaf scraper failed:', error);
    logScrapingRun('trueleaf', { ...stats, error: error.message });
  }
  
  return plants;
}

async function scrapeProductPage(url) {
  const response = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PlantFinderBot/1.0)' },
    timeout: 30000
  });
  
  const $ = cheerio.load(response.data);
  
  const rawData = {
    commonName: $('h1.product-title').text().trim(),
    scientificName: $('.botanical-name').text().trim() || 'Unknown species',
    description: $('.product-description').text().trim(),
    sun: 'full sun',
    moisture: 'medium',
    soil: 'loam',
    height: 24,
    width: 18,
    bloomColor: ['yellow'],
    bloomTime: ['summer'],
    nativeRange: ['Central US'],
    hardinessZones: ['5', '6', '7', '8'],
    foodFor: ['bees', 'butterflies'],
    usefulFor: ['pollinator garden', 'native garden'],
    source: 'trueleaf',
    sourceUrl: url
  };
  
  const plantData = formatPlantData(rawData);
  
  const imageUrl = $('img.product-image').attr('src');
  if (imageUrl) {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
    const localPath = await downloadImage(fullUrl, plantData.id, 'trueleaf');
    if (localPath) plantData.imageUrl = localPath;
  }
  
  return plantData;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeTrueLeaf().then(() => process.exit(0)).catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });
}

export default scrapeTrueLeaf;
