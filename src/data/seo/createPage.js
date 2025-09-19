/**
 * SEO Content Page Generator
 * 
 * This script helps generate new SEO content pages quickly.
 * Run it with Node.js to create a new page:
 * 
 * node src/data/seo/createPage.js pageName "Page Title" "Page Description"
 * 
 * Example:
 * node src/data/seo/createPage.js weekend "Weekend Football Predictions" "Get accurate weekend football predictions..."
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const pageName = process.argv[2];
const pageTitle = process.argv[3] || `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} Football Predictions`;
const pageDescription = process.argv[4] || `Description for ${pageName} football predictions. Customize this text to be unique for this page type.`;

if (!pageName) {
  console.error('Please provide a page name as the first argument.');
  process.exit(1);
}

// Read the template file
const templatePath = path.join(__dirname, 'pages', 'template.js');
const outputPath = path.join(__dirname, 'pages', `${pageName}.js`);

// Check if the output file already exists
if (fs.existsSync(outputPath)) {
  console.error(`Error: File already exists at ${outputPath}`);
  process.exit(1);
}

// Read the template file
let templateContent = fs.readFileSync(templatePath, 'utf8');

// Replace PAGETYPE with the actual page name
templateContent = templateContent.replace(/PAGETYPE/g, pageName);
templateContent = templateContent.replace(/pagetypeContent/g, `${pageName}Content`);
templateContent = templateContent.replace(/Template for SEO Content Pages/g, `${pageTitle} SEO Content`);
templateContent = templateContent.replace(/Description for .* football predictions\. Customize this text to be unique for this page type\./g, pageDescription);

// Write the new file
fs.writeFileSync(outputPath, templateContent);

console.log(`Created new SEO content page at: ${outputPath}`);

// Update the index.js file to include the new page
const indexPath = path.join(__dirname, 'index.js');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Add the import statement
const importStatement = `import ${pageName}Content from './pages/${pageName}';`;
indexContent = indexContent.replace(
  /import.*from '\.\/pages\/.*';(\r?\n)/,
  (match) => match + importStatement + '$1'
);

// Add to the contentMap
const contentMapEntry = `  ${pageName}: ${pageName}Content,`;
indexContent = indexContent.replace(
  /const contentMap = {(\r?\n)/,
  (match) => match + contentMapEntry + '$1'
);

// Write the updated index file
fs.writeFileSync(indexPath, indexContent);

console.log(`Updated index.js to include the new page.`);
console.log(`\nDon't forget to customize the content in: ${outputPath}`); 