#!/usr/bin/env node
/**
 * This script updates all sitemap lastmod dates to the current date.
 * It is designed to be run by a cron job daily.
 * 
 * Example crontab entry to run daily at midnight:
 * 0 0 * * * /path/to/node /path/to/sokapulse/scripts/cron-update-sitemaps.js
 */

const fs = require('fs');
const path = require('path');

// Get absolute path to the project root
const projectRoot = path.resolve(__dirname, '..');

console.log('Starting sitemap update, project root:', projectRoot);

// Path to the sitemap files
const countryPath = path.join(projectRoot, 'public/fixtures-by-country-sitemap.xml');
const leaguesPath = path.join(projectRoot, 'public/fixtures-by-leagues-sitemap.xml');
// const teamDetailsPath = path.join(projectRoot, 'public/team-details-sitemap.xml');
const mainSitemapPath = path.join(projectRoot, 'public/sitemap-0.xml');

// Function to update a sitemap file
function updateSitemap(filePath) {
  try {
    console.log(`Checking if sitemap file exists: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Sitemap file does not exist: ${filePath}`);
      return false;
    }
    
    console.log(`Reading sitemap file: ${filePath}`);
    
    // Read the file synchronously
    const data = fs.readFileSync(filePath, 'utf8');

    // Get the current date in ISO format
    const today = new Date().toISOString();
    
    console.log(`Updating lastmod dates to ${today} in ${path.basename(filePath)}`);
    
    // Replace all lastmod tags with the current date
    const updatedData = data.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
    
    // Check if the file is writable
    try {
      fs.accessSync(filePath, fs.constants.W_OK);
      console.log(`File is writable: ${filePath}`);
    } catch (accessErr) {
      console.error(`File is not writable: ${filePath}`, accessErr);
      // Try to change permissions if not writable
      try {
        fs.chmodSync(filePath, 0o666);
        console.log(`Changed permissions for: ${filePath}`);
      } catch (chmodErr) {
        console.error(`Failed to change permissions: ${filePath}`, chmodErr);
      }
    }
    
    // Write the updated content back to the file
    console.log(`Writing updated content to: ${filePath}`);
    fs.writeFileSync(filePath, updatedData, 'utf8');
    
    console.log(`Successfully updated lastmod dates to ${today} in ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`Error updating sitemap ${filePath}:`, error);
    console.error(`Error details: ${error.stack}`);
    return false;
  }
}

console.log('Starting sitemap update process...');

// Update all sitemap files
const countrySuccess = updateSitemap(countryPath);
const leaguesSuccess = updateSitemap(leaguesPath);
// const teamDetailsSuccess = updateSitemap(teamDetailsPath);
const mainSitemapSuccess = updateSitemap(mainSitemapPath);

// Report results
console.log('Sitemap update results:');
console.log(`Country sitemap: ${countrySuccess ? 'Success' : 'Failed'}`);
console.log(`Leagues sitemap: ${leaguesSuccess ? 'Success' : 'Failed'}`);
console.log(`Team details sitemap: ${teamDetailsSuccess ? 'Success' : 'Failed'}`);
console.log(`Main sitemap: ${mainSitemapSuccess ? 'Success' : 'Failed'}`);

// Exit with appropriate code
process.exit(countrySuccess && leaguesSuccess && teamDetailsSuccess && mainSitemapSuccess ? 0 : 1); 