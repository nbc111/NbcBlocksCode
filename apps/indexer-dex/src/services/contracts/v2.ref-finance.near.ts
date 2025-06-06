import { types } from 'nb-lake';
import { logger } from 'nb-logger';
import { DexEventType } from 'nb-types';

import { config } from '../../config.js';
import { DexEvents, Swap, SwapArgs } from '../../types/types.js';
import { knex } from '../db.js';

const CONTRACT = 'v2.ref-finance.near';
const EVENT_INDEX = '0';
const POOL_METHOD = 'get_pool';
const SWAP_METHODS = ['swap', 'ft_on_transfer'];

export async function syncRefFinance(message: types.StreamerMessage): Promise<void> {
  const { shards } = message;

  for (const shard of shards) {
    const { receiptExecutionOutcomes } = shard;

    for (const outcome of receiptExecutionOutcomes) {
      const { receipt, executionOutcome } = outcome;
      const { predecessorId, receiverId } = receipt;
      const { status, logs } = executionOutcome;

      if (receiverId !== CONTRACT) {
        continue;
      }

      if (status.type !== 'SuccessValue') {
        continue;
      }

      for (const receiptAction of receipt.receiptActions) {
        if (receiptAction.type !== 'FunctionCall') {
          continue;
        }

        const { methodName, args } = receiptAction.FunctionCall;

        if (!SWAP_METHODS.includes(methodName)) {
          continue;
        }

        for (const log of logs) {
          if (!log.includes(EVENT_INDEX)) {
            continue;
          }

          const swapArgs = JSON.parse(Buffer.from(args, 'base64').toString()) as SwapArgs;
          const swap = getSwap(swapArgs, log, predecessorId);

          if (!swap) {
            continue;
          }

          const pool = await getPool(swap.pool_id);

          if (!pool) {
            continue;
          }

          const swapEvent: DexEvents = {
            amount_usd: 0,
            maker: swap.maker,
            pair_id: pool,
            receipt_id: receipt.receiptId,
            timestamp: Date.now(),
            token0: swap.token0,
            token1: swap.token1,
            type: DexEventType.SWAP,
          };

          await knex('dex_events').insert(swapEvent);
        }
      }
    }
  }
}

function getSwap(args: SwapArgs, log: string, maker: string): Swap | undefined {
  try {
    const [token0, token1] = log.split('|')[1].split(',');

    return {
      amount0: '0',
      amount1: '0',
      maker,
      pool: '',
      receipt: '',
      timestamp: Date.now(),
      token0,
      token1,
      pool_id: args.pool_id,
    };
  } catch (error) {
    logger.error({ error, log }, 'Failed to parse swap');
    return undefined;
  }
}

async function getPool(poolId: number): Promise<string | undefined> {
  try {
    const response = await fetch(config.API_URL, {
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'call_function',
          finality: 'final',
          account_id: CONTRACT,
          method_name: POOL_METHOD,
          args_base64: Buffer.from(JSON.stringify({ pool_id: poolId })).toString('base64'),
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const data = await response.json() as { result: { result: string } };

    if (!data.result.result) {
      return undefined;
    }

    const pool = JSON.parse(Buffer.from(data.result.result).toString());

    return pool.id;
  } catch (error) {
    logger.error({ error, poolId }, 'Failed to get pool');
    return undefined;
  }
}
