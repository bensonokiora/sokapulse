import { getApiBaseUrl, getApiKey, isServer, getSportpesaApiUrl, getSportpesaApiKey } from './config';

// API configuration 
// Get values directly from config functions which have built-in defaults
const API_BASE = getApiBaseUrl();
const API_KEY = getApiKey();
// Set timeout duration in milliseconds (60 seconds - increased from 30 to handle slow external APIs)
const API_TIMEOUT = 60000;

// Sportpesa API configuration
const SPORTPESA_API_BASE = getSportpesaApiUrl();
const SPORTPESA_API_KEY = getSportpesaApiKey();

// Define public URL for client-side calls using environment variables
const PUBLIC_JACKPOT_API_BASE = 'https://jackpot-predictions.com/soka/api/v1';



// Common headers for all API requests
const getHeaders = () => ({
  'X-API-KEY': API_KEY,
  'Content-Type': 'application/json'
});

// Helper function to add timeout to fetch requests with retry capability
async function fetchWithTimeoutAndRetry(url, options = {}, maxRetries = 3) {
  const baseDelay = 1000; // Start with 1 second delay
  let attempt = 0;
  
  while (attempt <= maxRetries) {
    const controller = new AbortController();
    const { signal } = controller;
    
    const timeout = setTimeout(() => {
      controller.abort();
    }, API_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeout);
      attempt++;
      
      // If we've used all retries or this is a client error (4xx), rethrow
      if (attempt > maxRetries || (error.message?.includes('status') && error.message.match(/status: 4\d\d/))) {
        // Only throw the error if we're out of retries
        throw error;
      }
      
      // For network errors, timeouts, or server errors, retry with exponential backoff
      
      // Calculate delay with exponential backoff (1s, 2s, 4s...)
      const delayTime = baseDelay * Math.pow(2, attempt - 1);
      
      // Add some jitter to prevent all retries happening simultaneously
      const jitter = Math.random() * 500;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayTime + jitter));
    }
  }
}

// Replace all instances of fetchWithTimeout with fetchWithTimeoutAndRetry
// First function is kept for backward compatibility
async function fetchWithTimeout(url, options = {}) {
  return fetchWithTimeoutAndRetry(url, options, 3);
}


// Fetch fixtures by country
export async function fetchFixturesByCountry(countryName) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_fixtures_by_country?country_name=${countryName}`, 
      {
        headers: getHeaders()
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching country fixtures:', error);
    throw error;
  }
}

// Fetch fetchFixturesByDate's fixtures
export async function fetchFixturesByDatePaginated(date, perPage = 20, nextCursor = '1') {
  // Ensure nextCursor is a string, as the API expects it. '1' is the default for the first page.
  const cursor = nextCursor === null || nextCursor === undefined ? '1' : String(nextCursor);

  try {
    const url = `${API_BASE}/fetch_fixtures_by_date_mobile?fixture_date=${date}&per_page=${perPage}&next_cursor=${cursor}&user_country="KE"`;
    const response = await fetchWithTimeoutAndRetry(  // Use the enhanced fetch with retries
      url,
      {
        headers: getHeaders() // Assuming these headers are correct for the new endpoint
      },
      3  // Maximum 3 retries
    );

    const jsonData = await response.json();

    // The API returns 'nextCursor'. If it's null, it means no more pages.
    // The data is in jsonData.data
    return {
      status: jsonData.status,
      message: jsonData.message,
      fixtures: jsonData.data || [], // Ensure data is an array
      nextCursor: jsonData.nextCursor, // This will be used for the next call
      perPage: jsonData.per_page
    };
  } catch (error) {
    console.error('Error fetching fixtures by date (paginated):', error);
    // Return a consistent error structure
    return {
      status: false,
      message: error.message || 'Failed to fetch fixtures',
      fixtures: [],
      nextCursor: null, // No cursor on error
      perPage: perPage
    };
  }
}

// Fetch fetchWeekendFixtures's fixtures
export async function fetchWeekendFixtures(date, per_page = 20, next_cursor = '1') {
  try {
    const url = `${API_BASE}/fetch_weekend_fixtures?saturday_date=${date}&per_page=${per_page}&next_cursor=${next_cursor}`;
    const response = await fetchWithTimeout(
      url,
      {
        headers: getHeaders()
      }
    );

    const jsonData = await response.json();
    // Assuming the paginated response structure is similar to other paginated endpoints
    return {
        status: jsonData.status,
        message: jsonData.message,
        data: jsonData.data || [],
        nextCursor: jsonData.nextCursor, // API should return this
        perPage: jsonData.per_page      // API should return this
    };

  } catch (error) {
    console.error('Error fetching weekend fixtures:', error);
    // Return a consistent error structure
    return {
      status: false,
      message: error.message || 'Failed to fetch weekend fixtures',
      data: [],
      nextCursor: null,
      perPage: per_page
    };
  }
}

// Fetch grouped fixtures
export async function fetchGroupedFixtures(date, startIndex = 0, endIndex = 20) {
  try {
    // Ensure parameters are valid numbers
    const start = Number(startIndex) || 0;
    let end = Number(endIndex) || 20;
    
    // If we're loading more, interpret endIndex as a limit (batchSize)
    // This is to handle the case where the API might be interpreting endIndex differently
    const limit = end - start;
    // Adjust endIndex to be a true index, not a count
    if (start > 0) {
      end = start + limit;
    }
    
    if (start < 0 || end <= 0 || end <= start) {
        throw new Error('Invalid pagination parameters');
    }
    
    const url = `${API_BASE}/fetch_todays_games_grouped_by_leagues?fixture_date=${date}&start_index=${start}&end_index=${end}`;
    
    const response = await fetchWithTimeout(
      url,
      {
        headers: getHeaders()
      }
    );

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching grouped fixtures:', error);
    throw error;
  }
}

// Fetch fixture details by ID
export async function fetchFixtureById(fixtureId) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_fixtures_by_id`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ fixture_id: fixtureId })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching fixture details:', error);
    throw error;
  }
}

