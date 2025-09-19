export function formatDate(dateString) {
  if (!dateString) return '';
  
  // If it's already a formatted date string in DD/MM/YYYY format, return it directly
  if (typeof dateString === 'string' && dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}/)) {
    return dateString;
  }
  
  try {
    // Handle date in YYYY-MM-DD format
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [year, month, day] = dateString.split('-');
      if (dateString.includes(' ')) {
        // If it includes time part, extract it
        const timePart = dateString.split(' ')[1];
        return `${day}/${month}/${year} ${timePart}`;
      }
      return `${day}/${month}/${year}`;
    }
    
    // Try to parse as a date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If parsing fails, return the original string or a fallback
      return dateString || 'Upcoming match';
    }
    
    // Format the valid date
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    // Return the original string on error, or a fallback message
    return dateString || 'Upcoming match';
  }
}

export function formatDateShort(date) {
  const today = new Date();
  const selectedDate = new Date(today.getFullYear(), today.getMonth(), date);
  return selectedDate.toISOString().split('T')[0];
}
