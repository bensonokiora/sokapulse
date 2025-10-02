'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FreePredictionsSection() {
  const [activeTab, setActiveTab] = useState('today');

  // Sample predictions data
  const predictions = [
    { id: 1, date: '21/09/25', time: '21:45', homeTeam: 'Inter', awayTeam: 'Sassuolo', homeScore: '-', awayScore: '-', tip: '1', league: 'SEA', leagueFlag: '🇮🇹' },
    { id: 2, date: '21/09/25', time: '20:30', homeTeam: 'Hapoel Haifa', awayTeam: 'Maccabi Haifa', homeScore: '-', awayScore: '-', tip: '2', league: 'LIH', leagueFlag: '🇮🇱' },
    { id: 3, date: '21/09/25', time: '20:00', homeTeam: 'Budapest Honved', awayTeam: 'Bekescsaba 1912', homeScore: '-', awayScore: '-', tip: '1', league: 'NBI', leagueFlag: '🇭🇺' },
    { id: 4, date: '21/09/25', time: '19:15', homeTeam: 'Sharjah FC', awayTeam: 'Ajman', homeScore: '-', awayScore: '-', tip: '1', league: 'LEA', leagueFlag: '🇦🇪' },
    { id: 5, date: '21/09/25', time: '18:00', homeTeam: 'Kongsvinger', awayTeam: 'Egersund', homeScore: '-', awayScore: '-', tip: '1', league: '1D', leagueFlag: '🇳🇴' },
    { id: 6, date: '21/09/25', time: '17:30', homeTeam: 'Larisa', awayTeam: 'AEK Athens FC', homeScore: '-', awayScore: '-', tip: '2', league: 'SL', leagueFlag: '🇬🇷' },
    { id: 7, date: '21/09/25', time: '17:00', homeTeam: 'W. Waasland-beveren', awayTeam: 'Lokeren-Temse', homeScore: '-', awayScore: '-', tip: '1', league: 'CPL', leagueFlag: '🇧🇪' },
    { id: 8, date: '21/09/25', time: '17:00', homeTeam: 'FC Copenhagen', awayTeam: 'Silkeborg', homeScore: '-', awayScore: '-', tip: '1', league: 'SL', leagueFlag: '🇩🇰' },
    { id: 9, date: '21/09/25', time: '17:00', homeTeam: 'Bristol City', awayTeam: 'Oxford United', homeScore: '-', awayScore: '-', tip: '1', league: 'CH', leagueFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 10, date: '21/09/25', time: '16:00', homeTeam: 'Araz', awayTeam: 'Qarabag', homeScore: '-', awayScore: '-', tip: '2', league: 'PL', leagueFlag: '🇦🇿' },
    { id: 11, date: '21/09/25', time: '16:00', homeTeam: 'Aalborg', awayTeam: 'B 93', homeScore: '-', awayScore: '-', tip: '1', league: '1D', leagueFlag: '🇩🇰' },
    { id: 12, date: '21/09/25', time: '15:00', homeTeam: 'Grobina', awayTeam: 'Tukums 2000', homeScore: '-', awayScore: '-', tip: '2', league: 'VIR', leagueFlag: '🇱🇻' },
  ];

  return (
    <section className="free-predictions-section">
      <div className="predictions-header">
        <div className="predictions-title-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"/>
          </svg>
          <h2>Free Predictions</h2>
        </div>

        <div className="predictions-tabs">
          <button
            className={`predictions-tab ${activeTab === 'yesterday' ? 'active' : ''}`}
            onClick={() => setActiveTab('yesterday')}
          >
            Yesterday
          </button>
          <button
            className={`predictions-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Today
          </button>
          <button
            className={`predictions-tab ${activeTab === 'tomorrow' ? 'active' : ''}`}
            onClick={() => setActiveTab('tomorrow')}
          >
            Tomorrow
          </button>
        </div>
      </div>

      <div className="predictions-table-wrapper">
        <table className="predictions-table">
          <thead>
            <tr>
              <th className="col-index"></th>
              <th className="col-teams">Teams</th>
              <th className="col-results">Results</th>
              <th className="col-tip">Tip</th>
              <th className="col-league">League</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction, index) => (
              <tr key={prediction.id} className="prediction-row">
                <td className="col-index">
                  <div className="index-badge">{index + 1}</div>
                </td>
                <td className="col-teams">
                  <div className="teams-wrapper">
                    <div className="match-datetime">
                      <span className="match-date">{prediction.date}</span>
                      <span className="match-time">{prediction.time}</span>
                    </div>
                    <div className="teams-names">
                      <div className="team home-team">{prediction.homeTeam}</div>
                      <div className="team away-team">{prediction.awayTeam}</div>
                    </div>
                  </div>
                </td>
                <td className="col-results">
                  <div className="results-wrapper">
                    <span className="score">{prediction.homeScore}</span>
                    <span className="score">{prediction.awayScore}</span>
                  </div>
                </td>
                <td className="col-tip">
                  <div className="tip-badge">{prediction.tip}</div>
                </td>
                <td className="col-league">
                  <div className="league-wrapper">
                    <span className="league-flag">{prediction.leagueFlag}</span>
                    <span className="league-name">{prediction.league}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="predictions-footer">
        <Link href="/today-football-predictions" className="view-all-predictions-btn">
          View All Predictions
        </Link>
      </div>
    </section>
  );
}
