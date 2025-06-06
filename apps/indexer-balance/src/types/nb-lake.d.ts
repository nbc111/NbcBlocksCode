declare module 'nb-lake' {
  export namespace types {
    export interface StreamerMessage {
      block: {
        header: BlockHeader;
      };
      shards: Shard[];
    }

    export interface BlockHeader {
      height: number;
      timestampNanosec: string;
      hash: string;
    }

    export interface Shard {
      receiptExecutionOutcomes: ExecutionOutcomeWithReceipt[];
      stateChanges?: StateChange[];
      chunk?: {
        shardId: number;
      };
    }

    export interface ExecutionOutcomeWithReceipt {
      executionOutcome: {
        id: string;
        outcome: {
          status: ExecutionStatus;
          logs: string[];
        };
      };
      receipt?: {
        receipt: {
          Action: {
            signerId: string;
            actions: Action[];
          };
        };
        receiverId: string;
        predecessorId: string;
        receiptId: string;
      };
    }

    export type ExecutionStatus = string | { SuccessValue: string };

    export type Action = string | {
      FunctionCall: {
        methodName: string;
        args: string;
      };
    };

    export interface EndpointConfig {
      network: string;
      startBlockHeight: number;
      s3BucketName: string;
      s3RegionName: string;
      hostname?: string;
      path?: string;
      port?: number;
      protocol?: string;
    }

    export interface LakeConfig {
      network: string;
      startBlockHeight: number;
      s3BucketName: string;
      s3RegionName: string;
      blocksPreloadPoolSize?: number;
      fetchBlocks?: (block: number, limit: number) => Promise<number[]>;
      s3ForcePathStyle?: boolean;
      s3Endpoint?: string;
    }

    export interface StateChange {
      cause: {
        type: string;
        receiptHash: string;
      };
      type: string;
      change: {
        accountId: string;
        amount: string;
        codeHash: string;
        locked: string;
        storagePaidAt: number;
        storageUsage: number;
      };
    }

    export interface IndexerTransactionWithOutcome {
      block: {
        header: BlockHeader;
      };
    }
  }

  export function stream(options: types.EndpointConfig): AsyncGenerator<types.StreamerMessage>;
} 