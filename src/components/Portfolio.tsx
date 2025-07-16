import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Wallet from './Wallet';
import { Billfolds } from '../atoms';

interface Holding {
  name: string;
  value: number;
  percentage: number;
}

const Portfolio: React.FC = () => {
    const [wallets] = useRecoilState(Billfolds);
    const [timeFrame, setTimeFrame] = useState<string>('all');
    
    // Filter out disabled wallets
    const enabledWallets = wallets.filter(wallet => !wallet.disabled);
    
    const [portfolioTotals, setPortfolioTotals] = useState<any>({
        usd: 5,
        btc: 4,
        eggs: 3,
        bananas: 2,
        gold: 0,
        silver: 0,
        formattedUSD: '$0.00',
        formattedBTC: '₿0.0000',
        walletCount: 0,
        coinCount: 0,
        topHoldings: [],
        diversityScore: 0,
        largestHolding: { name: '', value: '$0', percentage: 0 }
    });
    
    // Load portfolio totals from sessionStorage on component mount
    useEffect(() => {
        const storedTotals = sessionStorage.getItem('portfolio_totals');
        console.log('Portfolio totals from storage:', storedTotals);
        if (storedTotals) {
            setPortfolioTotals(JSON.parse(storedTotals));
        }
    }, []);
    
    return (
        <div className="relative flex flex-col min-h-screen p-4">
            {/* Portfolio Summary */}
            <div className="rounded-xl shadow-lg p-6 mb-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Portfolio Summary</h1>
                </div>
                
                {/* Main metrics grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Value card */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <div className={`text-xl font-bold rounded-full w-48 h-48 m-auto my-2   
                            flex justify-center items-center flex-col
                            bg-gradient-to-t from-gray-300 to-gray-100 `}
                            >
                            <h3 className="text-lg font-medium text-gray-600 mb-1">Total Value</h3>
                            <p className="text-3xl font-bold">{portfolioTotals.formattedUSD}</p>
                            <p className="text-2xl font-bold">{portfolioTotals.formattedBTC}</p>                        
                        </div>
                    </div>
                    
                    {/* Composition card */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <h3 className="text-lg font-medium text-gray-600 mb-1">Portfolio Composition</h3>
                        <div className="mt-2">
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-600">
                                    Diversity Score
                                    <span className="text-xs block text-gray-400">
                                        {portfolioTotals.diversityScore > 80 ? 'Well diversified' : 
                                         portfolioTotals.diversityScore > 50 ? 'Moderately diversified' : 'Needs diversification'}
                                    </span>
                                </span>
                                <span className="font-medium">{portfolioTotals.diversityScore.toFixed(0)}/100</span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        portfolioTotals.diversityScore > 80 ? 'bg-green-500' : 
                                        portfolioTotals.diversityScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} 
                                    style={{ width: `${Math.max(5, portfolioTotals.diversityScore)}%` }}
                                ></div>
                            </div>
                            
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">Top Holdings</span>
                                    <span className="text-xs text-gray-400">by value</span>
                                </div>
                                {portfolioTotals.topHoldings && portfolioTotals.topHoldings.length > 0 ? (
                                    portfolioTotals.topHoldings.map((holding: Holding) => (
                                        <div key={holding.name} className="flex justify-between mt-1">
                                            <span className="font-medium">{holding.name}</span>
                                            <span className="text-gray-600">{holding.percentage.toFixed(1)}%</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-400 text-sm italic">Loading holdings...</div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Fun metrics card */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <h3 className="text-lg font-medium text-gray-600 mb-1">Alternative Values</h3>
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-start items-center">
                                <span className="text-xl">🥚</span>
                                <span className="text-xl font-medium pl-3">{portfolioTotals.eggs?.toLocaleString() || 0} eggs</span>
                            </div>
                            <div className="flex justify-start items-center">
                                <span className="text-xl">🍌</span>
                                <span className="text-xl font-medium pl-3">{portfolioTotals.bananas?.toLocaleString() || 0} bananas</span>
                            </div>
                            <div className="flex justify-start items-center">
                                <span className="text-xl">🥇</span>
                                <span className="text-xl font-medium pl-3">{portfolioTotals.gold?.toLocaleString() || '0.0000'} oz gold</span>
                            </div>
                            <div className="flex justify-start items-center">
                                <span className="text-xl">🥈</span>
                                <span className="text-xl font-medium pl-3">{portfolioTotals.silver?.toLocaleString() || '0.00'} oz silver</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Portfolio stats bar */}
                <div className="flex flex-wrap gap-4 mt-6 text-gray-600">
                    <div className="flex items-center gap-1">
                        <span className="font-medium">{portfolioTotals.walletCount}</span> wallets
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-medium">{portfolioTotals.coinCount}</span> assets
                    </div>
                    <div className="flex items-center gap-1">
                        Largest holding: <span className="font-medium">{portfolioTotals.largestHolding.name}</span> 
                        ({portfolioTotals.largestHolding.percentage.toFixed(1)}%)
                    </div>
                </div>
            </div>
            
            {/* Wallets List */}
            <div className="bg-white rounded-xl">
                
                <div className="flex flex-wrap justify-center gap-4">
                  {enabledWallets.map((wallet) => (
                    <Wallet 
                      key={wallet.id} 
                      wallet={wallet} 
                      className="hover:shadow-lg transition-all duration-300 rounded-lg flex-grow basis-64 w-auto "
                    />
                  ))}
                  
                  {/* Show message if no enabled wallets */}
                  {enabledWallets.length === 0 && (
                    <div className="text-gray-500 text-center w-full py-8">
                      <p>No enabled wallets to display.</p>
                      <p className="text-sm">Enable wallets in your configuration to see them here.</p>
                    </div>
                  )}
                  
                  {/* Show count of disabled wallets */}
                  {wallets.length > enabledWallets.length && (
                    <div className="text-xs text-gray-400 w-full text-center mt-2">
                      {wallets.length - enabledWallets.length} wallet{wallets.length - enabledWallets.length !== 1 ? 's' : ''} disabled
                    </div>
                  )}
                </div>
            </div>

            {/* Debug button */}
            <button 
                onClick={() => {
                    console.log('Current portfolio totals:', portfolioTotals);
                    console.log('Total wallets:', wallets.length);
                    console.log('Enabled wallets:', enabledWallets.length);
                    console.log('Disabled wallets:', wallets.length - enabledWallets.length);
                    console.log('Enabled wallet details:', enabledWallets.map(w => ({ id: w.id, name: w.name })));
                }} 
                className="px-3 py-1 bg-gray-100 rounded-md text-sm mt-4"
            >
                Debug Totals & Wallets
            </button>
        </div>
    );
};

export default Portfolio;











