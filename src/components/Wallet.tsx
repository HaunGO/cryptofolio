import React from 'react';
// import axios from 'axios';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
  
import Coin from './Coin'

import { Billfolds, StoredResponseData } from '../atoms';

type Props = {
    // wallet: {coins:[]},
    // name: string,
    // coins: object,
    // usdValue: number,
    // btcValue: number,
    // bananaValue: number, 
}   

const Wallet: React.FC<any> = ({ wallet }) => {  
    
    // const [coins, setCoins] = useRecoilState(myCoins);
    const [wallets, setWallets] = useRecoilState(Billfolds);
    const [responseData] = useRecoilState(StoredResponseData);


    function getCoinData(obj:any, value:string): Object {
        const num:any = Object.keys(obj).find(k => obj[k].asset_id === value);        
        return responseData[num];
    }

    const coinData:Array<Object> = [];
    
    Object.entries(wallet.coins[0]).map(coin => {
        const marketData = getCoinData(responseData, coin[0]);
        let myAmount = {myAmount:coin[1]}
        const combinedCoinData = { ...marketData, ...myAmount }        
        coinData.push(combinedCoinData);
    });

    const copy = JSON.parse(JSON.stringify(wallets));    
    copy[wallet.id].usdValue = getUsdTotal();
    copy[wallet.id].btcValue = getBtcTotal();
    copy[wallet.id].bananaValue = getBananaTotal();
    copy[wallet.id].coinData = coinData;

    const walletTotal = getUsdTotal();
    const bittyTotal = getBtcTotal() ? `₿`+getBtcTotal().toFixed(3) : `₿0`;

    function getRawUSD() {
        let num = 0;
        Object.entries(copy[wallet.id].coinData).map(coin => {        
            let usd = Object(coin[1]).price_usd;
            let amt = Object(coin[1]).myAmount;
            let tot = usd * amt;
            num += isNaN(tot) ? 0 : tot;    
        }); 
        return num;
    }

    function getUsdTotal(){
        let usd = getRawUSD();
        const prettyUSD = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0,
        }).format(Math.round(usd));        
        return isNaN(usd) ? '-' : prettyUSD  
    }

    function getBtcTotal():number {
        const dataBTC:any = getCoinData(responseData, 'BTC');
        let usd = getRawUSD()        
        const TotalInBitty = dataBTC ? usd / dataBTC.price_usd : undefined;
        return TotalInBitty
    }

    function getBananaTotal(){
        let num = 400;        
        return num
    }

    return (
        <div className='border p-1 m-1'>
            <div>{wallet.name}</div>
            <div className="text-gray-500">{wallet.description}</div>
            
            <div className='text-xl font-bold rounded-full w-32 h-32 m-auto my-2   
                            flex justify-center items-center 
                            bg-gradient-to-t from-gray-300 to-gray-100
                            '
                            // bg-gradient-to-t from-yellow-400 to-yellow-200 
                    >{walletTotal}<br />{bittyTotal}
            </div>

            <div className="">
                {
                    Object.entries(wallet.coins[0]).map(([key, value]) => (
                        <Coin key={key} name={key} amount={value} ></Coin>
                    ))
                }            
            </div>         
        </div>
    )
};

export default Wallet; 