import { NextResponse } from 'next/server';

/**
 * Simple test endpoint to verify CSP reporting is working
 */
export async function GET() {
  // Log that the test was triggered
  console.log('\n🧪 CSP Report Test Endpoint Called');
  
  // Create a sample CSP report
  const sampleReport = {
    'csp-report': {
      'document-uri': 'http://localhost:3000/csp-test',
      'referrer': '',
      'violated-directive': 'script-src-elem',
      'effective-directive': 'script-src-elem',
      'original-policy': 'default-src \'self\'; script-src \'self\' \'unsafe-inline\'; report-uri /api/csp-report',
      'disposition': 'enforce',
      'blocked-uri': 'https://example.com/test-script.js',
      'line-number': 15,
      'column-number': 5,
      'source-file': 'http://localhost:3000/csp-test',
      'status-code': 0,
      'script-sample': ''
    }
  };
  
  // Send a POST request to the CSP report endpoint
  try {
    const response = await fetch('http://localhost:3000/api/csp-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/csp-report'
      },
      body: JSON.stringify(sampleReport)
    });
    
    if (response.ok) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'CSP report test sent successfully! Check your console for the report.'
      });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: `Failed to send CSP report: ${response.status} ${response.statusText}`
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in CSP test:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: `Error in CSP test: ${error.message}`
    }, { status: 500 });
  }
} 