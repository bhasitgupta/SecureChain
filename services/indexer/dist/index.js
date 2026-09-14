"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const contracts_1 = require("@sih26125/contracts");
const config_js_1 = require("./config.js");
const db_js_1 = require("./db.js");
const polygonAmoy = (0, viem_1.defineChain)({
    id: config_js_1.config.chainId,
    name: 'Polygon Amoy',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
        default: { http: [config_js_1.config.polygonRpcUrl] },
    },
    testnet: true,
});
const client = (0, viem_1.createPublicClient)({
    chain: polygonAmoy,
    transport: (0, viem_1.http)(config_js_1.config.polygonRpcUrl),
});
console.log('🔍 SIH26125 Blockchain Indexer starting...');
async function getCheckpoint(contractAddress) {
    const res = await (0, db_js_1.query)(`SELECT last_block FROM indexer_checkpoints WHERE contract_address = $1`, [contractAddress.toLowerCase()]);
    if (res.rows.length > 0) {
        return BigInt(res.rows[0].last_block);
    }
    return 0n;
}
async function setCheckpoint(contractAddress, blockNumber) {
    await (0, db_js_1.query)(`INSERT INTO indexer_checkpoints (contract_address, last_block, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (contract_address) DO UPDATE SET last_block = $2, updated_at = NOW()`, [contractAddress.toLowerCase(), Number(blockNumber)]);
}
async function indexContractEvents(contractAddress, abi, contractName) {
    if (!contractAddress || contractAddress === '0x')
        return;
    try {
        const currentBlock = await client.getBlockNumber();
        let fromBlock = await getCheckpoint(contractAddress);
        if (fromBlock === 0n) {
            // Start near head if no checkpoint (e.g. 1000 blocks back)
            fromBlock = currentBlock > 1000n ? currentBlock - 1000n : 0n;
        }
        if (fromBlock >= currentBlock)
            return;
        const toBlock = currentBlock - fromBlock > config_js_1.config.blockBatchSize
            ? fromBlock + config_js_1.config.blockBatchSize
            : currentBlock;
        const logs = await client.getLogs({
            address: contractAddress,
            fromBlock,
            toBlock,
        });
        for (const log of logs) {
            try {
                const decoded = (0, viem_1.decodeEventLog)({
                    abi,
                    data: log.data,
                    topics: log.topics,
                });
                // Convert bigints to strings for JSON serialization
                const sanitizedArgs = JSON.parse(JSON.stringify(decoded.args, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));
                await (0, db_js_1.query)(`INSERT INTO audit_events 
           (contract_addr, event_name, block_number, tx_hash, log_index, decoded, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (tx_hash, log_index) DO NOTHING`, [
                    contractAddress.toLowerCase(),
                    decoded.eventName,
                    Number(log.blockNumber),
                    log.transactionHash,
                    log.logIndex || 0,
                    JSON.stringify(sanitizedArgs),
                ]);
                console.log(`[Indexer] Indexed ${contractName}.${decoded.eventName} at block ${log.blockNumber}`);
            }
            catch {
                // Unrecognized event log for this ABI, skip
            }
        }
        await setCheckpoint(contractAddress, toBlock + 1n);
    }
    catch (err) {
        console.error(`[Indexer] Error indexing ${contractName}:`, err.message);
    }
}
async function runIndexLoop() {
    if (config_js_1.config.contracts.iam) {
        await indexContractEvents(config_js_1.config.contracts.iam, contracts_1.IdentityAndAccessManagerAbi, 'IAM');
    }
    if (config_js_1.config.contracts.nft) {
        await indexContractEvents(config_js_1.config.contracts.nft, contracts_1.EnterpriseAssetNFTAbi, 'NFT');
    }
    if (config_js_1.config.contracts.anchor) {
        await indexContractEvents(config_js_1.config.contracts.anchor, contracts_1.DocumentAnchorRegistryAbi, 'Anchor');
    }
    if (config_js_1.config.contracts.recovery) {
        await indexContractEvents(config_js_1.config.contracts.recovery, contracts_1.RecoveryManagerAbi, 'Recovery');
    }
}
// Start polling loop
async function main() {
    while (true) {
        await runIndexLoop();
        await new Promise((r) => setTimeout(r, config_js_1.config.pollIntervalMs));
    }
}
main();
