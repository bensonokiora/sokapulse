'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingAnimation from '@/components/LoadingAnimation';
import FixturesTab from '@/components/tabs/FixturesTab';
import StandingsTab from '@/components/tabs/StandingsTab';
import TrendsTab from '@/components/tabs/TrendsTab';

export default function LeaguePageClient({ 
  initialFixtures, 
  initialStandings, 
  initialTrends,
  leagueName,
  leagueId,
  countryName
}) {
  const [activeTab, setActiveTab] = useState('fixtures');
  const [isLoading, setIsLoading] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [standings, setStandings] = useState(initialStandings);
  const [trends, setTrends] = useState(initialTrends);
  const [error, setError] = useState(null);

  // Add hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'fixtures';
      setActiveTab(hash);
    };

    // Set initial tab from URL hash
    handleHashChange();

    // Add listener for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {/* Tab Navigation */}
      <ul className="nav nav-tabs nav-justified modern-tabs">
        <li className="nav-item">
          <Link 
            href="#fixtures"
            className={`nav-link ${activeTab === 'fixtures' ? 'active' : ''}`}
            onClick={() => handleTabClick('fixtures')}
            role="tab"
          >
            Fixtures
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            href="#standings"
            className={`nav-link ${activeTab === 'standings' ? 'active' : ''}`}
            onClick={() => handleTabClick('standings')}
            role="tab"
          >
            Table
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            href="#trends"
            className={`nav-link ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => handleTabClick('trends')}
            role="tab"
          >
            Trends
          </Link>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-32 my-4">
            <LoadingAnimation text="Loading matches..." />
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {/* Fixtures Tab */}
            {activeTab === 'fixtures' && (
              <div id="fixtures" className="tab-pane fade show active" role="tabpanel">
                <FixturesTab fixtures={fixtures} />
              </div>
            )}

            {/* Standings Tab */}
            {activeTab === 'standings' && (
              <div id="standings" className="tab-pane fade show active" role="tabpanel">
                <StandingsTab standings={standings} />
              </div>
            )}

            {/* Trends Tab */}
            {activeTab === 'trends' && (
              <div id="trends" className="tab-pane fade show active" role="tabpanel">
                <TrendsTab trends={trends} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
} 