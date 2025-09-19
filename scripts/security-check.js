/**
 * Security Check Script
 * 
 * This script checks various security configurations in the project
 * and reports any issues or recommendations.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}=== Security Configuration Check ===\n${colors.reset}`);

// Check for environment variables in .env.local but not committed to git
function checkEnvVariables() {
  console.log(`${colors.blue}Checking environment variables...${colors.reset}`);
  
  try {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (!gitignore.includes('.env.local') && !gitignore.includes('.env.*')) {
      console.log(`${colors.red}WARNING: .env.local is not in .gitignore. Sensitive environment variables might be committed to the repository.${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ .env files are properly gitignored${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}Could not read .gitignore file: ${error.message}${colors.reset}`);
  }
  
  console.log();
}

// Check CSP configuration
function checkCSP() {
  console.log(`${colors.blue}Checking Content Security Policy configuration...${colors.reset}`);
  
  try {
    const nextConfig = fs.readFileSync('next.config.js', 'utf8');
    
    if (nextConfig.includes('Content-Security-Policy')) {
      console.log(`${colors.green}✓ Content Security Policy is configured in next.config.js${colors.reset}`);
      
      // Check for unsafe directives
      if (nextConfig.includes("'unsafe-eval'") && !nextConfig.includes("isDevelopment")) {
        console.log(`${colors.yellow}⚠ CSP includes 'unsafe-eval' which should only be used in development${colors.reset}`);
      }
      
      if (nextConfig.includes("'unsafe-inline'") && !nextConfig.includes("nonce")) {
        console.log(`${colors.yellow}⚠ CSP includes 'unsafe-inline' without nonce-based CSP${colors.reset}`);
      }
      
    } else {
      console.log(`${colors.red}✗ No Content Security Policy found in next.config.js${colors.reset}`);
    }
    
    // Check if CSP reporting is configured
    if (nextConfig.includes('Content-Security-Policy-Report-Only')) {
      console.log(`${colors.green}✓ CSP Report-Only mode is configured for monitoring${colors.reset}`);
    }
    
    if (nextConfig.includes('report-uri') || nextConfig.includes('report-to')) {
      console.log(`${colors.green}✓ CSP reporting endpoint is configured${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}Could not read next.config.js: ${error.message}${colors.reset}`);
  }
  
  console.log();
}

// Check middleware security
function checkMiddleware() {
  console.log(`${colors.blue}Checking middleware security headers...${colors.reset}`);
  
  try {
    const middleware = fs.readFileSync('src/middleware.js', 'utf8');
    
    const headers = [
      { name: 'Strict-Transport-Security', pattern: 'Strict-Transport-Security' },
      { name: 'X-Content-Type-Options', pattern: 'X-Content-Type-Options' },
      { name: 'X-Frame-Options', pattern: 'X-Frame-Options' },
      { name: 'Permissions-Policy', pattern: 'Permissions-Policy' },
      { name: 'Referrer-Policy', pattern: 'Referrer-Policy' },
      { name: 'Cross-Origin-Opener-Policy', pattern: 'Cross-Origin-Opener-Policy' },
      { name: 'Cross-Origin-Embedder-Policy', pattern: 'Cross-Origin-Embedder-Policy' },
      { name: 'Cross-Origin-Resource-Policy', pattern: 'Cross-Origin-Resource-Policy' }
    ];
    
    headers.forEach(header => {
      if (middleware.includes(header.pattern)) {
        console.log(`${colors.green}✓ ${header.name} is configured in middleware.js${colors.reset}`);
      } else {
        console.log(`${colors.yellow}⚠ ${header.name} was not found in middleware.js${colors.reset}`);
      }
    });
    
  } catch (error) {
    console.log(`${colors.red}Could not read src/middleware.js: ${error.message}${colors.reset}`);
  }
  
  console.log();
}

// Check package dependencies for known vulnerabilities
function checkDependencies() {
  console.log(`${colors.blue}Checking for package vulnerabilities...${colors.reset}`);
  
  try {
    // Run npm audit and capture the output
    const auditOutput = execSync('npm audit --json', { stdio: 'pipe' }).toString();
    const auditData = JSON.parse(auditOutput);
    
    // Get vulnerability counts by severity
    const vulnerabilities = auditData.metadata?.vulnerabilities;
    
    if (vulnerabilities) {
      const { critical, high, moderate, low } = vulnerabilities;
      const totalVulns = critical + high + moderate + low;
      
      if (totalVulns === 0) {
        console.log(`${colors.green}✓ No vulnerabilities found in dependencies${colors.reset}`);
      } else {
        console.log(`${colors.red}${totalVulns} vulnerabilities found:${colors.reset}`);
        if (critical > 0) console.log(`${colors.red}  - Critical: ${critical}${colors.reset}`);
        if (high > 0) console.log(`${colors.red}  - High: ${high}${colors.reset}`);
        if (moderate > 0) console.log(`${colors.yellow}  - Moderate: ${moderate}${colors.reset}`);
        if (low > 0) console.log(`${colors.yellow}  - Low: ${low}${colors.reset}`);
        
        console.log(`${colors.yellow}Run 'npm audit' for more details and 'npm audit fix' to fix issues${colors.reset}`);
      }
    } else {
      console.log(`${colors.yellow}Could not parse npm audit output${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}Error running npm audit: ${error.message}${colors.reset}`);
  }
  
  console.log();
}

// Run all checks
function runSecurityChecks() {
  checkEnvVariables();
  checkCSP();
  checkMiddleware();
  checkDependencies();
  
  console.log(`${colors.cyan}=== Security Check Complete ===\n${colors.reset}`);
  console.log(`${colors.cyan}Recommendations:${colors.reset}`);
  console.log(` - Regularly run 'npm audit' to check for vulnerabilities`);
  console.log(` - Keep your CSP policy as restrictive as possible`);
  console.log(` - Monitor your CSP violation reports regularly`);
  console.log(` - Consider using a web security scanning service for your production site`);
}

runSecurityChecks(); 