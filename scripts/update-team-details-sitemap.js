// const fs = require('fs');
// const path = require('path');

// // Path to the sitemap file
// const sitemapPath = path.join(__dirname, '../public/team-details-sitemap.xml');

// // Read the file
// fs.readFile(sitemapPath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading file:', err);
//     return;
//   }

//   // Get the current date in ISO format
//   const today = new Date().toISOString();
  
//   // Replace all lastmod tags with the current date
//   const updatedData = data.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  
//   // Write the updated content back to the file
//   fs.writeFile(sitemapPath, updatedData, 'utf8', (err) => {
//     if (err) {
//       console.error('Error writing file:', err);
//       return;
//     }
//     console.log(`Successfully updated lastmod dates to ${today} in team-details-sitemap.xml`);
//   });
// }); 