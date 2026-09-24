#!/usr/bin/env node
/**
 * Post-bootstrap smoke test for SecureChain.
 *
 * Read-only — sends no transactions, spends no gas.
 * Reads back the most recently minted token and asserts chain state is correct.
 *
 *   node scripts/onchain-smoke.mjs
 */
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import {
  IAM_ABI,
  NFT_ABI,
  ROLES,
  explorerAddress,
  makeProvider,
} from './lib/onchain.mjs';

dotenv.config();

const RPC         = process.env.POLYGON_RPC_URL;
const CHAIN_ID    = Number(process.env.CHAIN_ID || 80002);
const IAM_ADDRESS = process.env.IAM_ADDRESS;
const NFT_ADDRESS = process.env.NFT_ADDRESS;
const ADMIN_PK    = process.env.ADMIN_PRIVATE_KEY;
const SECONDARY   = '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c';

const ok   = (m) => console.log(`  \x1b[32m✔\x1b[0m ${m}`);
const fail = (m) => { console.log(`  \x1b[31m✘\x1b[0m ${m}`); failures++; };
const head = (m) => console.log(`\n\x1b[1m${m}\x1b[0m`);

let failures = 0;

function assert(condition, passMsg, failMsg) {
  if (condition) ok(passMsg);
  else fail(failMsg);
}

async function main() {
  const provider = makeProvider(RPC);
  const relayer  = new ethers.Wallet(ADMIN_PK, provider).address;

  const iam = new ethers.Contract(IAM_ADDRESS, IAM_ABI, provider);
  const nft = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);

  // ── 1. Roles ───────────────────────────────────────────────────────────────
  head('1. ADMIN_ROLE assertions');
  const relayerAdmin = await iam.hasRole(ROLES.ADMIN_ROLE, relayer);
  assert(relayerAdmin, `Relayer ${relayer} has ADMIN_ROLE`, `Relayer MISSING ADMIN_ROLE`);

  const secondaryAdmin = await iam.hasRole(ROLES.ADMIN_ROLE, SECONDARY);
  assert(secondaryAdmin, `Secondary ${SECONDARY} has ADMIN_ROLE`, `Secondary MISSING ADMIN_ROLE`);

  // ── 2. DIDs ────────────────────────────────────────────────────────────────
  head('2. Identity (DID) assertions');
  const relayerDid = await iam.getDidByAccount(relayer);
  assert(relayerDid !== ethers.ZeroHash, `Relayer DID registered (${relayerDid.slice(0, 12)}…)`, 'Relayer has NO DID');

  if (relayerDid !== ethers.ZeroHash) {
    const relayerActive = await iam.isIdentityActive(relayerDid);
    assert(relayerActive, 'Relayer DID is Active', 'Relayer DID is NOT Active');
  }

  const secondaryDid = await iam.getDidByAccount(SECONDARY);
  assert(secondaryDid !== ethers.ZeroHash, `Secondary DID registered (${secondaryDid.slice(0, 12)}…)`, 'Secondary has NO DID');

  if (secondaryDid !== ethers.ZeroHash) {
    const secondaryActive = await iam.isIdentityActive(secondaryDid);
    assert(secondaryActive, 'Secondary DID is Active', 'Secondary DID is NOT Active');
  }

  // ── 3. Find latest token ───────────────────────────────────────────────────
  head('3. Token assertions');

  // Scan recent AssetMinted events to find the bootstrap token
  const currentBlock = await provider.getBlockNumber();
  const fromBlock = Math.max(0, currentBlock - 50000); // generous range
  let latestTokenId = null;

  try {
    const filter = nft.filters.AssetMinted();
    const events = await nft.queryFilter(filter, fromBlock, currentBlock);

    if (events.length === 0) {
      fail('No AssetMinted events found — bootstrap may not have run');
    } else {
      // Find the bootstrap token (assetClass = "Bootstrap Test")
      for (const ev of events.reverse()) {
        const parsed = nft.interface.parseLog(ev);
        if (parsed && parsed.args.assetClass === 'Bootstrap Test') {
          latestTokenId = parsed.args.tokenId.toString();
          break;
        }
      }

      if (!latestTokenId) {
        // Fall back to latest event
        const last = events[0]; // reversed, so [0] is latest
        const parsed = nft.interface.parseLog(last);
        latestTokenId = (parsed.args.tokenId ?? parsed.args[2]).toString();
      }

      ok(`Found token #${latestTokenId}`);
    }
  } catch (err) {
    // If event query fails (some RPCs limit range), try token #1 as fallback
    console.warn(`  Event scan failed: ${err.message}. Trying token #1.`);
    latestTokenId = '1';
  }

  if (latestTokenId) {
    try {
      const asset = await nft.getAsset(BigInt(latestTokenId));
      const owner = await nft.ownerOf(BigInt(latestTokenId));

      ok(`Token #${latestTokenId} exists on-chain`);
      ok(`  owner: ${owner}`);
      ok(`  assetClass: ${asset.assetClass}`);

      const statusNames = ['Uninitialized', 'Active', 'Transferred', 'Retired'];
      const statusStr = statusNames[Number(asset.status)] || String(asset.status);
      ok(`  status: ${statusStr}`);

      // If this was the bootstrap token allocated to secondary, owner should be secondary
      if (asset.assetClass === 'Bootstrap Test') {
        assert(
          owner.toLowerCase() === SECONDARY.toLowerCase(),
          `Owner matches secondary admin (post-allocateInitial)`,
          `Owner is ${owner}, expected ${SECONDARY} after allocation`
        );
      }

      assert(
        Number(asset.status) === 1 || Number(asset.status) === 2,
        `Status is ${statusStr} (valid)`,
        `Status is ${statusStr} — unexpected`
      );
    } catch (err) {
      fail(`Could not read token #${latestTokenId}: ${err.message}`);
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  head('SMOKE TEST RESULT');
  if (failures === 0) {
    console.log('  \x1b[32mAll assertions passed. On-chain state is correct.\x1b[0m');
    process.exit(0);
  } else {
    console.log(`  \x1b[31m${failures} assertion(s) failed.\x1b[0m`);
    console.log('  Run: node scripts/bootstrap-onchain.mjs');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('\nUnexpected failure:', e);
  process.exit(1);
});
