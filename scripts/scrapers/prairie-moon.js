/**
 * Prairie Moon Nursery Scraper
 * Scrapes wildflower data from https://www.prairiemoon.com/
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { formatPlantData } from '../utils/plant-data-formatter.js';
import { downloadImage } from '../utils/image-downloader.js';
import { savePlants, logScrapingRun } from '../utils/file-writer.js';

const BASE_URL = 'https://www.prairiemoon.com';
const CATEGORY_URL = `${BASE_URL}/seeds/wildflowers-forbs`;

/**
 * Scrapes Prairie Moon Nursery for wildflower data
 */
async function scrapePrairieMoon() {
  console.log('Starting Prairie Moon Nursery scraper...');
  const plants = [];
  let stats = {
    attempted: 0,
    successful: 0,
    failed: 0,
    images: 0
  };
  
  try {
    // Note: This is a template scraper. The actual implementation would need
    // to be customized based on the website's structure and terms of service.
    // This is a demonstration of the structure.
    
    console.log('Fetching product list from Prairie Moon...');
    const response = await axios.get(CATEGORY_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PlantFinderBot/1.0)'
      },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    
    // Example: Extract product links (actual selectors would need to be determined)
    const productLinks = [];
    $('.product-item a.product-link').each((i, elem) => {
      const link = $(elem).attr('href');
      if (link) {
        productLinks.push(link.startsWith('http') ? link : `${BASE_URL}${link}`);
      }
    });
    
    console.log(`Found ${productLinks.length} products to scrape`);
    
    // Limit to a few products for demonstration
    const limit = Math.min(productLinks.length, 10);
    
    for (let i = 0; i < limit; i++) {
      const productUrl = productLinks[i];
      stats.attempted++;
      
      try {
        console.log(`Scraping product ${i + 1}/${limit}: ${productUrl}`);
        const plant = await scrapeProductPage(productUrl);
        
        if (plant) {
          plants.push(plant);
          stats.successful++;
          if (plant.imageUrl) {
            stats.images++;
          }
        }
      } catch (error) {
        console.error(`Failed to scrape ${productUrl}:`, error.message);
        stats.failed++;
      }
      
      // Be respectful with rate limiting
      await sleep(2000);
    }
    
    // Save all scraped plants
    if (plants.length > 0) {
      console.log(`Saving ${plants.length} plants from Prairie Moon...`);
      await savePlants(plants);
    }
    
    logScrapingRun('prairie-moon', stats);
    console.log('Prairie Moon scraping complete!');
    console.log('Stats:', stats);
    
  } catch (error) {
    console.error('Prairie Moon scraper failed:', error);
    logScrapingRun('prairie-moon', { ...stats, error: error.message });
  }
  
  return plants;
}

/**
 * Scrapes a single product page
 * @param {string} url - Product page URL
 * @returns {Promise<Object|null>} - Formatted plant data or null
 */
async function scrapeProductPage(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PlantFinderBot/1.0)'
      },
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    
    // Example selectors (would need to be customized based on actual site structure)
    const commonName = $('.product-title').text().trim();
    const scientificName = $('.scientific-name').text().trim();
    const description = $('.product-description').text().trim();
    
    // Extract image
    const imageUrl = $('.product-image img').attr('src');
    const fullImageUrl = imageUrl && imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
    
    // Extract characteristics (these would need to be parsed from the page)
    const rawData = {
      commonName,
      scientificName,
      description,
      sun: 'full sun', // Would extract from page
      moisture: 'medium',
      soil: 'loam',
      height: 24,
      width: 18,
      bloomColor: ['purple'], // Would extract from page
      bloomTime: ['summer'],
      nativeRange: ['Eastern US'],
      hardinessZones: ['3', '4', '5', '6', '7', '8', '9'],
      foodFor: ['butterflies', 'bees'],
      usefulFor: ['pollinator garden'],
      source: 'prairie-moon',
      sourceUrl: url
    };
    
    // Format the data
    const plantData = formatPlantData(rawData);
    
    // Download image if available
    if (fullImageUrl && plantData.id) {
      const localImagePath = await downloadImage(fullImageUrl, plantData.id, 'prairie-moon');
      if (localImagePath) {
        plantData.imageUrl = localImagePath;
      }
    }
    
    return plantData;
    
  } catch (error) {
    console.error(`Failed to scrape product page ${url}:`, error.message);
    return null;
  }
}

/**
 * Sleep helper for rate limiting
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapePrairieMoon().then(() => {
    console.log('Scraping complete');
    process.exit(0);
  }).catch(error => {
    console.error('Scraping failed:', error);
    process.exit(1);
  });
}

export default scrapePrairieMoon;
