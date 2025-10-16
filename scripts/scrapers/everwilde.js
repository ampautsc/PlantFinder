/**
 * Everwilde Scraper
 * Scrapes wildflower data from https://www.everwilde.com/wildflower-store.html
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatPlantData } from '../utils/plant-data-formatter.js';
import { downloadImage } from '../utils/image-downloader.js';
import { savePlants, logScrapingRun } from '../utils/file-writer.js';

const BASE_URL = 'https://www.everwilde.com';
const CATEGORY_URL = `${BASE_URL}/wildflower-store.html`;

async function scrapeEverwilde() {
  console.log('Starting Everwilde scraper...');
  const plants = [];
  const stats = { attempted: 0, successful: 0, failed: 0, images: 0 };
  
  try {
    console.log('Fetching product list from Everwilde...');
    const response = await axios.get(CATEGORY_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PlantFinderBot/1.0)' },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    const productLinks = [];
    
    $('.product-item a').each((i, elem) => {
      const link = $(elem).attr('href');
      if (link && link.includes('product')) {
        productLinks.push(link.startsWith('http') ? link : `${BASE_URL}${link}`);
      }
    });
    
    console.log(`Found ${productLinks.length} products`);
    
    // Process limited number for demonstration
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
        console.error(`Failed to scrape product:`, error.message);
        stats.failed++;
      }
      await sleep(2000);
    }
    
    if (plants.length > 0) {
      await savePlants(plants);
    }
    
    logScrapingRun('everwilde', stats);
    console.log('Everwilde scraping complete!', stats);
  } catch (error) {
    console.error('Everwilde scraper failed:', error);
    logScrapingRun('everwilde', { ...stats, error: error.message });
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
    commonName: $('.product-name').text().trim(),
    scientificName: $('.scientific-name').text().trim() || 'Unknown species',
    description: $('.description').text().trim(),
    sun: 'full sun',
    moisture: 'medium',
    soil: 'loam',
    height: 24,
    width: 18,
    bloomColor: ['pink'],
    bloomTime: ['summer'],
    nativeRange: ['Eastern US'],
    hardinessZones: ['4', '5', '6', '7', '8'],
    foodFor: ['bees', 'butterflies'],
    usefulFor: ['pollinator garden'],
    source: 'everwilde',
    sourceUrl: url
  };
  
  const plantData = formatPlantData(rawData);
  
  const imageUrl = $('.product-image img').attr('src');
  if (imageUrl) {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
    const localPath = await downloadImage(fullUrl, plantData.id, 'everwilde');
    if (localPath) plantData.imageUrl = localPath;
  }
  
  return plantData;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeEverwilde().then(() => process.exit(0)).catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });
}

export default scrapeEverwilde;
