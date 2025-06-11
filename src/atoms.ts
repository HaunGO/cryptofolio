import { atom } from "recoil";
import { CoinData, Wallet } from './types';

interface CoinState {
  key: number;
  name: string;
  amount: number;
  usdValue: number;
  btcValue: number;
  bananaValue: number;
  fullData: Record<string, any>;
}

export const myCoins = atom<CoinState[]>({
  key: "myCoins-key",
  default: [{
    key: 0,
    name: '',
    amount: 0,
    usdValue: 0,
    btcValue: 0,
    bananaValue: 0,
    fullData: {},
  }]
});

export const Billfolds = atom<Wallet[]>({
  key: "wallets-key",
  default: []
});

export const StoredResponseData = atom<CoinData[]>({
  key: "StoredResponseData-key",
  default: [{
    asset_id: '',
    name: '',
    price_usd: 0,
    type_is_crypto: 0,
    data_quote_start: '',
    data_quote_end: '',
    data_orderbook_start: '',
    data_orderbook_end: '',
    data_trade_start: '',
    data_trade_end: '',
    data_symbols_count: 0,
    volume_1hrs_usd: 0,
    volume_1day_usd: 0,
    volume_1mth_usd: 0,
    id_icon: '',
    data_start: '',
    data_end: '',
  }]
});



