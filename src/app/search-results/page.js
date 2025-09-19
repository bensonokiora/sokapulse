'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchByKeyword } from '../../utils/api';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setIsLoading(true);
        const results = await searchByKeyword(query);
        setSearchResults(results || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="h3 mb-4">Search Results for "{query}"</h1>
      
      {searchResults.length === 0 ? (
        <p>No results found for "{query}"</p>
      ) : (
        <div className="search-results-list">
          {searchResults.map((result, index) => {
            let href = '';
            let displayName = '';
            let displayId = '';
            let countryName = '';
            let fixtureDate = '';

            let teamApiLogo = '';
            let leagueApiLogo = '';
            let homeTeamApiLogo = '';
            let awayTeamApiLogo = '';
            
            let homeTeamName = '';
            let awayTeamName = '';

            switch(result.search_group) {
              case 'team':
                displayName = result.name;
                displayId = result.team_id;
                teamApiLogo = result.logo; // Direct API URL
                href = `/football-predictions/team/${encodeURI(displayName.toLowerCase().replace(/\s+/g, '-'))}-${displayId}`;
                break;
              case 'country': 
                displayName = result.name || result.search_res_name || 'N/A';
                href = `/football-predictions/country/${encodeURI(displayName.toLowerCase().replace(/\s+/g, '-'))}`;
                break;
              case 'league':
                displayName = result.name;
                displayId = result.id;
                countryName = result.country_name;
                leagueApiLogo = result.league_logo; // Direct API URL
                href = `/football-predictions/league/${encodeURI(countryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURI(displayName.toLowerCase().replace(/\s+/g, '-'))}-${displayId}`;
                break;
              case 'fixture':
                homeTeamName = result.home_team_name;
                awayTeamName = result.away_team_name;
                displayName = `${homeTeamName} VS ${awayTeamName}`;
                displayId = result.fixture_id;
                fixtureDate = result.formatted_date;
                homeTeamApiLogo = result.home_team_logo; // Direct API URL
                awayTeamApiLogo = result.away_team_logo; // Direct API URL
                href = `/football-predictions/fixture/${encodeURI(homeTeamName.replace(/\s+/g, '-').toLowerCase())}vs${encodeURI(awayTeamName.replace(/\s+/g, '-').toLowerCase())}-${displayId}`;
                break;
            }

            return (
              <div key={index} className="card mb-3">
                <div className="card-body">
                  <Link href={href} className="text-decoration-none text-dark">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center flex-grow-1">
                        {/* Logos using direct API URLs */}
                        {result.search_group === 'team' && teamApiLogo && (
                          <img 
                            src={teamApiLogo}
                            alt={displayName} 
                            className="me-2" style={{ width: '30px', height: '30px' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        {result.search_group === 'league' && leagueApiLogo && (
                          <img 
                            src={leagueApiLogo} 
                            alt={displayName} 
                            className="me-2" style={{ width: '30px', height: '30px' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        {result.search_group === 'fixture' && (
                          <div className="d-flex align-items-center">
                            {homeTeamApiLogo && 
                              <img 
                                src={homeTeamApiLogo} 
                                alt={homeTeamName} 
                                className="me-1" style={{ width: '24px', height: '24px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />}
                            <span className="me-1 fw-bold" style={{fontSize: '0.9rem'}}>{homeTeamName}</span>
                            <span className="mx-1" style={{fontSize: '0.8rem'}}>vs</span>
                            {awayTeamApiLogo && 
                              <img 
                                src={awayTeamApiLogo} 
                                alt={awayTeamName} 
                                className="ms-1 me-2" style={{ width: '24px', height: '24px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />}
                            <span className="fw-bold" style={{fontSize: '0.9rem'}}>{awayTeamName}</span>
                          </div>
                        )}
                        {/* Display Name (excluding for fixture as it's handled above) */}
                        {result.search_group !== 'fixture' && (
                          <h5 className="card-title mb-0" style={{ fontSize: '1.1rem' }}>{displayName}</h5>
                        )}
                      </div>
                      <span className={`badge ${result.search_group === 'team' ? 'bg-primary' : result.search_group === 'league' ? 'bg-success' : 'bg-info' } text-white ms-2`}>
                        {result.search_group}
                      </span>
                    </div>
                    {/* Additional Info */}
                    {(result.search_group === 'league' && countryName) && (
                      <small className="text-muted d-block mt-1" style={leagueApiLogo ? { marginLeft: '38px' } : {}}>
                        Country: {countryName}
                      </small>
                    )}
                    {(result.search_group === 'fixture' && fixtureDate) && (
                      <small className="text-muted d-block mt-1 text-end">
                        Date: {fixtureDate}
                      </small>
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Loading fallback for Suspense
function SearchResultsLoading() {
  return (
    <div className="container mt-4">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading search results...</p>
      </div>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<SearchResultsLoading />}>
      <SearchResultsContent />
    </Suspense>
  );
} 