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
import walletsDataRaw from './private/wallets.private.json';

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
        
        // 2. Check if we already have cached coin data
        if (isSessionDataValid(STORAGE_KEYS.ALL_COINS)) {
          console.log('💰 Using cached coin data - NO API calls needed');
          const coinData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ALL_COINS) || '[]');
          setResponseData(coinData);
        } else {
          // 3. Make a SINGLE API call to get ALL coin data
          console.log('📡 Making a SINGLE API call to get all coin data');
          const success = await initializeAppData();
          
          if (success) {
            // Load the pre-fetched data into state
            const coinData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ALL_COINS) || '[]');
            setResponseData(coinData);
            console.log(`✅ Successfully loaded data for ${coinData.length} coins`);
          }
        }
      } catch (error) {
        console.error("❌ Error initializing app:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeApp();
  }, []);

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



















