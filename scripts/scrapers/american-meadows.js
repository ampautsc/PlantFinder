/**
 * American Meadows Scraper
 * Scrapes wildflower data from https://www.americanmeadows.com/
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatPlantData } from '../utils/plant-data-formatter.js';
import { downloadImage } from '../utils/image-downloader.js';
import { savePlants, logScrapingRun } from '../utils/file-writer.js';

const BASE_URL = 'https://www.americanmeadows.com';

async function scrapeAmericanMeadows() {
  console.log('Starting American Meadows scraper...');
  const plants = [];
  const stats = { attempted: 0, successful: 0, failed: 0, images: 0 };
  
  try {
    const categoryUrl = `${BASE_URL}/wildflower-seeds`;
    console.log('Fetching from American Meadows...');
    
    const response = await axios.get(categoryUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PlantFinderBot/1.0)' },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    const productLinks = [];
    
    $('.product-grid a, a[href*="/wildflower-seeds/"]').each((i, elem) => {
      const link = $(elem).attr('href');
      if (link && !productLinks.includes(link)) {
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
    
    logScrapingRun('american-meadows', stats);
    console.log('American Meadows complete!', stats);
  } catch (error) {
    console.error('American Meadows scraper failed:', error);
    logScrapingRun('american-meadows', { ...stats, error: error.message });
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
    commonName: $('h1.product-name').text().trim(),
    scientificName: $('.latin-name').text().trim() || 'Unknown species',
    description: $('.product-description').text().trim(),
    sun: 'full sun',
    moisture: 'medium',
    soil: 'loam',
    height: 30,
    width: 20,
    bloomColor: ['blue'],
    bloomTime: ['summer'],
    nativeRange: ['Eastern US'],
    hardinessZones: ['4', '5', '6', '7', '8', '9'],
    foodFor: ['butterflies', 'bees', 'hummingbirds'],
    usefulFor: ['pollinator garden', 'meadow'],
    source: 'american-meadows',
    sourceUrl: url
  };
  
  const plantData = formatPlantData(rawData);
  
  const imageUrl = $('.product-photo img').attr('src');
  if (imageUrl) {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
    const localPath = await downloadImage(fullUrl, plantData.id, 'american-meadows');
    if (localPath) plantData.imageUrl = localPath;
  }
  
  return plantData;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAmericanMeadows().then(() => process.exit(0)).catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });
}

export default scrapeAmericanMeadows;
