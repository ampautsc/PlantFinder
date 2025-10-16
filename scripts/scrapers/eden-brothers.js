/**
 * Eden Brothers Scraper
 * Scrapes wildflower data from https://www.edenbrothers.com/collections/organic-seeds
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatPlantData } from '../utils/plant-data-formatter.js';
import { downloadImage } from '../utils/image-downloader.js';
import { savePlants, logScrapingRun } from '../utils/file-writer.js';

const BASE_URL = 'https://www.edenbrothers.com';

async function scrapeEdenBrothers() {
  console.log('Starting Eden Brothers scraper...');
  const plants = [];
  const stats = { attempted: 0, successful: 0, failed: 0, images: 0 };
  
  try {
    const categoryUrl = `${BASE_URL}/collections/organic-seeds`;
    console.log('Fetching from Eden Brothers...');
    
    const response = await axios.get(categoryUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PlantFinderBot/1.0)' },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    const productLinks = [];
    
    $('.product-item a, a[href*="/products/"]').each((i, elem) => {
      const link = $(elem).attr('href');
      if (link && link.includes('wildflower') && !productLinks.includes(link)) {
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
    
    logScrapingRun('eden-brothers', stats);
    console.log('Eden Brothers complete!', stats);
  } catch (error) {
    console.error('Eden Brothers scraper failed:', error);
    logScrapingRun('eden-brothers', { ...stats, error: error.message });
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
    commonName: $('h1').text().trim(),
    scientificName: $('.scientific-name, .latin').text().trim() || 'Unknown species',
    description: $('.description, .product-info').text().trim(),
    sun: 'full sun',
    moisture: 'medium',
    soil: 'loam',
    height: 28,
    width: 20,
    bloomColor: ['purple'],
    bloomTime: ['summer', 'fall'],
    nativeRange: ['Central US'],
    hardinessZones: ['5', '6', '7', '8', '9'],
    foodFor: ['bees', 'butterflies'],
    usefulFor: ['pollinator garden', 'organic garden'],
    source: 'eden-brothers',
    sourceUrl: url
  };
  
  const plantData = formatPlantData(rawData);
  
  const imageUrl = $('img[alt*="wildflower"], .product-image img').attr('src');
  if (imageUrl) {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
    const localPath = await downloadImage(fullUrl, plantData.id, 'eden-brothers');
    if (localPath) plantData.imageUrl = localPath;
  }
  
  return plantData;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeEdenBrothers().then(() => process.exit(0)).catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });
}

export default scrapeEdenBrothers;
