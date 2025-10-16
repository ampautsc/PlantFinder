/**
 * Main scraper orchestrator
 * Runs all scrapers in sequence or individually based on arguments
 */

import scrapePrairieMoon from './prairie-moon.js';
import scrapeEverwilde from './everwilde.js';
import scrapeTrueLeaf from './trueleaf.js';
import scrapeAmericanMeadows from './american-meadows.js';
import scrapeEdenBrothers from './eden-brothers.js';

const scrapers = {
  'prairie-moon': scrapePrairieMoon,
  'everwilde': scrapeEverwilde,
  'trueleaf': scrapeTrueLeaf,
  'american-meadows': scrapeAmericanMeadows,
  'eden-brothers': scrapeEdenBrothers
};

/**
 * Run all scrapers in sequence
 */
async function runAllScrapers() {
  console.log('Starting all scrapers...\n');
  const results = {};
  
  for (const [name, scraper] of Object.entries(scrapers)) {
    console.log(`\n========================================`);
    console.log(`Running ${name} scraper...`);
    console.log(`========================================\n`);
    
    try {
      const plants = await scraper();
      results[name] = {
        success: true,
        count: plants.length
      };
    } catch (error) {
      console.error(`${name} scraper failed:`, error);
      results[name] = {
        success: false,
        error: error.message
      };
    }
    
    // Wait between scrapers to be respectful
    await sleep(5000);
  }
  
  console.log('\n========================================');
  console.log('All scrapers completed!');
  console.log('========================================\n');
  console.log('Results:');
  console.log(JSON.stringify(results, null, 2));
  
  return results;
}

/**
 * Run a specific scraper by name
 */
async function runScraper(name) {
  const scraper = scrapers[name];
  
  if (!scraper) {
    console.error(`Unknown scraper: ${name}`);
    console.log('Available scrapers:', Object.keys(scrapers).join(', '));
    process.exit(1);
  }
  
  console.log(`Running ${name} scraper...`);
  const plants = await scraper();
  console.log(`${name} completed! Scraped ${plants.length} plants.`);
  return plants;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const scraperName = process.argv[2];
  
  if (scraperName) {
    // Run specific scraper
    runScraper(scraperName)
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Scraper failed:', error);
        process.exit(1);
      });
  } else {
    // Run all scrapers
    runAllScrapers()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Scraping failed:', error);
        process.exit(1);
      });
  }
}

export { runAllScrapers, runScraper };
