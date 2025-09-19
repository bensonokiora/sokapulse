'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingAnimation from '@/components/LoadingAnimation';
import '@/styles/jackpot.css';
import '../styles/payment-form-utilities.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCalendarAlt, faClock, faInfoCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import LoginModal from './LoginModal';
import ManualPayment from './ManualPayment';
import { useAuth } from '../hooks/useAuth';
import JackpotMatches from './JackpotMatches';
import Link from 'next/link';
import { extractFixtureCount } from '@/utils/api';

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

// Helper function to fetch data from API routes
const fetchFromApiRoute = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generate date tabs utility
const generateDateTabs = (currentDate) => {
    const tabs = [];
    let centerDate = currentDate instanceof Date ? currentDate : new Date(currentDate);
    if (isNaN(centerDate.getTime())) {
        centerDate = new Date();
    }
    for (let i = 2; i > 0; i--) { 
        const date = new Date(centerDate); 
        date.setDate(date.getDate() - i); 
        tabs.push(date); 
    }
    tabs.push(new Date(centerDate));
    for (let i = 1; i <= 2; i++) { 
        const date = new Date(centerDate); 
        date.setDate(date.getDate() + i); 
        tabs.push(date); 
    }
    return tabs;
};

export default function JackpotPredictionsPageClient({
    initialBookmakers,
    initialMatches,
    initialSelectedBookmakerId,
    initialSelectedDate,
    initialError,
    firstMatchDateISO,
    seoContent
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const countdownInterval = useRef(null);
    const matchesContentRef = useRef(null);
    const dateTabsContainerRef = useRef(null);

    const [bookmakers, setBookmakers] = useState(initialBookmakers || []);
    const [matches, setMatches] = useState(initialMatches || []);
    const [selectedBookmaker, setSelectedBookmaker] = useState(initialSelectedBookmakerId);
    const [selectedDate, setSelectedDate] = useState(() => 
        initialSelectedDate ? new Date(initialSelectedDate) : new Date()
    );
    const [error, setError] = useState(initialError);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMatches, setIsLoadingMatches] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [dateTabs, setDateTabs] = useState(() => 
        generateDateTabs(initialSelectedDate ? new Date(initialSelectedDate) : new Date())
    );
    const [activeTab, setActiveTab] = useState(2);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [firstMatchDate, setFirstMatchDate] = useState(
        firstMatchDateISO ? new Date(firstMatchDateISO) : null
    );

    const { 
        isLoggedIn, 
        showLoginModal, 
        setShowLoginModal, 
        showPaymentForm, 
        setShowPaymentForm, 
        handleLoginSuccess, 
        handleLogout, 
        handleShowRegister, 
        openLoginModal 
    } = useAuth();

    // Format functions
    const formatMatchTime = (timeString) => timeString ? timeString.substring(0, 5) : '';
    const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');

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
        if (isMobile && matchesContentRef.current) { 
            setTimeout(() => { 
                matchesContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }, 300); 
        }
    };

    const calculateCountdown = (targetDate) => {
        if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const now = new Date().getTime(); 
        const distance = targetDate.getTime() - now;
        if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const days = Math.floor(distance / 86400000); 
        const hours = Math.floor((distance % 86400000) / 3600000); 
        const minutes = Math.floor((distance % 3600000) / 60000); 
        const seconds = Math.floor((distance % 60000) / 1000);
        return { days, hours, minutes, seconds };
    };

    const getFirstMatchDateTime = (currentMatches) => {
        if (!currentMatches || currentMatches.length === 0) return null;
        const sortedMatches = [...currentMatches].sort((a, b) => 
            new Date(`${a.matchDateOriginal}T${a.matchTime}`) - new Date(`${b.matchDateOriginal}T${b.matchTime}`)
        );
        const firstMatch = sortedMatches[0];
        return new Date(`${firstMatch.matchDateOriginal}T${firstMatch.matchTime}`); 
    };

    // Update URL without page reload
    const updateURL = (date, bookmakerId) => {
        const params = new URLSearchParams(searchParams);
        params.set('date', formatDateForApi(date));
        if (bookmakerId) {
            params.set('bookmaker', bookmakerId.toString());
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    // Effects
    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        // Setup initial countdown
        if (firstMatchDate) {
            const updateCountdown = () => {
                const newCountdown = calculateCountdown(firstMatchDate);
                setCountdown(newCountdown);
                if (newCountdown.days <= 0 && newCountdown.hours <= 0 && 
                    newCountdown.minutes <= 0 && newCountdown.seconds <= 0) {
                    if (countdownInterval.current) clearInterval(countdownInterval.current);
                }
            };
            updateCountdown();
            countdownInterval.current = setInterval(updateCountdown, 1000);
        }

        return () => {
            window.removeEventListener('resize', checkIfMobile);
            if (countdownInterval.current) clearInterval(countdownInterval.current);
        };
    }, [firstMatchDate]);

    useEffect(() => {
        setDateTabs(generateDateTabs(selectedDate));
    }, [selectedDate]);

    useEffect(() => {
        if (isMobile && dateTabsContainerRef.current) {
            const container = dateTabsContainerRef.current;
            const activeTabElement = container.querySelector(`.jp-date-tab:nth-child(${activeTab + 1})`);

            if (activeTabElement) {
                const containerWidth = container.offsetWidth;
                const activeTabOffsetLeft = activeTabElement.offsetLeft;
                const activeTabWidth = activeTabElement.offsetWidth;
                const scrollLeft = activeTabOffsetLeft - (containerWidth / 2) + (activeTabWidth / 2);

                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [isMobile, activeTab, dateTabs]);

    // Event handlers
    const handleDateChange = async (date, index) => {
        setSelectedDate(date);
        setActiveTab(index);
        setIsLoading(true);
        setIsLoadingMatches(true);
        setError(null);
        setBookmakers([]);
        setMatches([]);
        setSelectedBookmaker(null);
        setFirstMatchDate(null);
        if (countdownInterval.current) clearInterval(countdownInterval.current);

        const formattedDate = formatDateForApi(date);

        try {
            // Fetch bookmakers
            const bookmakersUrl = `/api/jackpots?date=${formattedDate}`;
            const fetchedBookmakers = await fetchFromApiRoute(bookmakersUrl);
            setBookmakers(fetchedBookmakers);

            if (fetchedBookmakers.length > 0) {
                const firstBookmakerId = fetchedBookmakers[0].id;
                setSelectedBookmaker(firstBookmakerId);

                // Fetch matches with correct fixture count
                const firstBookmaker = fetchedBookmakers.find(b => b.id === firstBookmakerId);
                const fixturesCount = firstBookmaker ? extractFixtureCount(firstBookmaker.description) : 20;
                
                const matchesUrl = `/api/jackpot-matches?date=${formattedDate}&bookmakerId=${firstBookmakerId}&fixtures_count=${fixturesCount}`;
                const fetchedMatches = await fetchFromApiRoute(matchesUrl);
                setMatches(fetchedMatches);

                // Setup countdown
                const firstMatch = getFirstMatchDateTime(fetchedMatches);
                setFirstMatchDate(firstMatch);
                
                if (firstMatch) {
                    const updateCountdown = () => {
                        const newCountdown = calculateCountdown(firstMatch);
                        setCountdown(newCountdown);
                        if (newCountdown.days <= 0 && newCountdown.hours <= 0 && 
                            newCountdown.minutes <= 0 && newCountdown.seconds <= 0) {
                            if (countdownInterval.current) clearInterval(countdownInterval.current);
                        }
                    };
                    updateCountdown();
                    if (countdownInterval.current) clearInterval(countdownInterval.current);
                    countdownInterval.current = setInterval(updateCountdown, 1000);
                }

                // Update URL
                updateURL(date, firstBookmakerId);
                scrollToMatches();
            } else {
                setError('No jackpots available for this date');
                updateURL(date, null);
            }
        } catch (err) {
            setError(err.message || 'Failed to load data for selected date.');
        } finally {
            setIsLoading(false);
            setIsLoadingMatches(false);
        }
    };

    const handleBookmakerChange = async (bookmakerId) => {
        setSelectedBookmaker(bookmakerId);
        setIsLoadingMatches(true);
        setError(null);
        setMatches([]);
        setFirstMatchDate(null);
        if (countdownInterval.current) clearInterval(countdownInterval.current);

        const formattedDate = formatDateForApi(selectedDate);

        try {
            // Find the selected bookmaker and extract fixture count
            const selectedBookmakerData = bookmakers.find(b => b.id === bookmakerId);
            const fixturesCount = selectedBookmakerData ? extractFixtureCount(selectedBookmakerData.description) : 20;
            
            const matchesUrl = `/api/jackpot-matches?date=${formattedDate}&bookmakerId=${bookmakerId}&fixtures_count=${fixturesCount}`;
            const fetchedMatches = await fetchFromApiRoute(matchesUrl);
            setMatches(fetchedMatches);

            // Setup countdown
            const firstMatch = getFirstMatchDateTime(fetchedMatches);
            setFirstMatchDate(firstMatch);
            
            if (firstMatch) {
                const updateCountdown = () => {
                    const newCountdown = calculateCountdown(firstMatch);
                    setCountdown(newCountdown);
                    if (newCountdown.days <= 0 && newCountdown.hours <= 0 && 
                        newCountdown.minutes <= 0 && newCountdown.seconds <= 0) {
                        if (countdownInterval.current) clearInterval(countdownInterval.current);
                    }
                };
                updateCountdown();
                if (countdownInterval.current) clearInterval(countdownInterval.current);
                countdownInterval.current = setInterval(updateCountdown, 1000);
            }

            // Update URL
            updateURL(selectedDate, bookmakerId);
            scrollToMatches();
        } catch (err) {
            setError(err.message || 'Failed to load matches for selected bookmaker.');
        } finally {
            setIsLoadingMatches(false);
        }
    };

    // Render helpers
    const getActiveBookmaker = () => bookmakers.find(b => b.id === selectedBookmaker);
    const activeBookmaker = getActiveBookmaker();

    if (error && (!matches || matches.length === 0) && (!bookmakers || bookmakers.length === 0)) {
        return (
            <div className="jp-container p-4">
                <div className="jp-error-message text-red-500 text-center">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="jp-content-wrapper">
            {/* Main Header */}
            <div className="jp-page-header">
                <div className="jp-title-section">
                    <h1 className="jp-title">{seoContent?.title || "Jackpot Predictions"}</h1>
                    <p className="jp-subtitle">{seoContent?.description || "Expert predictions for jackpot betting"}</p>
                </div>
                
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
                
                {/* Countdown Timer */}
                {firstMatchDate && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0) && (
                    <div className="jp-timer-countdown-container">
                        <div className="jp-timer-label-top">First Match Starts In:</div>
                        <div className="jp-timer-countdown">
                            <div className="jp-timer-time-segment">
                                <div className="jp-timer-time">{formatTimeUnit(countdown.days)}</div>
                                <div className="jp-timer-label">days</div>
                            </div>
                            <div className="jp-timer-time-segment">
                                <div className="jp-timer-time">{formatTimeUnit(countdown.hours)}</div>
                                <div className="jp-timer-label">hrs</div>
                            </div>
                            <div className="jp-timer-time-segment">
                                <div className="jp-timer-time">{formatTimeUnit(countdown.minutes)}</div>
                                <div className="jp-timer-label">min</div>
                            </div>
                            <div className="jp-timer-time-segment">
                                <div className="jp-timer-time">{formatTimeUnit(countdown.seconds)}</div>
                                <div className="jp-timer-label">sec</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Date Tabs */}
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

            <div className="jp-page-content">
                <div className="jp-content" style={{ opacity: isLoading ? 0.5 : 1 }}>
                    {/* Bookmaker Sidebar */}
                    <div className="jp-bookmaker-sidebar">
                        <h2 className="jp-sidebar-title">Bookmakers</h2>
                        {bookmakers.length > 0 ? (
                            <div className="jp-bookmaker-list">
                                {bookmakers.map((bookmaker) => (
                                    <div 
                                        key={bookmaker.id} 
                                        className={`jp-bookmaker-item ${selectedBookmaker === bookmaker.id ? 'active' : ''}`} 
                                        onClick={() => handleBookmakerChange(bookmaker.id)}
                                    >
                                        <div className="jp-bookmaker-logo">
                                            <img src={bookmaker.imageSrc} alt={bookmaker.bookmaker} />
                                        </div>
                                        <div className="jp-bookmaker-info">
                                            <div className="jp-bookmaker-name">{bookmaker.bookmaker}</div>
                                            <div className="jp-bookmaker-description">{bookmaker.description}</div>
                                        </div>
                                        {bookmaker.jackpotSiteUrl && (
                                            <a 
                                                href={bookmaker.jackpotSiteUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="jp-bookmaker-link" 
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                    <polyline points="15 3 21 3 21 9"></polyline>
                                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : !isLoading ? (
                            <div className="jp-no-bookmakers">No bookmakers available.</div>
                        ) : null}
                    </div>

                    {/* Matches Content */}
                    <div className="jp-matches-content" ref={matchesContentRef}>
                        {isMobile && activeBookmaker && (
                            <div className="jp-mobile-active-bookmaker">
                                <img src={activeBookmaker.imageSrc} alt={activeBookmaker.bookmaker} className="jp-active-bookmaker-logo" />
                                <span className="jp-active-bookmaker-name">{activeBookmaker.bookmaker}</span>
                                <span className="jp-active-bookmaker-description">{activeBookmaker.description}</span>
                            </div>
                        )}
                        
                        {isLoadingMatches ? (
                            <div className="jp-loading-matches-container">
                                <LoadingAnimation text="Loading Matches..." />
                            </div>
                        ) : matches.length > 0 ? (
                            <JackpotMatches 
                                predictions={matches} 
                                isLoggedIn={isLoggedIn} 
                                handleUnlockClick={openLoginModal} 
                                bookmakerId={selectedBookmaker} 
                            />
                        ) : (
                            !error && <div className="jp-no-matches"><p>No matches available for this jackpot</p></div>
                        )}

                        {/* Manual Payment Section */}
                        <ManualPayment
                            paymentReason="premium jackpot predictions"
                            onPayWithMpesaExpress={handleShowRegister}
                        />
                    </div>
                </div>

                {/* SEO Content Section */}
                <div className="jp-seo-content">
                    <div className="jp-seo-main-section">
                        {seoContent?.sections?.map((section) => (
                            <div key={section.id} className="jp-seo-section">
                                <h2 className="jp-seo-section-title">{section.title}</h2>
                                <div className="jp-seo-section-content" dangerouslySetInnerHTML={{ __html: section.content }} />
                            </div>
                        ))}
                    </div>

                    {/* Features Section */}
                    {seoContent?.features && seoContent.features.length > 0 && (
                        <div className="jp-features-section">
                            <h2 className="jp-features-title">Our Prediction Features</h2>
                            <div className="jp-features-subtitle">What makes our predictions special</div>
                            <div className="jp-features-list">
                                {seoContent.features.map((feature, index) => (
                                    <div key={index} className="jp-feature-item">
                                        <span className="jp-feature-check">✓</span>
                                        <span className="jp-feature-text">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            {seoContent.accuracy && (
                                <div className="jp-accuracy-note">
                                    <strong>Accuracy:</strong> {seoContent.accuracy}
                                </div>
                            )}
                            {seoContent.specialFeature && (
                                <div className="jp-special-feature">
                                    <strong>Special Feature:</strong> {seoContent.specialFeature}
                                </div>
                            )}
                        </div>
                    )}

                    {/* FAQs Section */}
                    {seoContent?.faqs && seoContent.faqs.length > 0 && (
                        <div className="jp-faqs-section">
                            <h2 className="jp-faqs-title">Frequently Asked Questions</h2>
                            <div className="jp-faqs-subtitle">Everything you need to know</div>
                            <div className="jp-faqs-list">
                                {seoContent.faqs.map((faq, index) => (
                                    <div key={index} className="jp-faq-item">
                                        <h3 className="jp-faq-question">{faq.question}</h3>
                                        <p className="jp-faq-answer">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prediction Links Section */}
                    {seoContent?.predictionLinks && seoContent.predictionLinks.length > 0 && (
                        <div className="jp-prediction-links-section">
                            <h2 className="jp-prediction-links-title">More Predictions</h2>
                            <div className="jp-prediction-links-subtitle">Explore our other services</div>
                            <div className="jp-prediction-links-list">
                                {seoContent.predictionLinks.map((link, index) => (
                                    link.href.startsWith('/') ? (
                                        <Link key={index} href={link.href} className="jp-prediction-link">{link.text}</Link>
                                    ) : (
                                        <a key={index} href={link.href} className="jp-prediction-link" target="_blank" rel="noopener noreferrer">{link.text}</a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <LoginModal 
                isLoginModalOpen={showLoginModal} 
                setIsLoginModalOpen={setShowLoginModal} 
                handleShowRegister={handleShowRegister}
                onLoginSuccess={handleLoginSuccess}
            />
            
            {/* Payment Form Modal */}
            {showPaymentForm && (
                <div 
                    className="payment-modal-backdrop fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowPaymentForm(false);
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
                                onClick={() => setShowPaymentForm(false)}
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