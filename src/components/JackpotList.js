'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Restore useRouter
import LoadingAnimation from '@/components/LoadingAnimation';
import '../styles/jackpot.css';
import '../styles/payment-form-utilities.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCalendarAlt, faClock, faInfoCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import LoginModal from './LoginModal';
// Remove direct API utility imports - we will fetch from API routes
// import { fetchJackpots, fetchJackpotMatches } from '@/utils/api'; 

// Dynamically import PaymentForm
const PaymentForm = dynamic(() => import('@/components/PaymentForm'), {
  ssr: false,
  loading: () => <div className="payment-form-loading-placeholder p-4 text-center">
    <div className="payment-form-spinner inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
    <p className="payment-form-loading-text mt-2 text-black">Loading payment form...</p>
  </div>
});

// Helper function to format date for API calls (YYYY-MM-DD)
const formatDateForApi = (date) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return dateObj.toISOString().split('T')[0];
};

const createSeoSlug = (text = '') => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\\-]+/g, '')     // Remove all non-word chars
        .replace(/\\-\\-+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

// Helper function to fetch data from our internal API routes
const fetchFromApiRoute = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty object
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Utility moved outside component as it doesn't depend on component state/props
const generateDateTabs = (currentDate) => {
    const tabs = [];
    // Ensure currentDate is a Date object
    let centerDate = currentDate instanceof Date ? currentDate : new Date(currentDate);
    if (isNaN(centerDate.getTime())) {
        // Handle invalid date, maybe default to today
        centerDate = new Date();
    }
    for (let i = 2; i > 0; i--) { const date = new Date(centerDate); date.setDate(date.getDate() - i); tabs.push(date); }
    tabs.push(new Date(centerDate)); // Push the center date
    for (let i = 1; i <= 2; i++) { const date = new Date(centerDate); date.setDate(date.getDate() + i); tabs.push(date); }
    return tabs;
};

export default function JackpotList({
    // Reintroduce initial props
    initialBookmakers,
    initialMatches,
    initialSelectedBookmakerId,
    initialDateString,
    initialError
}) {
    // --- State Initialization ---
    const router = useRouter();
    const countdownInterval = useRef(null);
    const matchesContentRef = useRef(null);
    const dateTabsContainerRef = useRef(null); // Ref for the date tabs container

    const [bookmakers, setBookmakers] = useState(initialBookmakers || []);
    const [matches, setMatches] = useState(initialMatches || []);
    const [selectedBookmaker, setSelectedBookmaker] = useState(initialSelectedBookmakerId);
    // Initialize selectedDate state based on initialDateString prop, default to today
    const [selectedDate, setSelectedDate] = useState(() => initialDateString ? new Date(initialDateString) : new Date());
    const [error, setError] = useState(initialError);
    // Loading state primarily for the initial server fetch or major date changes
    const [isLoading, setIsLoading] = useState(false); // Start false, let initial data dictate
    const [isLoadingMatches, setIsLoadingMatches] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    // Initialize dateTabs based on the initial selectedDate
    const [dateTabs, setDateTabs] = useState(() => generateDateTabs(initialDateString ? new Date(initialDateString) : new Date()));
    // Initialize activeTab to the center (Today relative to initial date)
    const [activeTab, setActiveTab] = useState(2); // Index 2 is the middle tab
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [firstMatchDate, setFirstMatchDate] = useState(null);
    // State for login status
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State for payment modal
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    // State for login modal
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    
    // --- Utility Functions ---

    // Check login status function
    const checkLoginStatus = () => {
        const userToken = localStorage.getItem('userToken');
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        
        if (userToken && tokenExpiry) {
            // Check if token has expired
            const expiryDate = new Date(tokenExpiry);
            const currentDate = new Date();
            
            if (currentDate > expiryDate) {
                // Token has expired, clear storage
                localStorage.removeItem('userToken');
                localStorage.removeItem('userPhone');
                localStorage.removeItem('tokenExpiry');
                setIsLoggedIn(false);
            } else {
                // Token is still valid
                setIsLoggedIn(true);
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    // Handle successful login
    const handleLoginSuccess = useCallback(() => {
        console.log('Login successful, updating login state...');
        setIsLoggedIn(true);
    }, []);

    // Show register/payment form
    const handleShowRegister = useCallback(() => {
        // Close login modal if open
        setIsLoginModalOpen(false);
        
        // Show the React payment form
        setIsPaymentModalOpen(true);
    }, [setIsLoginModalOpen, setIsPaymentModalOpen]);

    // Handle logout
    const handleLogout = () => {
        // Clear all stored authentication data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('tokenExpiry');
        
        // Update state
        setIsLoggedIn(false);
        
        // Optional: Show confirmation or feedback
        console.log('User logged out successfully');
    };

    const formatMatchTime = (timeString) => timeString ? timeString.substring(0, 5) : '';

    const formatTabDate = (date) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        date = new Date(date); date.setHours(0, 0, 0, 0);
        if (date.getTime() === today.getTime()) return 'Today';
        if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
        if (date.getTime() === yesterday.getTime()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getFormattedDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    const scrollToMatches = () => {
        if (isMobile && matchesContentRef.current) { setTimeout(() => { matchesContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300); }
    };

    const calculateCountdown = (targetDate) => {
        if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const now = new Date().getTime(); const distance = targetDate.getTime() - now;
        if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const days = Math.floor(distance / 86400000); const hours = Math.floor((distance % 86400000) / 3600000); const minutes = Math.floor((distance % 3600000) / 60000); const seconds = Math.floor((distance % 60000) / 1000);
        return { days, hours, minutes, seconds };
    };

    const getFirstMatchDateTime = (currentMatches) => {
        if (!currentMatches || currentMatches.length === 0) return null;
        const sortedMatches = [...currentMatches].sort((a, b) => new Date(`${a.matchDateOriginal}T${a.matchTime}`) - new Date(`${b.matchDateOriginal}T${b.matchTime}`));
        const firstMatch = sortedMatches[0];
        return new Date(`${firstMatch.matchDateOriginal}T${firstMatch.matchTime}`); 
    };

    // Use useCallback for startCountdown as it's used in useEffect dependency arrays
    const startCountdown = useCallback((targetDate) => {
        if (countdownInterval.current) clearInterval(countdownInterval.current);
        if (!targetDate) {
            setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); // Reset countdown display if no target date
            return;
        }
        setCountdown(calculateCountdown(targetDate)); // Initial calculation
        countdownInterval.current = setInterval(() => {
            const newCountdown = calculateCountdown(targetDate);
            setCountdown(newCountdown);
            if (newCountdown.days <= 0 && newCountdown.hours <= 0 && newCountdown.minutes <= 0 && newCountdown.seconds <= 0) {
                clearInterval(countdownInterval.current);
            }
        }, 1000);
    }, []); // calculateCountdown is pure, so no dependencies needed here

    const formatTimeUnit = (unit) => unit < 10 ? `0${unit}` : unit;

    // --- Effects ---

    // Effect for Initial Setup & Cleanup (Runs ONCE on mount or when initial props change)
    useEffect(() => {
        // Mobile check listener setup
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        // Check login status
        checkLoginStatus();

        // Initial countdown setup if matches were provided by SSR
        if (initialMatches && initialMatches.length > 0) {
             const firstMatch = getFirstMatchDateTime(initialMatches);
             setFirstMatchDate(firstMatch); // Set state for initial first match date
             startCountdown(firstMatch);     // Start countdown based on initial matches
        }

        // Fetch initial matches *only if* they were missing from SSR and no critical error
        // And ensure we have initial bookmakers and a selected bookmaker ID from props
        if (!initialError && initialBookmakers && initialBookmakers.length > 0 && initialSelectedBookmakerId && (!initialMatches || initialMatches.length === 0)) {
            const fetchMissingInitialMatches = async () => {
                // Use initialDateString prop to determine the date for the fetch
                const initialDateObject = initialDateString ? new Date(initialDateString) : new Date();
                const formattedDate = formatDateForApi(initialDateObject);
                console.log(`[Client Initial Effect] Initial matches missing, fetching from API route for bookmaker ${initialSelectedBookmakerId}`);
                setIsLoadingMatches(true); // Show loading specifically for matches
                try {
                    const matchesUrl = `/api/jackpot-matches?date=${formattedDate}&bookmakerId=${initialSelectedBookmakerId}`;
                    const fetchedMatches = await fetchFromApiRoute(matchesUrl);
                    //console.log(`[Client Initial Effect] Fetched missing initial ${fetchedMatches.length} matches:`, fetchedMatches);
                    setMatches(fetchedMatches); // Update matches state
                    const firstMatch = getFirstMatchDateTime(fetchedMatches);
                    setFirstMatchDate(firstMatch); // Update first match date state
                    startCountdown(firstMatch); // Start countdown based on fetched matches
                } catch (matchErr) {
                    console.error('[Client Initial Effect] Error fetching missing initial matches:', matchErr);
                    setError(matchErr.message || 'Failed to load initial matches.'); // Set error state
                    setMatches([]); // Clear matches on error
                    setFirstMatchDate(null); // Clear first match date on error
                    startCountdown(null); // Ensure countdown stops/resets
                } finally {
                    setIsLoadingMatches(false); // Hide loading indicator
                }
            };
            fetchMissingInitialMatches();
        }

        // Cleanup function
        return () => {
            window.removeEventListener('resize', checkIfMobile);
            if (countdownInterval.current) clearInterval(countdownInterval.current); // Clear interval on unmount
        };
    // Dependencies: Only run when initial server-provided props change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialBookmakers, initialMatches, initialSelectedBookmakerId, initialDateString, initialError, startCountdown]);

    // Effect to regenerate date tabs when selectedDate changes
    useEffect(() => {
      // Regenerate tabs whenever the selected date changes
      setDateTabs(generateDateTabs(selectedDate));
      // NOTE: We DO NOT set activeTab here. It's set ONLY by the user click (handleDateChange)
      // or defaults to 2 on initial load via useState.
    }, [selectedDate]); // Dependency: only selectedDate

    // Effect to center the active tab on mobile
    useEffect(() => {
        if (isMobile && dateTabsContainerRef.current) {
            const container = dateTabsContainerRef.current;
            // Find the active tab button within the container
            // Using a more specific selector might be needed if structure changes
            const activeTabElement = container.querySelector(`.jp-date-tab:nth-child(${activeTab + 1})`); // Use index + 1 for nth-child

            if (activeTabElement) {
                const containerWidth = container.offsetWidth;
                const activeTabOffsetLeft = activeTabElement.offsetLeft;
                const activeTabWidth = activeTabElement.offsetWidth;

                // Calculate the scroll position to center the active tab
                const scrollLeft = activeTabOffsetLeft - (containerWidth / 2) + (activeTabWidth / 2);

                // Scroll the container
                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth' // Use smooth scrolling
                });
            }
        }
    // Dependencies: Run when mobile status changes, active tab changes, or tabs themselves potentially change
    }, [isMobile, activeTab, dateTabs]);

    // --- Event Handlers ---

    const handleDateChange = async (date, index) => {
        // 1. Update state immediately for UI feedback
        setSelectedDate(date); // Update the selected date object
        setActiveTab(index);   // Update the active tab index

        // 2. Set loading states and clear previous data/timers
        setIsLoading(true);    // Indicate general loading for date change
        setIsLoadingMatches(true); // Also indicate matches are loading
        setError(null);        // Clear any previous errors
        setBookmakers([]);     // Clear bookmakers
        setMatches([]);        // Clear matches
        setSelectedBookmaker(null); // Clear selected bookmaker
        setFirstMatchDate(null); // Clear first match date
        if (countdownInterval.current) clearInterval(countdownInterval.current); // Stop previous countdown

        // 3. Fetch new data
        const formattedDate = formatDateForApi(date);
        //console.log(`[Client Handler] Date change: Fetching data from API routes for date: ${formattedDate}`);

        try {
            // Fetch bookmakers first
            const bookmakersUrl = `/api/jackpots?date=${formattedDate}`;
            const fetchedBookmakers = await fetchFromApiRoute(bookmakersUrl);
            setBookmakers(fetchedBookmakers); // Update bookmakers state

            // If bookmakers exist, fetch matches for the first one
            if (fetchedBookmakers.length > 0) {
                const firstBookmakerId = fetchedBookmakers[0].id;
                setSelectedBookmaker(firstBookmakerId); // Update selected bookmaker state

                const matchesUrl = `/api/jackpot-matches?date=${formattedDate}&bookmakerId=${firstBookmakerId}`;
                const fetchedMatches = await fetchFromApiRoute(matchesUrl);
                // console.log(`[Client Handler] Date change API Response for ${formattedDate}:`, {
                //     matchCount: fetchedMatches.length,
                //     sampleMatch: fetchedMatches[0],
                //     completedMatches: fetchedMatches.filter(m => m.isPlayed && (m.isPlayed.includes('correct.webp') || m.isPlayed.includes('remove.webp'))).length,
                //     allMatchStatuses: fetchedMatches.map(m => ({ id: m.id, isPlayed: m.isPlayed, scores: m.scores })),
                //     rawApiResponse: fetchedMatches.slice(0, 3) // Show first 3 complete matches for debugging
                // });
                setMatches(fetchedMatches); // Update matches state

                // Update countdown based on new matches
                const firstMatch = getFirstMatchDateTime(fetchedMatches);
                setFirstMatchDate(firstMatch); // Update first match date state
                startCountdown(firstMatch); // Start new countdown

                scrollToMatches(); // Scroll if on mobile
            } else {
                // Handle case where no bookmakers are found for the selected date
                setError('No jackpots available for this date');
                startCountdown(null); // Ensure countdown stops/resets
                // Other states already cleared above
            }
        } catch (err) {
            console.error('[Client Handler] Error during date change fetch:', err);
            setError(err.message || 'Failed to load data for selected date.');
            startCountdown(null); // Ensure countdown stops/resets
             // Other states already cleared above
        } finally {
            // 4. Clear loading states
            setIsLoading(false);
            setIsLoadingMatches(false);
        }
    };

    const handleBookmakerChange = async (bookmakerId) => {
        // 1. Update state immediately
        setSelectedBookmaker(bookmakerId);

        // 2. Set loading states and clear previous data/timers
        setIsLoadingMatches(true); // Only match loading needed here
        setError(null);
        setMatches([]); // Clear only matches
        setFirstMatchDate(null);
        if (countdownInterval.current) clearInterval(countdownInterval.current); // Stop previous countdown

        // 3. Fetch new data
        const formattedDate = formatDateForApi(selectedDate); // Use current selectedDate
        console.log(`[Client Handler] Bookmaker change: Fetching matches from API route for date: ${formattedDate}, bookmaker: ${bookmakerId}`);

        try {
            const matchesUrl = `/api/jackpot-matches?date=${formattedDate}&bookmakerId=${bookmakerId}`;
            //console.log(`[Client Handler] Making API call to: ${matchesUrl}`);
            const fetchedMatches = await fetchFromApiRoute(matchesUrl);
            // console.log(`[Client Handler] API Response received for ${formattedDate}, bookmaker ${bookmakerId}:`, {
            //     matchCount: fetchedMatches.length,
            //     sampleMatch: fetchedMatches[0],
            //     completedMatches: fetchedMatches.filter(m => m.isPlayed && (m.isPlayed.includes('correct.webp') || m.isPlayed.includes('remove.webp'))).length,
            //     allMatchStatuses: fetchedMatches.map(m => ({ id: m.id, isPlayed: m.isPlayed, scores: m.scores })),
            //     rawApiResponse: fetchedMatches.slice(0, 3) // Show first 3 complete matches for debugging
            // });
            setMatches(fetchedMatches); // Update matches state

            // Update countdown based on new matches
            const firstMatch = getFirstMatchDateTime(fetchedMatches);
            setFirstMatchDate(firstMatch); // Update first match date state
            startCountdown(firstMatch); // Start new countdown

            scrollToMatches(); // Scroll if on mobile
        } catch (err) {
            console.error('[Client Handler] Error during bookmaker change fetch:', err);
            setError(err.message || 'Failed to load matches for selected bookmaker.');
            startCountdown(null); // Ensure countdown stops/resets
             // Matches state already cleared above
        } finally {
            // 4. Clear loading state
            setIsLoadingMatches(false);
        }
    };

    const handleMatchClick = (match) => {
        const homeTeamSlug = createSeoSlug(match.homeTeam); const awayTeamSlug = createSeoSlug(match.awayTeam);
        const matchDateForUrl = new Date(match.matchDateOriginal); const formattedDateForUrl = matchDateForUrl.toISOString().split('T')[0];
        const seoUrl = `/jackpot-match-details/${match.id}/${homeTeamSlug}-vs-${awayTeamSlug}`;
        const queryParams = new URLSearchParams({
            homeTeamId: match.matchHomeTeamId,
            awayTeamId: match.matchAwayTeamId,
            date: formattedDateForUrl,
            bookmakerId: selectedBookmaker,
            matchId: match.matchId // Pass the specific API match ID
        }).toString();
        router.push(`${seoUrl}?${queryParams}`);
    };

    // --- Rendering Helper ---
    const getActiveBookmaker = () => bookmakers.find(b => b.id === selectedBookmaker);
    const activeBookmaker = getActiveBookmaker();

    // Helper function to determine if prediction was correct and format result
    const formatMatchResult = (match) => {
        // For pending matches (clock.webp) or no scores, return dash
        if (!match.scores || match.scores === null || !match.isPlayed || match.isPlayed.includes('clock.webp')) {
            return '-';
        }
        
        // For completed matches, check if it's correct.webp or remove.webp
        if (!(match.isPlayed.includes('correct.webp') || match.isPlayed.includes('remove.webp'))) {
            return match.scores || '-';
        }

        // If we have scores, parse and analyze them
        if (match.scores) {
            // Parse the scores (e.g., "0 - 3")
            const scoreParts = match.scores.split(' - ');
            if (scoreParts.length !== 2) return match.scores;

            const homeScore = parseInt(scoreParts[0]);
            const awayScore = parseInt(scoreParts[1]);
            
            if (isNaN(homeScore) || isNaN(awayScore)) return match.scores;

            // Determine actual result
            let actualResult;
            if (homeScore > awayScore) {
                actualResult = '1'; // Home win
            } else if (awayScore > homeScore) {
                actualResult = '2'; // Away win
            } else {
                actualResult = 'X'; // Draw
            }

            // Compare with prediction tip
            const predictionTip = match.tip;
            let isCorrect = false;

            if (predictionTip === actualResult) {
                isCorrect = true;
            } else if (predictionTip === '1X' && (actualResult === '1' || actualResult === 'X')) {
                isCorrect = true;
            } else if (predictionTip === '2X' && (actualResult === '2' || actualResult === 'X')) {
                isCorrect = true;
            } else if (predictionTip === '12' && (actualResult === '1' || actualResult === '2')) {
                isCorrect = true;
            } else if (predictionTip === '1 OR X' && (actualResult === '1' || actualResult === 'X')) {
                isCorrect = true;
            } else if (predictionTip === 'X OR 2' && (actualResult === 'X' || actualResult === '2')) {
                isCorrect = true;
            } else if (predictionTip === '1 OR 2' && (actualResult === '1' || actualResult === '2')) {
                isCorrect = true;
            }

            // Return formatted result with win/loss indicator
            return `${match.scores} (${isCorrect ? 'W' : 'L'})`;
        }

        // If no scores but completed, determine based on isPlayed status
        if (match.isPlayed.includes('correct.webp')) {
            return 'Won (W)';
        } else if (match.isPlayed.includes('remove.webp')) {
            return 'Lost (L)';
        }

        return '-';
    };

    // Helper function to determine match status from scores or results containing (W) or (L)
    const getMatchStatusClass = (match) => {
        // Only check for win/loss styling on completed matches (those with correct.webp or remove.webp)
        if (!match.isPlayed || !(match.isPlayed.includes('correct.webp') || match.isPlayed.includes('remove.webp'))) {
            return ''; // No styling for pending matches
        }
        
        // Use the formatted result to determine win/loss
        const formattedResult = formatMatchResult(match);
        
        if (formattedResult.includes('(W)')) {
            return 'jp-match-won';
        }
        if (formattedResult.includes('(L)')) {
            return 'jp-match-lost';
        }
        return ''; // Default case for completed matches without clear win/loss
    };

    // --- Render ---
    return (
        <div className="jp-container">
            <div className="jp-header">
                <h1 className="jp-title">Jackpot Predictions</h1>
                {!isMobile && activeBookmaker && (
                    <div className="jp-active-bookmaker">
                        <img src={activeBookmaker.imageSrc} alt={activeBookmaker.bookmaker} className="jp-active-bookmaker-logo" />
                        <span className="jp-active-bookmaker-name">{activeBookmaker.bookmaker}</span>
                    </div>
                )}
                {isLoggedIn && (
                    <button 
                        className="jp-logout-btn"
                        onClick={handleLogout}
                        style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                            position: 'absolute',
                            top: '16px',
                            right: '16px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>

            <div className="jp-date-tabs" ref={dateTabsContainerRef}>
                {dateTabs.map((date, index) => (
                    <button
                        key={index}
                        className={`jp-date-tab ${activeTab === index ? 'active' : ''}`}
                        onClick={() => handleDateChange(date, index)}
                    >
                        <span className="jp-date-tab-day">{formatTabDate(date)}</span>
                        <span className="jp-date-tab-date">{getFormattedDate(date)}</span>
                    </button>
                ))}
            </div>

            {error && <div className="jp-error-message">{error}</div>}
            <div className="jp-content" style={{ opacity: isLoading ? 0.5 : 1 }}>
                <div className="jp-bookmaker-sidebar">
                    <h2 className="jp-sidebar-title">Bookmakers</h2>
                    {bookmakers.length > 0 ? (
                        <div className="jp-bookmaker-list">
                            {bookmakers.map((bookmaker) => (
                                <div key={bookmaker.id} className={`jp-bookmaker-item ${selectedBookmaker === bookmaker.id ? 'active' : ''}`} onClick={() => handleBookmakerChange(bookmaker.id)} >
                                    <div className="jp-bookmaker-logo"><img src={bookmaker.imageSrc} alt={bookmaker.bookmaker} /></div>
                                    <div className="jp-bookmaker-info"><div className="jp-bookmaker-name">{bookmaker.bookmaker}</div><div className="jp-bookmaker-description">{bookmaker.description}</div></div>
                                    {bookmaker.jackpotSiteUrl && (<a href={bookmaker.jackpotSiteUrl} target="_blank" rel="noopener noreferrer" className="jp-bookmaker-link" onClick={(e) => e.stopPropagation()}><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>)}
                                </div>
                            ))}
                        </div>
                    ) : !isLoading ? (
                        <div className="jp-no-bookmakers">No bookmakers available.</div>
                    ) : null}
                </div>

                <div className="jp-matches-content" ref={matchesContentRef}>
                    {isMobile && activeBookmaker && (
                        <div className="jp-mobile-active-bookmaker">
                            <img src={activeBookmaker.imageSrc} alt={activeBookmaker.bookmaker} className="jp-active-bookmaker-logo" />
                            <span className="jp-active-bookmaker-name">{activeBookmaker.bookmaker}</span>
                            <span className="jp-active-bookmaker-description">{activeBookmaker.description}</span>
                        </div>
                    )}
                    <div className="jp-matches-header">
                        <h2 className="jp-matches-title">
                            {!isMobile && activeBookmaker ? activeBookmaker.description : 'Matches'}
                            {!isLoadingMatches && <span className="jp-matches-count">{matches.length} matches</span>}
                        </h2>
                        {firstMatchDate && (
                            <div className="jp-timer-countdown-container"><div className="jp-timer-countdown">
                                <div className="jp-timer-time-segment"><div className="jp-timer-time">{formatTimeUnit(countdown.days)}</div><div className="jp-timer-label">days</div></div>
                                <div className="jp-timer-time-segment"><div className="jp-timer-time">{formatTimeUnit(countdown.hours)}</div><div className="jp-timer-label">hrs</div></div>
                                <div className="jp-timer-time-segment"><div className="jp-timer-time">{formatTimeUnit(countdown.minutes)}</div><div className="jp-timer-label">min</div></div>
                                <div className="jp-timer-time-segment"><div className="jp-timer-time">{formatTimeUnit(countdown.seconds)}</div><div className="jp-timer-label">sec</div></div>
                            </div></div>
                        )}
                    </div>
                    {isLoadingMatches ? (
                        <div className="jp-loading-matches-container">
                            <LoadingAnimation text="Loading Matches..." />
                        </div>
                    ) : matches.length > 0 ? (
                        <>
                            <div className="jp-matches-list">
                                {/* Free matches (first 7) */}
                                {matches.slice(0, 7).map((match) => {
                                    const formattedResult = formatMatchResult(match);
                                    // console.log(`[Render] Match ${match.id} data:`, {
                                    //     isPlayed: match.isPlayed,
                                    //     scores: match.scores,
                                    //     results: match.results,
                                    //     tip: match.tip,
                                    //     homeTeam: match.homeTeam,
                                    //     awayTeam: match.awayTeam,
                                    //     formattedResult: formattedResult
                                    // });
                                    return (
                                    <div key={match.id} className={`jp-match-card ${getMatchStatusClass(match)}`} onClick={() => handleMatchClick(match)} >
                                        <div className={`jp-match-header ${getMatchStatusClass(match)}`}>
                                            <div className="jp-match-date-time"><span className="jp-match-day">{match.matchDate}</span><span className="jp-match-time">{formatMatchTime(match.matchTime)}</span></div>
                                            <div className="jp-match-status">
                                                {match.isPlayed && (match.isPlayed.includes('correct.webp') || match.isPlayed.includes('remove.webp')) ? (
                                                    <span>{formatMatchResult(match)}</span>
                                                ) : (
                                                    <img src={match.isPlayed} alt="Status" className="jp-status-icon" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="jp-match-teams">
                                            <div className="jp-team home-team"><div className="jp-team-logo"><img src={match.homeTeamLogo} alt={match.homeTeam} /></div><div className="jp-team-name">{match.homeTeam}</div></div>
                                            <div className="jp-match-score">{match.scores ? (<div className="jp-score-display">{match.scores}</div>) : (<div className="jp-vs-display">VS</div>)}</div>
                                            <div className="jp-team away-team"><div className="jp-team-logo"><img src={match.awayTeamLogo} alt={match.awayTeam} /></div><div className="jp-team-name">{match.awayTeam}</div></div>
                                        </div>
                                        <div className="jp-match-prediction">
                                            <div className="jp-prediction-content">
                                                <div className="jp-prediction-label">
                                                    <FontAwesomeIcon icon={faInfoCircle} className="jp-prediction-icon" />
                                                    Prediction:
                                                </div>
                                                <div className="jp-prediction-value">{match.tip}</div>
                                            </div>
                                            <div className="jp-prediction-logo">
                                                <img src={match.imageSrc} alt="Prediction" />
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}

                                {/* Premium matches (8th onwards) */}
                                {matches.length > 7 && !isLoggedIn && (
                                    <>
                                        {matches.slice(7).map((match, index) => (
                                            <div key={match.id} className="jp-match-card jp-premium-match" onClick={() => setIsLoginModalOpen(true)} >
                                                <div className="jp-match-header">
                                                    <div className="jp-match-date-time"><span className="jp-match-day">{match.matchDate}</span><span className="jp-match-time">{formatMatchTime(match.matchTime)}</span></div>
                                                    <div className="jp-match-status">
                                                        <img src="/assets/images/icon/clock.webp" alt="Status" className="jp-status-icon" />
                                                    </div>
                                                </div>
                                                <div className="jp-match-teams">
                                                    <div className="jp-team home-team"><div className="jp-team-logo"><img src={match.homeTeamLogo} alt={match.homeTeam} /></div><div className="jp-team-name">{match.homeTeam}</div></div>
                                                    <div className="jp-match-score">{match.scores ? (<div className="jp-score-display">{match.scores}</div>) : (<div className="jp-vs-display">VS</div>)}</div>
                                                    <div className="jp-team away-team"><div className="jp-team-logo"><img src={match.awayTeamLogo} alt={match.awayTeam} /></div><div className="jp-team-name">{match.awayTeam}</div></div>
                                                </div>
                                                <div className="jp-match-prediction jp-premium-prediction">
                                                    <div className="jp-premium-lock-overlay">
                                                        <FontAwesomeIcon icon={faLock} className="jp-premium-lock-icon" />
                                                        <span className="jp-premium-text">Premium Content</span>
                                                        <button className="jp-unlock-btn" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsLoginModalOpen(true);
                                                        }}>
                                                            Unlock Prediction
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* All matches for logged-in users */}
                                {matches.length > 7 && isLoggedIn && (
                                    <>
                                        {matches.slice(7).map((match) => (
                                            <div key={match.id} className={`jp-match-card ${getMatchStatusClass(match)}`} onClick={() => handleMatchClick(match)} >
                                                <div className={`jp-match-header ${getMatchStatusClass(match)}`}>
                                                    <div className="jp-match-date-time"><span className="jp-match-day">{match.matchDate}</span><span className="jp-match-time">{formatMatchTime(match.matchTime)}</span></div>
                                                    <div className="jp-match-status">
                                                        {match.isPlayed && (match.isPlayed.includes('correct.webp') || match.isPlayed.includes('remove.webp')) ? (
                                                            <span>{formatMatchResult(match)}</span>
                                                        ) : (
                                                            <img src={match.isPlayed} alt="Status" className="jp-status-icon" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="jp-match-teams">
                                                    <div className="jp-team home-team"><div className="jp-team-logo"><img src={match.homeTeamLogo} alt={match.homeTeam} /></div><div className="jp-team-name">{match.homeTeam}</div></div>
                                                    <div className="jp-match-score">{match.scores ? (<div className="jp-score-display">{match.scores}</div>) : (<div className="jp-vs-display">VS</div>)}</div>
                                                    <div className="jp-team away-team"><div className="jp-team-logo"><img src={match.awayTeamLogo} alt={match.awayTeam} /></div><div className="jp-team-name">{match.awayTeam}</div></div>
                                                </div>
                                                <div className="jp-match-prediction">
                                                    <div className="jp-prediction-content">
                                                        <div className="jp-prediction-label">
                                                            <FontAwesomeIcon icon={faInfoCircle} className="jp-prediction-icon" />
                                                            Prediction:
                                                        </div>
                                                        <div className="jp-prediction-value">{match.tip}</div>
                                                    </div>
                                                    <div className="jp-prediction-logo">
                                                        <img src={match.imageSrc} alt="Prediction" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* Premium access banner - moved outside jp-matches-list */}
                            {matches.length > 7 && !isLoggedIn && (
                                <div className="jp-premium-banner">
                                    <div className="jp-premium-banner-content">
                                        <div className="jp-premium-banner-icon">
                                            <FontAwesomeIcon icon={faLock} />
                                        </div>
                                        <div className="jp-premium-banner-text">
                                            <h3>Unlock All {matches.length - 7} Premium Predictions</h3>
                                            <p>Get access to expert jackpot predictions and boost your winning chances</p>
                                        </div>
                                        <div className="jp-premium-banner-actions">
                                            <button className="jp-premium-login-btn" onClick={() => setIsLoginModalOpen(true)}>
                                                Login
                                            </button>
                                            <button className="jp-premium-register-btn" onClick={() => setIsPaymentModalOpen(true)}>
                                                Get Premium Access
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        !error && <div className="jp-no-matches"><p>No matches available for this jackpot</p></div>
                    )}

                    {/* Manual Payment Section */}
                    <div className="jp-manual-payment-section" style={{
                        backgroundColor: 'white',
                        margin: '20px 0',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <div className="jp-payment-header" style={{
                            textAlign: 'center',
                            marginBottom: '24px'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#111827',
                                marginBottom: '8px'
                            }}>
                                💳 Manual Payment Option
                            </h2>
                            <p style={{
                                color: '#6b7280',
                                fontSize: '14px'
                            }}>
                                Pay via M-Pesa and get instant access to premium jackpot predictions
                            </p>
                        </div>

                        {/* Step by step process */}
                        <div className="jp-payment-steps" style={{
                            backgroundColor: '#f9fafb',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#111827',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                📋 Step by Step Process
                            </h3>
                            
                            <div className="jp-step-list">
                                <div className="jp-step-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        flexShrink: 0
                                    }}>1</span>
                                    <span style={{ color: '#374151', fontSize: '14px' }}>
                                        Go to <strong>M-PESA</strong> → Select <strong>LIPA NA M-PESA</strong>
                                    </span>
                                </div>

                                <div className="jp-step-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        flexShrink: 0
                                    }}>2</span>
                                    <div style={{ color: '#374151', fontSize: '14px' }}>
                                        Enter PAY BILL: 
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            backgroundColor: '#fef3c7',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            margin: '4px 0',
                                            border: '1px solid #f59e0b'
                                        }}>
                                            <strong style={{ color: '#92400e', fontSize: '16px' }}>883927</strong>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText('883927');
                                                    // Show copied feedback
                                                    const btn = event.target;
                                                    const originalText = btn.textContent;
                                                    btn.textContent = '✓';
                                                    btn.style.color = '#059669';
                                                    setTimeout(() => {
                                                        btn.textContent = originalText;
                                                        btn.style.color = '#374151';
                                                    }, 1000);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#374151',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    padding: '2px'
                                                }}
                                            >
                                                📋
                                            </button>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                            (KEDEVELOPERS TECH LTD)
                                        </div>
                                    </div>
                                </div>

                                <div className="jp-step-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        flexShrink: 0
                                    }}>3</span>
                                    <span style={{ color: '#374151', fontSize: '14px' }}>
                                        Enter Account No: <strong>Your Phone Number</strong>
                                    </span>
                                </div>

                                <div className="jp-step-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        flexShrink: 0
                                    }}>4</span>
                                    <span style={{ color: '#374151', fontSize: '14px' }}>
                                        Select Amount <strong>(Access All Jackpots)</strong>
                                    </span>
                                </div>

                                <div className="jp-step-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        flexShrink: 0
                                    }}>5</span>
                                    <span style={{ color: '#374151', fontSize: '14px' }}>
                                        After Payment: <strong>Your Password is sent instantly via SMS</strong>
                                    </span>
                                </div>

                                <div className="jp-step-item" style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px'
                                }}>
                                    <span style={{
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        flexShrink: 0
                                    }}>6</span>
                                    <span style={{ color: '#374151', fontSize: '14px' }}>
                                        Games Access: Tap <strong>VIP/LOGIN</strong> → enter Phone & Password
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Options */}
                        <div className="jp-pricing-options" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '20px'
                        }}>
                            {[
                                { amount: 150, duration: '3 days', popular: false },
                                { amount: 300, duration: 'One week', popular: true },
                                { amount: 400, duration: '2 weeks', popular: false },
                                { amount: 700, duration: '1 month', popular: false }
                            ].map((option, index) => (
                                <div key={index} style={{
                                    backgroundColor: option.popular ? '#fef3c7' : 'white',
                                    border: option.popular ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}>
                                    {option.popular && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#f59e0b',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            fontWeight: '600'
                                        }}>
                                            POPULAR
                                        </div>
                                    )}
                                    <div style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#111827',
                                        marginBottom: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px'
                                    }}>
                                        KES {option.amount}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(option.amount.toString());
                                                // Show copied feedback
                                                const btn = event.target;
                                                const originalText = btn.textContent;
                                                btn.textContent = '✓';
                                                btn.style.color = '#059669';
                                                setTimeout(() => {
                                                    btn.textContent = originalText;
                                                    btn.style.color = '#6b7280';
                                                }, 1000);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#6b7280',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                padding: '2px'
                                            }}
                                        >
                                            📋
                                        </button>
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#6b7280',
                                        fontWeight: '500'
                                    }}>
                                        {option.duration} access
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* M-Pesa Express Option */}
                        <div style={{
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                color: '#374151',
                                fontSize: '14px',
                                marginBottom: '12px'
                            }}>
                                Don't like Paybill? 
                            </p>
                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 28px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 8px 20px rgba(5, 150, 105, 0.3)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                                    e.target.style.boxShadow = '0 12px 30px rgba(5, 150, 105, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0) scale(1)';
                                    e.target.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.3)';
                                }}
                            >
                                Pay with 👉 M-Pesa Express
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <LoginModal 
                isLoginModalOpen={isLoginModalOpen} 
                setIsLoginModalOpen={setIsLoginModalOpen} 
                handleShowRegister={handleShowRegister}
                onLoginSuccess={handleLoginSuccess}
            />
            
            {/* Payment Form Modal */}
            {isPaymentModalOpen && (
                <div 
                    className="payment-modal-backdrop fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 overflow-y-auto"
                    onClick={(e) => {
                        // Close when clicking outside
                        if (e.target === e.currentTarget) {
                            setIsPaymentModalOpen(false);
                        }
                    }}
                    style={{
                        padding: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    <style>
                        {`
                            @keyframes fadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                            @keyframes slideUp {
                                from { transform: translateY(20px); opacity: 0; }
                                to { transform: translateY(0); opacity: 1; }
                            }
                            .payment-modal-container {
                                animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                            }
                        `}
                    </style>
                    <div className="payment-modal-container relative bg-white rounded-lg w-full max-w-xl overflow-hidden flex flex-col" style={{
                        margin: 20, 
                        width: '100%', 
                        maxWidth: '700px',
                        borderRadius: '20px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div className="payment-modal-header sticky top-0 z-10 bg-gradient-to-r from-violet-500 to-indigo-600 text-white p-4 flex justify-between items-center" style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            padding: '24px',
                            borderRadius: '20px 20px 0 0'
                        }}>
                            <div>
                                <h3 className="payment-modal-title text-lg font-semibold" style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    margin: 0,
                                    letterSpacing: '-0.025em'
                                }}>Premium Access</h3>
                                <p style={{
                                    fontSize: '14px',
                                    margin: '4px 0 0 0',
                                    opacity: 0.9
                                }}>Choose your subscription plan</p>
                            </div>
                            <button 
                                className="payment-modal-close-btn text-2xl text-white hover:text-violet-200 focus:outline-none"
                                onClick={() => setIsPaymentModalOpen(false)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                    e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className="payment-modal-body flex-1 overflow-auto" style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            flexGrow: 1, 
                            height: 'calc(100% - 60px)', 
                            padding: 0, 
                            width: '100%',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                        }}>
                            <PaymentForm />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 