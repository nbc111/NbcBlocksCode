import { stream, types } from 'nb-lake';
import { logger } from 'nb-logger';
import { streamBlock } from 'nb-neardata';
import { Network } from 'nb-types';

import { config } from '#config';
import knex from '#libs/knex';
import sentry from '#libs/sentry';
import { syncRefFinance } from './contracts/v2.ref-finance.near.js';
import { DataSource } from '#types/enum';

const dexKey = 'dex';
const lakeConfig: types.EndpointConfig = {
  hostname: config.API_URL,
  path: '/',
  port: 443,
  protocol: 'https',
  network: config.network as Network,
  startBlockHeight: config.startBlockHeight,
  s3BucketName: config.s3BucketName,
  s3RegionName: config.s3RegionName,
};

if (config.S3_ENDPOINT) {
  // 注意：EndpointConfig 没有 s3ForcePathStyle 和 s3Endpoint 属性
  // 这些可能需要通过其他方式设置
}

export const syncData = async () => {
  const settings = await knex('settings').where({ key: dexKey }).first();
  const latestBlock = settings?.value?.sync;
  let startBlockHeight = config.startBlockHeight;

  if (latestBlock) {
    const next = +latestBlock - config.delta;

    if (next > startBlockHeight) {
      logger.info(`last synced block: ${latestBlock}`);
      logger.info(`syncing from block: ${next}`);
      startBlockHeight = next;
      lakeConfig.startBlockHeight = next;
    }
  }

  if (config.dataSource === DataSource.FAST_NEAR) {
    const stream = streamBlock({
      network: config.network,
      start: startBlockHeight,
    });

    for await (const message of stream) {
      await onMessage(message);
    }

    stream.on('end', () => {
      logger.error('stream ended');
      process.exit();
    });
    stream.on('error', (error: Error) => {
      logger.error(error);
      process.exit();
    });
  } else {
    for await (const message of stream(lakeConfig)) {
      await onMessage(message);
    }
  }
};

export const onMessage = async (message: types.StreamerMessage) => {
  try {
    if (message.block.height % 1000 === 0) {
      logger.info(`syncing block: ${message.block.height}`);
    }

    await syncRefFinance(message);

    if (message.block.height % 100 === 0) {
      await knex('settings')
        .insert({
          key: dexKey,
          value: { sync: message.block.height },
        })
        .onConflict('key')
        .merge();
    }
  } catch (error) {
    logger.error(
      `aborting... block ${message.block.height} ${message.block.hash}`,
    );
    logger.error(error);
    sentry.captureException(error);
    process.exit();
  }
};
