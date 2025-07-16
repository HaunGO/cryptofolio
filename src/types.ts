export interface CoinData {
  asset_id: string;
  name: string;
  price_usd: number;
  type_is_crypto: number;
  data_quote_start: string;
  data_quote_end: string;
  data_orderbook_start: string;
  data_orderbook_end: string;
  data_trade_start: string;
  data_trade_end: string;
  data_symbols_count: number;
  volume_1hrs_usd: number;
  volume_1day_usd: number;
  volume_1mth_usd: number;
  id_icon: string;
  data_start: string;
  data_end: string;
}

export interface CoinProps {
  name: string;
  amount: number;
}

export interface Wallet {
  id: number;
  name: string;
  description: string;
  disabled: boolean;
  coins: Record<string, number>[];
  coinData: CoinData[];
  usdValue: number;
  btcValue: number;
  bananaValue: number;
}
