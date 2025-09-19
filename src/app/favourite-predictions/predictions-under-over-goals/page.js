'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import NavigationRow from '@/components/NavigationRow';
import { fetchFixturesByIds } from '@/utils/api';
import { toggleFavorite } from '@/utils/favorites';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../../styles/custom.css';
import { getUnderOverPrediction, calculateProbabilities, calculateConfidenceLevel } from '@/utils/predictionUtils';
import { formatMatchTime } from '@/utils/dateUtils';



export default function UnderOverPredictions() {
  const [fixtures, setFixtures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      loadFavoriteFixtures();
    }, []);

    
  
    const loadFavoriteFixtures = async () => {
      try {
        const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
        
        if (!favoriteData?.dataArray?.length) {
          setFixtures([]);
          setError("No games selected at the moment. To select your games just click the star icon located next to games across SokaPulse.com.");
          setIsLoading(false);
          return;
        }
  
        const fixtureIds = favoriteData.dataArray;
        const response = await fetchFixturesByIds(fixtureIds);
        
        if (response.status === true && Array.isArray(response.data)) {
          setFixtures(response.data);
          setError(null);
        } else {
          throw new Error(response.message || 'Failed to load fixtures');
        }
  
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError("Error loading favorite matches. Please try again later.");
        setFixtures([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleToggleFavorite = (fixtureId) => {
      toggleFavorite(fixtureId);
      loadFavoriteFixtures(); // Reload fixtures after toggle
    };

  const validatePrediction = (prediction, scores, status) => {
    if (status !== "Match Finished" && status !== "Match Finished After Extra Time") {
      return {
        backgroundColor: 'rgb(255, 180, 0)',
        color: 'white',
        border: 'none'
      };
    }

    const homeScore = parseInt(scores.fulltime.home);
    const awayScore = parseInt(scores.fulltime.away);
    const totalGoals = homeScore + awayScore;
    let predictionCorrect = false;

    if (prediction === "Over") {
      predictionCorrect = totalGoals > 2.5;
    } else {
      predictionCorrect = totalGoals < 2.5;
    }

    if (predictionCorrect) {
      return {
        backgroundColor: 'green',
        color: 'white',
        border: 'none'
      };
    }

    return {
      backgroundColor: 'white',
      color: 'red',
      border: '1px solid red'
    };
  };

  
  useEffect(() => {
    // Check if the device is mobile based on screen width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const renderPredictionNav = () => (
    <div className="match-details-navigation">
      <div className="match-details-nav-item">
        <Link href="/favourite-predictions" className="match-details-nav-link ">
          <span>1x2</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/favourite-predictions/double-chance-predictions" className="match-details-nav-link ">
          <span>Double Chance</span>
        </Link>
      </div>
      <div className="match-details-nav-item">
        <Link href="/favourite-predictions/predictions-under-over-goals" className="match-details-nav-link active ">
          <span>Under/Over 2.5</span>
        </Link>
      </div>
      </div>
  );

  const renderFixturesHeader = () => (
    <div className="responsive-row header-size" style={{ fontWeight: 'bold', textAlign: 'left', cursor: 'auto' }}>
      <div className="responsive-cell"></div>
      <div className="responsive-cell team-link-probability" style={{ textAlign: 'left', fontWeight: 'bold' }}>
        <span>Teams</span><br />
      </div>
      <div className="responsive-cell team-link-probability" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
        <span>&nbsp;{isMobile ? 'Probs' : 'Probability %'} </span><br />
        <span>Under/Over 2.5</span>
      </div>
      <div className="responsive-cell">{isMobile ? 'Pred' : 'Prediction'}</div>
      <div className="responsive-cell hide-on-mobile">Avg<br/>goals</div>
      <div className="responsive-cell">Odds</div>
      <div className="responsive-cell">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">Scores</div>
        </div>
      </div>
    </div>
  );

  const renderFixture = (fixture) => {
    const scores = JSON.parse(fixture.scores);
    const [prediction, odd, avgGoals] = getUnderOverPrediction(fixture);
    const [underProb, overProb] = calculateProbabilities(fixture);
    const predictionStyle = validatePrediction(prediction, scores, fixture.status_long);
    
    // Calculate prediction confidence level
    const { confidenceText, confidenceColor } = calculateConfidenceLevel(underProb, overProb);

    return (
      <div key={fixture.id} className="responsive-row" style={{ cursor: 'auto' }}>
        <div className="match-time-wrapper">
          <div className="match-time">
            {formatMatchTime(fixture.date)}
          </div>
        </div>
        <div className="league-info-wrapper">
          <img src={fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/England-01-1.svg" 
              ? "https://pngimg.com/uploads/england/england_PNG7.png" 
              : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Scotland-01-1.svg"
                ? "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png"
                : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Wales-01-1.svg"
                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Flag_of_Wales.svg/1200px-Flag_of_Wales.svg.png"
                  : fixture.country_flag === "https://seekflag.com/app/uploads/2021/11/Flag-of-Gabon-01-1.svg"
                    ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Gabon.svg"
                    : fixture.country_flag === "https://seekflag.com/app/uploads/2022/01/Northern-Ireland-01-1.svg"
                      ? "https://cdn.britannica.com/92/3092-050-3A68D1DE/Flag-of-Northern-Ireland.jpg"
                : fixture.country_flag || fixture.logo} className="img-fluid league-logo" alt={`${fixture.country_name}-football-predictions`} loading="lazy" />
          <span className="league-name">{fixture.league_name}</span>
        </div>
        <div className="responsive-cell favorite-cell">
          <div className="favorite-desktop" onClick={() => handleToggleFavorite(fixture.fixture_id)}>
            <svg xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                fill="red" 
                className="bi bi-star-fill" 
                viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
          </div>
          <div className="favorite-mobile" onClick={() => handleToggleFavorite(fixture.fixture_id)}>
            <svg xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                fill="red" 
                className="bi bi-star-fill" 
                viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
          </div>
        </div>
        <div className="responsive-cell team-link" title="Click to open match details">
          <Link href={`/football-predictions/fixture/${fixture.home_team_name.toLowerCase().replace(/\s+/g, '-')}-vs-${fixture.away_team_name.toLowerCase().replace(/\s+/g, '-')}-${fixture.fixture_id}`}>
            <div className="teamNameLink">
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.home_team_name}</span><br />
              <span className="team-name" style={{ fontWeight: 'bold' }}>{fixture.away_team_name}</span>
            </div>
          </Link>
        </div>
        <div className="responsive-cell" style={{ minWidth: '70px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: prediction === 'Under' ? 'bold' : 'normal' }}>{underProb}%</span>&nbsp;
              <span style={{ fontWeight: prediction === 'Over' ? 'bold' : 'normal' }}>{overProb}%</span>
            </div>
            <div style={{ 
              fontSize: '8px', 
              marginTop: '2px', 
              padding: '1px 3px', 
              borderRadius: '3px', 
              backgroundColor: confidenceColor,
              color: '#fff' 
            }}>
              {confidenceText} confidence
            </div>
          </div>
        </div>
        <div className="responsive-cell" title="Prediction" style={{ minWidth: '65px', textAlign: 'center' }}>
          <span className="m-1">
          <span className="number-circle rounded-square" style={{
              ...predictionStyle,
              minWidth: '25px', // Ensure enough width for the text
              display: 'inline-block',
              textAlign: 'center',
              padding: '3px 6px', // Add horizontal padding
              whiteSpace: 'nowrap', // Prevent text wrapping
              fontSize: '12px', // Slightly smaller font on mobile if needed
              fontWeight: 'bold', // Make text bold for better visibility
              letterSpacing: '0.5px' // Add letter spacing for better readability
            }}>
              {prediction === 'Over' ? 'OVER' : 'UNDER'}
            </span>
          </span>
          <span></span>
        </div>
        <div className="responsive-cell hide-on-mobile" title="Average Goals">{avgGoals.toFixed(2)}</div>
        <div className="responsive-cell" title="Under/Over 2.5 Odds">
          <div className="odds-container">
            <div style={{ fontWeight: prediction === 'Under' ? 'bold' : 'normal' }}>
              {fixture?.goals_over_under ? 
                JSON.parse(fixture.goals_over_under).find(g => g.value === "Under 2.5")?.odd || '-' : '-'}
            </div>
            <div style={{ fontWeight: prediction === 'Over' ? 'bold' : 'normal' }}>
              {fixture?.goals_over_under ? 
                JSON.parse(fixture.goals_over_under).find(g => g.value === "Over 2.5")?.odd || '-' : '-'}
            </div>
          </div>
        </div>
        <div className="responsive-cell" title="Scores">
          <div className="score-container">
            <div className="match-status-wrapper">
              {fixture.status_short === "FT" || fixture.status_short === "ABD" ? (
                <span className="match-status">{fixture.status_short}</span>
              ) : ["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? (
                <div className="match-status-live">
                  {["1H", "2H"].includes(fixture.status_short) ? 
                    `${fixture.status_elapased}` :
                    fixture.status_short
                  }
                  {fixture.status_short !== "HT" && fixture.status_elapased && (
                    <span className="blink_text">&nbsp;'</span>
                  )}
                </div>
              ) : null}
            </div>
            <div className="scores-display">
              <span className={`${scores.fulltime.home !== null ? 'scores-card' : 'no-score'} ${["2H", "1H", "INT", "HT", "LIVE"].includes(fixture.status_short) ? 'live' : ''}`} id="fulltimeGoals">
                {scores.fulltime.home !== null ? `${scores.fulltime.home} - ${scores.fulltime.away}` : '-'}
              </span>
              {scores.halftime.home !== null && (
                <span className="halfTimeDataDisplay">
                  {`(${scores.halftime.home}-${scores.halftime.away})`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>

        <div className="col-lg-12" style={{ height: 'auto !important' }}>
          <NavigationRow />
                  
          <div className="responsive-row" style={{
            textAlign: 'center',
            backgroundColor: 'rgb(211, 211, 211)',
            marginLeft: '1px',
            borderRadius: '5px',
            cursor: 'auto'
          }}>
            <div className="table-cell">
              <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Favourites</h1>
            </div>
          </div>
          {renderPredictionNav()}
          {renderFixturesHeader()}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center w-full h-32 my-4">
                <LoadingAnimation text="Loading matches..." />
              </div>
            ) : error ? (
              <div className="text-center p-4 text-danger">{error}</div>
            ) : fixtures.length === 0 ? (
              <div className="text-center p-4">No fixtures available for this date</div>
            ) : (
              fixtures.map(fixture => renderFixture(fixture))
            )}
          </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
