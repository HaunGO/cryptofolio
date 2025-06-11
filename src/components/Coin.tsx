import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { StoredResponseData } from '../atoms';
import { CoinProps, CoinData } from '../types';
import { roundToTwoNonZeroDecimals, formatCurrency, formatAmount, getBananaTotal, getEggTotal, calculateCoinUSDValue } from '../utils/utils';

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
        if (!thisCoin) return 0;
        return thisCoin.asset_id === "USD" ? amount : amount * thisCoin.price_usd;
    }, [thisCoin, amount]);
    
    const thisValBTC = useMemo(() => 
        currentBTC ? roundToTwoNonZeroDecimals(thisValUSD / currentBTC) : 0,
        [thisValUSD, currentBTC]
    );
    
    // Calculate values in bananas and eggs
    const thisValBANANAS = useMemo(() => getBananaTotal(thisValUSD), [thisValUSD]);
    const thisValEGGS = useMemo(() => getEggTotal(thisValUSD), [thisValUSD]);
    
    // Determine price per unit
    const perUSD = useMemo(() => 
        thisCoin ? (thisCoin.asset_id === "USD" ? 1 : thisCoin.price_usd) : 0,
        [thisCoin]
    );
    
    // Format values for display
    const prettyAmount = formatAmount(amount);
    const usdPerCoin = formatCurrency(perUSD, 'USD', 2, 8);
    const prettyUSD = formatCurrency(thisValUSD, 'USD');
    
    // Calculate USD value using the new utility function
    const usdValue = calculateCoinUSDValue(name, amount, storedData);
    const formattedValue = formatCurrency(usdValue, 'USD', 2);
    
    return (
        <div className='border rounded inline-block bg-gray-100 p-1 m-0.5 hover:shadow-md transition-shadow'>
            <div>
                <span>{prettyAmount} {capsName}</span> 
                <br/>
                {usdPerCoin}                 
                <br/><hr />
                {prettyUSD}
                <br />
                ₿{thisValBTC}  
                {/* <br /> */}
                {/* <strong>🍌</strong>{thisValBANANAS} */}
                {/* <br /> */}
                {/* <strong>🥚</strong>{thisValEGGS} */}
            </div>
        </div>
    );
};

export default Coin;