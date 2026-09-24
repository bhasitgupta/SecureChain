#!/usr/bin/env node
/**
 * On-chain health check for the SecureChain contract suite.
 *
 * Read-only: sends no transactions, spends no gas. Run this first whenever
 * "minting doesn't work" — it tells you exactly which precondition is missing.
 *
 *   node scripts/onchain-status.mjs
 */
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import {
  IAM_ABI,
  NFT_ABI,
  ANCHOR_ABI,
  RECOVERY_ABI,
  ROLES,
  explorerAddress,
} from './lib/onchain.mjs';

dotenv.config();

const RPC = process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org';
const EXPECTED_CHAIN_ID = BigInt(process.env.CHAIN_ID || 80002);

const ok = (m) => console.log(`  \x1b[32m✔\x1b[0m ${m}`);
const bad = (m) => console.log(`  \x1b[31m✘\x1b[0m ${m}`);
const warn = (m) => console.log(`  \x1b[33m!\x1b[0m ${m}`);
const head = (m) => console.log(`\n\x1b[1m${m}\x1b[0m`);

const problems = [];
const fail = (m) => {
  bad(m);
  problems.push(m);
};

async function main() {
  head('1. RPC + network');
  const provider = new ethers.JsonRpcProvider(RPC, undefined, { batchMaxCount: 1 });
  let net;
  try {
    net = await provider.getNetwork();
  } catch (e) {
    fail(`Cannot reach RPC ${RPC}: ${e.shortMessage || e.message}`);
    return report();
  }
  ok(`RPC reachable: ${RPC}`);
  if (net.chainId === EXPECTED_CHAIN_ID) {
    ok(`chainId ${net.chainId} matches CHAIN_ID`);
  } else {
    fail(`chainId mismatch: RPC reports ${net.chainId}, CHAIN_ID=${EXPECTED_CHAIN_ID}`);
  }
  ok(`current block: ${await provider.getBlockNumber()}`);

  head('2. Signer (backend relayer)');
  let signer = null;
  if (!process.env.ADMIN_PRIVATE_KEY) {
    fail('ADMIN_PRIVATE_KEY is not set — the gateway cannot sign any transaction');
  } else {
    try {
      signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
      ok(`relayer address: ${signer.address}`);
      const bal = await provider.getBalance(signer.address);
      const pol = Number(ethers.formatEther(bal));
      if (pol === 0) {
        fail(`relayer has 0 POL — every transaction will revert with "insufficient funds". Fund ${signer.address} from https://faucet.polygon.technology (Amoy)`);
      } else if (pol < 0.05) {
        warn(`relayer balance is low: ${pol} POL (top up at https://faucet.polygon.technology)`);
      } else {
        ok(`relayer balance: ${pol} POL`);
      }
    } catch (e) {
      fail(`ADMIN_PRIVATE_KEY is not a valid key: ${e.shortMessage || e.message}`);
    }
  }

  const addrs = {
    IAM_ADDRESS: process.env.IAM_ADDRESS,
    NFT_ADDRESS: process.env.NFT_ADDRESS,
    ANCHOR_ADDRESS: process.env.ANCHOR_ADDRESS,
    RECOVERY_ADDRESS: process.env.RECOVERY_ADDRESS,
  };

  head('3. Contract addresses have deployed code');
  for (const [key, addr] of Object.entries(addrs)) {
    if (!addr) {
      fail(`${key} is empty in .env`);
      continue;
    }
    if (!ethers.isAddress(addr)) {
      fail(`${key}=${addr} is not a valid address`);
      continue;
    }
    const code = await provider.getCode(addr);
    if (code === '0x') {
      fail(`${key}=${addr} has NO contract code on chain ${net.chainId} (wrong network, or never deployed) — ${explorerAddress(addr)}`);
    } else {
      ok(`${key} live (${(code.length - 2) / 2} bytes) ${explorerAddress(addr)}`);
    }
  }

  if (!addrs.IAM_ADDRESS || (await provider.getCode(addrs.IAM_ADDRESS)) === '0x') {
    warn('Skipping wiring/role checks — IAM is not deployed');
    return report();
  }

  const iam = new ethers.Contract(addrs.IAM_ADDRESS, IAM_ABI, provider);

  head('4. Contract wiring (each module must point at this IAM)');
  const wiring = [
    ['NFT', addrs.NFT_ADDRESS, NFT_ABI],
    ['Anchor', addrs.ANCHOR_ADDRESS, ANCHOR_ABI],
    ['Recovery', addrs.RECOVERY_ADDRESS, RECOVERY_ABI],
  ];
  for (const [label, addr, abi] of wiring) {
    if (!addr || (await provider.getCode(addr)) === '0x') continue;
    try {
      const wired = await new ethers.Contract(addr, abi, provider).iam();
      if (wired.toLowerCase() === addrs.IAM_ADDRESS.toLowerCase()) {
        ok(`${label}.iam() → IAM_ADDRESS`);
      } else {
        fail(`${label}.iam() = ${wired} but IAM_ADDRESS = ${addrs.IAM_ADDRESS} — role checks will always fail`);
      }
    } catch (e) {
      fail(`${label}.iam() call failed: ${e.shortMessage || e.message} (ABI/address mismatch?)`);
    }
  }

  if (addrs.NFT_ADDRESS && (await provider.getCode(addrs.NFT_ADDRESS)) !== '0x') {
    try {
      const nft = new ethers.Contract(addrs.NFT_ADDRESS, NFT_ABI, provider);
      ok(`NFT collection: "${await nft.name()}" (${await nft.symbol()})`);
    } catch {
      warn('Could not read NFT name/symbol');
    }
  }

  head('5. ADMIN_ROLE holders');
  const candidates = new Map();
  if (signer) candidates.set(signer.address, 'relayer (ADMIN_PRIVATE_KEY)');
  if (process.env.ADMIN_WALLET) candidates.set(process.env.ADMIN_WALLET, 'ADMIN_WALLET');
  for (const extra of (process.env.ADMIN_WALLETS || '').split(',').map((s) => s.trim()).filter(Boolean)) {
    candidates.set(extra, 'ADMIN_WALLETS');
  }

  let relayerIsAdmin = false;
  for (const [addr, label] of candidates) {
    if (!ethers.isAddress(addr)) {
      fail(`${label} ${addr} is not a valid address`);
      continue;
    }
    const roles = [];
    for (const [name, hash] of Object.entries(ROLES)) {
      if (await iam.hasRole(hash, addr)) roles.push(name.replace('_ROLE', ''));
    }
    const isAdmin = roles.includes('ADMIN');
    if (signer && addr.toLowerCase() === signer.address.toLowerCase()) relayerIsAdmin = isAdmin;
    const line = `${label} ${addr} → roles: ${roles.length ? roles.join(', ') : 'NONE'}`;
    isAdmin ? ok(line) : fail(`${line}  (needs ADMIN_ROLE)`);
  }

  if (signer && !relayerIsAdmin) {
    problems.push(
      `The relayer ${signer.address} lacks ADMIN_ROLE on IAM — mint/allocate/retire/grantRole will revert with "NFT: not admin" / "IAM: not admin". Fix: node scripts/bootstrap-onchain.mjs`
    );
  }

  head('6. Identity registry (allocation/transfer require an Active DID)');
  for (const [addr, label] of candidates) {
    if (!ethers.isAddress(addr)) continue;
    const did = await iam.getDidByAccount(addr);
    if (did === ethers.ZeroHash) {
      warn(`${label} ${addr} has no registered DID — allocateInitial/authorizeTransfer to it revert "NFT: target identity inactive"`);
    } else {
      const active = await iam.isIdentityActive(did);
      active
        ? ok(`${label} ${addr} DID active (${did.slice(0, 12)}…)`)
        : fail(`${label} ${addr} DID exists but is NOT Active`);
    }
  }

  head('7. Anchor registry activity');
  if (addrs.ANCHOR_ADDRESS && (await provider.getCode(addrs.ANCHOR_ADDRESS)) !== '0x') {
    try {
      const anchor = new ethers.Contract(addrs.ANCHOR_ADDRESS, ANCHOR_ABI, provider);
      const to = await provider.getBlockNumber();
      const from = Math.max(0, to - 9000); // stay inside public-RPC log range limits
      const logs = await anchor.queryFilter(anchor.filters.MerkleRootAnchored(), from, to);
      ok(`MerkleRootAnchored events in last ${to - from} blocks: ${logs.length}`);
    } catch (e) {
      warn(`Could not read anchor events: ${e.shortMessage || e.message}`);
    }
  }

  report();
}

function report() {
  head('SUMMARY');
  if (problems.length === 0) {
    console.log('  \x1b[32mAll on-chain preconditions satisfied — mint/anchor/role calls should succeed.\x1b[0m');
    process.exit(0);
  }
  console.log(`  \x1b[31m${problems.length} blocking issue(s):\x1b[0m`);
  problems.forEach((p, i) => console.log(`   ${i + 1}. ${p}`));
  console.log('\n  Most role/permission problems are fixed by: \x1b[1mnode scripts/bootstrap-onchain.mjs\x1b[0m');
  process.exit(1);
}

main().catch((e) => {
  console.error('\nUnexpected failure:', e);
  process.exit(1);
});
