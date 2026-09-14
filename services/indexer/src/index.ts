import { createPublicClient, http, parseAbiItem, defineChain, type Address, decodeEventLog } from 'viem';
import {
  IdentityAndAccessManagerAbi,
  EnterpriseAssetNFTAbi,
  DocumentAnchorRegistryAbi,
  RecoveryManagerAbi,
} from '@sih26125/contracts';
import { config } from './config.js';
import { query } from './db.js';

const polygonAmoy = defineChain({
  id: config.chainId,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: [config.polygonRpcUrl] },
  },
  testnet: true,
});

const client = createPublicClient({
  chain: polygonAmoy,
  transport: http(config.polygonRpcUrl),
});

console.log('🔍 SIH26125 Blockchain Indexer starting...');

async function getCheckpoint(contractAddress: string): Promise<bigint> {
  const res = await query(
    `SELECT last_block FROM indexer_checkpoints WHERE contract_address = $1`,
    [contractAddress.toLowerCase()]
  );
  if (res.rows.length > 0) {
    return BigInt(res.rows[0].last_block);
  }
  return 0n;
}

async function setCheckpoint(contractAddress: string, blockNumber: bigint) {
  await query(
    `INSERT INTO indexer_checkpoints (contract_address, last_block, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (contract_address) DO UPDATE SET last_block = $2, updated_at = NOW()`,
    [contractAddress.toLowerCase(), Number(blockNumber)]
  );
}

async function indexContractEvents(
  contractAddress: Address,
  abi: any,
  contractName: string
) {
  if (!contractAddress || contractAddress === '0x') return;

  try {
    const currentBlock = await client.getBlockNumber();
    let fromBlock = await getCheckpoint(contractAddress);

    if (fromBlock === 0n) {
      // Start near head if no checkpoint (e.g. 1000 blocks back)
      fromBlock = currentBlock > 1000n ? currentBlock - 1000n : 0n;
    }

    if (fromBlock >= currentBlock) return;

    const toBlock =
      currentBlock - fromBlock > config.blockBatchSize
        ? fromBlock + config.blockBatchSize
        : currentBlock;

    const logs = await client.getLogs({
      address: contractAddress,
      fromBlock,
      toBlock,
    });

    for (const log of logs) {
      try {
        const decoded: any = decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        });

        // Convert bigints to strings for JSON serialization
        const sanitizedArgs = JSON.parse(
          JSON.stringify(decoded.args, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
        );

        await query(
          `INSERT INTO audit_events 
           (contract_addr, event_name, block_number, tx_hash, log_index, decoded, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (tx_hash, log_index) DO NOTHING`,
          [
            contractAddress.toLowerCase(),
            decoded.eventName,
            Number(log.blockNumber),
            log.transactionHash,
            log.logIndex || 0,
            JSON.stringify(sanitizedArgs),
          ]
        );

        console.log(`[Indexer] Indexed ${contractName}.${decoded.eventName} at block ${log.blockNumber}`);
      } catch {
        // Unrecognized event log for this ABI, skip
      }
    }

    await setCheckpoint(contractAddress, toBlock + 1n);
  } catch (err: any) {
    console.error(`[Indexer] Error indexing ${contractName}:`, err.message);
  }
}

async function runIndexLoop() {
  if (config.contracts.iam) {
    await indexContractEvents(config.contracts.iam, IdentityAndAccessManagerAbi, 'IAM');
  }
  if (config.contracts.nft) {
    await indexContractEvents(config.contracts.nft, EnterpriseAssetNFTAbi, 'NFT');
  }
  if (config.contracts.anchor) {
    await indexContractEvents(config.contracts.anchor, DocumentAnchorRegistryAbi, 'Anchor');
  }
  if (config.contracts.recovery) {
    await indexContractEvents(config.contracts.recovery, RecoveryManagerAbi, 'Recovery');
  }
}

// Start polling loop
async function main() {
  while (true) {
    await runIndexLoop();
    await new Promise((r) => setTimeout(r, config.pollIntervalMs));
  }
}

main();
