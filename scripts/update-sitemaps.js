const fs = require('fs');
const path = require('path');

// Path to the sitemap files
const countryPath = path.join(__dirname, '../public/fixtures-by-country-sitemap.xml');
const leaguesPath = path.join(__dirname, '../public/fixtures-by-leagues-sitemap.xml');
// const teamDetailsPath = path.join(__dirname, '../public/team-details-sitemap.xml');
const sitemap0Path = path.join(__dirname, '../public/sitemap-0.xml');

// Function to update a sitemap file
function updateSitemap(filePath) {
  // Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    // Get the current date in ISO format
    const today = new Date().toISOString();
    
    // Replace all lastmod tags with the current date
    const updatedData = data.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
    
    // Write the updated content back to the file
    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}:`, err);
        return;
      }
      console.log(`Successfully updated lastmod dates to ${today} in ${path.basename(filePath)}`);
    });
  });
}

// Update all sitemap files
updateSitemap(countryPath);
updateSitemap(leaguesPath);
// updateSitemap(teamDetailsPath);
updateSitemap(sitemap0Path);

console.log('Sitemap update process initiated...'); 