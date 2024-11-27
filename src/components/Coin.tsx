import React, {useEffect} from 'react';
// import axios from 'axios';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';
  

// import { myCoins } from '../atoms';
import { StoredResponseData } from '../atoms';

const Coin: React.FC<any> = ({ name, amount }) => {
    
    const [responseData] = useRecoilState(StoredResponseData);


    useEffect(() => {
        // console.log('onMount');
        
    }, []);

    const storedData = useRecoilValue(StoredResponseData);
    const capsName = name.toUpperCase();
    const thisCoin = Object.values(storedData).filter(v => v.asset_id == name);
    const thisValBTC = 0; // CALCULATE VALUE IN BITCOIN.
    const thisValBANANAS = 0; // CALCULATE VALUE IN BANANAS.
    const isCrypto = thisCoin[0] ? thisCoin[0].type_is_crypto : undefined ;
    
    function getCoinData(obj:any, value:string): Object {
        const num:any = Object.keys(obj).find(k => obj[k].asset_id === value);        
        return responseData[num];
    }

    // const coinData:any = getCoinData(responseData, 'BTC');
    // console.log(coinData);


    const thisValUSD = () => {
        if(thisCoin[0]){
            if (thisCoin[0].asset_id == "USD") {
                return (amount * 1)
            }else{
                return (amount * thisCoin[0].price_usd)
            }
        }else{
            return 0
        }
    }

    const isUSD = () => {
        if(thisCoin[0]){
            if (thisCoin[0].asset_id == "USD") {
                    return true
            }else{
                return false
            }
        }else{
            return null
        }
    }

    const perUSD = () => {
        if(thisCoin[0]){
            if (thisCoin[0].asset_id == "USD") {
                    return 1
            }else{
                return thisCoin[0].price_usd
            }
        }else{
            return null
        }
    }
    
    const prettyAmount = new Intl.NumberFormat("en-US", {
        // minimumFractionDigits: 0, 
        // maximumFractionDigits: 0,
        }).format(amount);
    
    const usdPerCoin = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
        // }).format( thisCoin[0] ? thisCoin[0].price_usd : 0 );    
        }).format( thisCoin[0] ? perUSD() : 0 );    
    
    const prettyUSD = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0,
        // }).format( thisValUSD() )
        }).format( thisValUSD() )
    


        
    return (
        <div className='border rounded inline-block bg-gray-100 p-1 m-0.5'>
            
            <div>
                <strong>{capsName}</strong>
                <br/>
                {prettyAmount}
                <br/>
                {usdPerCoin} 
                <br/>
                {prettyUSD ? <><hr /><strong>{prettyUSD}</strong></> : null }
            </div>

        </div>
    );
};

export default Coin;