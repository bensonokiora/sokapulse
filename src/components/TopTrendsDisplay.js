'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Removed unused LoadingAnimation import
import {
    WinningTrends,
    LosingTrends,
    CleanSheetTrends,
    WinningStreaksTrends,
    DrawsTrends
} from '@/components/trends/TrendSections';
import styles from '@/styles/trends.module.css';
// Removed ThemeContext for now, assuming styles are self-contained or globally applied
// Removed fetch logic as data is passed via props

export default function TopTrendsDisplay({ initialTrendsData, error }) {

    const [trendsData, setTrendsData] = useState(initialTrendsData || []);
    // isLoading state is not needed here as data is pre-fetched by server component
    // Error is passed as a prop

    // Function to check if a specific trend type has data meeting criteria
    const hasTrends = (data, type) => {
        if (!data || !Array.isArray(data)) return false;

        const getTeamStats = (match) => {
            try {
                // Check for the new API structure with predictions
                if (match?.predictions?.[0]) {
                    return {
                        home: match.predictions[0].home_team_stats,
                        away: match.predictions[0].away_team_stats
                    };
                }
                // Fallback to legacy structure
                else if (match?.teams_perfomance_per_fixture) {
                    return JSON.parse(match.teams_perfomance_per_fixture);
                }
                
                return null;
            } catch (e) {
                console.error("Error getting team stats:", e, "Match:", match);
                return null;
            }
        };

        // Map internal type names to the IDs used in href/id
        const typeToIdMap = {
            winning: 'winning-trends',
            losing: 'losing-trends',
            cleanSheet: 'clean-sheet-trends',
            winningStreak: 'winning-streaks-trends',
            draws: 'draws-trends'
        };
        const id = typeToIdMap[type] || type; // Fallback to type if not mapped

        switch (id) {
            case 'winning-trends':
                return data.some(match => {
                    const stats = getTeamStats(match);
                    return stats && (
                        stats.home?.league?.fixtures?.wins?.total > 15 || 
                        stats.away?.league?.fixtures?.wins?.total > 15
                    );
                });
            case 'losing-trends':
                return data.some(match => {
                    const stats = getTeamStats(match);
                    return stats && (
                        stats.home?.league?.fixtures?.loses?.total > 15 || 
                        stats.away?.league?.fixtures?.loses?.total > 15
                    );
                });
            case 'clean-sheet-trends':
                return data.some(match => {
                    const stats = getTeamStats(match);
                    return stats && (
                        stats.home?.league?.clean_sheet?.total > 15 || 
                        stats.away?.league?.clean_sheet?.total > 15
                    );
                });
            case 'winning-streaks-trends':
                return data.some(match => {
                    const stats = getTeamStats(match);
                    return stats && (
                        stats.home?.league?.biggest?.streak?.wins > 5 || 
                        stats.away?.league?.biggest?.streak?.wins > 5
                    );
                });
            case 'draws-trends':
                return data.some(match => {
                    const stats = getTeamStats(match);
                    return stats && (
                        stats.home?.league?.fixtures?.draws?.total > 5 &&
                        stats.home?.league?.fixtures?.wins?.total < 15 &&
                        stats.away?.league?.fixtures?.wins?.total < 15
                    );
                });
            default:
                return false;
        }
    };

    // Replicate the requested HTML structure using Tailwind
    const renderNavigation = () => (
        <div className="row"> {/* Mimic Bootstrap row - typically just a container/flex context */}
            <div className="col-lg-12"> {/* Mimic Bootstrap col - typically full width */}
                {/* Apply scrollable, flex, and background styles */}
                <ul className="nav scrollable nav-fill small position-relative flex flex-nowrap overflow-x-auto bg-gray-800 p-2 mb-4 rounded scrollbar-hide">
                    {/* Check for each trend type using the ID strings */}
                    {hasTrends(trendsData, 'winning-trends') && (
                        <li className="nav-link scroll-card flex-shrink-0 mr-2"> {/* Styles for list item */}
                            <Link href="#winning-trends" className="nav-link text-gray-200 hover:text-white block px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">
                                Winning Trends
                            </Link>
                        </li>
                    )}
                    {hasTrends(trendsData, 'losing-trends') && (
                        <li className="nav-link scroll-card flex-shrink-0 mr-2">
                            <Link href="#losing-trends" className="nav-link text-gray-200 hover:text-white block px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">
                                Losing Trends
                            </Link>
                        </li>
                    )}
                    {hasTrends(trendsData, 'clean-sheet-trends') && (
                        <li className="nav-link scroll-card flex-shrink-0 mr-2">
                            <Link href="#clean-sheet-trends" className="nav-link text-gray-200 hover:text-white block px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">
                                Clean Sheet Trends
                            </Link>
                        </li>
                    )}
                    {hasTrends(trendsData, 'winning-streaks-trends') && (
                        <li className="nav-link scroll-card flex-shrink-0 mr-2">
                            <Link href="#winning-streaks-trends" className="nav-link text-gray-200 hover:text-white block px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">
                                Winning Streaks Trends
                            </Link>
                        </li>
                    )}
                    {hasTrends(trendsData, 'draws-trends') && (
                        <li className="nav-link scroll-card flex-shrink-0 mr-2">
                            <Link href="#draws-trends" className="nav-link text-gray-200 hover:text-white block px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">
                                Draws Trends
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );

    // Render a section for a specific trend type using the correct ID
    const renderTrendSection = (title, id, TrendComponent) => {
        // Check if this trend type exists before rendering the section
        if (!hasTrends(trendsData, id)) {
            return null; // Don't render the section if no relevant trends exist
        }

        // Use the correct ID for the anchor link target
        return (
            <div id={id} className="pt-4 scroll-mt-20"> {/* Added scroll-mt for sticky nav offset */}
                <h2 className={`${styles.sectionTitle} text-xl font-semibold mb-3`}>{title}</h2>
                {trendsData.map((match, index) => (
                    match && match.fixture_id && 
                    <TrendComponent key={`${id}-${match.fixture_id}-${index}`} match={match} />
                ))}
            </div>
        );
    };

    // Display error message if error prop is present
    if (error) {
        return (
            <div className="text-center text-red-500 my-8">
                <p>Failed to load trends data: {error}. Please try again later.</p>
            </div>
        );
    }

    // Display message if no data is available after successful fetch
    if (!trendsData || trendsData.length === 0) {
        return (
            <div className="text-center my-8">
                <p>No trends data available for the current date.</p>
            </div>
        );
    }

    // Main render logic for the trends display
    return (
        <div className="relative"> {/* Added relative positioning for context */} 
            {renderNavigation()}
             {/* Add scroll-padding-top to the main scrollable container if necessary, e.g., in layout.js or global CSS */}
             {/* Example: html { scroll-padding-top: 60px; } /* Adjust value based on nav height */}
            <div className="my-4 space-y-8"> {/* Added spacing between sections */} 
                {renderTrendSection('Teams with Most Wins', 'winning-trends', WinningTrends)}
                {renderTrendSection('Teams with Most Losses', 'losing-trends', LosingTrends)}
                {renderTrendSection('Teams with Most Clean Sheets', 'clean-sheet-trends', CleanSheetTrends)}
                {renderTrendSection('Teams with Longest Winning Streaks', 'winning-streaks-trends', WinningStreaksTrends)}
                {renderTrendSection('Teams with Most Draws (and Few Wins)', 'draws-trends', DrawsTrends)}
            </div>
        </div>
    );
} 