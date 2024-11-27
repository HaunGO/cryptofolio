import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Portfolio from './components/Portfolio';

import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue, } from 'recoil';

import {myCoins, Billfolds, StoredResponseData} from './atoms';


function App() {

  const [coins, setCoins] = useRecoilState(myCoins);
  const [wallets, setWallets] = useRecoilState(Billfolds);
  const [responsData, setResponseData] = useRecoilState(StoredResponseData);



  useEffect(() => {

    async function fetchExchangeRates() {
      axiosRetry(axios, { retries: 3 });
      axios.get('https://rest.coinapi.io/v1/assets/', {
        params: {
          apikey: '0B36A2B5-67CC-4D92-8B26-55BCC3644F35'
        }
      })
      .then(function (response) {
        setResponseData(response.data);        
        console.log('response.data', response.data);
      })
      .catch(function (error) {
        console.log('err', error);        
      })
      .finally(function () {
        // always executed
      });
    }
    
    fetchExchangeRates();

    setWallets([{ id : 0,
                  name : 'Primary Billfold', 
                  description:'नमूना वॉलेट एक',
                  usdValue: 0,
                  btcValue: 0,
                  bananaValue: 0,
                  coins: [{ 'USD':10, 'BTC':0.1, 'XRP':5000,  }], 
                  coinData:[],
                }, 
                {   id : 1,
                    name : "Second Billfold", 
                    description:'Sample second',
                    usdValue: 0,
                    btcValue: 0,
                    bananaValue: 0,
                    // coins: [{ 'BTC':0.3, 'XRP':1300, 'THETA':1600 }], 
                    // coins: [{ 'BTC':0.1, 'XRP':5000, 'THETA':8000, 'TFUEL':12000, 'LTC':6, 'BCH':1, 'DGB':75000, 'ADA':6000, 'DOGE':14000, 'XLM':5000, 'SHIB':10000000  }], 
                    coins: [{ 'BTC':0.1, 'XRP':5000, 'THETA':8000, 'TFUEL':12000, 'LTC':6, 'BCH':1, 'DGB':75000, 'ADA':6000, 'DOGE':14000  }], 
                    // coins: [{ 'CAD':100 }], 
                    // coins: [{ 'USD':100, 'CAD':100 }], 
                    coinData:[],
                },
                {   id : 2, 
                    name : "Third Billfold", 
                    description:'Thrice Great ',
                    usdValue: 0,
                    btcValue: 0,
                    bananaValue: 0,
                    coins: [{ 'BTC':0.01}], 
                    // coins: [{ 'BTC':0.1, 'XRP':5000, 'THETA':8000, 'LTC':6, 'BCH':1, 'DGB':75000, 'ADA':8000, 'DOGE':14000, 'XLM':5000, 'SHIB':10000000  }], 
                    // coins: [{ USD:1, CAD:2 }], 
                    coinData:[],
                  }
              ])
              

    // getOHLCV();

  }, []);


  // function getOHLCV(){
  //   const coinAPIKey = '0B36A2B5-67CC-4D92-8B26-55BCC3644F35'; // replace with your CoinAPI key
  //   const cryptoSymbol = 'BTC'; // replace with the symbol of the cryptocurrency you want to track
  //   // const periods = ['1DAY', '3DAY', '7DAY', '30DAY']; // periods to track
  //   const periods = ['30DAY']; // periods to track
  
  //   periods.forEach(period => {
  //     // const url = `https://rest.coinapi.io/v1/ohlcv/${cryptoSymbol}/USD/history?period_id=${period}&limit=1&apikey=${coinAPIKey}`;
  //     // const url = `https://rest.coinapi.io/v1/ohlcv/BTC/history`;
  //     // https://rest.coinapi.io/v1/ohlcv/BTC/history?period_id=2MTH&limit=1&apikey=0B36A2B5-67CC-4D92-8B26-55BCC3644F35
      
  //     axiosRetry(axios, { retries: 3 }); 
  
  //     axios.get(url)
  //       .then(function (response) {
  //         const latestData = response.data[0];
  //         const priceChange = latestData.price_close - latestData.price_open;
  
  //         console.log(`Price change for ${cryptoSymbol} over the last ${period}: ${priceChange}`);
  //       })
  //       .catch(function (error) {
  //         console.log('err', error);        
  //       })
  //       .finally(function () {
  
  //       });      
  //   });    
  // }

  

  return (
    <div className="App">
        {/* <Portfolio title="This Portfolio" coins={coins} wallets={wallets} /> */}
        
        
        
        





        <Portfolio />






     
        {/* <div className='absolute bottom-1 flex  justify-start p-1'>Coins:  */}
          {/* {Object.entries(coins[0]).map(( [key, val] ) => ( */}
          {/* {Object.entries(coins).map(( [key, val] ) => ( */}
            {/* <span key={key} className="bg-gray-100 m-1 p-1"><strong>{key}:</strong> {val}</span>         */}
          {/* ))}       */}
        {/* </div> */}


    </div>
  );
}



export default App;
