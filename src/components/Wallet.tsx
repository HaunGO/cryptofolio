import React from 'react';
import { useRecoilState } from 'recoil';
import Coin from './Coin';
import { Billfolds, StoredResponseData } from '../atoms';
import { 
  getBananaTotal, 
  formatCurrency,
  getCoinData,
  calculateRawUSD,
  getFormattedUSDTotal,
  getFormattedBTCTotal
} from '../utils/utils';
import { CoinData, Wallet as WalletType } from '../types';

interface WalletProps {
  wallet: {
    id: number;
    name: string;
    description: string;
    coins: Record<string, number>[];
    coinData?: any[];
    usdValue: number | string;
    btcValue: number;
    bananaValue: number;
  };
  className?: string;
}

const Wallet: React.FC<WalletProps> = ({ wallet, className = ''}) => {

    const [wallets, setWallets] = useRecoilState(Billfolds);
    const [responseData] = useRecoilState(StoredResponseData);

    const coinData: any[] = [];
    
    Object.entries(wallet.coins[0]).forEach(([coinName, amount]) => {
        const marketData = getCoinData(responseData, coinName);
        if (marketData) {
            coinData.push({
                ...marketData,
                myAmount: amount
            });
        }
    });

    const walletTotal = getFormattedUSDTotal(coinData);
    const bittyTotal = getFormattedBTCTotal(coinData, responseData);
    const rawUsdValue = calculateRawUSD(coinData);

    // const bananaTotal = getBananaTotal(getRawUSD());

    return (
        <div className={`border p-1 m-1 ${className}`}>
            <div>
                {wallet.name}
                <div className="text-gray-500">{wallet.description}</div>
            </div>
            <div 
                className={`text-xl font-bold rounded-full w-32 h-32 m-auto my-2   
                flex justify-center items-center 
                bg-gradient-to-t from-gray-300 to-gray-100 `}
                >
                {walletTotal}
                <br />
                {bittyTotal}<br/>
                {/* 🍌{bananaTotal} */}
            </div>

            <div >
                {
                    Object.entries(wallet.coins[0]).map(([key, value]) => (
                        <Coin key={key} name={key} amount={Number(value)} />
                    ))
                }            
            </div>         
        </div>
    );
};

export default Wallet;
































