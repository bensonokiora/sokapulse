/**
 * IndexNow Utility
 * 
 * This utility helps notify search engines about new or updated content
 * using the IndexNow protocol supported by Bing, Yandex, and others.
 * 
 * Usage:
 * - Import and call notifyIndexNow() after content updates
 * - Or use the automatic ping function in your content management system
 */

// The key we generated and placed in public/indexnow.txt
const INDEXNOW_KEY = '9e8d4f7c6b5a3210';
const SITE_URL = 'https://sokapulse.com';

/**
 * Notifies search engines about a single URL that was updated
 * 
 * @param {string} url - The full URL that was updated
 * @returns {Promise<Object>} - Response from the IndexNow API
 */
export async function notifyIndexNow(url) {
  // Make sure URL is absolute
  if (!url.startsWith('http')) {
    url = `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  console.log(`Notifying IndexNow about updated URL: ${url}`);
  
  try {
    const response = await fetch(`https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${INDEXNOW_KEY}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('IndexNow notification successful:', data);
      return { success: true, data };
    } else {
      console.error('IndexNow notification failed:', data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Error notifying IndexNow:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Notifies search engines about multiple URLs that were updated
 * 
 * @param {string[]} urls - Array of URLs that were updated
 * @returns {Promise<Object>} - Response from the IndexNow API
 */
export async function notifyMultipleUrls(urls) {
  // Make sure all URLs are absolute
  const absoluteUrls = urls.map(url => {
    if (!url.startsWith('http')) {
      return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  });
  
  console.log(`Notifying IndexNow about ${urls.length} updated URLs`);
  
  try {
    // Send a batch request to IndexNow
    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        urlList: absoluteUrls
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Batch IndexNow notification successful:', data);
      return { success: true, data };
    } else {
      console.error('Batch IndexNow notification failed:', data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Error in batch IndexNow notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Utility to test if IndexNow setup is working correctly
 */
export async function testIndexNowSetup() {
  try {
    // Test key file accessibility
    const keyFileResponse = await fetch(`${SITE_URL}/indexnow.txt`);
    const keyFileContent = await keyFileResponse.text();
    
    if (keyFileResponse.ok && keyFileContent.trim() === INDEXNOW_KEY) {
      console.log('✅ IndexNow key file is accessible and contains the correct key');
    } else {
      console.error('❌ IndexNow key file is not accessible or contains incorrect key');
      return { success: false, error: 'Key file verification failed' };
    }
    
    // Test verification file accessibility
    const verificationFileResponse = await fetch(`${SITE_URL}/${INDEXNOW_KEY}.txt`);
    const verificationFileContent = await verificationFileResponse.text();
    
    if (verificationFileResponse.ok && verificationFileContent.trim() === INDEXNOW_KEY) {
      console.log('✅ IndexNow verification file is accessible and contains the correct key');
    } else {
      console.error('❌ IndexNow verification file is not accessible or contains incorrect key');
      return { success: false, error: 'Verification file check failed' };
    }
    
    return { success: true, message: 'IndexNow setup is correctly configured' };
  } catch (error) {
    console.error('Error testing IndexNow setup:', error);
    return { success: false, error: error.message };
  }
} 