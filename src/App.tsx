import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { StoredResponseData, Billfolds } from './atoms';
import { 
  initializeAppData,
  STORAGE_KEYS,
  isSessionDataValid
} from './services/api';
import Portfolio from './components/Portfolio';
import { Wallet as WalletType } from './types';
import './App.css';
// Sample data only. Real holdings live in src/private/ (gitignored). Do not commit an import of that file.
import walletsDataRaw from './data/wallets.sample.json';
import { formatCurrency, getEggTotal, getGoldTotal, getSilverTotal } from './utils/utils';

const walletsData = walletsDataRaw as WalletType[];

function App() {
  const [wallets, setWallets] = useRecoilState(Billfolds);
  const [responseData, setResponseData] = useRecoilState(StoredResponseData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialize app with a single API call and wallet data load
    async function initializeApp() {
      try {
        setIsLoading(true);
        
        // 1. Load wallets from JSON and store in sessionStorage
        setWallets(walletsData);
        sessionStorage.setItem('wallets', JSON.stringify(walletsData));
        console.log('💼 Loaded wallet data from JSON file');
        console.log(`📊 Found ${walletsData.length} total wallets, ${walletsData.filter(w => !w.disabled).length} enabled`);
        
        // 2. Check if we already have cached coin data
        if (isSessionDataValid(STORAGE_KEYS.ALL_COINS)) {
          console.log('💰 Using cached coin data - NO API calls needed');
          const coinData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ALL_COINS) || '[]');
          setResponseData(coinData);
          
          // Calculate and store portfolio totals (only for enabled wallets)
          const enabledWallets = walletsData.filter(wallet => !wallet.disabled);
          calculatePortfolioTotals(enabledWallets, coinData);
        } else {
          // 3. Make a SINGLE API call to get ALL coin data
          console.log('📡 Making a SINGLE API call to get all coin data');
          const success = await initializeAppData();
          
          if (success) {
            // Load the pre-fetched data into state
            const coinData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ALL_COINS) || '[]');
            setResponseData(coinData);
            console.log(`✅ Successfully loaded data for ${coinData.length} coins`);
            
            // Calculate and store portfolio totals (only for enabled wallets)
            const enabledWallets = walletsData.filter(wallet => !wallet.disabled);
            calculatePortfolioTotals(enabledWallets, coinData);
          }
        }
      } catch (error) {
        console.error("❌ Error initializing app:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeApp();
  }, [setResponseData, setWallets]);

  // Calculate portfolio totals from individual coins across all wallets
  function calculatePortfolioTotals(wallets: WalletType[], coinData: any[]) {
    let totalUSD = 0;
    let coinCount = 0;
    let largestHolding = { name: '', value: 0 };
    const holdings: Record<string, number> = {};
    
    console.log('📊 Calculating portfolio totals for', wallets.length, 'wallets');
    console.log('💰 Available coin data:', coinData.length, 'coins');
    
    // Calculate totals by iterating through each wallet's coins
    wallets.forEach(wallet => {
      if (wallet.coins && wallet.coins.length > 0) {
        Object.entries(wallet.coins[0]).forEach(([coinSymbol, amount]) => {
          coinCount++;
          
          // Handle USD as a special case since it's not in crypto API data
          let coinValue: number;
          if (coinSymbol.toUpperCase() === 'USD') {
            coinValue = amount; // USD amount is already in USD
            console.log(`${coinSymbol}: ${amount} (USD) = $${coinValue.toFixed(2)}`);
          } else {
            // Find coin price data for cryptocurrencies
            const coin = coinData.find(c => c.asset_id === coinSymbol);
            coinValue = coin ? amount * (coin.price_usd || 0) : 0;
            console.log(`${coinSymbol}: ${amount} × $${coin?.price_usd || 0} = $${coinValue.toFixed(2)}`);
          }
          
          // Add to total USD value
          totalUSD += coinValue;
          
          // Track holdings by coin symbol for diversity calculations
          if (coinSymbol in holdings) {
            holdings[coinSymbol] += coinValue;
          } else {
            holdings[coinSymbol] = coinValue;
          }
          
          // Track largest holding
          if (coinValue > largestHolding.value) {
            largestHolding = { name: coinSymbol, value: coinValue };
          }
        });
      }
    });
    
    // Calculate BTC equivalent
    const btcCoin = coinData.find(c => c.asset_id === 'BTC');
    const totalBTC = btcCoin && btcCoin.price_usd ? totalUSD / btcCoin.price_usd : 0;
    
    // Calculate percentages for holdings
    const holdingPercentages = Object.entries(holdings).map(([name, value]) => ({
      name,
      value,
      percentage: totalUSD > 0 ? (value / totalUSD) * 100 : 0
    })).sort((a, b) => b.value - a.value);
    
    // Top 3 holdings for display
    const topHoldings = holdingPercentages.slice(0, 3);
    
    // Calculate diversity score (0-100)
    // A well-diversified portfolio should have no single asset dominating
    let diversityScore = 0;
    if (holdingPercentages.length > 1) {
      const largestPercentage = holdingPercentages[0]?.percentage || 0;
      const idealPercentage = 100 / holdingPercentages.length; // Equal distribution
      
      // Score based on how close the largest holding is to ideal distribution
      // If largest holding is close to ideal, score is high
      // If largest holding dominates (e.g., 90%), score is low
      diversityScore = Math.max(0, Math.min(100, 100 - Math.max(0, largestPercentage - idealPercentage)));
    }
    
    console.log('📈 Portfolio Summary:');
    console.log(`Total USD: $${totalUSD.toFixed(2)}`);
    console.log(`Total BTC: ₿${totalBTC.toFixed(6)}`);
    console.log(`Diversity Score: ${diversityScore.toFixed(1)}/100`);
    console.log('Top Holdings:', topHoldings);
      
    // Fun metrics
    const totalEggs = getEggTotal(totalUSD);
    const totalBananas = Math.round(totalUSD / 0.15);
    const totalGold = getGoldTotal(totalUSD);
    const totalSilver = getSilverTotal(totalUSD);
    
    const portfolioTotals = {
      usd: totalUSD,
      btc: totalBTC,
      eggs: totalEggs,
      bananas: totalBananas,
      gold: totalGold,
      silver: totalSilver,
      formattedUSD: formatCurrency(totalUSD, 'USD', 2, 2),
      formattedBTC: `₿${totalBTC.toFixed(4)}`,
      walletCount: wallets.length,
      coinCount,
      topHoldings,
      diversityScore,
      largestHolding: {
        name: largestHolding.name,
        value: formatCurrency(largestHolding.value, 'USD'),
        percentage: totalUSD > 0 ? (largestHolding.value / totalUSD) * 100 : 0
      }
    };
    
    // Store in session storage
    sessionStorage.setItem('portfolio_totals', JSON.stringify(portfolioTotals));
    return portfolioTotals;
  }

  return (
    <div className="App">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <h2 className="text-xl font-semibold">Loading Cryptofolio...</h2>
        </div>
      ) : (
        <Portfolio />
      )}
    </div>
  );
}

export default App;



















