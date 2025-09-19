import { useState, useContext } from 'react';
import Link from 'next/link';
import { searchByKeyword } from './api';
import { ThemeContext } from '@/context/ThemeContext';

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleSearch = async (query) => {
    if (query.length >= 2) {
      setIsLoading(true);
      setSearchQuery(query);
      try {
        const results = await searchByKeyword(query);
        setSearchResults(results || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  // Define theme-based styles
  const themeStyles = {
    input: theme === 'dark' 
      ? 'bg-dark text-light border-secondary' 
      : 'bg-light text-dark',
    results: theme === 'dark' 
      ? 'bg-dark text-light border border-secondary shadow' 
      : 'bg-white text-dark border shadow',
    resultItem: theme === 'dark'
      ? 'text-light hover-dark'
      : 'text-dark hover-light',
    searchIcon: theme === 'dark'
      ? 'text-light-50'
      : 'text-dark-50',
    resultsBg: theme === 'dark'
      ? '#0f172a'  // Dark theme background
      : '#ffffff'  // Light theme background
  };

  return (
    <>
      <div className="collapse navbar-collapse" id="searchBar" style={{flexGrow: 0}}>
        <form className="d-flex ms-auto w-100">
          <div className="search-container position-relative w-100">
            <div className="position-relative">
              <i className={`bi bi-search position-absolute ${themeStyles.searchIcon}`} style={{top: '50%', transform: 'translateY(-50%)', left: '10px'}} aria-hidden="true"></i>
              <input
                className={`form-control search-input ${themeStyles.input}`}
                type="text" 
                onChange={(e) => handleSearch(e.target.value)}
                placeholder='Try typing "Manchester Utd"...'
                id="searchInput"
                autoComplete="off"
                style={{paddingLeft: '35px'}}
              />
            </div>
            
            {searchResults.length > 0 && (
              <div id="searchResultsForm" className={`position-absolute w-100 ${themeStyles.results}`} style={{
                top: '100%',
                left: 0,
                zIndex: 1050,
                marginTop: '5px',
                maxHeight: '80vh',
                overflowY: 'auto',
                borderRadius: '8px',
                backgroundColor: themeStyles.resultsBg
              }}>
                {searchResults.slice(0, 15).map((result, index) => {
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
                      displayName = result.name || '';
                      displayId = result.team_id;
                      teamApiLogo = result.logo; // Direct API URL
                      href = `/football-predictions/team/${encodeURI(displayName.toLowerCase().replace(/\s+/g, '-'))}-${displayId}`;
                      break;
                    case 'country': 
                      displayName = result.search_res_name || result.name || ''; 
                      href = `/football-predictions/country/${encodeURI(displayName.toLowerCase().replace(/\s+/g, '-'))}`;
                      break;
                    case 'league':
                      displayName = result.name || '';
                      displayId = result.id;
                      countryName = result.country_name || '';
                      leagueApiLogo = result.league_logo; // Direct API URL
                      href = `/football-predictions/league/${encodeURI(countryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURI(displayName.toLowerCase().replace(/\s+/g, '-'))}-${displayId}`;
                      break;
                    case 'fixture':
                      homeTeamName = result.home_team_name || '';
                      awayTeamName = result.away_team_name || '';
                      displayName = `${homeTeamName} VS ${awayTeamName}`;
                      displayId = result.fixture_id;
                      fixtureDate = result.formatted_date;
                      homeTeamApiLogo = result.home_team_logo; // Direct API URL
                      awayTeamApiLogo = result.away_team_logo; // Direct API URL
                      href = `/football-predictions/fixture/${encodeURI(homeTeamName.replace(/\s+/g, '-').toLowerCase())}vs${encodeURI(awayTeamName.replace(/\s+/g, '-').toLowerCase())}-${displayId}`;
                      break;
                  }

                  return (
                    <div key={index} className={index > 0 ? 'border-top' : ''}>
                      <Link href={href} className={`ml-2 linkTxt d-block p-2 ${themeStyles.resultItem}`} onClick={clearSearch} style={{backgroundColor: themeStyles.resultsBg}}>
                        <div className="responsive-row align-items-center">
                          <div className="col-9">
                            <div className="d-flex align-items-center">
                              {result.search_group === 'team' && teamApiLogo && (
                                <img 
                                  src={teamApiLogo} 
                                  alt={displayName} 
                                  style={{width: '24px', height: '24px', marginRight: '8px'}}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              {result.search_group === 'league' && leagueApiLogo && (
                                <img 
                                  src={leagueApiLogo} 
                                  alt={displayName} 
                                  style={{width: '24px', height: '24px', marginRight: '8px'}} 
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              {result.search_group === 'fixture' ? (
                                <>
                                  {homeTeamApiLogo && 
                                    <img 
                                      src={homeTeamApiLogo} 
                                      alt={homeTeamName} 
                                      style={{width: '20px', height: '20px', marginRight: '4px'}}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />}
                                  <span className="me-1">{homeTeamName}</span>
                                  <span className="mx-1">VS</span>
                                  {awayTeamApiLogo && 
                                    <img 
                                      src={awayTeamApiLogo} 
                                      alt={awayTeamName} 
                                      style={{width: '20px', height: '20px', marginLeft: '4px', marginRight: '4px'}}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />}
                                  <span>{awayTeamName}</span>
                                </> 
                              ) : (
                                <span>{displayName}</span>
                              )}
                            </div>
                            {result.search_group === 'league' && countryName && (
                              <div className="league-info ms-1 text-muted small" style={(result.search_group === 'team' && teamApiLogo) || (result.search_group === 'league' && leagueApiLogo) ? { marginLeft: '32px' } : {}}> 
                                ({countryName})
                              </div>
                            )}
                            {result.search_group === 'fixture' && fixtureDate && (
                              <div className="league-info ms-1 text-muted small"> 
                                ({fixtureDate})
                              </div>
                            )}
                          </div>
                          <div className="col-3 text-end">
                            <span className={`badge ${theme === 'dark' ? 'bg-secondary' : 'bg-light text-dark border'}`}>
                              {result.search_group}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
                
                {searchResults.length > 15 && (
                  <div className="container p-2 border-top" style={{backgroundColor: themeStyles.resultsBg}}>
                    <div className="row">
                      <Link
                        className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-primary'} btn-sm w-100`}
                        href={`/search-results?query=${encodeURIComponent(searchQuery)}`}
                        style={{borderRadius: '8px'}}
                        onClick={clearSearch}
                      >
                        View All Results
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
