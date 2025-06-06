import { types } from 'nb-lake';
import { DexPairs, Network, DexEventType } from 'nb-types';

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
  network: string;
  preloadSize: number;
  s3BucketName: string;
  s3RegionName: string;
  startBlockHeight: number;
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
  amount_usd: number;
  maker: string;
  pair_id: string;
  receipt_id: string;
  timestamp: number;
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
