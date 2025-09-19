import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 50;
const ipRequestMap = new Map();

/**
 * Formats CSP reports for easier reading in development
 */
function formatCSPReport(report) {
  if (!report || !report['csp-report']) {
    return 'Invalid CSP report format';
  }

  const cspReport = report['csp-report'];
  
  // Create a more readable format for the console
  return {
    summary: `CSP Violation: ${cspReport['violated-directive'] || 'unknown directive'}`,
    details: {
      blockedURI: cspReport['blocked-uri'] || 'N/A',
      violatedDirective: cspReport['violated-directive'] || 'N/A',
      originalPolicy: cspReport['original-policy'] ? 
        cspReport['original-policy'].substring(0, 100) + '...' : 'N/A',
      documentURI: cspReport['document-uri'] || 'N/A',
      disposition: cspReport['disposition'] || 'N/A',
      sourceFile: cspReport['source-file'] || 'N/A',
      lineNumber: cspReport['line-number'] || 'N/A',
      columnNumber: cspReport['column-number'] || 'N/A', 
    }
  };
}

/**
 * Simple rate limiting function to prevent abuse
 * @param {string} ip - The client IP address
 * @returns {boolean} - Whether the request is allowed
 */
function checkRateLimit(ip) {
  const now = Date.now();
  
  // Remove expired entries
  for (const [storedIp, { timestamp }] of ipRequestMap.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      ipRequestMap.delete(storedIp);
    }
  }
  
  // Check if IP exists in the map
  if (!ipRequestMap.has(ip)) {
    ipRequestMap.set(ip, { 
      count: 1, 
      timestamp: now 
    });
    return true;
  }
  
  // Increment counter for existing IP
  const data = ipRequestMap.get(ip);
  if (data.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }
  
  // Update counter
  data.count += 1;
  ipRequestMap.set(ip, data);
  return true;
}

/**
 * Enhanced CSP reporting endpoint with rate limiting
 * and improved security logging
 */
export async function POST(request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Apply rate limiting
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    console.log('⚠️ CSP report endpoint was called!');
    
    // Get the CSP report data
    const reportData = await request.json();
    
    // Create a timestamp
    const timestamp = new Date().toISOString();
    
    // Format the log entry with additional security context
    const logEntry = {
      timestamp,
      report: reportData,
      metadata: {
        clientIp,
        userAgent: request.headers.get('user-agent') || 'Unknown',
        referer: request.headers.get('referer') || 'Unknown',
        host: request.headers.get('host') || 'Unknown',
        path: request.url || 'Unknown',
      }
    };
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n🚨 CSP Violation Report Received:');
      console.log('-------------------------------');
      const formattedReport = formatCSPReport(reportData);
      console.log(formattedReport.summary);
      console.table(formattedReport.details);
      console.log('Security Context:');
      console.table(logEntry.metadata);
      console.log('-------------------------------\n');
    }
    
    // Log to file in production
    if (process.env.NODE_ENV === 'production') {
      const logsDir = path.join(process.cwd(), 'logs');
      
      // Create logs directory if it doesn't exist
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      const logFile = path.join(logsDir, 'csp-violations.log');
      
      // Append to log file - sanitize data to prevent log injection
      fs.appendFileSync(
        logFile,
        JSON.stringify(logEntry).replace(/[\n\r]/g, '') + '\n',
        'utf8'
      );
      
      // Add rotation logic for log files to prevent them from growing too large
      try {
        const stats = fs.statSync(logFile);
        const fileSizeInMB = stats.size / (1024 * 1024);
        
        // If file is larger than 10MB, rotate it
        if (fileSizeInMB > 10) {
          const backupFile = `${logFile}.${timestamp.replace(/:/g, '-')}`;
          fs.renameSync(logFile, backupFile);
        }
      } catch (err) {
        console.error('Error checking log file size:', err);
      }
    }
    
    // Return success response (204 No Content)
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json(
      { error: 'Failed to process CSP report' }, 
      { status: 500 }
    );
  }
}

// OPTIONS request handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
} 