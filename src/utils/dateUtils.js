// Convert a date to Nairobi timezone
function toNairobiTimezone(date) {
  const d = new Date(date);
  return new Date(d.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
}

// Format date to YYYY-MM-DD in Nairobi timezone
export function formatDate(date) {
  // Always work with a new Date object
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  // Format date using local timezone to avoid UTC conversion issues
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Get current date in Nairobi
export function getCurrentDate() {
  return formatDate(new Date());
}

// Get today's date in YYYY-MM-DD
export function getTodayDate() {
  return formatDate(new Date());
}

// Get tomorrow's date in YYYY-MM-DD
export function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

// Get yesterday's date in YYYY-MM-DD
export function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

// Get date for URL formatting
export function getDateForUrl(date) {
  return `football-predictions-for-${formatDate(date)}`;
}

// Parse date from URL
export function parseDateFromUrl(url) {
  const match = url.match(/football-predictions-for-(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : getTodayDate();
}

// Check if date is today
export function isToday(date) {
  return formatDate(date) === getTodayDate();
}

// Check if date is tomorrow
export function isTomorrow(date) {
  return formatDate(date) === getTomorrowDate();
}

// Check if date is yesterday
export function isYesterday(date) {
  return formatDate(date) === getYesterdayDate();
}

// Get date label (Today, Tomorrow, Yesterday, or weekday)
export function getDateLabel(date) {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
}

// Get a range of dates
export const getDateRange = (startDate, daysForward) => {
  const dates = [];
  const yesterday = new Date(startDate);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Add yesterday
  dates.push({
    value: formatDate(yesterday),
    label: 'Yesterday',
    isToday: false
  });

  // Add today and future dates
  for (let i = 0; i <= daysForward; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push({
      value: formatDate(date),
      label: i === 0 ? 'Today' : getDateLabel(date),
      isToday: i === 0
    });
  }
  
  return dates;
};

// Validate date format YYYY-MM-DD
export function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  const timestamp = date.getTime();
  
  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }
  
  return date.toISOString().split('T')[0] === dateString;
}

// Get date for navigation
export async function getNavigationDate(params) {
  // Await params before accessing its properties
  const paramsObj = await params;
  
  if (!paramsObj || !paramsObj['football-prediction-for-date']) {
    return getTodayDate();
  }
  
  const date = paramsObj['football-prediction-for-date'].replace('football-predictions-for-', '');
  return isValidDate(date) ? date : getTodayDate();
}

// Get initial date for datepicker
export function getInitialDate() {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate()
  };
}

// Generate calendar dates starting from current month
export function generateCalendarDates(year = new Date().getFullYear(), month = new Date().getMonth()) {
  // Create dates in local timezone
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  firstDay.setHours(0, 0, 0, 0);
  lastDay.setHours(0, 0, 0, 0);
  
  return {
    firstDay,
    lastDay,
    currentMonth: month,
    currentYear: year,
    today: new Date()
  };
}

// Format match time with status
export function formatMatchTime(dateString) {
  // Ensure the date string is treated as UTC by appending 'Z'
  const matchDate = new Date(dateString + 'Z');
  const now = new Date();
  
  // Convert UTC to local time
  const localMatchDate = new Date(matchDate);
  const hours = localMatchDate.getHours();
  const minutes = localMatchDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const timeString = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
  // Check if the match is today or tomorrow in local time
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const matchDay = new Date(localMatchDate);
  matchDay.setHours(0, 0, 0, 0);
  
  const isToday = matchDay.getTime() === today.getTime();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = matchDay.getTime() === tomorrow.getTime();

  // Standard football match duration is 90 minutes plus added time
  const matchEndTime = new Date(localMatchDate);
  matchEndTime.setMinutes(matchEndTime.getMinutes() + 115);

  // Calculate minutes since kickoff in local time
  const minutesSinceKickoff = Math.floor((now - localMatchDate) / 60000);

  if (isToday) {
    if (localMatchDate <= now && now <= matchEndTime) {
      if (minutesSinceKickoff < 45) {
        return `🔴 LIVE: Started at ${timeString}`;
      } else if (minutesSinceKickoff < 60) {
        return `⏱️ HT: Half-Time`;
      } else if (minutesSinceKickoff < 105) {
        return `🔴 LIVE: Started at ${timeString}`;
      } else {
        return `🔴 LIVE: Extra Time`;
      }
    }
    else if (localMatchDate < now) {
      if ((now - matchEndTime) < 30 * 60 * 1000) {
        return `FT: Just Finished`;
      }
      return `FT: Played at ${timeString}`;
    } 
    else {
      if ((localMatchDate - now) < 30 * 60 * 1000) {
        return `⏳ Kick-off Soon at ${timeString}`;
      }
      return `🗓️ Kick-off today at ${timeString}`;
    }
  } else if (isTomorrow) {
    return `🗓️ Kick-off tomorrow at ${timeString}`;
  } else {
    // Use fixed format for date to avoid locale issues
    const month = localMatchDate.toLocaleString('en-US', { month: 'short' });
    const day = localMatchDate.getDate();
    const datePart = `${month} ${day}`;
    
    if (localMatchDate < now) {
      return `FT: Played on ${datePart} at ${timeString}`;
    } else {
      return `🗓️ Kick-off on ${datePart} at ${timeString}`;
    }
  }
}
