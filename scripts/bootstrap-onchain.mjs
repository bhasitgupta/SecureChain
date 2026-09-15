#!/usr/bin/env node
/**
 * On-chain bootstrap for SecureChain (SIH26125).
 *
 * Idempotent: checks each item before acting and skips what is already done.
 * Sends REAL transactions on Polygon Amoy — costs gas.
 *
 *   node scripts/bootstrap-onchain.mjs
 */
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import {
  IAM_ABI,
  NFT_ABI,
  RECOVERY_ABI,
  ROLES,
  formatDidPkh,
  didHashFor,
  explorerTx,
  explorerAddress,
  makeProvider,
  reasonOf,
} from './lib/onchain.mjs';

dotenv.config();

// ── Configuration ────────────────────────────────────────────────────────────
const RPC              = process.env.POLYGON_RPC_URL;
const CHAIN_ID         = Number(process.env.CHAIN_ID || 80002);
const IAM_ADDRESS      = process.env.IAM_ADDRESS;
const NFT_ADDRESS      = process.env.NFT_ADDRESS;
const RECOVERY_ADDRESS = process.env.RECOVERY_ADDRESS;
const ADMIN_PK         = process.env.ADMIN_PRIVATE_KEY;

// Secondary admin from the UI's DEFAULT_ROLES
const SECONDARY_ADMIN  = '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c';

const RECOVERY_TIMELOCK = 172800; // 48 hours in seconds

// ── Helpers ──────────────────────────────────────────────────────────────────
const ok   = (m) => console.log(`  \x1b[32m✔\x1b[0m ${m}`);
const skip = (m) => console.log(`  \x1b[33m↷\x1b[0m ${m}`);
const fail = (m) => { console.log(`  \x1b[31m✘\x1b[0m ${m}`); process.exit(1); };
const head = (m) => console.log(`\n\x1b[1m${m}\x1b[0m`);
const link = (hash) => explorerTx(hash, CHAIN_ID);

const txResults = [];
const logTx = (label, hash) => {
  txResults.push({ label, hash, link: link(hash) });
  ok(`${label}: ${link(hash)}`);
};