// Fetch match details and related data
export async function fetchMatchDetailsData(fixtureId) {
  try {
    
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_match_details_top_data?fixture_id=${fixtureId}`,
      {
        headers: getHeaders()
      }
    );
    
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

// Fetch last 6 matches for home team
export async function fetchHomeTeamMatches(homeTeamId, fixtureDate) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_last_six_matches_by_home_team`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          home_team_id: homeTeamId,
          fixture_date: fixtureDate
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching home team matches:', error);
    throw error;
  }
}

// Fetch last 6 matches for away team
export async function fetchAwayTeamMatches(awayTeamId, fixtureDate) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_last_six_matches_by_away_team`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          away_team_id: awayTeamId,
          fixture_date: fixtureDate
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching away team matches:', error);
    throw error;
  }
}

// Fetch team standings
export async function fetchTeamStandings(leagueId) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_team_standings`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ league_id: leagueId })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching standings:', error);
    throw error;
  }
}

// Fetch head-to-head fixtures
export async function fetchH2HFixtures(homeTeamId, awayTeamId, fixtureDate) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_h2h_fixtures`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
          fixture_date: fixtureDate
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching H2H fixtures:', error);
    throw error;
  }
}

// Fetch match trends data
export async function fetchMatchTrends(fixtureId) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_trends_data_by_fixture_id_old?fixture_id=${fixtureId}`,
      {
        headers: getHeaders()
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching match trends:', error);
    throw error;
  }
}

// Fetch trends data
export async function fetchTrendsData(date) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_teams_stats_by_fixture?fixture_date=${date}`,
      {
        headers: getHeaders()
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
}

// Fetch upcoming matches for home team
export async function fetchUpcomingHomeMatches(homeTeamId, fixtureDate) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_upcoming_matches_home_team`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          home_team_id: homeTeamId,
          fixture_date: fixtureDate
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming home matches:', error);
    throw error;
  }
}

// Fetch upcoming matches for away team  
export async function fetchUpcomingAwayMatches(awayTeamId, fixtureDate) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_upcoming_matches_away_team`, 
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          away_team_id: awayTeamId,
          fixture_date: fixtureDate
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming away matches:', error);
    throw error;
  }
}

// Fetch top predictions
export async function fetchTopPredictions(date, per_page = 20, next_cursor = '1') {
  try {
    const url = `${API_BASE}/fetch_top_winning_predictions?fixture_date=${date}&per_page=${per_page}&next_cursor=${next_cursor}`;
    const response = await fetchWithTimeout(
      url,
      {
        headers: getHeaders()
      }
    );

    const jsonData = await response.json();
    return {
        status: jsonData.status,
        message: jsonData.message,
        data: jsonData.data || [],
        nextCursor: jsonData.nextCursor,
        perPage: jsonData.per_page
    };

  } catch (error) {
    console.error('Error fetching top predictions:', error);
    // Return a consistent error structure
    return {
      status: false,
      message: error.message || 'Failed to fetch top predictions',
      data: [],
      nextCursor: null,
      perPage: per_page
    };
  }
}

// Fetch live games
export async function fetchLiveGames(date) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_live_games?fixture_date=${date}&start_index=0&end_index=2000`,
      {
        headers: getHeaders()
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching live games:', error);
    throw error;
  }
}

