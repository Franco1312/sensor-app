/**
 * Date range utilities for series historical data
 */

export type TimeRange = '1M' | '3M' | '1A';

/**
 * Calculates start and end dates for a given time range
 * @param range - Time range (1M, 3M, or 1A)
 * @returns Object with startDate and endDate in ISO format with timezone -03:00
 */
export const calculateDateRange = (range: TimeRange): { startDate: string; endDate: string } => {
  const now = new Date();
  const endDate = new Date(now);
  
  // Set end date to end of today (23:59:59)
  endDate.setHours(23, 59, 59, 999);
  
  // Calculate start date based on range
  const startDate = new Date(now);
  
  switch (range) {
    case '1M':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '3M':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '1A':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }
  
  // Set start date to beginning of the day (00:00:00)
  startDate.setHours(0, 0, 0, 0);
  
  // Format dates as ISO string with timezone -03:00 (Argentina timezone)
  const formatDateWithTimezone = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-03:00`;
  };
  
  return {
    startDate: formatDateWithTimezone(startDate),
    endDate: formatDateWithTimezone(endDate),
  };
};

