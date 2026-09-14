export * from './abis.js';
import { type Address } from 'viem';
export interface ContractAddresses {
    iam: Address;
    nft: Address;
    anchor: Address;
    recovery: Address;
}
export declare const amoyChain: {
    blockExplorers: {
        readonly default: {
            readonly name: "PolygonScan";
            readonly url: "https://amoy.polygonscan.com";
        };
    };
    blockTime?: number | undefined | undefined;
    contracts?: {
        [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
            [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 80002;
    name: "Polygon Amoy";
    nativeCurrency: {
        readonly name: "MATIC";
        readonly symbol: "MATIC";
        readonly decimals: 18;
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc-amoy.polygon.technology"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc-amoy.polygon.technology"];
        };
    };
    sourceId?: number | undefined | undefined;
    supportsTransactionReplacementDetection?: boolean | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    extendSchema?: Record<string, unknown> | undefined;
    fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
    formatters?: undefined;
    prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
        client: import("viem", { with: { "resolution-mode": "import" } }).Client;
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
        client: import("viem", { with: { "resolution-mode": "import" } }).Client;
        phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
    }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
        runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
    }] | undefined;
    serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
    verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
};
export declare function getPublicClient(rpcUrl?: string): {
    account: undefined;
    batch?: {
        multicall?: boolean | import("viem", { with: { "resolution-mode": "import" } }).Prettify<import("viem", { with: { "resolution-mode": "import" } }).MulticallBatchOptions> | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: (parameters: import("viem", { with: { "resolution-mode": "import" } }).CcipRequestParameters) => Promise<import("../../../node_modules/viem/_types/utils/ccip.js", { with: { "resolution-mode": "import" } }).CcipRequestReturnType>;
    } | undefined;
    chain: {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    };
    dataSuffix?: import("viem", { with: { "resolution-mode": "import" } }).DataSuffix | undefined;
    experimental_blockTag?: import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined;
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem", { with: { "resolution-mode": "import" } }).EIP1193RequestFn<import("viem", { with: { "resolution-mode": "import" } }).PublicRpcSchema>;
    tokens: undefined;
    transport: import("viem", { with: { "resolution-mode": "import" } }).TransportConfig<"http", import("viem", { with: { "resolution-mode": "import" } }).EIP1193RequestFn> & {
        fetchOptions?: import("viem", { with: { "resolution-mode": "import" } }).HttpTransportConfig["fetchOptions"] | undefined;
        url?: string | undefined;
    };
    type: string;
    uid: string;
    call: (parameters: import("viem", { with: { "resolution-mode": "import" } }).CallParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).CallReturnType>;
    createAccessList: (parameters: import("viem", { with: { "resolution-mode": "import" } }).CreateAccessListParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }>) => Promise<{
        accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
        gasUsed: bigint;
    }>;
    createBlockFilter: () => Promise<import("viem", { with: { "resolution-mode": "import" } }).CreateBlockFilterReturnType>;
    createContractEventFilter: <const abi extends import("viem", { with: { "resolution-mode": "import" } }).Abi | readonly unknown[], eventName extends import("viem", { with: { "resolution-mode": "import" } }).ContractEventName<abi> | undefined, args extends import("viem", { with: { "resolution-mode": "import" } }).MaybeExtractEventArgsFromAbi<abi, eventName> | undefined, strict extends boolean | undefined = undefined, fromBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined, toBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).CreateContractEventFilterParameters<abi, eventName, args, strict, fromBlock, toBlock>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).CreateContractEventFilterReturnType<abi, eventName, args, strict, fromBlock, toBlock>>;
    createEventFilter: <const abiEvent extends import("viem", { with: { "resolution-mode": "import" } }).AbiEvent | undefined = undefined, const abiEvents extends readonly import("viem", { with: { "resolution-mode": "import" } }).AbiEvent[] | readonly unknown[] | undefined = abiEvent extends import("viem", { with: { "resolution-mode": "import" } }).AbiEvent ? [abiEvent] : undefined, strict extends boolean | undefined = undefined, fromBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined, toBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined, _EventName extends string | undefined = import("viem", { with: { "resolution-mode": "import" } }).MaybeAbiEventName<abiEvent>, _Args extends import("viem", { with: { "resolution-mode": "import" } }).MaybeExtractEventArgsFromAbi<abiEvents, _EventName> | undefined = undefined>(args?: import("viem", { with: { "resolution-mode": "import" } }).CreateEventFilterParameters<abiEvent, abiEvents, strict, fromBlock, toBlock, _EventName, _Args> | undefined) => Promise<import("viem", { with: { "resolution-mode": "import" } }).CreateEventFilterReturnType<abiEvent, abiEvents, strict, fromBlock, toBlock, _EventName, _Args>>;
    createPendingTransactionFilter: () => Promise<import("viem", { with: { "resolution-mode": "import" } }).CreatePendingTransactionFilterReturnType>;
    estimateContractGas: <chain extends import("viem", { with: { "resolution-mode": "import" } }).Chain | undefined, const abi extends import("viem", { with: { "resolution-mode": "import" } }).Abi | readonly unknown[], functionName extends import("viem", { with: { "resolution-mode": "import" } }).ContractFunctionName<abi, "nonpayable" | "payable">, args extends import("viem", { with: { "resolution-mode": "import" } }).ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>>(args: import("viem", { with: { "resolution-mode": "import" } }).EstimateContractGasParameters<abi, functionName, args, chain>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).EstimateContractGasReturnType>;
    estimateGas: (args: import("viem", { with: { "resolution-mode": "import" } }).EstimateGasParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).EstimateGasReturnType>;
    fillTransaction: <chainOverride extends import("viem", { with: { "resolution-mode": "import" } }).Chain | undefined = undefined, accountOverride extends import("viem", { with: { "resolution-mode": "import" } }).Account | Address | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).FillTransactionParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, chainOverride, accountOverride>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).FillTransactionReturnType<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>>;
    getBalance: (args: import("viem", { with: { "resolution-mode": "import" } }).GetBalanceParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetBalanceReturnType>;
    getBlobBaseFee: () => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetBlobBaseFeeReturnType>;
    getBlock: <includeTransactions extends boolean = false, blockTag extends import("viem", { with: { "resolution-mode": "import" } }).BlockTag = "latest">(args?: import("viem", { with: { "resolution-mode": "import" } }).GetBlockParameters<includeTransactions, blockTag> | undefined) => Promise<{
        number: blockTag extends "pending" ? null : bigint;
        hash: blockTag extends "pending" ? null : `0x${string}`;
        nonce: blockTag extends "pending" ? null : `0x${string}`;
        logsBloom: blockTag extends "pending" ? null : `0x${string}`;
        baseFeePerGas: bigint | null;
        blobGasUsed: bigint;
        difficulty: bigint;
        excessBlobGas: bigint;
        extraData: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        gasLimit: bigint;
        gasUsed: bigint;
        miner: Address;
        mixHash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        parentBeaconBlockRoot?: `0x${string}` | undefined;
        parentHash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        receiptsRoot: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        sealFields: import("viem", { with: { "resolution-mode": "import" } }).Hex[];
        sha3Uncles: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        size: bigint;
        stateRoot: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        timestamp: bigint;
        totalDifficulty: bigint | null;
        transactionsRoot: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        uncles: import("viem", { with: { "resolution-mode": "import" } }).Hash[];
        withdrawals?: import("viem", { with: { "resolution-mode": "import" } }).Withdrawal[] | undefined | undefined;
        withdrawalsRoot?: `0x${string}` | undefined;
        transactions: includeTransactions extends true ? ({
            r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            v: bigint;
            yParity?: undefined | undefined;
            blockTimestamp?: bigint | undefined;
            from: Address;
            gas: bigint;
            hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
            input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            nonce: number;
            to: Address | null;
            typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
            value: bigint;
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            chainId?: number | undefined;
            type: "legacy";
            gasPrice: bigint;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T ? T extends (blockTag extends "pending" ? true : false) ? T extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_1 ? T_1 extends (blockTag extends "pending" ? true : false) ? T_1 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_2 ? T_2 extends (blockTag extends "pending" ? true : false) ? T_2 extends true ? null : number : never : never;
        } | {
            r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            v: bigint;
            yParity: number;
            blockTimestamp?: bigint | undefined;
            from: Address;
            gas: bigint;
            hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
            input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            nonce: number;
            to: Address | null;
            typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
            value: bigint;
            accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
            authorizationList?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            chainId: number;
            type: "eip2930";
            gasPrice: bigint;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T_3 ? T_3 extends (blockTag extends "pending" ? true : false) ? T_3 extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_4 ? T_4 extends (blockTag extends "pending" ? true : false) ? T_4 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_5 ? T_5 extends (blockTag extends "pending" ? true : false) ? T_5 extends true ? null : number : never : never;
        } | {
            r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            v: bigint;
            yParity: number;
            blockTimestamp?: bigint | undefined;
            from: Address;
            gas: bigint;
            hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
            input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            nonce: number;
            to: Address | null;
            typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
            value: bigint;
            accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
            authorizationList?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            chainId: number;
            type: "eip1559";
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T_6 ? T_6 extends (blockTag extends "pending" ? true : false) ? T_6 extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_7 ? T_7 extends (blockTag extends "pending" ? true : false) ? T_7 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_8 ? T_8 extends (blockTag extends "pending" ? true : false) ? T_8 extends true ? null : number : never : never;
        } | {
            r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            v: bigint;
            yParity: number;
            blockTimestamp?: bigint | undefined;
            from: Address;
            gas: bigint;
            hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
            input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            nonce: number;
            to: Address | null;
            typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
            value: bigint;
            accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
            authorizationList?: undefined | undefined;
            blobVersionedHashes: readonly import("viem", { with: { "resolution-mode": "import" } }).Hex[];
            chainId: number;
            type: "eip4844";
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas: bigint;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T_9 ? T_9 extends (blockTag extends "pending" ? true : false) ? T_9 extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_10 ? T_10 extends (blockTag extends "pending" ? true : false) ? T_10 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_11 ? T_11 extends (blockTag extends "pending" ? true : false) ? T_11 extends true ? null : number : never : never;
        } | {
            r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            v: bigint;
            yParity: number;
            blockTimestamp?: bigint | undefined;
            from: Address;
            gas: bigint;
            hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
            input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
            nonce: number;
            to: Address | null;
            typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
            value: bigint;
            accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList;
            blobVersionedHashes?: undefined | undefined;
            chainId: number;
            type: "eip7702";
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T_12 ? T_12 extends (blockTag extends "pending" ? true : false) ? T_12 extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_13 ? T_13 extends (blockTag extends "pending" ? true : false) ? T_13 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_14 ? T_14 extends (blockTag extends "pending" ? true : false) ? T_14 extends true ? null : number : never : never;
        })[] : `0x${string}`[];
    }>;
    getBlockReceipts: (args?: import("viem", { with: { "resolution-mode": "import" } }).GetBlockReceiptsParameters | undefined) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetBlockReceiptsReturnType<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }>>;
    getBlockNumber: (args?: import("viem", { with: { "resolution-mode": "import" } }).GetBlockNumberParameters | undefined) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetBlockNumberReturnType>;
    getBlockTransactionCount: (args?: import("viem", { with: { "resolution-mode": "import" } }).GetBlockTransactionCountParameters | undefined) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetBlockTransactionCountReturnType>;
    getBytecode: (args: import("viem", { with: { "resolution-mode": "import" } }).GetBytecodeParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetBytecodeReturnType>;
    getChainId: () => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetChainIdReturnType>;
    getCode: (args: import("viem", { with: { "resolution-mode": "import" } }).GetBytecodeParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetBytecodeReturnType>;
    getContractEvents: <const abi extends import("viem", { with: { "resolution-mode": "import" } }).Abi | readonly unknown[], eventName extends import("viem", { with: { "resolution-mode": "import" } }).ContractEventName<abi> | undefined = undefined, strict extends boolean | undefined = undefined, fromBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined, toBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).GetContractEventsParameters<abi, eventName, strict, fromBlock, toBlock>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetContractEventsReturnType<abi, eventName, strict, fromBlock, toBlock>>;
    getDelegation: (args: import("viem", { with: { "resolution-mode": "import" } }).GetDelegationParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetDelegationReturnType>;
    getEip712Domain: (args: import("viem", { with: { "resolution-mode": "import" } }).GetEip712DomainParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetEip712DomainReturnType>;
    getEnsAddress: (args: import("viem", { with: { "resolution-mode": "import" } }).GetEnsAddressParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetEnsAddressReturnType>;
    getEnsAvatar: (args: import("viem", { with: { "resolution-mode": "import" } }).GetEnsAvatarParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetEnsAvatarReturnType>;
    getEnsName: (args: import("viem", { with: { "resolution-mode": "import" } }).GetEnsNameParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetEnsNameReturnType>;
    getEnsResolver: (args: import("viem", { with: { "resolution-mode": "import" } }).GetEnsResolverParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetEnsResolverReturnType>;
    getEnsText: (args: import("viem", { with: { "resolution-mode": "import" } }).GetEnsTextParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetEnsTextReturnType>;
    getFeeHistory: (args: import("viem", { with: { "resolution-mode": "import" } }).GetFeeHistoryParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetFeeHistoryReturnType>;
    estimateFeesPerGas: <chainOverride extends import("viem", { with: { "resolution-mode": "import" } }).Chain | undefined = undefined, type extends import("viem", { with: { "resolution-mode": "import" } }).FeeValuesType = "eip1559">(args?: import("viem", { with: { "resolution-mode": "import" } }).EstimateFeesPerGasParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride, type> | undefined) => Promise<import("viem", { with: { "resolution-mode": "import" } }).EstimateFeesPerGasReturnType<type>>;
    getFilterChanges: <filterType extends import("viem", { with: { "resolution-mode": "import" } }).FilterType, const abi extends import("viem", { with: { "resolution-mode": "import" } }).Abi | readonly unknown[] | undefined, eventName extends string | undefined, strict extends boolean | undefined = undefined, fromBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined, toBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).GetFilterChangesParameters<filterType, abi, eventName, strict, fromBlock, toBlock>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetFilterChangesReturnType<filterType, abi, eventName, strict, fromBlock, toBlock>>;
    getFilterLogs: <const abi extends import("viem", { with: { "resolution-mode": "import" } }).Abi | readonly unknown[] | undefined, eventName extends string | undefined, strict extends boolean | undefined = undefined, fromBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined, toBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).GetFilterLogsParameters<abi, eventName, strict, fromBlock, toBlock>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetFilterLogsReturnType<abi, eventName, strict, fromBlock, toBlock>>;
    getGasPrice: () => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetGasPriceReturnType>;
    getLogs: <const abiEvent extends import("viem", { with: { "resolution-mode": "import" } }).AbiEvent | undefined = undefined, const abiEvents extends readonly import("viem", { with: { "resolution-mode": "import" } }).AbiEvent[] | readonly unknown[] | undefined = abiEvent extends import("viem", { with: { "resolution-mode": "import" } }).AbiEvent ? [abiEvent] : undefined, strict extends boolean | undefined = undefined, fromBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined, toBlock extends import("viem", { with: { "resolution-mode": "import" } }).BlockNumber | import("viem", { with: { "resolution-mode": "import" } }).BlockTag | undefined = undefined>(args?: import("viem", { with: { "resolution-mode": "import" } }).GetLogsParameters<abiEvent, abiEvents, strict, fromBlock, toBlock> | undefined) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetLogsReturnType<abiEvent, abiEvents, strict, fromBlock, toBlock>>;
    getProof: (args: import("viem", { with: { "resolution-mode": "import" } }).GetProofParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetProofReturnType>;
    estimateMaxPriorityFeePerGas: <chainOverride extends import("viem", { with: { "resolution-mode": "import" } }).Chain | undefined = undefined>(args?: {
        chain?: chainOverride | null | undefined;
    } | undefined) => Promise<import("viem", { with: { "resolution-mode": "import" } }).EstimateMaxPriorityFeePerGasReturnType>;
    getRawTransaction: (args: import("viem", { with: { "resolution-mode": "import" } }).GetRawTransactionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetRawTransactionReturnType>;
    getStorageAt: (args: import("viem", { with: { "resolution-mode": "import" } }).GetStorageAtParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetStorageAtReturnType>;
    getTransaction: <blockTag extends import("viem", { with: { "resolution-mode": "import" } }).BlockTag = "latest">(args: import("viem", { with: { "resolution-mode": "import" } }).GetTransactionParameters<blockTag>) => Promise<{
        r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        v: bigint;
        yParity?: undefined | undefined;
        blockTimestamp?: bigint | undefined;
        from: Address;
        gas: bigint;
        hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        nonce: number;
        to: Address | null;
        typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
        value: bigint;
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        chainId?: number | undefined;
        type: "legacy";
        gasPrice: bigint;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
        blockHash: (blockTag extends "pending" ? true : false) extends infer T ? T extends (blockTag extends "pending" ? true : false) ? T extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag extends "pending" ? true : false) extends infer T_1 ? T_1 extends (blockTag extends "pending" ? true : false) ? T_1 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_2 ? T_2 extends (blockTag extends "pending" ? true : false) ? T_2 extends true ? null : number : never : never;
    } | {
        r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        v: bigint;
        yParity: number;
        blockTimestamp?: bigint | undefined;
        from: Address;
        gas: bigint;
        hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        nonce: number;
        to: Address | null;
        typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
        value: bigint;
        accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
        authorizationList?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        chainId: number;
        type: "eip2930";
        gasPrice: bigint;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
        blockHash: (blockTag extends "pending" ? true : false) extends infer T_3 ? T_3 extends (blockTag extends "pending" ? true : false) ? T_3 extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag extends "pending" ? true : false) extends infer T_4 ? T_4 extends (blockTag extends "pending" ? true : false) ? T_4 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_5 ? T_5 extends (blockTag extends "pending" ? true : false) ? T_5 extends true ? null : number : never : never;
    } | {
        r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        v: bigint;
        yParity: number;
        blockTimestamp?: bigint | undefined;
        from: Address;
        gas: bigint;
        hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        nonce: number;
        to: Address | null;
        typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
        value: bigint;
        accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
        authorizationList?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        chainId: number;
        type: "eip1559";
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        blockHash: (blockTag extends "pending" ? true : false) extends infer T_6 ? T_6 extends (blockTag extends "pending" ? true : false) ? T_6 extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag extends "pending" ? true : false) extends infer T_7 ? T_7 extends (blockTag extends "pending" ? true : false) ? T_7 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_8 ? T_8 extends (blockTag extends "pending" ? true : false) ? T_8 extends true ? null : number : never : never;
    } | {
        r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        v: bigint;
        yParity: number;
        blockTimestamp?: bigint | undefined;
        from: Address;
        gas: bigint;
        hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        nonce: number;
        to: Address | null;
        typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
        value: bigint;
        accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
        authorizationList?: undefined | undefined;
        blobVersionedHashes: readonly import("viem", { with: { "resolution-mode": "import" } }).Hex[];
        chainId: number;
        type: "eip4844";
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas: bigint;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        blockHash: (blockTag extends "pending" ? true : false) extends infer T_9 ? T_9 extends (blockTag extends "pending" ? true : false) ? T_9 extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag extends "pending" ? true : false) extends infer T_10 ? T_10 extends (blockTag extends "pending" ? true : false) ? T_10 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_11 ? T_11 extends (blockTag extends "pending" ? true : false) ? T_11 extends true ? null : number : never : never;
    } | {
        r: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        s: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        v: bigint;
        yParity: number;
        blockTimestamp?: bigint | undefined;
        from: Address;
        gas: bigint;
        hash: import("viem", { with: { "resolution-mode": "import" } }).Hash;
        input: import("viem", { with: { "resolution-mode": "import" } }).Hex;
        nonce: number;
        to: Address | null;
        typeHex: import("viem", { with: { "resolution-mode": "import" } }).Hex | null;
        value: bigint;
        accessList: import("viem", { with: { "resolution-mode": "import" } }).AccessList;
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList;
        blobVersionedHashes?: undefined | undefined;
        chainId: number;
        type: "eip7702";
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        blockHash: (blockTag extends "pending" ? true : false) extends infer T_12 ? T_12 extends (blockTag extends "pending" ? true : false) ? T_12 extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag extends "pending" ? true : false) extends infer T_13 ? T_13 extends (blockTag extends "pending" ? true : false) ? T_13 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_14 ? T_14 extends (blockTag extends "pending" ? true : false) ? T_14 extends true ? null : number : never : never;
    }>;
    getTransactionConfirmations: (args: import("viem", { with: { "resolution-mode": "import" } }).GetTransactionConfirmationsParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetTransactionConfirmationsReturnType>;
    getTransactionCount: (args: import("viem", { with: { "resolution-mode": "import" } }).GetTransactionCountParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).GetTransactionCountReturnType>;
    getTransactionReceipt: (args: import("viem", { with: { "resolution-mode": "import" } }).GetTransactionReceiptParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).TransactionReceipt>;
    multicall: <const contracts extends readonly unknown[], allowFailure extends boolean = true>(args: import("viem", { with: { "resolution-mode": "import" } }).MulticallParameters<contracts, allowFailure>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).MulticallReturnType<contracts, allowFailure>>;
    prepareTransactionRequest: <const request extends import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestRequest<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, chainOverride extends import("viem", { with: { "resolution-mode": "import" } }).Chain | undefined = undefined, accountOverride extends import("viem", { with: { "resolution-mode": "import" } }).Account | Address | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, chainOverride, accountOverride, request>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).UnionRequiredBy<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> & (import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride> extends infer T_1 ? T_1 extends import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride> ? T_1 extends import("viem", { with: { "resolution-mode": "import" } }).Chain ? {
        chain: T_1;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem", { with: { "resolution-mode": "import" } }).DeriveAccount<undefined, accountOverride> extends infer T_2 ? T_2 extends import("viem", { with: { "resolution-mode": "import" } }).DeriveAccount<undefined, accountOverride> ? T_2 extends import("viem", { with: { "resolution-mode": "import" } }).Account ? {
        account: T_2;
        from: Address;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).ExtractFormattedTransactionRequest<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, {
        type?: ((request["type"] extends string ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_3 ? T_3 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_3 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_3> ? T_3 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_4 ? T_4 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_4 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_4> ? T_4 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never> extends false ? import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_5 ? T_5 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_5 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_5> ? T_5 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_6 ? T_6 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_6 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_6> ? T_6 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never : request["type"] extends string | undefined ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
        } | {
            maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
        }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
        }) ? "eip1559" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
        } & {
            accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
        } ? "eip2930" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
        } | {
            blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
        } | {
            sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
        }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        }) & {
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
        } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
        } | {
            maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
        }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
        }) ? "eip1559" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
        } & {
            accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
        } ? "eip2930" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
        } | {
            blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
        } | {
            sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
        }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        }) & {
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
        } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_7 ? T_7 extends (request["type"] extends string ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_8 ? T_8 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_8 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_8> ? T_8 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_9 ? T_9 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_9 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_9> ? T_9 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never> extends false ? import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_10 ? T_10 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_10 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_10> ? T_10 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_11 ? T_11 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_11 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_11> ? T_11 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never : request["type"] extends string | undefined ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
        } | {
            maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
        }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
        }) ? "eip1559" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
        } & {
            accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
        } ? "eip2930" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
        } | {
            blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
        } | {
            sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
        }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        }) & {
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
        } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
        } | {
            maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
        }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
        }) ? "eip1559" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
        } & {
            accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
        } ? "eip2930" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
        } | {
            blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
        } | {
            sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
        }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        }) & {
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
        } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_7 extends string ? T_7 : undefined : never : never) | undefined;
    }, import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from">, ((request["type"] extends string ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_12 ? T_12 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_12 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_12> ? T_12 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_13 ? T_13 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_13 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_13> ? T_13 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never> extends false ? import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_14 ? T_14 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_14 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_14> ? T_14 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_15 ? T_15 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_15 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_15> ? T_15 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never : request["type"] extends string | undefined ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
    } | {
        maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
    }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
    }) ? "eip1559" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
    } & {
        accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
    } ? "eip2930" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
    } | {
        blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
    } | {
        sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
    }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    }) & {
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
    } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
    } | {
        maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
    }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
    }) ? "eip1559" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
    } & {
        accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
    } ? "eip2930" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
    } | {
        blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
    } | {
        sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
    }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    }) & {
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
    } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_16 ? T_16 extends (request["type"] extends string ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_17 ? T_17 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_17 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_17> ? T_17 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_18 ? T_18 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_18 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_18> ? T_18 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never> extends false ? import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_19 ? T_19 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_19 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_19> ? T_19 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_20 ? T_20 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_20 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_20> ? T_20 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never : request["type"] extends string | undefined ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
    } | {
        maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
    }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
    }) ? "eip1559" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
    } & {
        accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
    } ? "eip2930" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
    } | {
        blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
    } | {
        sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
    }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    }) & {
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
    } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
    } | {
        maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
    }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
    }) ? "eip1559" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
    } & {
        accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
    } ? "eip2930" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
    } | {
        blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
    } | {
        sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
    }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    }) & {
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
    } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_16 extends string ? T_16 : undefined : never : never) | undefined>> extends true ? unknown : import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).ExtractFormattedTransactionRequest<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, {
        type?: ((request["type"] extends string ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_21 ? T_21 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_21 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_21> ? T_21 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_22 ? T_22 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_22 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_22> ? T_22 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never> extends false ? import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_23 ? T_23 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_23 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_23> ? T_23 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_24 ? T_24 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_24 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_24> ? T_24 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never : request["type"] extends string | undefined ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
        } | {
            maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
        }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
        }) ? "eip1559" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
        } & {
            accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
        } ? "eip2930" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
        } | {
            blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
        } | {
            sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
        }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        }) & {
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
        } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
        } | {
            maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
        }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
        }) ? "eip1559" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
        } & {
            accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
        } ? "eip2930" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
        } | {
            blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
        } | {
            sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
        }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        }) & {
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
        } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_25 ? T_25 extends (request["type"] extends string ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_26 ? T_26 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_26 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_26> ? T_26 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_27 ? T_27 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_27 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_27> ? T_27 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never> extends false ? import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_28 ? T_28 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_28 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_28> ? T_28 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_29 ? T_29 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_29 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_29> ? T_29 extends {
            type?: infer type | undefined;
        } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never : request["type"] extends string | undefined ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
        } | {
            maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
        }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
        }) ? "eip1559" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
        } & {
            accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
        } ? "eip2930" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
        } | {
            blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
        } | {
            sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
        }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        }) & {
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
        } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
            accessList?: undefined | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
        } | {
            maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
        }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
        }) ? "eip1559" : never) | (request extends {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: bigint | undefined;
            sidecars?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: undefined | undefined;
            maxPriorityFeePerGas?: undefined | undefined;
        } & {
            accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
        } ? "eip2930" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: undefined | undefined;
            blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
            blobVersionedHashes?: readonly `0x${string}`[] | undefined;
            maxFeePerBlobGas?: bigint | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
        }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
            blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
        } | {
            blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
        } | {
            sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
        }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        } | {
            accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
            authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
            blobs?: undefined | undefined;
            blobVersionedHashes?: undefined | undefined;
            gasPrice?: undefined | undefined;
            maxFeePerBlobGas?: undefined | undefined;
            maxFeePerGas?: bigint | undefined;
            maxPriorityFeePerGas?: bigint | undefined;
            sidecars?: undefined | undefined;
        }) & {
            authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
        } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_25 extends string ? T_25 : undefined : never : never) | undefined;
    }, import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from">, ((request["type"] extends string ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_30 ? T_30 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_30 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_30> ? T_30 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_31 ? T_31 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_31 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_31> ? T_31 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never> extends false ? import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_32 ? T_32 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_32 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_32> ? T_32 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_33 ? T_33 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_33 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_33> ? T_33 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never : request["type"] extends string | undefined ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
    } | {
        maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
    }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
    }) ? "eip1559" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
    } & {
        accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
    } ? "eip2930" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
    } | {
        blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
    } | {
        sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
    }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    }) & {
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
    } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
    } | {
        maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
    }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
    }) ? "eip1559" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
    } & {
        accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
    } ? "eip2930" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
    } | {
        blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
    } | {
        sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
    }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    }) & {
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
    } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) extends infer T_34 ? T_34 extends (request["type"] extends string ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).IsNever<import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_35 ? T_35 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_35 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_35> ? T_35 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_36 ? T_36 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_36 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_36> ? T_36 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never> extends false ? import("viem", { with: { "resolution-mode": "import" } }).IsNever<Extract<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_37 ? T_37 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_37 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_37> ? T_37 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>>> extends true ? Exclude<import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> extends infer T_38 ? T_38 extends import("viem", { with: { "resolution-mode": "import" } }).UnionOmit<import("viem", { with: { "resolution-mode": "import" } }).ExtractChainFormatterParameters<import("viem", { with: { "resolution-mode": "import" } }).DeriveChain<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride>, "transactionRequest", import("viem", { with: { "resolution-mode": "import" } }).TransactionRequest>, "from"> ? T_38 extends object ? request extends import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<T_38> ? T_38 extends {
        type?: infer type | undefined;
    } ? Extract<type, string> : never : never : never : never : never, NonNullable<"legacy" | "eip2930" | "eip1559" | "eip4844" | "eip7702" | undefined>> : never : request["type"] extends string | undefined ? request["type"] : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
    } | {
        maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
    }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
    }) ? "eip1559" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
    } & {
        accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
    } ? "eip2930" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
    } | {
        blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
    } | {
        sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
    }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    }) & {
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
    } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)> extends "legacy" ? unknown : import("viem", { with: { "resolution-mode": "import" } }).GetTransactionType<request, (request extends {
        accessList?: undefined | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).FeeValuesLegacy ? "legacy" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } & (import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        maxFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxFeePerGas"];
    } | {
        maxPriorityFeePerGas: import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559["maxPriorityFeePerGas"];
    }, import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP1559> & {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"] | undefined;
    }) ? "eip1559" : never) | (request extends {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: undefined | undefined;
        maxPriorityFeePerGas?: undefined | undefined;
    } & {
        accessList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP2930["accessList"];
    } ? "eip2930" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: undefined | undefined;
        blobs?: readonly `0x${string}`[] | readonly import("viem", { with: { "resolution-mode": "import" } }).ByteArray[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem", { with: { "resolution-mode": "import" } }).BlobSidecar<`0x${string}`>[] | undefined;
    }) & (import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<import("viem", { with: { "resolution-mode": "import" } }).FeeValuesEIP4844> & import("viem", { with: { "resolution-mode": "import" } }).OneOf<{
        blobs: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobs"];
    } | {
        blobVersionedHashes: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["blobVersionedHashes"];
    } | {
        sidecars: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844["sidecars"];
    }, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP4844>) ? "eip4844" : never) | (request extends ({
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    } | {
        accessList?: import("viem", { with: { "resolution-mode": "import" } }).AccessList | undefined;
        authorizationList?: import("viem", { with: { "resolution-mode": "import" } }).SignedAuthorizationList | undefined;
        blobs?: undefined | undefined;
        blobVersionedHashes?: undefined | undefined;
        gasPrice?: undefined | undefined;
        maxFeePerBlobGas?: undefined | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined | undefined;
    }) & {
        authorizationList: import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializableEIP7702["authorizationList"];
    } ? "eip7702" : never) | (request["type"] extends string | undefined ? Extract<request["type"], string> : never)>) ? T_34 extends string ? T_34 : undefined : never : never) | undefined>>> & {
        chainId?: number | undefined;
    }, (request["parameters"] extends readonly import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId" | "type") extends infer T_39 ? T_39 extends (request["parameters"] extends readonly import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId" | "type") ? T_39 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_39 : never : never> & (unknown extends request["kzg"] ? {} : Pick<request, "kzg">) & {
        _capabilities?: {
            [x: string]: any;
        } | undefined;
    } extends infer T ? { [K in keyof T]: T[K]; } : never>;
    readContract: <const abi extends import("viem", { with: { "resolution-mode": "import" } }).Abi | readonly unknown[], functionName extends import("viem", { with: { "resolution-mode": "import" } }).ContractFunctionName<abi, "pure" | "view">, const args extends import("viem", { with: { "resolution-mode": "import" } }).ContractFunctionArgs<abi, "pure" | "view", functionName>>(args: import("viem", { with: { "resolution-mode": "import" } }).ReadContractParameters<abi, functionName, args>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).ReadContractReturnType<abi, functionName, args>>;
    sendRawTransaction: (args: import("viem", { with: { "resolution-mode": "import" } }).SendRawTransactionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).SendRawTransactionReturnType>;
    sendRawTransactionSync: (args: import("viem", { with: { "resolution-mode": "import" } }).SendRawTransactionSyncParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).TransactionReceipt>;
    simulate: <const calls extends readonly unknown[]>(args: import("viem", { with: { "resolution-mode": "import" } }).SimulateBlocksParameters<calls>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).SimulateBlocksReturnType<calls>>;
    simulateBlocks: <const calls extends readonly unknown[]>(args: import("viem", { with: { "resolution-mode": "import" } }).SimulateBlocksParameters<calls>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).SimulateBlocksReturnType<calls>>;
    simulateCalls: <const calls extends readonly unknown[]>(args: import("viem", { with: { "resolution-mode": "import" } }).SimulateCallsParameters<calls>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).SimulateCallsReturnType<calls>>;
    simulateContract: <const abi extends import("viem", { with: { "resolution-mode": "import" } }).Abi | readonly unknown[], functionName extends import("viem", { with: { "resolution-mode": "import" } }).ContractFunctionName<abi, "nonpayable" | "payable">, const args_1 extends import("viem", { with: { "resolution-mode": "import" } }).ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>, chainOverride extends import("viem", { with: { "resolution-mode": "import" } }).Chain | undefined, accountOverride extends import("viem", { with: { "resolution-mode": "import" } }).Account | Address | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).SimulateContractParameters<abi, functionName, args_1, {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, chainOverride, accountOverride>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).SimulateContractReturnType<abi, functionName, args_1, {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, chainOverride, accountOverride>>;
    verifyHash: (args: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>;
    verifyMessage: (args: import("viem", { with: { "resolution-mode": "import" } }).VerifyMessageActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyMessageActionReturnType>;
    verifySiweMessage: (args: import("../../../node_modules/viem/_types/actions/siwe/verifySiweMessage.js", { with: { "resolution-mode": "import" } }).VerifySiweMessageParameters) => Promise<import("../../../node_modules/viem/_types/actions/siwe/verifySiweMessage.js", { with: { "resolution-mode": "import" } }).VerifySiweMessageReturnType>;
    verifyTypedData: (args: import("viem", { with: { "resolution-mode": "import" } }).VerifyTypedDataActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyTypedDataActionReturnType>;
    uninstallFilter: (args: import("viem", { with: { "resolution-mode": "import" } }).UninstallFilterParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).UninstallFilterReturnType>;
    waitForTransactionReceipt: (args: import("viem", { with: { "resolution-mode": "import" } }).WaitForTransactionReceiptParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }>) => Promise<import("viem", { with: { "resolution-mode": "import" } }).TransactionReceipt>;
    watchBlockNumber: (args: import("viem", { with: { "resolution-mode": "import" } }).WatchBlockNumberParameters) => import("viem", { with: { "resolution-mode": "import" } }).WatchBlockNumberReturnType;
    watchBlockHeaders: (args: never) => import("viem", { with: { "resolution-mode": "import" } }).WatchBlockHeadersReturnType;
    watchBlocks: <includeTransactions extends boolean = false, blockTag extends import("viem", { with: { "resolution-mode": "import" } }).BlockTag = "latest">(args: import("viem", { with: { "resolution-mode": "import" } }).WatchBlocksParameters<import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>, {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, includeTransactions, blockTag>) => import("viem", { with: { "resolution-mode": "import" } }).WatchBlocksReturnType;
    watchContractEvent: <const abi extends import("viem", { with: { "resolution-mode": "import" } }).Abi | readonly unknown[], eventName extends import("viem", { with: { "resolution-mode": "import" } }).ContractEventName<abi>, strict extends boolean | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).WatchContractEventParameters<abi, eventName, strict, import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>>) => import("viem", { with: { "resolution-mode": "import" } }).WatchContractEventReturnType;
    watchEvent: <const abiEvent extends import("viem", { with: { "resolution-mode": "import" } }).AbiEvent | undefined = undefined, const abiEvents extends readonly import("viem", { with: { "resolution-mode": "import" } }).AbiEvent[] | readonly unknown[] | undefined = abiEvent extends import("viem", { with: { "resolution-mode": "import" } }).AbiEvent ? [abiEvent] : undefined, strict extends boolean | undefined = undefined>(args: import("viem", { with: { "resolution-mode": "import" } }).WatchEventParameters<abiEvent, abiEvents, strict, import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>>) => import("viem", { with: { "resolution-mode": "import" } }).WatchEventReturnType;
    watchPendingTransactions: (args: import("viem", { with: { "resolution-mode": "import" } }).WatchPendingTransactionsParameters<import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>>) => import("viem", { with: { "resolution-mode": "import" } }).WatchPendingTransactionsReturnType;
    token: {
        getAllowance: ((parameters: import("../../../node_modules/viem/_types/actions/token/getAllowance.js", { with: { "resolution-mode": "import" } }).getAllowance.Parameters<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, undefined>) => Promise<import("../../../node_modules/viem/_types/actions/token/getAllowance.js", { with: { "resolution-mode": "import" } }).getAllowance.ReturnValue>) & {
            call: (args: import("../../../node_modules/viem/_types/actions/token/getAllowance.js", { with: { "resolution-mode": "import" } }).getAllowance.Args<{
                blockExplorers: {
                    readonly default: {
                        readonly name: "PolygonScan";
                        readonly url: "https://amoy.polygonscan.com";
                    };
                };
                blockTime?: number | undefined | undefined;
                contracts?: {
                    [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                        [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    } | undefined;
                    ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensTlds?: readonly string[] | undefined;
                id: 80002;
                name: "Polygon Amoy";
                nativeCurrency: {
                    readonly name: "MATIC";
                    readonly symbol: "MATIC";
                    readonly decimals: 18;
                };
                experimental_preconfirmationTime?: number | undefined | undefined;
                rpcUrls: {
                    readonly default: {
                        readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                    };
                    readonly public: {
                        readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                    };
                };
                sourceId?: number | undefined | undefined;
                supportsTransactionReplacementDetection?: boolean | undefined | undefined;
                testnet: true;
                custom?: Record<string, unknown> | undefined;
                extendSchema?: Record<string, unknown> | undefined;
                fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
                formatters?: undefined;
                prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                    client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                    phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
                }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                    client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                    phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
                }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                    runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
                }] | undefined;
                serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
                verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
            }, undefined>) => ReturnType<typeof import("../../../node_modules/viem/_types/actions/token/getAllowance.js", { with: { "resolution-mode": "import" } }).getAllowance.call>;
        };
        getBalance: ((parameters: import("../../../node_modules/viem/_types/actions/token/getBalance.js", { with: { "resolution-mode": "import" } }).getBalance.Parameters<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, undefined, undefined>) => Promise<import("../../../node_modules/viem/_types/actions/token/getBalance.js", { with: { "resolution-mode": "import" } }).getBalance.ReturnValue>) & {
            call: (args: import("../../../node_modules/viem/_types/actions/token/getBalance.js", { with: { "resolution-mode": "import" } }).getBalance.Args<{
                blockExplorers: {
                    readonly default: {
                        readonly name: "PolygonScan";
                        readonly url: "https://amoy.polygonscan.com";
                    };
                };
                blockTime?: number | undefined | undefined;
                contracts?: {
                    [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                        [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    } | undefined;
                    ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensTlds?: readonly string[] | undefined;
                id: 80002;
                name: "Polygon Amoy";
                nativeCurrency: {
                    readonly name: "MATIC";
                    readonly symbol: "MATIC";
                    readonly decimals: 18;
                };
                experimental_preconfirmationTime?: number | undefined | undefined;
                rpcUrls: {
                    readonly default: {
                        readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                    };
                    readonly public: {
                        readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                    };
                };
                sourceId?: number | undefined | undefined;
                supportsTransactionReplacementDetection?: boolean | undefined | undefined;
                testnet: true;
                custom?: Record<string, unknown> | undefined;
                extendSchema?: Record<string, unknown> | undefined;
                fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
                formatters?: undefined;
                prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                    client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                    phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
                }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                    client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                    phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
                }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                    runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
                }] | undefined;
                serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
                verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
            }, undefined, undefined>) => ReturnType<typeof import("../../../node_modules/viem/_types/actions/token/getBalance.js", { with: { "resolution-mode": "import" } }).getBalance.call>;
        };
        getMetadata: (parameters: import("../../../node_modules/viem/_types/actions/token/getMetadata.js", { with: { "resolution-mode": "import" } }).getMetadata.Parameters<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, undefined>) => Promise<import("../../../node_modules/viem/_types/actions/token/getMetadata.js", { with: { "resolution-mode": "import" } }).getMetadata.ReturnValue>;
        getTotalSupply: ((parameters: import("../../../node_modules/viem/_types/actions/token/getTotalSupply.js", { with: { "resolution-mode": "import" } }).getTotalSupply.Parameters<{
            blockExplorers: {
                readonly default: {
                    readonly name: "PolygonScan";
                    readonly url: "https://amoy.polygonscan.com";
                };
            };
            blockTime?: number | undefined | undefined;
            contracts?: {
                [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                    [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensTlds?: readonly string[] | undefined;
            id: 80002;
            name: "Polygon Amoy";
            nativeCurrency: {
                readonly name: "MATIC";
                readonly symbol: "MATIC";
                readonly decimals: 18;
            };
            experimental_preconfirmationTime?: number | undefined | undefined;
            rpcUrls: {
                readonly default: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
                readonly public: {
                    readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                };
            };
            sourceId?: number | undefined | undefined;
            supportsTransactionReplacementDetection?: boolean | undefined | undefined;
            testnet: true;
            custom?: Record<string, unknown> | undefined;
            extendSchema?: Record<string, unknown> | undefined;
            fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
            formatters?: undefined;
            prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
            }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
            }] | undefined;
            serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
            verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
        }, undefined>) => Promise<import("../../../node_modules/viem/_types/actions/token/getTotalSupply.js", { with: { "resolution-mode": "import" } }).getTotalSupply.ReturnValue>) & {
            call: (args: import("../../../node_modules/viem/_types/actions/token/getTotalSupply.js", { with: { "resolution-mode": "import" } }).getTotalSupply.Args<{
                blockExplorers: {
                    readonly default: {
                        readonly name: "PolygonScan";
                        readonly url: "https://amoy.polygonscan.com";
                    };
                };
                blockTime?: number | undefined | undefined;
                contracts?: {
                    [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                        [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    } | undefined;
                    ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                    erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
                } | undefined;
                ensTlds?: readonly string[] | undefined;
                id: 80002;
                name: "Polygon Amoy";
                nativeCurrency: {
                    readonly name: "MATIC";
                    readonly symbol: "MATIC";
                    readonly decimals: 18;
                };
                experimental_preconfirmationTime?: number | undefined | undefined;
                rpcUrls: {
                    readonly default: {
                        readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                    };
                    readonly public: {
                        readonly http: readonly ["https://rpc-amoy.polygon.technology"];
                    };
                };
                sourceId?: number | undefined | undefined;
                supportsTransactionReplacementDetection?: boolean | undefined | undefined;
                testnet: true;
                custom?: Record<string, unknown> | undefined;
                extendSchema?: Record<string, unknown> | undefined;
                fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
                formatters?: undefined;
                prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                    client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                    phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
                }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
                    client: import("viem", { with: { "resolution-mode": "import" } }).Client;
                    phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
                }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
                    runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
                }] | undefined;
                serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
                verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
            }, undefined>) => ReturnType<typeof import("../../../node_modules/viem/_types/actions/token/getTotalSupply.js", { with: { "resolution-mode": "import" } }).getTotalSupply.call>;
        };
    };
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        dataSuffix?: undefined;
        experimental_blockTag?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        tokens?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & import("viem", { with: { "resolution-mode": "import" } }).ExactPartial<Pick<import("viem", { with: { "resolution-mode": "import" } }).PublicActions<import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>, {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, undefined>, "prepareTransactionRequest" | "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<import("viem", { with: { "resolution-mode": "import" } }).WalletActions<{
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, undefined>, "sendTransaction" | "writeContract">>>(fn: (client: import("viem", { with: { "resolution-mode": "import" } }).Client<import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>, {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, import("viem", { with: { "resolution-mode": "import" } }).PublicRpcSchema, import("viem", { with: { "resolution-mode": "import" } }).PublicActions<import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>, {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, undefined>, undefined>) => client) => import("viem", { with: { "resolution-mode": "import" } }).Client<import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>, {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, import("viem", { with: { "resolution-mode": "import" } }).PublicRpcSchema, { [K in keyof client]: client[K]; } & import("viem", { with: { "resolution-mode": "import" } }).PublicActions<import("viem", { with: { "resolution-mode": "import" } }).HttpTransport<undefined, false>, {
        blockExplorers: {
            readonly default: {
                readonly name: "PolygonScan";
                readonly url: "https://amoy.polygonscan.com";
            };
        };
        blockTime?: number | undefined | undefined;
        contracts?: {
            [x: string]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | {
                [sourceId: number]: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            } | undefined;
            ensRegistry?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            ensUniversalResolver?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            multicall3?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
            erc6492Verifier?: import("viem", { with: { "resolution-mode": "import" } }).ChainContract | undefined;
        } | undefined;
        ensTlds?: readonly string[] | undefined;
        id: 80002;
        name: "Polygon Amoy";
        nativeCurrency: {
            readonly name: "MATIC";
            readonly symbol: "MATIC";
            readonly decimals: 18;
        };
        experimental_preconfirmationTime?: number | undefined | undefined;
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
            readonly public: {
                readonly http: readonly ["https://rpc-amoy.polygon.technology"];
            };
        };
        sourceId?: number | undefined | undefined;
        supportsTransactionReplacementDetection?: boolean | undefined | undefined;
        testnet: true;
        custom?: Record<string, unknown> | undefined;
        extendSchema?: Record<string, unknown> | undefined;
        fees?: import("viem", { with: { "resolution-mode": "import" } }).ChainFees<undefined> | undefined;
        formatters?: undefined;
        prepareTransactionRequest?: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | [fn: ((args: import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters, options: {
            client: import("viem", { with: { "resolution-mode": "import" } }).Client;
            phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";
        }) => Promise<import("viem", { with: { "resolution-mode": "import" } }).PrepareTransactionRequestParameters>) | undefined, options: {
            runAt: readonly ("beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters")[];
        }] | undefined;
        serializers?: import("viem", { with: { "resolution-mode": "import" } }).ChainSerializers<undefined, import("viem", { with: { "resolution-mode": "import" } }).TransactionSerializable> | undefined;
        verifyHash?: ((client: import("viem", { with: { "resolution-mode": "import" } }).Client, parameters: import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionParameters) => Promise<import("viem", { with: { "resolution-mode": "import" } }).VerifyHashActionReturnType>) | undefined;
    }, undefined, undefined>, undefined>;
};
