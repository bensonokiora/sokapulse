import React from 'react';

export const metadata = {
  title: 'Submit URLs to IndexNow - SokaPulse',
  description: 'Submit your URLs to the IndexNow API to notify search engines about new or updated content',
  robots: {
    index: false,
    follow: false,
  },
};

export default function IndexNowSubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Submit URLs to IndexNow</h1>
      <p className="mb-6">Use this tool to notify search engines about new or updated content on your site.</p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Single URL Submission</h2>
        
        <form id="single-form" className="mb-4">
          <div className="mb-4">
            <label htmlFor="single-url" className="block mb-2 font-medium">URL to submit:</label>
            <input 
              type="url" 
              id="single-url" 
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="https://sokapulse.com/your-page"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="api-key" className="block mb-2 font-medium">API Key:</label>
            <input 
              type="password" 
              id="api-key-single" 
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Your API key"
              required
            />
          </div>
          
          <button 
            type="submit" 
            id="submit-single"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Submit URL
          </button>
        </form>
        
        <div id="single-result" className="mt-4 hidden">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre id="single-result-content" className="whitespace-pre-wrap"></pre>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Batch URL Submission</h2>
        
        <form id="batch-form" className="mb-4">
          <div className="mb-4">
            <label htmlFor="batch-urls" className="block mb-2 font-medium">URLs to submit (one per line):</label>
            <textarea 
              id="batch-urls" 
              rows="5" 
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="https://sokapulse.com/page1&#10;https://sokapulse.com/page2&#10;https://sokapulse.com/page3"
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="api-key-batch" className="block mb-2 font-medium">API Key:</label>
            <input 
              type="password" 
              id="api-key-batch" 
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Your API key"
              required
            />
          </div>
          
          <button 
            type="submit" 
            id="submit-batch"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Submit URLs
          </button>
        </form>
        
        <div id="batch-result" className="mt-4 hidden">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre id="batch-result-content" className="whitespace-pre-wrap"></pre>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">IndexNow Status</h2>
        <button 
          id="check-status"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Check IndexNow Configuration
        </button>
        
        <div id="status-result" className="mt-4 hidden">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded">
            <h3 className="font-medium mb-2">Status:</h3>
            <pre id="status-result-content" className="whitespace-pre-wrap"></pre>
          </div>
        </div>
      </div>
      
      {/* Client-side script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            // Single URL submission
            document.getElementById('single-form').addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const singleUrl = document.getElementById('single-url').value;
              const apiKey = document.getElementById('api-key-single').value;
              const resultDiv = document.getElementById('single-result');
              const resultContent = document.getElementById('single-result-content');
              
              try {
                resultDiv.classList.remove('hidden');
                resultContent.textContent = 'Submitting...';
                
                const response = await fetch('/api/indexnow', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    singleUrl,
                    apiKey
                  })
                });
                
                const data = await response.json();
                resultContent.textContent = JSON.stringify(data, null, 2);
              } catch (error) {
                resultContent.textContent = 'Error: ' + error.message;
              }
            });
            
            // Batch URL submission
            document.getElementById('batch-form').addEventListener('submit', async (e) => {
              e.preventDefault();
              
              const batchUrls = document.getElementById('batch-urls').value;
              const urls = batchUrls.split('\\n').filter(url => url.trim() !== '');
              const apiKey = document.getElementById('api-key-batch').value;
              const resultDiv = document.getElementById('batch-result');
              const resultContent = document.getElementById('batch-result-content');
              
              try {
                resultDiv.classList.remove('hidden');
                resultContent.textContent = 'Submitting...';
                
                const response = await fetch('/api/indexnow', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    urls,
                    apiKey
                  })
                });
                
                const data = await response.json();
                resultContent.textContent = JSON.stringify(data, null, 2);
              } catch (error) {
                resultContent.textContent = 'Error: ' + error.message;
              }
            });
            
            // Check IndexNow status
            document.getElementById('check-status').addEventListener('click', async () => {
              const resultDiv = document.getElementById('status-result');
              const resultContent = document.getElementById('status-result-content');
              
              try {
                resultDiv.classList.remove('hidden');
                resultContent.textContent = 'Checking...';
                
                const response = await fetch('/api/indexnow');
                const data = await response.json();
                resultContent.textContent = JSON.stringify(data, null, 2);
              } catch (error) {
                resultContent.textContent = 'Error: ' + error.message;
              }
            });
          });
        `
      }} />
    </div>
  );
} 