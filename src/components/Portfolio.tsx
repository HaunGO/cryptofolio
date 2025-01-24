import React from 'react';
import axios from 'axios';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
  
import Dashboard from './Dashboard'
import Wallet from './Wallet'
// import Coin from './Coin'
 
import { myCoins, StoredResponseData, Billfolds} from '../atoms'


type Props = {
    // title: string,
    // coins: object,
    // wallets: object,
}   


// const Portfolio: React.FC<Props> = ({ title, coins, wallets}) => {
const Portfolio: React.FC<Props> = ({ }) => {
    
    const [coins1, setCoins1] = useRecoilState(myCoins);
    // const respData = useRecoilState(StoredResponseData);
    
    const [wallets, setMyWallets] = useRecoilState(Billfolds);



    // console.log('typeof ', typeof wallets, wallets);

    // Object.entries(wallets).map((wallet) => (
        // <Wallet key={key} name={value.name} coins={value.coins}></Coin>
            
        // wallets.forEach((wal) => {
        //     console.log(wal);
        // })

    // ))

    // console.log(wallets1[0].coins);
    // {
    //     wallets.forEach(function (w) {
    //         // console.log(w.coins[0]);

    //         let ob = w.coins

    //         Object.keys(ob).forEach( (key, val) => {
    //             // console.log(key, val) 
    //         })

    //     })
    // }            






    const API_KEY = '0B36A2B5-67CC-4D92-8B26-55BCC3644F35';
    const BASE_URL = 'https://rest.coinapi.io/v1/ohlcv';

    async function getOHLCVData(symbol: string, period: string, timeStart: string, timeEnd: string) {
      try {
        const response = await axios.get(`${BASE_URL}/${symbol}/USD/history`, {
          headers: {
            'X-CoinAPI-Key': API_KEY
          },
          params: {
            period_id: period,
            time_start: timeStart,
            time_end: timeEnd
          }
        });
    
        return response.data;
      } catch (error) {
        console.error('Error fetching OHLCV data:', error);
        return null;
      }
    }
    // const periods = ['1DAY', '3DAY', '7DAY', '30DAY']
    async function comparePrices(symbol: string) {
      const now = new Date();
      const periods = [
        { label: 'day', period: '1DAY', timeStart: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() },
        { label: '3 days', period: '3DAY', timeStart: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { label: 'week', period: '7DAY', timeStart: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { label: 'month', period: '30DAY', timeStart: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() },    
      ];
    
      for (const period of periods) {
        const data = await getOHLCVData(symbol, period.period, period.timeStart, now.toISOString());
        if (data && data.length > 0) {
          const latestClose = data[data.length - 1].price_close;
          const previousClose = data[0].price_close;
          const change = ((latestClose - previousClose) / previousClose) * 100;
          console.log(`Price change over the last ${period.label}: ${change.toFixed(2)}%`);
        }
      }
    }
    
    // Example usage
    comparePrices('BTC/USD');







    

    return (
        <div className="relative flex flex-row min-h-screen">

            <Dashboard />

            <div className="w-9/12 grid grid-cols-2 gap-2 ">


                {
                    // wallets.forEach((w) => {
                    wallets.map((w) => {
                        // console.log(w.coins[0]);
                        // console.log('w', w);
                        
                        // let ob = w.coins[0]

                        // return ''
                        // return <Wallet key={w.id} name={w.name} coins={w.coins[0]} usdValue={w.usdValue} btcValue={w.btcValue} bananaValue={w.bananaValue} />
                        // return <Wallet key={w.id} name={w.name} coins={w.coins[0]} usdValue={w.usdValue} btcValue={w.btcValue} bananaValue={w.bananaValue} />
                        return <Wallet key={w.id} wallet={w}/>
                        
                        // return Object.keys(ob).map( (key, val) => {
                        //     return <p>{key}, {val}</p>
                        // })
                            
                    })
                }            


                {/* {wallets.map((w) => (
                    <Wallet key={w.name} name={w.name} coins={w.coins} usdValue={w.usdValue} btcValue={w.btcValue} bananaValue={w.bananaValue}></Wallet>
                ))} */}
               


                {/* <h1>Folio</h1>
                <div className='bg-blue-300 absolute bottom-1 left-1 p-2 rounded-full w-10 h-10'>{coins1[0].BTC}</div> */}

            </div>
        </div>
    )
};

export default Portfolio;