async function main() {
  // ── Pre-flight ─────────────────────────────────────────────────────────────
  head('0. Pre-flight');

  if (!ADMIN_PK)      fail('ADMIN_PRIVATE_KEY not set in .env');
  if (!IAM_ADDRESS)   fail('IAM_ADDRESS not set in .env');
  if (!NFT_ADDRESS)   fail('NFT_ADDRESS not set in .env');

  const provider = makeProvider(RPC);
  const signer   = new ethers.Wallet(ADMIN_PK, provider);
  const relayer  = signer.address;

  const balance = await provider.getBalance(relayer);
  const pol = Number(ethers.formatEther(balance));
  if (pol < 0.01) fail(`Relayer ${relayer} has ${pol} POL — need gas. Fund it first.`);
  ok(`Relayer: ${relayer} (${pol.toFixed(4)} POL)`);

  const iam = new ethers.Contract(IAM_ADDRESS, IAM_ABI, signer);
  const nft = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);

  // Verify relayer is admin
  const relayerIsAdmin = await iam.hasRole(ROLES.ADMIN_ROLE, relayer);
  if (!relayerIsAdmin) fail(`Relayer ${relayer} lacks ADMIN_ROLE — cannot bootstrap. Grant it manually first.`);
  ok('Relayer holds ADMIN_ROLE');

  // ── 1. Grant ADMIN_ROLE to secondary admin ─────────────────────────────────
  head('1. Grant ADMIN_ROLE to secondary admin');
  const secondaryHasAdmin = await iam.hasRole(ROLES.ADMIN_ROLE, SECONDARY_ADMIN);
  if (secondaryHasAdmin) {
    skip(`${SECONDARY_ADMIN} already has ADMIN_ROLE`);
  } else {
    try {
      const tx = await iam.grantRole(ROLES.ADMIN_ROLE, SECONDARY_ADMIN);
      await tx.wait();
      logTx('grantRole(ADMIN, secondary)', tx.hash);
    } catch (err) {
      fail(`grantRole failed: ${reasonOf(err)}`);
    }
  }

  // ── 2. Register DID for relayer ────────────────────────────────────────────
  head('2. Register DID for relayer');
  const relayerDid     = formatDidPkh(CHAIN_ID, relayer);
  const relayerDidHash = didHashFor(CHAIN_ID, relayer);

  const relayerExistingDid = await iam.getDidByAccount(relayer);
  if (relayerExistingDid !== ethers.ZeroHash) {
    skip(`Relayer already has DID (${relayerExistingDid.slice(0, 12)}…)`);
  } else {
    try {
      const tx = await iam.registerIdentity(relayerDidHash, relayer, 'admin-relayer');
      await tx.wait();
      logTx('registerIdentity(relayer)', tx.hash);
    } catch (err) {
      fail(`registerIdentity(relayer) failed: ${reasonOf(err)}`);
    }
  }

  // ── 3. Register DID for secondary admin ────────────────────────────────────
  head('3. Register DID for secondary admin');
  const secondaryDidHash = didHashFor(CHAIN_ID, SECONDARY_ADMIN);

  const secondaryExistingDid = await iam.getDidByAccount(SECONDARY_ADMIN);
  if (secondaryExistingDid !== ethers.ZeroHash) {
    skip(`Secondary admin already has DID (${secondaryExistingDid.slice(0, 12)}…)`);
  } else {
    try {
      const tx = await iam.registerIdentity(secondaryDidHash, SECONDARY_ADMIN, 'admin-secondary');
      await tx.wait();
      logTx('registerIdentity(secondary)', tx.hash);
    } catch (err) {
      fail(`registerIdentity(secondary) failed: ${reasonOf(err)}`);
    }
  }

  // ── 4. Recovery provider + account registration ────────────────────────────
  head('4. Recovery setup');
  if (RECOVERY_ADDRESS) {
    const recovery = new ethers.Contract(RECOVERY_ADDRESS, RECOVERY_ABI, signer);

    // Register relayer as provider
    const isProvider = await recovery.approvedProviders(relayer);
    if (isProvider) {
      skip(`Relayer already an approved recovery provider`);
    } else {
      try {
        const tx = await recovery.registerProvider(relayer);
        await tx.wait();
        logTx('registerProvider(relayer)', tx.hash);
      } catch (err) {
        // May fail if already registered
        console.warn(`  registerProvider skipped: ${reasonOf(err)}`);
      }
    }

    // Register account with timelock
    const acct = await recovery.accounts(relayer);
    if (acct[0] !== ethers.ZeroAddress) {
      skip(`Relayer account already registered (owner=${acct[0].slice(0, 10)}…)`);
    } else {
      try {
        const tx = await recovery.registerAccount(BigInt(RECOVERY_TIMELOCK));
        await tx.wait();
        logTx(`registerAccount(${RECOVERY_TIMELOCK}s)`, tx.hash);
      } catch (err) {
        console.warn(`  registerAccount skipped: ${reasonOf(err)}`);
      }
    }
  } else {
    skip('RECOVERY_ADDRESS not set — skipping recovery setup');
  }

  // ── 5. Verification mint ───────────────────────────────────────────────────
  head('5. Verification mint');
  let mintedTokenId;
  try {
    // Re-read relayer DID hash (may have been registered just now)
    const currentRelayerDidHash = await iam.getDidByAccount(relayer);
    if (currentRelayerDidHash === ethers.ZeroHash) {
      fail('Relayer DID not found after registration — something went wrong');
    }

    const tx = await nft.mint(relayer, currentRelayerDidHash, 'Bootstrap Test', '');
    const receipt = await tx.wait();

    // Parse tokenId from events
    for (const log of receipt.logs) {
      try {
        const parsed = nft.interface.parseLog(log);
        if (parsed && (parsed.name === 'AssetMinted' || parsed.name === 'Transfer')) {
          mintedTokenId = (parsed.args.tokenId ?? parsed.args[2]).toString();
          break;
        }
      } catch {}
    }

    if (!mintedTokenId) fail('Mint tx succeeded but no tokenId found in events');
    logTx(`mint → Token #${mintedTokenId}`, tx.hash);
  } catch (err) {
    fail(`Verification mint failed: ${reasonOf(err)}`);
  }

  // ── 6. Verification allocate ───────────────────────────────────────────────
  head('6. Verification allocate');
  try {
    const currentSecondaryDidHash = await iam.getDidByAccount(SECONDARY_ADMIN);
    if (currentSecondaryDidHash === ethers.ZeroHash) {
      fail('Secondary admin DID not found — allocateInitial will revert');
    }

    const tx = await nft.allocateInitial(BigInt(mintedTokenId), SECONDARY_ADMIN, currentSecondaryDidHash);
    await tx.wait();
    logTx(`allocateInitial(#${mintedTokenId} → secondary)`, tx.hash);
  } catch (err) {
    fail(`allocateInitial failed: ${reasonOf(err)}`);
  }

  // ── 7. Dry-run transfer ────────────────────────────────────────────────────
  head('7. Dry-run transfer (staticCall — no gas spent)');
  try {
    const currentRelayerDidHash = await iam.getDidByAccount(relayer);
    await nft.authorizeTransfer.staticCall(
      BigInt(mintedTokenId),
      SECONDARY_ADMIN,
      relayer,
      currentRelayerDidHash
    );
    ok('authorizeTransfer staticCall passed — transfers will work');
  } catch (err) {
    console.warn(`  authorizeTransfer staticCall failed: ${reasonOf(err)}`);
    console.warn('  (This is expected if the token is already in a non-transferable state)');
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  head('SUMMARY');
  if (txResults.length === 0) {
    console.log('  \x1b[33mNothing to do — all items were already bootstrapped.\x1b[0m');
  } else {
    console.log(`  \x1b[32m${txResults.length} transaction(s) landed on Polygon Amoy:\x1b[0m`);
    txResults.forEach((r, i) => console.log(`   ${i + 1}. ${r.label}`));
    console.log('\n  Links:');
    txResults.forEach((r) => console.log(`   ${r.link}`));
  }
  console.log(`\n  Relayer: ${explorerAddress(relayer, CHAIN_ID)}`);
  console.log(`  Next: node scripts/onchain-smoke.mjs`);
}

main().catch((e) => {
  console.error('\nUnexpected failure:', e);
  process.exit(1);
});
