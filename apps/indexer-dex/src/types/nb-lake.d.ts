declare module 'nb-lake' {
  export namespace types {
    export interface StreamerMessage {
      block: BlockHeader;
      shards: Shard[];
    }

    export interface BlockHeader {
      height: number;
      timestampNanosec: string;
      hash: string;
      timestamp?: number;
    }

    export interface Shard {
      receiptExecutionOutcomes: ExecutionOutcomeWithReceipt[];
      stateChanges?: StateChange[];
      chunk?: {
        header: {
          height: number;
          shardId: number;
        };
      };
    }

    export interface ExecutionOutcomeWithReceipt {
      receipt: {
        predecessorId: string;
        receiverId: string;
        receiptId: string;
        receiptActions: Action[];
      };
      executionOutcome: {
        status: ExecutionStatus;
        logs: string[];
      };
    }

    export interface ExecutionStatus {
      type: 'SuccessValue' | 'Failure';
    }

    export interface Action {
      type: 'FunctionCall';
      FunctionCall: {
        methodName: string;
        args: string;
      };
    }

    export interface EndpointConfig {
      hostname: string;
      path: string;
      port: number;
      protocol: string;
      network: string;
      startBlockHeight: number;
      s3BucketName: string;
      s3RegionName: string;
    }

    export interface LakeConfig {
      blocksPreloadPoolSize?: number;
      fetchBlocks?: boolean;
      s3ForcePathStyle?: boolean;
      s3Endpoint?: string;
    }

    export interface StateChange {
      cause: {
        type: string;
        transactionHash?: string;
      };
      change: {
        type: string;
        accountId: string;
        codeBase64?: string;
      };
    }

    export interface IndexerTransactionWithOutcome {
      transaction: {
        signerId: string;
        receiverId: string;
        actions: Action[];
      };
      outcome: {
        status: ExecutionStatus;
        logs: string[];
      };
    }
  }

  export function stream(options: types.EndpointConfig): AsyncGenerator<types.StreamerMessage>;
} 