const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Find all CSS files in the .next directory
async function purgeUnusedCSS() {
  //console.log('🧹 Starting CSS purging process...');
  
  try {
    // Find CSS files
    const cssFiles = globSync('.next/**/*.css');
    
    if (cssFiles.length === 0) {
      //console.log('⚠️ No CSS files found in .next directory');
      return;
    }
    
    //console.log(`Found ${cssFiles.length} CSS files to process`);
    
    // Process each CSS file
    for (const cssFile of cssFiles) {
      const originalSize = fs.statSync(cssFile).size;
      //console.log(`Processing ${cssFile} (${(originalSize / 1024).toFixed(2)} KB)`);
      
      // Run PurgeCSS
      const result = await new PurgeCSS().purge({
        content: [
          '.next/**/*.html',
          '.next/**/*.js',
          'src/**/*.{js,jsx,ts,tsx}',
        ],
        css: [cssFile],
        safelist: {
          standard: [
            /^nav/, 
            /^dropdown/, 
            /^modal/, 
            /^btn/, 
            /^col/, 
            /^row/, 
            /^table/, 
            /^form/, 
            /^alert/, 
            /^card/,
            /^container/,
            /^show$/, /^active$/, /^disabled$/,
            /^bi-/
          ],
          deep: [
            /dropdown/, /modal/, /tooltip/, /popover/, /collapse/,
          ],
        },
      });
      
      if (result.length > 0 && result[0].css) {
        // Write purged CSS back to file
        fs.writeFileSync(cssFile, result[0].css);
        
        // Log stats
        const newSize = fs.statSync(cssFile).size;
        const reduction = originalSize - newSize;
        const percentReduction = ((reduction / originalSize) * 100).toFixed(2);
        
        //console.log(`✅ Reduced ${cssFile} from ${(originalSize / 1024).toFixed(2)} KB to ${(newSize / 1024).toFixed(2)} KB (${percentReduction}% reduction)`);
      }
    }
    
    //console.log('🎉 CSS purging completed successfully!');
  } catch (error) {
    //console.error('Error purging CSS:', error);
  }
}

purgeUnusedCSS(); 