/**
 * Date formatting utilities
 * Centralized date formatting functions for consistent date display across the app
 */

/**
 * Formats a date string to DD/MM/YYYY format
 * @param dateString - ISO date string from API or any date string
 * @returns Formatted date string (DD/MM/YYYY) or original string if invalid
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

/**
 * Formats a date string to time format (HH:MM)
 * @param dateString - ISO date string
 * @returns Formatted time string (HH:MM) or original string if invalid
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

/**
 * Formats a date string to full date and time format (DD/MM/YYYY HH:MM)
 * @param dateString - ISO date string
 * @returns Formatted date and time string or original string if invalid
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

