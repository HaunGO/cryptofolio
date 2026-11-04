import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { StoredResponseData } from '../atoms';
import { CoinProps, CoinData } from '../types';
import { roundToTwoNonZeroDecimals, formatCurrency, formatAmount, getBananaTotal, getEggTotal, getGoldTotal, getSilverTotal, calculateCoinUSDValue } from '../utils/utils';

const Coin: React.FC<CoinProps> = ({ name, amount }) => {
    const storedData = useRecoilValue(StoredResponseData);
    const capsName = name.toUpperCase();
    
    // Use find instead of filter for better performance
    const thisCoin = useMemo(() => 
        Object.values(storedData).find(v => v.asset_id === name),
        [storedData, name]
    );
    
    // Get Bitcoin price for conversion
    const btcCoin = useMemo(() => 
        Object.values(storedData).find(v => v.asset_id === 'BTC'),
        [storedData]
    );
    
    const currentBTC = btcCoin?.price_usd || 0;
    
    // Calculate values in different currencies
    const thisValUSD = useMemo(() => {
        // Handle USD as a special case since it's not in crypto API data
        if (name.toUpperCase() === "USD") {
            return amount; // USD amount is already in USD
        }
        
        if (!thisCoin) return 0;
        return amount * thisCoin.price_usd;
    }, [thisCoin, amount, name]);
    
    const thisValBTC = useMemo(() => 
        currentBTC ? roundToTwoNonZeroDecimals(thisValUSD / currentBTC) : 0,
        [thisValUSD, currentBTC]
    );
    
    // Calculate values in bananas and eggs
    const thisValBANANAS = useMemo(() => getBananaTotal(thisValUSD).toLocaleString(), [thisValUSD]);
    const thisValEGGS = useMemo(() => getEggTotal(thisValUSD).toLocaleString(), [thisValUSD]);
    
    // Calculate values in gold and silver
    const thisValGOLD = useMemo(() => getGoldTotal(thisValUSD), [thisValUSD]);
    const thisValSILVER = useMemo(() => getSilverTotal(thisValUSD), [thisValUSD]);
    
    // Determine price per unit
    const perUSD = useMemo(() => {
        // Handle USD as a special case
        if (name.toUpperCase() === "USD") {
            return 1; // 1 USD = 1 USD
        }
        
        return thisCoin ? thisCoin.price_usd : 0;
    }, [thisCoin, name]);
    
    // Format values for display
    const prettyAmount = formatAmount(amount);
    const usdPerCoin = formatCurrency(perUSD, 'USD', 2, 8);
    const prettyUSD = formatCurrency(thisValUSD, 'USD');
    
    // Calculate USD value using the new utility function
    // const usdValue = calculateCoinUSDValue(name, amount, storedData);
    // const formattedValue = formatCurrency(usdValue, 'USD', 2);
    
    return (
        <div className='border rounded inline-block bg-gray-100 p-1 m-1 hover:shadow-md transition-shadow bg-gradient-to-t from-gray-300 to-gray-100 '>
            <div className='text-left'>
                <span>{prettyAmount} {capsName}</span> 
                <br/>
                {usdPerCoin}                 
                <br/><hr />
                <strong>{prettyUSD}</strong>
                <br />
                <strong>₿ {thisValBTC} </strong>
                <br /><hr />
                🟡 {thisValGOLD} oz
                <br />
                🪙 {thisValSILVER} oz
                <br /><hr />
                🥚 {thisValEGGS}
                <br />
                🍌 {thisValBANANAS}
            </div>
        </div>
    );
};

// <tr className='text-left'>
//     <td>{prettyAmount} {capsName}</td> 
//     <td>{usdPerCoin}</td>                 
//     <td><strong>{prettyUSD}</strong></td>
//     <td><strong>₿ {thisValBTC} </strong></td>
//     <td>🥇 {thisValGOLD} oz</td>
//     <td>🥈 {thisValSILVER} oz</td>
//     <td>🥚 {thisValEGGS}</td>
//     <td>🍌 {thisValBANANAS}</td>
// </tr>

export default Coin;