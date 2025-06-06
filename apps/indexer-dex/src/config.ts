import { cleanEnv, str, num } from 'envalid';

import { types } from 'nb-lake';
import { Network } from 'nb-types';

import { DataSource } from './types/enum.js';
import { Config } from './types/types.js';

const env = cleanEnv(process.env, {
  API_URL: str(),
  API_ACCESS_KEY: str(),
  BOS_NETWORK: str(),
  DB_HOST: str(),
  DB_NAME: str(),
  DB_PASSWORD: str(),
  DB_PORT: num(),
  DB_USER: str(),
  MAINNET_URL: str(),
  NEAR_TOKEN: str(),
  NETWORK_ID: str({ choices: [Network.MAINNET, Network.TESTNET] }),
  S3_BUCKET: str(),
  S3_ENDPOINT: str({ default: '' }),
  S3_REGION: str(),
  STABLE_TOKENS: str({ default: '[]' }),
  TESTNET_URL: str(),
});

const stableTokens = JSON.parse(env.STABLE_TOKENS) as string[];

export const config: Config = {
  API_URL: env.API_URL,
  API_ACCESS_KEY: env.API_ACCESS_KEY,
  BOS_NETWORK: env.BOS_NETWORK,
  DB_HOST: env.DB_HOST,
  DB_NAME: env.DB_NAME,
  DB_PASSWORD: env.DB_PASSWORD,
  DB_PORT: env.DB_PORT,
  DB_USER: env.DB_USER,
  MAINNET_URL: env.MAINNET_URL,
  NEAR_TOKEN: env.NEAR_TOKEN,
  NETWORK_ID: env.NETWORK_ID,
  S3_BUCKET: env.S3_BUCKET,
  S3_ENDPOINT: env.S3_ENDPOINT,
  S3_REGION: env.S3_REGION,
  STABLE_TOKENS: stableTokens,
  TESTNET_URL: env.TESTNET_URL,
  network: env.NETWORK_ID,
  preloadSize: 100,
  s3BucketName: env.S3_BUCKET,
  s3RegionName: env.S3_REGION,
  startBlockHeight: 45_753_330,
} as const;
