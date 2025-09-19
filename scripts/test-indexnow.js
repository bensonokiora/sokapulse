/**
 * Test script for IndexNow setup
 * 
 * This script validates your IndexNow configuration and tests API calls
 * Run with: node scripts/test-indexnow.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://sokapulse.com';
const INDEXNOW_KEY = '9e8d4f7c6b5a3210';

// Test URLs
const testPages = [
  '/',
  '/football-predictions',
  '/today-football-predictions',
  '/about-us'
];

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testIndexNowKeyFile() {
  console.log('\n🔑 Testing IndexNow key file...');
  
  try {
    // Check if local file exists
    const localKeyFile = path.join(__dirname, '../public/indexnow.txt');
    if (fs.existsSync(localKeyFile)) {
      const content = fs.readFileSync(localKeyFile, 'utf8').trim();
      console.log(`✅ Local key file exists with content: ${content}`);
      
      if (content !== INDEXNOW_KEY) {
        console.warn(`⚠️ Local key doesn't match configured key. File: ${content}, Config: ${INDEXNOW_KEY}`);
      }
    } else {
      console.error('❌ Local key file doesn\'t exist at', localKeyFile);
    }
    
    // Check if key file is accessible on the live site
    const keyFileUrl = `${SITE_URL}/indexnow.txt`;
    console.log(`🔍 Checking if key file is accessible at ${keyFileUrl}...`);
    
    const response = await makeRequest(keyFileUrl);
    
    if (response.statusCode === 200) {
      console.log(`✅ Key file is accessible on the live site. Content: ${response.data.trim()}`);
      
      if (response.data.trim() !== INDEXNOW_KEY) {
        console.warn(`⚠️ Live key doesn't match configured key. Live: ${response.data.trim()}, Config: ${INDEXNOW_KEY}`);
      }
    } else {
      console.error(`❌ Key file returned status code ${response.statusCode}`);
    }
  } catch (error) {
    console.error('❌ Error testing key file:', error.message);
  }
}

async function testVerificationFile() {
  console.log('\n🔐 Testing verification file...');
  
  try {
    // Check if local verification file exists
    const localVerificationFile = path.join(__dirname, `../public/${INDEXNOW_KEY}.txt`);
    if (fs.existsSync(localVerificationFile)) {
      const content = fs.readFileSync(localVerificationFile, 'utf8').trim();
      console.log(`✅ Local verification file exists with content: ${content}`);
      
      if (content !== INDEXNOW_KEY) {
        console.warn(`⚠️ Verification file content doesn't match the key. File: ${content}, Key: ${INDEXNOW_KEY}`);
      }
    } else {
      console.error(`❌ Local verification file doesn't exist at ${localVerificationFile}`);
    }
    
    // Check if verification file is accessible on the live site
    const verificationFileUrl = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
    console.log(`🔍 Checking if verification file is accessible at ${verificationFileUrl}...`);
    
    const response = await makeRequest(verificationFileUrl);
    
    if (response.statusCode === 200) {
      console.log(`✅ Verification file is accessible on the live site. Content: ${response.data.trim()}`);
      
      if (response.data.trim() !== INDEXNOW_KEY) {
        console.warn(`⚠️ Verification file content doesn't match. File: ${response.data.trim()}, Key: ${INDEXNOW_KEY}`);
      }
    } else {
      console.error(`❌ Verification file returned status code ${response.statusCode}`);
    }
  } catch (error) {
    console.error('❌ Error testing verification file:', error.message);
  }
}

async function testBingIndexNow() {
  console.log('\n🔄 Testing IndexNow API with Bing...');
  
  try {
    // Test URL - replace with an actual URL from your site that you want to index
    const testUrl = `${SITE_URL}${testPages[0]}`;
    const apiUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(testUrl)}&key=${INDEXNOW_KEY}`;
    
    console.log(`🔍 Sending test submission to Bing IndexNow API for URL: ${testUrl}...`);
    console.log(`🔗 API request URL: ${apiUrl}`);
    
    const response = await makeRequest(apiUrl);
    
    console.log(`📊 Response status code: ${response.statusCode}`);
    console.log(`📋 Response headers:`, response.headers);
    console.log(`📄 Response data:`, response.data);
    
    if (response.statusCode === 200 || response.statusCode === 202) {
      console.log('✅ IndexNow API call was successful!');
    } else {
      console.error(`❌ IndexNow API call failed with status code ${response.statusCode}`);
    }
  } catch (error) {
    console.error('❌ Error testing IndexNow API:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting IndexNow tests...');
  
  // Test key file
  await testIndexNowKeyFile();
  
  // Test verification file
  await testVerificationFile();
  
  // Test Bing IndexNow API
  await testBingIndexNow();
  
  console.log('\n🏁 IndexNow tests completed!');
}

// Run all tests
runTests().catch(error => {
  console.error('❌ Tests failed with error:', error);
  process.exit(1);
}); 