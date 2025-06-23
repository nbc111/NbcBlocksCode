import { DexPairs, DexEventType, Network } from 'nb-types';

import { DataSource } from './enum.js';

export interface Config {
  API_URL: string;
  API_ACCESS_KEY: string;
  BOS_NETWORK: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_USER: string;
  MAINNET_URL: string;
  NEAR_TOKEN: string;
  NETWORK_ID: string;
  S3_BUCKET: string;
  S3_ENDPOINT: string;
  S3_REGION: string;
  STABLE_TOKENS: string[];
  TESTNET_URL: string;
  network: Network;
  preloadSize: number;
  s3BucketName: string;
  s3RegionName: string;
  startBlockHeight: number;
  dbUrl: string;
  dbCa: string;
  dbCert: string;
  dbKey: string;
  sentryDsn: string;
  dataSource: DataSource;
  delta: number;
}

export interface SwapArgs {
  min_amount_out: string;
  pool_id: number;
  token_in: string;
  token_out: string;
}

export interface FtOnTransferArgs {
  amount: string;
  msg: string;
  receiver_id: string;
  sender_id: string;
}

export interface PoolArgs {
  pool_id: number;
}

export interface Action {
  pool_id: number;
}

export interface Swap {
  amount0: string;
  amount1: string;
  maker: string;
  pool: string;
  receipt: string;
  timestamp: number;
  token0: string;
  token1: string;
  pool_id: number;
}

export interface DexEvents {
  amount_usd: string;
  base_amount: string;
  event_index: string;
  maker: string;
  pair_id: string;
  price_token: string;
  price_usd: string;
  quote_amount: string;
  receipt_id: string;
  timestamp: string;
  token0: string;
  token1: string;
  type: DexEventType;
}

export type SwapPair = {
  baseAmount: string;
  baseToken: string;
  quoteAmount: string;
  quoteToken: string;
};

export type DexPairMeta = DexPairs & {
  baseDecimal: number;
  quoteDecimal: number;
};
