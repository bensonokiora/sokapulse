'use client';

import Link from 'next/link';
import { getFavoriteCount } from '@/utils/favorites';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  getDateRange, 
  getTodayDate,
  formatDate,
  getDateLabel,
  isValidDate,
  getInitialDate,
  generateCalendarDates 
} from '@/utils/dateUtils';

export default function NavigationRow({ selectedDate, onDateChange }) {
  const router = useRouter();
  const pathname = usePathname();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const initialDate = getInitialDate();
    return new Date(initialDate.year, initialDate.month, initialDate.day);
  });
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Set today as default when component mounts if no date is selected and onDateChange exists
    if (!selectedDate && typeof onDateChange === 'function') {
      onDateChange({ target: { value: todayString } });
    }
    
    const updateFavoriteCount = () => {
      setFavoriteCount(getFavoriteCount());
    };
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
        setIsCalendarOpen(false);
      }
    };
    
    updateFavoriteCount();
    window.addEventListener('storage', updateFavoriteCount);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('storage', updateFavoriteCount);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Remove selectedDate and onDateChange from dependencies to prevent re-runs

  const generateDateOptions = () => {
    // Get yesterday, today and next 5 days
    return getDateRange(new Date(), 5);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const generateCalendarDays = () => {
    const { firstDay, lastDay } = generateCalendarDates(
      currentMonth.getFullYear(), 
      currentMonth.getMonth()
    );
    const days = [];
    
    // Add previous month days
    const startOffset = firstDay.getDay();
    for (let i = 0; i < startOffset; i++) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - (startOffset - i));
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Add current month days
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const handleDateSelection = (date) => {
    // Handle both Date objects and string dates
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    dateObj.setHours(0, 0, 0, 0); // Reset time part
    
    // Format the date
    const formattedDate = formatDate(dateObj);
    const urlDate = `football-predictions-for-${formattedDate}`;
    
    // Update state and URL
    if (typeof onDateChange === 'function') {
      onDateChange({ target: { value: formattedDate } });
    }
    
    router.push(`/${urlDate}?filter_date=${formattedDate}`);
    setIsDatePickerOpen(false);
    setIsCalendarOpen(false);
  };

  // Function to determine if a navigation item is active
  const isActive = (path) => {
    // For the homepage or direct today-football-predictions path
    if (path === '/today-football-predictions' && (pathname === '/' || pathname === '/today-football-predictions')) {
      return true;
    }
    
    // For child routes of today-football-predictions
    if (path === '/today-football-predictions' && pathname.startsWith('/today-football-predictions/')) {
      return true;
    }
    
    // For child routes of other main navigation items
    if (path !== '/today-football-predictions' && pathname.startsWith(path + '/')) {
      return true;
    }
    
    // Exact match for other paths
    return pathname === path;
  };

  return (
    <div className="row mx-0" style={{ paddingTop: '10px' }}>
      <div className="col-lg-8 col-md-7 col-12 px-0">
        <div className="navigation-container">
          <ul className="nav scrollable nav-fill small position-relative flex-nowrap">
            <li className={`nav-link scroll-card ${isActive('/today-football-predictions') ? 'active' : ''}`} id={isActive('/today-football-predictions') ? 'activeElement' : ''}>
              <Link href="/today-football-predictions" className="nav-link text-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                
              </Link>
            </li>
            <li className={`nav-link scroll-card ${isActive('/jackpot-predictions') ? 'active' : ''}`} id={isActive('/jackpot-predictions') ? 'activeElement' : ''}>
              <Link href="/jackpot-predictions" className="nav-link text-light">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.2 6.6h7.1l-5.7 4.2 2.2 6.6-5.8-4.2-5.8 4.2 2.2-6.6-5.7-4.2h7.1z"/></svg>
                Jackpot Predictions
              </Link>
            </li>
            <li className={`nav-link scroll-card ${isActive('/premium-tips') ? 'active' : ''}`} id={isActive('/premium-tips') ? 'activeElement' : ''}>
              <Link href="/premium-tips" className="nav-link text-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm4 14a2 2 0 0 0-2 2v.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V20a2 2 0 0 0-2-2H6z"/>
                </svg>
                Premium Slips
              </Link>
            </li>
            <li className={`nav-link scroll-card ${isActive('/favourite-predictions') ? 'active' : ''}`} id={isActive('/favourite-predictions') ? 'activeElement' : ''}>
              <Link href="/favourite-predictions" className="nav-link text-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                My Matches &nbsp;
                {favoriteCount > 0 && (
                  <span className="number-circle rounded-square" 
                        style={{backgroundColor: 'white', color: 'black', fontWeight: 'bolder'}}>
                    {favoriteCount}
                  </span>
                )}
              </Link>
            </li>
           
            <li className={`nav-link scroll-card ${isActive('/live-football-predictions') ? 'active' : ''}`} id={isActive('/live-football-predictions') ? 'activeElement' : ''}>
              <Link href="/live-football-predictions" className="nav-link text-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Live
              </Link>
            </li>
           
            <li className={`nav-link scroll-card ${isActive('/tomorrow-football-predictions') ? 'active' : ''}`} id={isActive('/tomorrow-football-predictions') ? 'activeElement' : ''}>
              <Link href="/tomorrow-football-predictions" className="nav-link text-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Tomorrow
              </Link>
            </li>
            <li className={`nav-link scroll-card ${isActive('/weekend-football-predictions') ? 'active' : ''}`} id={isActive('/weekend-football-predictions') ? 'activeElement' : ''}>
              <Link href="/weekend-football-predictions" className="nav-link text-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Weekend
              </Link>
            </li>
            <li className={`nav-link scroll-card ${isActive('/yesterday-football-predictions') ? 'active' : ''}`} id={isActive('/yesterday-football-predictions') ? 'activeElement' : ''}>
              <Link href="/yesterday-football-predictions" className="nav-link text-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Yesterday
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="col-lg-4 col-md-5 col-12 datePicker px-0" ref={dropdownRef}>
        <div className="date-picker-container">
          <button 
            type="button"
            className="date-picker-trigger"
            onClick={() => {
              setIsDatePickerOpen(!isDatePickerOpen);
              setIsCalendarOpen(false);
            }}
            aria-haspopup="true"
            aria-expanded={isDatePickerOpen}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>
                {generateDateOptions().find(opt => 
                  opt.value === (selectedDate || new Date().toISOString().split('T')[0]
                ))?.label || 'Today'}
              </span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9l6 6l6-6" />
            </svg>
          </button>
          
          {isDatePickerOpen && (
            <div className="date-picker-dropdown" style={{ zIndex: 1000, position: 'absolute' }} role="menu">
              {generateDateOptions().map((option, index) => (
                <div key={option.value}>
                  <button
                    className={`date-picker-item ${selectedDate === option.value ? 'selected' : ''} ${option.isToday ? 'today' : ''}`}
                    onClick={() => handleDateSelection(option.value)}
                    role="menuitem"
                  >
                    
                    {option.label}
                  </button>
                  {index === generateDateOptions().length - 1 && (
                    <div>
                      <div className="date-picker-separator" />
                      <div role="group">
                        <button
                          className="pick-date-button"
                          onClick={() => setIsCalendarOpen(true)}
                          role="menuitem"
                          tabIndex="-1"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="calendar-icon"
                          >
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          <span>Pick A Date</span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="arrow-icon"
                          >
                            <path d="m9 18l6-6-6-6"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isCalendarOpen && (
                <div className="calendar-popup">
                  <div className="calendar-header">
                    <button onClick={handlePrevMonth}>&lt;</button>
                    <span>
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth}>&gt;</button>
                  </div>
                  <div className="calendar-grid">
                    <div className="calendar-weekdays">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="calendar-weekday">{day}</div>
                      ))}
                    </div>
                    <div className="calendar-days">
                      {generateCalendarDays().map((day, index) => (
                        <div
                          key={index}
                          className={`calendar-day ${!day.isCurrentMonth ? 'outside-month' : ''} ${
                            day.isToday ? 'today' : ''
                          } ${formatDate(day.date) === selectedDate ? 'selected' : ''}`}
                          onClick={() => {
                            if (day.isCurrentMonth) {
                              handleDateSelection(day.date);
                            }
                          }}
                        >
                          {day.date.getDate()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
