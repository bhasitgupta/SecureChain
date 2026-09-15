"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const contracts_1 = require("@sih26125/contracts");
const config_js_1 = require("./config.js");
const db_js_1 = require("./db.js");
const provider = new ethers_1.ethers.JsonRpcProvider(config_js_1.config.polygonRpcUrl || 'https://polygon-amoy.drpc.org', undefined, { batchMaxCount: 1 });
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
        const currentBlock = BigInt(await provider.getBlockNumber());
        let fromBlock = await getCheckpoint(contractAddress);
        if (fromBlock === 0n) {
            // Start near head if no checkpoint (e.g. 1000 blocks back)
            fromBlock = currentBlock > 1000n ? currentBlock - 1000n : 0n;
        }
        if (fromBlock >= currentBlock)
            return;
        const toBlock = currentBlock - fromBlock > BigInt(config_js_1.config.blockBatchSize)
            ? fromBlock + BigInt(config_js_1.config.blockBatchSize)
            : currentBlock;
        const iface = new ethers_1.ethers.Interface(abi);
        const logs = await provider.getLogs({
            address: contractAddress,
            fromBlock: Number(fromBlock),
            toBlock: Number(toBlock),
        });
        for (const log of logs) {
            try {
                const parsed = iface.parseLog({
                    topics: log.topics,
                    data: log.data,
                });
                if (!parsed)
                    continue;
                // Convert bigints to strings for JSON serialization
                const sanitizedArgs = JSON.parse(JSON.stringify(parsed.args, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));
                await (0, db_js_1.query)(`INSERT INTO audit_events 
           (contract_addr, event_name, block_number, tx_hash, log_index, decoded, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (tx_hash, log_index) DO NOTHING`, [
                    contractAddress.toLowerCase(),
                    parsed.name,
                    Number(log.blockNumber),
                    log.transactionHash,
                    log.index || 0,
                    JSON.stringify(sanitizedArgs),
                ]);
                console.log(`[Indexer] Indexed ${contractName}.${parsed.name} at block ${log.blockNumber}`);
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
