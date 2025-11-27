/**
 * Crypto constants - Configuration for crypto features
 */

/**
 * Crypto symbol to full name mapping
 */
export const CRYPTO_NAMES: Record<string, string> = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
  BNBUSDT: 'Binance Coin',
  ADAUSDT: 'Cardano',
  SOLUSDT: 'Solana',
  XRPUSDT: 'Ripple',
  DOGEUSDT: 'Dogecoin',
  DOTUSDT: 'Polkadot',
  MATICUSDT: 'Polygon',
  AVAXUSDT: 'Avalanche',
} as const;

/**
 * Default polling interval in milliseconds
 */
export const DEFAULT_POLLING_INTERVAL = 1000; // 1 second

/**
 * Chart height constant
 */
export const CRYPTO_CHART_HEIGHT = 148;

/**
 * FlatList optimization constants
 */
export const FLATLIST_CONFIG = {
  removeClippedSubviews: true,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 50,
  windowSize: 10,
  initialNumToRender: 10,
} as const;

/**
 * Price display constants
 */
export const PRICE_DISPLAY = {
  minWidth: 100,
  maxDecimals: 8,
  minDecimalsForSmallValues: 2,
} as const;

