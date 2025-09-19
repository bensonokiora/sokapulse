// Default values for environment variables

export const validateEnvVars = () => {
  const requiredVars = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_API_KEY',
    'NEXT_PUBLIC_SPORTPESA_API_URL',
    'NEXT_PUBLIC_SPORTPESA_API_KEY',
    // Add NEXT_PUBLIC_API_BASE_CLIENT_URL for production builds, but it's optional for development
  ];

  const missingVars = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
      console.error(`Missing environment variable: ${varName}, check configuration.`);
    } else {
      console.log(`Found environment variable: ${varName} is set`);
    }
  }
  
  // Specifically check for the client URL in production
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_BASE_CLIENT_URL) {
     missingVars.push('NEXT_PUBLIC_API_BASE_CLIENT_URL');
     console.error(`Missing environment variable: NEXT_PUBLIC_API_BASE_CLIENT_URL, required for production client-side calls.`);
  } else if (process.env.NEXT_PUBLIC_API_BASE_CLIENT_URL) {
     console.log(`Found environment variable: NEXT_PUBLIC_API_BASE_CLIENT_URL is set`);
  }


  if (missingVars.length > 0) {
    // Adjusted warning for clarity
    console.warn(`Environment Variable Check: Some variables might be missing or using defaults (check logs above). Environment: ${process.env.NODE_ENV}`, {
      missingDetected: missingVars
    });
  } else {
    console.log('All required environment variables seem to be configured for environment:', process.env.NODE_ENV);
  }
};

export const getApiBaseUrl = () => {
  const serverApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const clientApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_CLIENT_URL;

  if (isServer) {
    // console.log(`getApiBaseUrl (Server): Using ${serverApiBaseUrl}`);
    return serverApiBaseUrl;
  } else {
    // Use client URL if available, otherwise fallback to server URL (for local dev)
    const urlToUse = clientApiBaseUrl || serverApiBaseUrl;
    // console.log(`getApiBaseUrl (Client): Using ${urlToUse}`);
    return urlToUse;
  }
};

export const getApiKey = () => {
  // Get API key from environment variables with fallback
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  
  //console.log(`getApiKey called, has value: ${apiKey ? 'yes' : 'no'}, NODE_ENV: ${process.env.NODE_ENV}`);
  
  return apiKey;
};

export const getSportpesaApiUrl = () => {
  // Get Sportpesa API URL from environment variables with fallback
  const apiUrl = process.env.NEXT_PUBLIC_SPORTPESA_API_URL;
  return apiUrl;
};

export const getSportpesaApiKey = () => {
  // Get Sportpesa API key from environment variables with fallback
  const apiKey = process.env.NEXT_PUBLIC_SPORTPESA_API_KEY;
  return apiKey;
};

// Check if we're in a browser or server environment
export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;

// Call validateEnvVars when this module is imported
if (isServer) {
  console.log('Running on server, validating environment variables...');
  validateEnvVars();
}
