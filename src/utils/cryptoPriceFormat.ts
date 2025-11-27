/**
 * Crypto price formatting utilities
 */

/**
 * Formats price value with currency symbol
 * Preserves all significant decimals from the original value
 * @param value - Price value as string
 * @returns Formatted string (e.g., "$42,000.00" or "$0.00001234")
 */
export const formatCryptoPrice = (value: string): string => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '$0.00';
  
  // Count decimal places in original string to preserve precision
  const decimalPart = value.includes('.') ? value.split('.')[1] : '';
  const decimalPlaces = decimalPart.length;
  
  // Use up to 8 decimal places for very small values, or preserve original precision
  const maxDecimals = Math.min(Math.max(decimalPlaces, 2), 8);
  
  // Format with comma as thousands separator, preserving significant decimals
  return `$${numValue.toLocaleString('en-US', {
    minimumFractionDigits: numValue < 1 ? maxDecimals : 2,
    maximumFractionDigits: maxDecimals,
  })}`;
};

/**
 * Calculates change and change percentage from open and last price
 */
export const calculatePriceChange = (
  lastPrice: string,
  openPrice: string
): { change: number; changePercent: number } => {
  const last = parseFloat(lastPrice);
  const open = parseFloat(openPrice);

  if (isNaN(last) || isNaN(open) || open === 0) {
    return { change: 0, changePercent: 0 };
  }

  const change = last - open;
  const changePercent = (change / open) * 100;

  return { change, changePercent };
};

