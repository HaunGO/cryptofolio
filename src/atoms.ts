import { atom } from "recoil";
// import { wallet } from './types'; 
type Coins = [{
    key:number, 
    name:string, 
    amount:number, 
    usdValue:number,
    btcValue:number, 
    bananaValue:number, 
    fullData:object,
}]
export const myCoins = atom<Coins>({
    key: "myCoins-key",
    // default: [{ USD:0, BTC:0, XRP:0, THETA:0 }],
    default: [{
        key: 0, 
        name: '', 
        amount: 0, 
        usdValue: 0,
        btcValue: 0, 
        bananaValue: 0,     
        fullData:{},
    }]
});
// 
// 
// 
 
export type Wallet = {
    id:number;
    name:string,
    description:string,
    coins:Array<Object>,
    coinData:Array<Object>
    usdValue:number,
    btcValue:number,
    bananaValue:number,
}


// export let myWallets = atom<Wallet[]>({
export let Billfolds = atom<Wallet[]>({
    key: "wallets-key",
    default: [
        // {   id : 0,
        //     name : "This is the wallet name;]", 
        //     usdValue: 0,
        //     btcValue: 0,
        //     bananaValue: 0,
        //     // coins: { USD:1, CAD:2, BTC:0.3, XRP:1300, THETA:1600 } 
        //     // coins: [{ USD:1, CAD:2, BTC:0.3, XRP:1300, THETA:1600 }], 
        //     coins: [{ USD:1, CAD:2, BTC:0.3, XRP:1300, THETA:1600 }], 
        //     holdings:[],
        // }, 
        // {   id : 1,
        //     name : "Dis wal nam", 
        //     usdValue: 0,
        //     btcValue: 0,
        //     bananaValue: 0,
        //     coins: [{ BTC:1, XRP:100, THETA:500 }],
        //     holdings:[],
        // }, 
    ]
});



type StoredResponse = {
    asset_id : string,
    name : string,
    price_usd :number,
    type_is_crypto : number,
    data_quote_start : string,
    data_quote_end : string,
    data_orderbook_start : string,
    data_orderbook_end : string,
    data_trade_start : string,
    data_trade_end : string,
    data_symbols_count : number,
    volume_1hrs_usd : number,
    volume_1day_usd : number,
    volume_1mth_usd : number,
    id_icon : string,
    data_start : string,
    data_end : string,
}


export const StoredResponseData = atom<StoredResponse[]>({
    key: "StoredResponseData-key",
    default: [{
        asset_id : '',
        name : '',
        price_usd : 0,
        type_is_crypto : 0,
        data_quote_start : '',
        data_quote_end : '',
        data_orderbook_start : '',
        data_orderbook_end : '',
        data_trade_start : '',
        data_trade_end : '',
        data_symbols_count : 0,
        volume_1hrs_usd : 0,
        volume_1day_usd : 0,
        volume_1mth_usd : 0,
        id_icon : '',
        data_start : '',
        data_end : '',
    }]
})
 

 
    