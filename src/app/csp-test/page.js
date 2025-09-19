'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * This page intentionally triggers CSP violations for testing
 */
export default function CSPTestPage() {
  useEffect(() => {
    // Method 1: Inject a script from unauthorized domain
    const scriptViolation = document.createElement('script');
    scriptViolation.src = 'https://example.com/test-script.js';
    document.body.appendChild(scriptViolation);

    // Method 2: Inline script with eval (if eval is restricted)
    try {
      const inlineViolation = document.createElement('script');
      inlineViolation.innerHTML = `
        // This should trigger a CSP violation if unsafe-eval is restricted
        eval('console.log("This is an eval test")');
      `;
      document.body.appendChild(inlineViolation);
    } catch (e) {
      console.log('Error adding inline script:', e);
    }

    // Method 3: Create an iframe from unauthorized source
    try {
      const iframeViolation = document.createElement('iframe');
      iframeViolation.src = 'https://example.org';
      document.body.appendChild(iframeViolation);
    } catch (e) {
      console.log('Error adding iframe:', e);
    }

    // Method 4: Style violation
    try {
      const styleViolation = document.createElement('link');
      styleViolation.rel = 'stylesheet';
      styleViolation.href = 'https://example.net/style.css';
      document.head.appendChild(styleViolation);
    } catch (e) {
      console.log('Error adding style:', e);
    }

    // Cleanup function
    return () => {
      document.querySelectorAll('script[src="https://example.com/test-script.js"]').forEach(el => el.remove());
      document.querySelectorAll('iframe[src="https://example.org"]').forEach(el => el.remove());
      document.querySelectorAll('link[href="https://example.net/style.css"]').forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="container mt-5">
      <h1>CSP Violation Test Page</h1>
      <p>This page intentionally triggers several Content Security Policy violations.</p>
      <p>Check your browser console and server logs for CSP violation reports.</p>
      
      <h2 className="mt-4">Test Results</h2>
      <p>You should see CSP violation reports in:</p>
      <ul>
        <li>Browser console (browser-side reporting)</li>
        <li>Development server console (our custom endpoint)</li>
      </ul>
      
      <div className="mt-4">
        <Link href="/" className="btn btn-primary">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
} 