// Fetch upcoming fixtures
export async function fetchUpcomingFixtures(date, per_page = 20, next_cursor = '1') {
  try {
    const url = `${API_BASE}/fetch_incoming_fixtures?fixture_date=${date}&per_page=${per_page}&next_cursor=${next_cursor}`;
    const response = await fetchWithTimeout(
      url,
      {
        headers: getHeaders()
      }
    );

    const jsonData = await response.json();
    // Assuming the paginated response structure is similar to fetchTopPredictions
    return {
        status: jsonData.status,
        message: jsonData.message,
        data: jsonData.data || [],
        nextCursor: jsonData.nextCursor, // API should return this
        perPage: jsonData.per_page      // API should return this
    };

  } catch (error) {
    console.error('Error fetching upcoming fixtures:', error);
    return {
      status: false,
      message: error.message || 'Failed to fetch upcoming fixtures',
      data: [],
      nextCursor: null,
      perPage: per_page
    };
  }
}

// Fetch league fixtures
export async function fetchLeagueFixtures(leagueId, leagueName, countryName) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_league_fixtures?league_id=${leagueId}&league_name=${leagueName}&country_name=${countryName}`,
      {
        headers: getHeaders()
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching league fixtures:', error);
    throw error;
  }
}

// Fetch league standings
export async function fetchLeagueStandings(leagueId) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_team_standings`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ league_id: leagueId })
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching standings:', error);
    throw error;
  }
}

// Fetch league trends
export async function fetchLeagueTrends(leagueId) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_trends_data_by_league_id?league_id=${leagueId}`,
      {
        headers: getHeaders()
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
}

// Fetch team details
export async function fetchTeamDetails(teamId) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_teams_details_top?team_id=${teamId}`,
      {
        headers: getHeaders()
      }
    );

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    throw error;
  }
}

// Fetch team's matches when home
export async function fetchTeamMatches(teamId, fixtureDate) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_teams_matches_when_home`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          team_id: teamId,
          fixture_date: fixtureDate
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching team matches:', error);
    throw error;
  }
}

// Fetch team's matches when away
export async function fetchTeamMatchesAway(teamId, fixtureDate) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_teams_matches_when_away`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          team_id: teamId,
          fixture_date: fixtureDate
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching team away matches:', error);
    throw error;
  }
}

// Fetch team's matches from both sides
export async function fetchTeamMatchesBothSides(teamId, fixtureDate) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_teams_matches_both_sides`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          team_id: teamId,
          fixture_date: fixtureDate
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching team matches from both sides:', error);
    throw error;
  }
}

// Fetch team stats by fixture date
export async function fetchTeamStatsByFixture(date) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/fetch_teams_stats_by_fixture?fixture_date=${date}`,
      {
        headers: getHeaders()
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching team stats:', error);
    throw error;
  }
}

export const fetchFixturesByIds = async (fixtureIds) => {
  try {
    // Format the fixture IDs in the required structure
    const formattedIds = fixtureIds.map(item => ({
      fixture_id: typeof item === 'object' ? item.fixture_id : item
    }));

    const response = await fetchWithTimeout(`${API_BASE}/fetch_fixtures_by_id`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        fixture_id: formattedIds
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    throw error;
  }
};

// Search API endpoint
export async function searchByKeyword(searchQuery) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/search_request_by_keyword`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ search_query: searchQuery })
      }
    );

    const data = await response.json();

    const combinedResults = [];

    if (data.teams && data.teams.data) {
      data.teams.data.forEach(item => {
        combinedResults.push({ ...item, search_group: 'team' });
      });
    }

    if (data.leagues && data.leagues.data) {
      data.leagues.data.forEach(item => {
        combinedResults.push({ ...item, search_group: 'league' });
      });
    }

    if (data.fixtures && data.fixtures.data) {
      data.fixtures.data.forEach(item => {
        combinedResults.push({ ...item, search_group: 'fixture' });
      });
    }
    
    return combinedResults;
    
  } catch (error) {
    console.error('Error performing search:', error); 
    return [];
  }
}

// Fetch pick of the day
export async function fetchPickOfTheDay() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/match_of_the_day`,
      {
        headers: getHeaders()
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching pick of the day:', error);
    throw error;
  }
}

