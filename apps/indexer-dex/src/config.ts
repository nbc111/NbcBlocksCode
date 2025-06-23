import { cleanEnv, str, num } from 'envalid';

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
  DB_URL: str({ default: '' }),
  DB_CA: str({ default: '' }),
  DB_CERT: str({ default: '' }),
  DB_KEY: str({ default: '' }),
  SENTRY_DSN: str({ default: '' }),
  DATA_SOURCE: str({ choices: [DataSource.FAST_NEAR, DataSource.NEAR_LAKE], default: DataSource.NEAR_LAKE }),
  DELTA: num({ default: 1000 }),
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
  network: env.NETWORK_ID as Network,
  preloadSize: 100,
  s3BucketName: env.S3_BUCKET,
  s3RegionName: env.S3_REGION,
  startBlockHeight: 45_753_330,
  dbUrl: env.DB_URL || `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  dbCa: env.DB_CA,
  dbCert: env.DB_CERT,
  dbKey: env.DB_KEY,
  sentryDsn: env.SENTRY_DSN,
  dataSource: env.DATA_SOURCE,
  delta: env.DELTA,
} as const;
