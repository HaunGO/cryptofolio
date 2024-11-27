import React, {useEffect} from 'react';
// import axios from 'axios';
import {
    // RecoilRoot,
    // atom,
    // selector,
    useRecoilState,
    // useRecoilValue,
  } from 'recoil';
  
 

import { 
    // myCoins, 
    // StoredResponseData, 
    Billfolds 
} from '../atoms'

// import { Wallet } from '../atoms'


const Dashboard: React.FC = () => {
    useEffect(() => {
        // console.log('honk')
    }, [])
    const [wallets, setMyWallets] = useRecoilState(Billfolds);
    // const respData = useRecoilState(StoredResponseData);    
 

    const onChange = (event:any) => {
        
        const thisCoin = event.target.dataset.coin;
        const thisValue = event.target.value;
        const walId = event.target.dataset.wallet;
        // const thisWallet = {...wallets[walId]};
       
        // const dupeWs: any[] = wallets.map((wal, index, arr) => ({ ...wal }));

        let newWallets = wallets.map(wallet => {
            console.log('isTrue?? ', wallet.id === walId);
            console.log(typeof thisCoin, thisCoin);
            if (wallet.id === walId) {
                let newCoins = {...wallet.coins[0], [thisCoin]: Number(thisValue)};
                console.log('newCoins', newCoins);
                return {...wallet, coins: [newCoins]};
            } else {
                return wallet;
            }
        });        

        setMyWallets(newWallets)
    };    

    return (     
        <div className='bg-gray-300 w-3/12 h-full p-2 absolute right-0 top-0'>            
            <p>(via recoil atom)</p>
            { 
                wallets.map((w) => {
                    return <div className='text-left mb-4' key={w.id}>

                        <p><strong>{w.name}</strong></p>
                        <p><i>{w.description}</i></p>
                        <div>
                            <select name="" id="">
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select> : &nbsp;
                            <input type="number" /></div>
                        {   
                            Object.entries(w.coins[0]).map(([key, value], index) => (
                                
                                <div key={index}>{key} : 
                                                
                                    <input type="number"    
                                        className="bg-gray-200 m-1 px-1 "
                                        data-coin={key}
                                        data-wallet={w.id} 
                                        value={value} 
                                        onChange={onChange.bind(key)} 
                                        />

                                </div>
                            ))

                        }
                        <hr />
                    </div>
                })
            }
        </div>
    );
};
export default Dashboard;