import React from 'react';
import {
    useRecoilState,
    // useRecoilValue,
} from 'recoil';
  
// import Dashboard from './Dashboard'
import Wallet from './Wallet'
 
import { Billfolds } from '../atoms'

const Portfolio: React.FC = () => {
    // Only use the wallets from Recoil state (loaded by App.tsx)
    const [wallets] = useRecoilState(Billfolds);
    
    return (
        <div className="relative flex flex-row min-h-screen">
            {/* <Dashboard /> */}
      
            <div className="" >
                <h2 className="text-2xl font-bold mb-6">Your Wallets</h2>
                
                <div className=" flex flex-inline flex-wrap">
                  {wallets.map((wallet) => (
                    <Wallet 
                      key={wallet.id} 
                      wallet={wallet} 
                      className="hover:shadow-lg transition-all duration-300 rounded-lg"
                    />
                  ))}
                </div>
              </div>
        </div>
    );
};

export default Portfolio;











