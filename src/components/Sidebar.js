'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fetchPickOfTheDay } from '@/utils/api';
import { mainNavLinks, leaguesByRegion, popularLeagues } from '../data/leagues';
import { useSidebar } from '@/context/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const [displayCount, setDisplayCount] = useState(10);
  const totalCountries = Object.keys(leaguesByRegion.countries).length;
  const { closeSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992); // Bootstrap's lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isLinkActive = (href) => {
    if (href === '#') return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const getLinkClassName = (href) => {
    return `main-nav-link ${isLinkActive(href) ? 'active-nav-link' : ''}`;
  };

  const getLeagueLinkClassName = (href) => {
    return `list-group-item ml-2 list-group-item-action sideNavCustom1 leageLink ${isLinkActive(href) ? 'active-nav-link' : ''}`;
  };

  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };
  
  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 25);
  };

  const [showPickOfDay, setShowPickOfDay] = useState(false);
  const [pickOfDay, setPickOfDay] = useState(null);
  const [isPickOfDayLoading, setIsPickOfDayLoading] = useState(false);

  const handlePickOfDay = async (e) => {
    e.preventDefault();
    if (isMobile) {
      closeSidebar();
    }
    setIsPickOfDayLoading(true);
    setShowPickOfDay(true);
    
    try {
      const response = await fetchPickOfTheDay();
      if (response.status && response.data.length > 0) {
        setPickOfDay(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching Bet of the Day:', error);
    } finally {
      setIsPickOfDayLoading(false);
    }
  };

  return (
    <div id="sidebar-wrapper">
      <div className="list-group list-group-flush">
        <br />
        {mainNavLinks.map((link, i) => (
          link.text === 'Bet of the Day' ? (
            <a 
              key={i}
              href="#"
              className={getLinkClassName('#')}
              onClick={handlePickOfDay}
            >
              <span dangerouslySetInnerHTML={{ __html: link.icon }} />
              <span>Bet of the Day</span>
            </a>
          ) : (
            <Link 
              key={i} 
              href={link.href} 
              className={getLinkClassName(link.href)}
              onClick={handleLinkClick}
            >
              <span dangerouslySetInnerHTML={{ __html: link.icon }} />
              <span>{link.text}</span>
            </Link>
          )
        ))}

        {/* Popular Leagues Section */}
        <div className="border-bottom" id="sidenavDynamicheader">Popular Leagues</div>
        <div className="responsive-cell team-link">
          {popularLeagues.map((league) => {
            const href = `/football-predictions/league/${league.country_name.toLowerCase()}/${league.league_name.replace(/\s+/g, '-').toLowerCase()}-${league.league_id}`;
            return (
              <div key={league.league_id} className="d-flex align-items-center">
                <Link
                  href={href}
                  className={getLinkClassName(href)}
                  title={league.league_name}
                  onClick={handleLinkClick}
                >
                  <img 
                    src={league.logo} 
                    height="8%" 
                    width="8%" 
                    className="img-fluid"
                    alt={`${league.country_name.toLowerCase()}-football-predictions`}
                    loading="lazy"
                    style={{backgroundColor: 'whitesmoke'}}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 'normal' }}>&nbsp;&nbsp;&nbsp;&nbsp;{league.league_name}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Countries Section */}
        <div className="border-bottom" id="sidenavDynamicheader">Countries</div>
        {Object.entries(leaguesByRegion.countries)
          .sort(([a], [b]) => a.localeCompare(b)) // Sort countries alphabetically
          .slice(0, displayCount)
          .map(([country, leagues]) => {
            const countryHref = `/football-predictions/country/${country.toLowerCase()}`;
            return (
              <div key={country} className="list-group list-group-flush collapsibleNav">
                {/* Country header with collapse toggle */}
                <div className="d-flex align-items-center">
                  <Link
                    href={countryHref}
                    className={getLinkClassName(countryHref)}
                    onClick={handleLinkClick}
                  >
                    {country}
                  </Link>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"
                    className="bi bi-chevron-up"
                    viewBox="0 0 16 16"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${country.replace(/\s+/g, '-')}Collapse`}
                    role="button"
                    aria-expanded="false"
                    aria-controls={`${country.replace(/\s+/g, '-')}Collapse`}
                    style={{ marginLeft: 'auto', cursor: 'pointer' }}
                  >
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </div>

                {/* Collapsible leagues list */}
                <div id={`${country.replace(/\s+/g, '-')}Collapse`} className="collapse">
                  <div className="card-body">
                    {leagues.map((league) => {
                      const leagueHref = `/football-predictions/league/${country.toLowerCase()}/${league.league_name.replace(/\s+/g, '-').toLowerCase()}-${league.league_id}`;
                      return (
                        <div key={league.league_id} className="d-flex align-items-center leagueNameWrapper">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-circle-fill leagueDot" viewBox="0 0 16 16"/>
                          <Link
                            href={leagueHref}
                            className={getLeagueLinkClassName(leagueHref)}
                            title={league.league_name}
                            onClick={handleLinkClick}
                          >
                            {league.league_name}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        
        {/* Show More Button */}
        {displayCount < totalCountries && (
          <div className="text-center mt-2 mb-2">
            <button 
              onClick={handleShowMore}
              className="btn btn-sm btn-outline-light"
            >
              Show More ({totalCountries - displayCount} remaining)
            </button>
          </div>
        )}

        {/* International Competitions */} 
        <div className="border-bottom" id="sidenavDynamicheader">International Competitions</div>
        {Object.entries(leaguesByRegion.international).map(([region, leagues]) => {
          const regionHref = `/football-predictions/country/${region.toLowerCase()}`;
          return (
            <div key={region} className="list-group list-group-flush collapsibleNav">
              <div className="d-flex align-items-center">
                <Link
                  href={regionHref}
                  className={getLinkClassName(regionHref)}
                  onClick={handleLinkClick}
                >
                  {region}
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black"
                  className="bi bi-chevron-up"
                  viewBox="0 0 16 16"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${region.replace(/\s+/g, '-')}Collapse`}
                  role="button"
                  aria-expanded="false"
                  aria-controls={`${region.replace(/\s+/g, '-')}Collapse`}
                  style={{ marginLeft: 'auto', cursor: 'pointer' }}
                >
                  <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </div>

              {/* Collapsible leagues list */}
              <div id={`${region.replace(/\s+/g, '-')}Collapse`} className="collapse">
                <div className="card-body">
                  {leagues.map((league) => {
                    const leagueHref = `/football-predictions/league/${region.toLowerCase()}/${league.league_name.replace(/\s+/g, '-').toLowerCase()}-${league.league_id}`;
                    return (
                      <div key={league.league_id} className="d-flex align-items-center leagueNameWrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-circle-fill leagueDot" viewBox="0 0 16 16"/>
                        <Link
                          href={leagueHref}
                          className={getLeagueLinkClassName(leagueHref)}
                          title={league.league_name}
                          onClick={handleLinkClick}
                        >
                          {league.league_name}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
        
      </div>

      {/* Bet of the Day Popup */}
      {showPickOfDay && (
        <div className="overlay">
          <div className="card overlay-content" style={{
            width: '22rem', 
            maxHeight: '70vh', 
            borderRadius: '10px',
            overflow: 'hidden',
            border: 'none',
            backgroundColor: 'var(--card-color)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <div className="d-flex justify-content-between align-items-center p-2" style={{
              background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
              color: 'white',
              borderBottom: 'none'
            }}>
              <h3 style={{fontSize: '16px', fontWeight: 'bold', margin: 0, padding: '4px 8px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill me-2" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                Bet of the Day
              </h3>
              <button 
                onClick={() => setShowPickOfDay(false)} 
                className="btn-close btn-close-white" 
                aria-label="Close"
                style={{margin: '0 8px'}}
              />
            </div>
            
            <div className="p-3" style={{color: 'var(--text-color)'}}>
              {isPickOfDayLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="mt-3" style={{color: 'var(--text-color)', fontSize: '14px'}}>
                    Loading Bet of the Day...
                  </div>
                </div>
              ) : pickOfDay ? (
                <>
                  <div className="d-flex align-items-center mb-2">
                    <div style={{minWidth: '50px'}} className="text-center me-2">
                      <div style={{fontSize: '11px', marginTop: '2px'}}>{pickOfDay.country_name}</div>
                    </div>
                    
                    <Link href={`/football-predictions/fixture/${pickOfDay.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${pickOfDay.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${pickOfDay.fixture_id}`} style={{textDecoration: 'none', flexGrow: 1}}>
                      <div className="teamNameLink p-2" style={{
                        background: 'rgba(0,0,0,0.03)', 
                        borderRadius: '6px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        color: 'var(--text-color)'
                      }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{fontWeight: '600', fontSize: '14px'}}>{pickOfDay.home_team_name}</span>
                          <span className="badge" style={{
                            backgroundColor: 'rgba(0,0,0,0.05)', 
                            color: 'var(--text-color)',
                            fontSize: '13px'
                          }}>{pickOfDay.goals_home ?? '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span style={{fontWeight: '600', fontSize: '14px'}}>{pickOfDay.away_team_name}</span>
                          <span className="badge" style={{
                            backgroundColor: 'rgba(0,0,0,0.05)', 
                            color: 'var(--text-color)',
                            fontSize: '13px'
                          }}>{pickOfDay.goals_away ?? '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span style={{fontSize: '12px', opacity: 0.7}}>{pickOfDay.date}</span>
                          <span className="badge" style={{
                            backgroundColor: pickOfDay.status_short === 'FT' ? '#28a745' : 
                                            pickOfDay.status_short === 'LIVE' ? '#dc3545' : '#6c757d',
                            color: 'white',
                            fontSize: '11px',
                            padding: '3px 6px'
                          }}>{pickOfDay.status_short}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="text-center p-2 mt-1" style={{
                    background: 'rgba(255, 180, 0, 0.1)', 
                    borderRadius: '6px'
                  }}>
                    <div style={{fontSize: '12px', opacity: 0.8, marginBottom: '4px'}}>Our Prediction</div>
                    <div className="number-circle rounded-square" style={{
                      backgroundColor: 'rgb(255, 180, 0)',
                      display: 'inline-block',
                      padding: '5px 12px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: '#000'
                    }}>
                      {pickOfDay.option_picked}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-exclamation-circle text-warning mb-3" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                  </svg>
                  <div style={{color: 'var(--text-color)', fontSize: '14px'}}>
                    Failed to load Bet of the Day. Please try again.
                  </div>
                </div>
              )}
              
              <div className="text-center mt-3">
                <button 
                  className="btn btn-sm px-3" 
                  onClick={() => setShowPickOfDay(false)}
                  style={{
                    background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontWeight: '500',
                    padding: '4px 12px'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
