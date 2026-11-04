import axios from 'axios';
import { CoinData } from '../types';

// ====================== COINGECKO API ======================
// Same-origin path. src/setupProxy.js forwards this to CoinGecko in development.
export const COINGECKO_BASE_URL = '/api/coingecko';

// Simple cache to store API responses
const apiCache: Record<string, {data: any, timestamp: number}> = {};

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

// Rate limiting queue
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1500; // 1.5 seconds between requests

// Session storage keys
export const STORAGE_KEYS = {
  ALL_COINS: 'cryptofolio_all_coins',
  PRICE_DATA: 'cryptofolio_price_data',
  LAST_FETCH: 'cryptofolio_last_fetch'
};

// Cache expiration time (1 hour in milliseconds)
const CACHE_EXPIRATION = 60 * 60 * 1000;

// Function to handle rate limiting
export const rateLimitedRequest = async (url: string, retryCount = 0): Promise<any> => {
  // Maximum retry attempts
  const MAX_RETRIES = 3;
  
  // Check cache first
  if (apiCache[url] && Date.now() - apiCache[url].timestamp < CACHE_DURATION) {
    console.log(`Using cached data for: ${url}`);
    return apiCache[url].data;
  }
  
  // Enforce rate limiting
  const now = Date.now();
  const timeToWait = Math.max(0, lastRequestTime + MIN_REQUEST_INTERVAL - now);
  
  if (timeToWait > 0) {
    console.log(`Rate limiting: waiting ${timeToWait}ms before next request`);
    await new Promise(resolve => setTimeout(resolve, timeToWait));
  }
  
  // Make the actual request
  try {
    lastRequestTime = Date.now();
    const response = await axios.get(url);
    
    // Cache the result
    apiCache[url] = {
      data: response.data,
      timestamp: Date.now()
    };
    
    return response.data;
  } catch (error: any) {
    // Special handling for rate limit errors with limited retries
    if (error.response && error.response.status === 429 && retryCount < MAX_RETRIES) {
      const nextRetry = retryCount + 1;
      const waitTime = 5000 * Math.pow(2, retryCount); // Exponential backoff: 5s, 10s, 20s
      
      console.warn(`Rate limit hit (attempt ${nextRetry}/${MAX_RETRIES}). Waiting ${waitTime/1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Retry with incremented counter
      return rateLimitedRequest(url, nextRetry);
    }
    
    // If we've exceeded retries or it's a different error, throw it
    if (error.response && error.response.status === 429) {
      console.error(`Rate limit exceeded after ${MAX_RETRIES} retries. Try again later.`);
    }
    throw error;
  }
};

// Helper function to map common symbols to CoinGecko IDs
function mapToGeckoId(symbol: string): string {
  // Remove USD suffix and standardize format
  const normalizedSymbol = symbol.toLowerCase()
    .replace('-usd', '')
    .replace('_usd', '')
    .replace('-', '')
    .replace('_', '');
  
  // Map of common symbols to CoinGecko IDs
  const symbolMap: Record<string, string> = {
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'ltc': 'litecoin',
    'xrp': 'ripple',
    'ada': 'cardano',
    'sol': 'solana',
    'doge': 'dogecoin',
    'dot': 'polkadot',
    'matic': 'matic-network',
    'avax': 'avalanche-2',
    'link': 'chainlink',
    'uni': 'uniswap',
  };
  
  return symbolMap[normalizedSymbol] || normalizedSymbol;
}

// Helper to check if session storage data is valid
export function isSessionDataValid(key: string): boolean {
  const lastFetchStr = sessionStorage.getItem(STORAGE_KEYS.LAST_FETCH);
  if (!lastFetchStr) return false;
  
  const data = sessionStorage.getItem(key);
  if (!data) return false;
  
  const lastFetch = JSON.parse(lastFetchStr);
  const now = Date.now();
  
  // Check if the data exists and is less than 1 hour old
  return lastFetch[key] && (now - lastFetch[key] < CACHE_EXPIRATION);
}

// Helper to save data to session storage with timestamp
function saveToSessionStorage(key: string, data: any): void {
  sessionStorage.setItem(key, JSON.stringify(data));
  
  // Update the last fetch timestamp
  const lastFetchStr = sessionStorage.getItem(STORAGE_KEYS.LAST_FETCH);
  const lastFetch = lastFetchStr ? JSON.parse(lastFetchStr) : {};
  lastFetch[key] = Date.now();
  sessionStorage.setItem(STORAGE_KEYS.LAST_FETCH, JSON.stringify(lastFetch));
}

// Add replacement for the removed CoinAPI functions
export const fetchAllCoins = async (): Promise<CoinData[]> => {
  // Check session storage first
  if (isSessionDataValid(STORAGE_KEYS.ALL_COINS)) {
    console.log('Using cached coin data from session storage');
    return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ALL_COINS) || '[]');
  }
  
  try {
    console.log('Fetching fresh coin data from API');
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1`;
    const data = await rateLimitedRequest(url);
    
    const processedData = data.map((coin: any) => ({
      asset_id: coin.symbol.toUpperCase(),
      name: coin.name,
      price_usd: coin.current_price,
      volume_1day_usd: coin.total_volume,
      market_cap_usd: coin.market_cap
    }));
    
    // Save to session storage
    saveToSessionStorage(STORAGE_KEYS.ALL_COINS, processedData);
    
    return processedData;
  } catch (error) {
    console.error('Error fetching all coins:', error);
    return [];
  }
};

// Get current coin data and price changes
export const getCoinData = async (symbol: string): Promise<any> => {
  try {
    const geckoId = mapToGeckoId(symbol);
    console.log(`Fetching CoinGecko data for ${geckoId} (original: ${symbol})`);
    
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${geckoId}&price_change_percentage=24h,7d,30d`;
    
    // Use the rate-limited request function
    const data = await rateLimitedRequest(url);
    
    if (data && data.length > 0) {
      console.log(`Successfully retrieved data for ${geckoId}`);
      return data[0];
    }
    
    console.warn(`No data found for ${geckoId}`);
    return null;
  } catch (error) {
    console.error('Error fetching coin data from CoinGecko:', error);
    return null;
  }
};

// Get historical price data for charting
export const getHistoricalPrices = async (
  symbol: string, 
  days: number = 30
): Promise<any> => {
  const cacheKey = `${STORAGE_KEYS.PRICE_DATA}_history_${symbol}_${days}`;
  
  // Check session storage first
  if (isSessionDataValid(cacheKey)) {
    console.log(`Using cached historical data for ${symbol} from session storage`);
    return JSON.parse(sessionStorage.getItem(cacheKey) || '{"prices":[]}');
  }
  
  try {
    const geckoId = mapToGeckoId(symbol);
    console.log(`Fetching historical prices for ${geckoId}, days: ${days}`);
    
    const url = `${COINGECKO_BASE_URL}/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`;
    
    // Use the rate-limited request function
    const data = await rateLimitedRequest(url);
    
    if (data && data.prices && data.prices.length > 0) {
      console.log(`Got ${data.prices.length} historical price points`);
      
      // Save to session storage
      saveToSessionStorage(cacheKey, data);
      
      return data;
    }
    
    console.warn(`No valid data for ${geckoId}`);
    return { prices: [] };
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return { prices: [] };
  }
};

// Get multiple coins at once (for portfolio display)
export const getMultipleCoins = async (symbols: string[]): Promise<any[]> => {
  try {
    const geckoIds = symbols.map(mapToGeckoId);
    console.log(`Fetching data for multiple coins: ${geckoIds.join(', ')}`);
    
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${geckoIds.join(',')}&price_change_percentage=24h`;
    const data = await rateLimitedRequest(url);
    
    console.log(`Retrieved data for ${data.length} coins`);
    return data;
  } catch (error) {
    console.error('Error fetching multiple coins:', error);
    return [];
  }
};

// Get historical price changes with session storage
export const getHistoricalPriceChanges = async (symbol: string): Promise<Record<string, number>> => {
  const cacheKey = `${STORAGE_KEYS.PRICE_DATA}_${symbol}`;
  
  // Check session storage first
  if (isSessionDataValid(cacheKey)) {
    console.log(`Using cached price data for ${symbol} from session storage`);
    return JSON.parse(sessionStorage.getItem(cacheKey) || '{}');
  }
  
  try {
    console.log(`Fetching fresh price data for ${symbol}`);
    // Try using "bitcoin" directly if original symbol fails
    let coinData = await getCoinData(symbol);
    
    if (!coinData && symbol.toLowerCase() !== 'bitcoin') {
      console.log(`Falling back to bitcoin for ${symbol}`);
      coinData = await getCoinData('bitcoin');
    }
    
    if (!coinData) {
      return { day: 0, week: 0, month: 0, price: 0, marketCap: 0 };
    }
    
    const result = {
      day: Number(coinData.price_change_percentage_24h?.toFixed(2)) || 0,
      week: Number(coinData.price_change_percentage_7d_in_currency?.toFixed(2)) || 0,
      month: Number(coinData.price_change_percentage_30d_in_currency?.toFixed(2)) || 0,
      price: coinData.current_price || 0,
      marketCap: coinData.market_cap || 0
    };
    
    // Save to session storage
    saveToSessionStorage(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error(`Error getting price changes for ${symbol}:`, error);
    return { day: 0, week: 0, month: 0, price: 0, marketCap: 0 };
  }
};

// CONSOLIDATED DATA LOADING
// This function fetches all required data in a single initialization
export const initializeAppData = async (): Promise<boolean> => {
  console.log('🚀 Initializing app data with minimal API calls');
  
  // Check if we already have fresh data in session storage
  if (isSessionDataValid(STORAGE_KEYS.ALL_COINS)) {
    console.log('✅ Using cached data - no API calls needed');
    return true;
  }
  
  try {
    // Get top coins with ALL the data we need in ONE call
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&price_change_percentage=24h,7d,30d`;
    
    console.log('Making single API call to get all coin data');
    const data = await rateLimitedRequest(url);
    
    if (!data || !data.length) {
      console.error('Failed to fetch initial coin data');
      return false;
    }
    
    // Process and store the base coin data
    const processedData = data.map((coin: any) => ({
      asset_id: coin.symbol.toUpperCase(),
      name: coin.name,
      price_usd: coin.current_price,
      volume_1day_usd: coin.total_volume,
      market_cap_usd: coin.market_cap
    }));
    
    // Save ALL coin data to session storage in one go
    saveToSessionStorage(STORAGE_KEYS.ALL_COINS, processedData);
    
    console.log('✅ Successfully stored data for all coins');
    return true;
  } catch (error) {
    console.error('Error initializing app data:', error);
    return false;
  }
};