
// Format a date string to a more readable format
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get relative time (e.g., "2 days ago", "in 3 hours")
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 0) {
    // Future date
    const absDiff = Math.abs(diffInSeconds);
    
    if (absDiff < 60) return `in ${absDiff} seconds`;
    if (absDiff < 3600) return `in ${Math.floor(absDiff / 60)} minutes`;
    if (absDiff < 86400) return `in ${Math.floor(absDiff / 3600)} hours`;
    if (absDiff < 604800) return `in ${Math.floor(absDiff / 86400)} days`;
    if (absDiff < 2629800) return `in ${Math.floor(absDiff / 604800)} weeks`;
    if (absDiff < 31557600) return `in ${Math.floor(absDiff / 2629800)} months`;
    return `in ${Math.floor(absDiff / 31557600)} years`;
  } else {
    // Past date
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2629800) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31557600) return `${Math.floor(diffInSeconds / 2629800)} months ago`;
    return `${Math.floor(diffInSeconds / 31557600)} years ago`;
  }
};

// Get days remaining until a date
export const getDaysRemaining = (dateString: string): number => {
  const eventDate = new Date(dateString);
  const today = new Date();
  
  // Set both dates to start of day for accurate day difference
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffInMs = eventDate.getTime() - today.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

// Check if a date is today
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Format time string
export const formatTime = (timeString: string): string => {
  return timeString;
};

// Create a countdown timer string
export const getCountdownString = (dateString: string, timeString: string): string => {
  const [startTime] = timeString.split(' - ');
  const [hour, minute] = startTime.replace(' AM', '').replace(' PM', '').split(':');
  
  const eventDate = new Date(dateString);
  const isPM = startTime.includes('PM') && parseInt(hour) < 12;
  
  eventDate.setHours(
    isPM ? parseInt(hour) + 12 : parseInt(hour),
    parseInt(minute),
    0,
    0
  );
  
  const now = new Date();
  const diffInMs = eventDate.getTime() - now.getTime();
  
  if (diffInMs <= 0) {
    return 'Event has started';
  }
  
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  
  return parts.join(' ');
};
