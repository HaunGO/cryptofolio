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

