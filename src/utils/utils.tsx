import { CoinData } from '../types'; // If you have it defined in a types file

// Or define it directly here if it's not imported
// interface CoinData {
//   asset_id: string;
//   name: string;
//   price_usd: number;
//   volume_1day_usd?: number;
//   market_cap_usd?: number;
// }

/**
 * A simple utility function that returns the string 'something'
 * @returns A string with value 'something'
 */
export const something = (): string => {
    return 'something';
}

/**
 * Doubles a number
 * @param num - The number to double
 * @returns The doubled number
 */
export const someNumber = (num: number): number => {
    return num + num;
}

/**
 * Calculates the equivalent value in bananas
 * Based on average banana price of $0.15 per banana
 * @param usdValue - The USD amount to convert to bananas
 * @returns The number of bananas (rounded to nearest whole banana)
 */
export const getBananaTotal = (usdValue: number): number => {
    const BANANA_PRICE_USD = 0.30;
    return Math.round(usdValue / BANANA_PRICE_USD);
}

/**
 * Calculates the equivalent value in eggs
 * Based on average egg price of $0.25 per egg
 * @param usdValue - The USD amount to convert to eggs
 * @returns The number of eggs (rounded to nearest whole egg)
 */
export const getEggTotal = (usdValue: number): number => {
    const EGG_PRICE_USD = 0.25;
    return Math.round(usdValue / EGG_PRICE_USD);
};


/**
 * Formats a given amount of money into a currency string.
 * @param amount - The amount of money to format.
 * @param currency - The currency code (default is 'USD').
 * @param minimumFractionDigits - The minimum number of fraction digits to display (default is 2).
 * @param maximumFractionDigits - The maximum number of fraction digits to display (default is 2).
 * @returns A string representing the formatted currency amount.
 */
export const formatCurrency = (
  amount: number, 
  currency = 'USD', 
  minimumFractionDigits = 2, 
  maximumFractionDigits = 2
): string => {
  // Ensure parameters are within valid ranges
  const minFractionDigits = Math.max(0, Math.min(20, minimumFractionDigits));
  const maxFractionDigits = Math.max(0, Math.min(20, maximumFractionDigits));
  
  // Ensure maxFractionDigits is at least minFractionDigits
  const finalMaxDigits = Math.max(minFractionDigits, maxFractionDigits);
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: finalMaxDigits,
  }).format(amount);
};


/**
 * Rounds a number to two non-zero decimal places.
 * @param num - The number to round.
 * @returns The rounded number.
 */
export const roundToTwoNonZeroDecimals = (num: number): number => {
  if (num === 0) return 0;
  
  const str = num.toString();
  const [integerPart, decimalPart] = str.split('.');
  if (!decimalPart) return num;
  
  let nonZeroCount = 0;
  let roundedDecimal = '';
  
  for (let i = 0; i < decimalPart.length; i++) {
    roundedDecimal += decimalPart[i];
    if (decimalPart[i] !== '0') nonZeroCount++;
    if (nonZeroCount === 2) break;
  }
  
  // Handle trailing zeros case (0.0505 → 0.050)
  if (nonZeroCount === 2 && 
      roundedDecimal.length < decimalPart.length && 
      decimalPart[roundedDecimal.length] === '0') {
    roundedDecimal += '0';
  }
  
  return Math.round(parseFloat(`${integerPart}.${roundedDecimal}`) * 1000) / 1000;
};


/**
 * Formats a given amount by adding commas as thousands separators.
 * @param amount - The amount to format.
 * @returns A string representing the formatted amount.
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US").format(amount);
};

// Get coin data from response data array
export function getCoinData(coinArray: CoinData[], symbol: string): CoinData | undefined {
  return coinArray.find(coin => coin.asset_id === symbol);
}

// Improve the type for coin data with amounts
interface CoinWithAmount {
  asset_id?: string;
  name?: string;
  price_usd: number;
  myAmount: number;
}

// Calculate raw USD value of coins - with better typing
// Alternative with type guard
export function calculateRawUSD(coinData: any[]): number {
  let total = 0;
  coinData.forEach(coin => {
    // Type guard to ensure properties exist
    if (typeof coin === 'object' && coin !== null && 
        'price_usd' in coin && 'myAmount' in coin && 
        typeof coin.price_usd === 'number' && typeof coin.myAmount === 'number') {
      
      const coinValue = coin.price_usd * coin.myAmount;
      total += isNaN(coinValue) ? 0 : coinValue;
    }
  });
  return total;
}

// Get formatted USD total - with better typing
export function getFormattedUSDTotal(coinData: CoinWithAmount[]): string {
  const usdValue = calculateRawUSD(coinData);
  return formatCurrency(usdValue, 'USD', 0, 0);
}

// Calculate BTC equivalent value
export function calculateBTCValue(usdValue: number, responseData: CoinData[]): number {
  const btcData = getCoinData(responseData, 'BTC');
  return btcData && btcData.price_usd ? usdValue / btcData.price_usd : 0;
}

// Get formatted BTC total - with better typing
export function getFormattedBTCTotal(coinData: CoinWithAmount[], responseData: CoinData[]): string {
  const usdValue = calculateRawUSD(coinData);
  const btcValue = calculateBTCValue(usdValue, responseData);
  return `₿${btcValue.toFixed(3)}`;
}

// Calculate a single coin's USD value
export function calculateCoinUSDValue(coinSymbol: string, amount: number, responseData: CoinData[]): number {
  const coinData = getCoinData(responseData, coinSymbol);
  return coinData && coinData.price_usd ? coinData.price_usd * amount : 0;
}

/**
 * Calculates the equivalent value in gold ounces
 * Based on approximate gold price of $2000 per ounce
 * @param usdValue - The USD amount to convert to gold ounces
 * @returns The number of gold ounces (rounded to 4 decimal places)
 */
export const getGoldTotal = (usdValue: number): number => {
    const GOLD_PRICE_USD = 2000;
    return Math.round((usdValue / GOLD_PRICE_USD) * 10000) / 10000; // 4 decimal places
};

/**
 * Calculates the equivalent value in silver ounces
 * Based on approximate silver price of $25 per ounce
 * @param usdValue - The USD amount to convert to silver ounces
 * @returns The number of silver ounces (rounded to 2 decimal places)
 */
export const getSilverTotal = (usdValue: number): number => {
    const SILVER_PRICE_USD = 25;
    return Math.round((usdValue / SILVER_PRICE_USD) * 100) / 100; // 2 decimal places
};