// Helper function to extract fixture count from bookmaker description
export const extractFixtureCount = (description) => {
  if (!description) return 20; // default fallback
  
  // Extract number from descriptions like "Predict 16 matches correctly"
  const match = description.match(/predict (\d+) matches/i);
  if (match) {
    return parseInt(match[1]);
  }
  
  // Fallback to 20 if we can't parse
  return 20;
};

// Fetch jackpot matches
export async function fetchJackpotMatches(date, bookmakerId, fixturesCount = 20) {
  const baseUrl = PUBLIC_JACKPOT_API_BASE;
  const fetchHeaders = isServer ? getHeaders() : { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY };
  const url = `${baseUrl}/datatable/matches?jackpot_date=${date}&link=${bookmakerId}&fixtures_count=${fixturesCount}`;

  try {
    const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: fetchHeaders
      }
    );
    return await response.json();
  } catch (error) {
    console.error(`Error fetching jackpot matches from ${url}:`, error);
    throw error;
  }
}

// Fetch head-to-head data between two teams
export async function fetchHeadToHeadData(homeTeamId, awayTeamId, fixtureDate) {
  const baseUrl = isServer ? API_BASE : PUBLIC_JACKPOT_API_BASE;
  const fetchHeaders = isServer ? getHeaders() : { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY };
  const url = `${baseUrl}/datatable/h2h/soka?homeTeamId=${homeTeamId}&awayTeamId=${awayTeamId}&fixtureDate=${fixtureDate}`;

  try {
    const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: fetchHeaders
      }
    );
    const jsonData = await response.json();
    // Return the data array directly based on the new API structure
    return jsonData?.data || []; 
  } catch (error) {
    console.error(`Error fetching head-to-head from ${url}:`, error);
    // Ensure an empty array is returned on error to avoid breaking the component
    return []; 
  }
}

// Fetch last 6 matches for home team
export async function fetchLastHomeTeamMatches(homeTeamId, fixtureDate) {
  const baseUrl = isServer ? API_BASE : PUBLIC_JACKPOT_API_BASE;
  const fetchHeaders = isServer ? getHeaders() : { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY };
  const url = `${baseUrl}/datatable/getlast6matches/soka?homeTeamId=${homeTeamId}&fixtureDate=${fixtureDate}`;

  try {
    const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: fetchHeaders
      }
    );
    const jsonData = await response.json();
    // Return the previousFixtures array directly based on the new API structure
    return jsonData?.previousFixtures || [];
  } catch (error) {
    console.error(`Error fetching home team matches from ${url}:`, error);
    // Ensure an empty array is returned on error
    return [];
  }
}

// Fetch last 6 matches for away team
export async function fetchLastAwayTeamMatches(awayTeamId, fixtureDate) {
  const baseUrl = isServer ? API_BASE : PUBLIC_JACKPOT_API_BASE;
  const fetchHeaders = isServer ? getHeaders() : { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY };
  const url = `${baseUrl}/datatable/getlast6matches/away?awayTeamId=${awayTeamId}&fixtureDate=${fixtureDate}`;

  try {
    const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: fetchHeaders
      }
    );
    const jsonData = await response.json();
    // Return the previousFixtures array directly based on the new API structure
    return jsonData?.previousFixtures || [];
  } catch (error) {
    console.error(`Error fetching away team matches from ${url}:`, error);
    // Ensure an empty array is returned on error
    return [];
  }
}

// Fetch match odds
export async function fetchMatchOdds(matchId) {
  const baseUrl = isServer ? API_BASE : PUBLIC_JACKPOT_API_BASE;
  const fetchHeaders = isServer ? getHeaders() : { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY };
  const url = `${baseUrl}/datatable/getOdds/mabao?matchId=${matchId}`;

  try {
    const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: fetchHeaders
      }
    );
    return await response.json();
  } catch (error) {
    console.error(`Error fetching match odds from ${url}:`, error);
    throw error;
  }
}

// Fetch more all JP
export async function fetchMoreAllJp(bookmakerId, maxDoublesCount = 10, fixturesCount = 20) {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/get-more-all-jp`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
          bookmakerId, 
          maxDoublesCount, 
          fixturesCount 
        })
      }
    );

    const data = await response.json();
    
    // Ensure we have a valid response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format: Expected object');
    }

    // Check if the data already has the expected structure
    if (data.error === false && Array.isArray(data.body)) {
      return data;
    }

    // Handle case where data is directly an array
    if (Array.isArray(data)) {
      return {
        error: false,
        message: 'success',
        body: data
      };
    }

    // Handle case where data.data exists and is an array
    if (Array.isArray(data.data)) {
      return {
        error: false,
        message: 'success',
        body: data.data
      };
    }
    
    // If none of the above, return empty array
    return {
      error: false,
      message: 'success',
      body: []
    };
    
  } catch (error) {
    console.error('Error fetching more all JP:', error);
    // Return a properly structured error response
    return {
      error: true,
      message: error.message || 'Failed to fetch predictions',
      body: []
    };
  }
}

// Fetch sports analysis multibet data
export async function fetchSportsAnalysisMultibetOne() {
  try {
    const response = await fetchWithTimeout(
      `${SPORTPESA_API_BASE}/sports-analysis-multibet-one`,
      {
        method: 'GET',
        headers: {
          'x-api-key': SPORTPESA_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    
    // Ensure we have a valid response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format: Expected object');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching sports analysis multibet data:', error);
    // Return a properly structured error response
    return {
      error: true,
      message: error.message || 'Failed to fetch sports analysis multibet data',
      body: []
    };
  }
}

// Fetch sports analysis multibet data
export async function fetchSportsAnalysisMultibetTwo() {
  try {
    const response = await fetchWithTimeout(
      `${SPORTPESA_API_BASE}/sports-analysis-multibet-two`,
      {
        method: 'GET',
        headers: {
          'x-api-key': SPORTPESA_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    
    // Ensure we have a valid response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format: Expected object');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching sports analysis multibet data:', error);
    // Return a properly structured error response
    return {
      error: true,
      message: error.message || 'Failed to fetch sports analysis multibet data',
      body: []
    };
  }
}

/**
 * Login API function
 * @param {string} phone - User's phone number
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response from the login API
 */
export const loginUser = async (phone, password) => {
  try {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('password', password);

    const response = await fetch(`${SPORTPESA_API_BASE}/login-sportpesa-leaguelane`, {
      method: 'POST',
      headers: {
        'x-api-key': SPORTPESA_API_KEY,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Login API error:', error);
    return { error: true, message: 'Connection error' };
  }
};

// Fetch jackpots data
export async function fetchJackpots(date) {
  const baseUrl = PUBLIC_JACKPOT_API_BASE;
  const fetchHeaders = isServer ? getHeaders() : { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY };
  const url = `${baseUrl}/datatable/jackpots?jackpot_date=${date}`;
  
  try {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: fetchHeaders
    });
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching jackpots from ${url}:`, error);
    throw error;
  }
}

export async function fetchFixturesForBetCreator(date) {
  let allFixtures = [];
  let nextCursor = '1'; // Start with the first page

  try {
    while (nextCursor) {
      const url = `${API_BASE}/fetch_fixtures_by_date_mobile?fixture_date=${date}&per_page=200&next_cursor=${nextCursor}&user_country=KE`;
      
      const response = await fetchWithTimeoutAndRetry(
        url,
        {
          headers: getHeaders(),
        },
        3
      );

      const jsonData = await response.json();

      if (jsonData.status && Array.isArray(jsonData.data)) {
        allFixtures = allFixtures.concat(jsonData.data);
        nextCursor = jsonData.nextCursor; // Update cursor for the next iteration, null if it's the last page
      } else {
        nextCursor = null; // Stop the loop
      }
    }

    return {
      status: true,
      message: `Successfully fetched ${allFixtures.length} fixtures.`,
      fixtures: allFixtures,
    };
  } catch (error) {
    // Return what we have accumulated so far, plus an error state.
    return {
      status: false,
      message: error.message || 'Failed to fetch fixtures',
      fixtures: allFixtures, // Return what we have so far
    };
  }
}

export async function createBetSlip(betSlipData) {
  try {
    const url = `${API_BASE}/user/create-bet-slip`;
    // Using fetchWithTimeout for consistency and timeout handling.
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: getHeaders(), // Re-using getHeaders which includes the Content-Type and X-API-KEY
      body: JSON.stringify(betSlipData),
    });

    // The fetchWithTimeout function throws for non-ok responses, so this part might not be reached
    // but is kept as a safeguard.
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to submit bet slip and parse error response.' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Re-throw to be caught by the calling component.
    throw error;
  }
}