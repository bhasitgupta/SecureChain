import test from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const API_BASE = 'http://127.0.0.1:3001/api';

test('End-to-end System Pipeline Test', async (t) => {
  // 1. Start Gateway
  console.log('[E2E] Spawning Gateway server...');
  const gateway = spawn('node', ['services/gateway/dist/index.js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: { ...process.env, PORT: '3001', BATCH_MAX_LEAVES: '2', BATCH_MAX_WAIT_SECONDS: '2' },
  });

  // 2. Start Worker
  console.log('[E2E] Spawning Workers pipeline...');
  const workers = spawn('node', ['services/workers/dist/index.js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: { ...process.env, BATCH_MAX_LEAVES: '2', BATCH_MAX_WAIT_SECONDS: '2' },
  });

  // Wait 3s for services to bind
  await new Promise((r) => setTimeout(r, 3000));

  try {
    // 3. Health check
    console.log('[E2E] Testing /health...');
    const healthRes = await fetch('http://127.0.0.1:3001/health');
    assert.strictEqual(healthRes.status, 200);
    const health = await healthRes.json();
    assert.strictEqual(health.status, 'ok');

    // 4. Test Identity Registration
    console.log('[E2E] Registering Identity...');
    const idRes = await fetch(`${API_BASE}/identity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account: '0x1111111111111111111111111111111111111111',
        subjectId: 'BEL-TEST-001',
      }),
    });
    assert.strictEqual(idRes.status, 200);
    const identity = await idRes.json();
    assert.strictEqual(identity.success, true);
    assert.ok(identity.did.includes('did:pkh:eip155:80002'));

    // 5. Test Asset NFT Minting with Thumbnail
    console.log('[E2E] Minting Asset with Thumbnail Image...');
    // Create a 1x1 WebP/PNG dummy buffer
    const dummyImage = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const formAsset = new FormData();
    formAsset.append('to', '0x1111111111111111111111111111111111111111');
    formAsset.append('assetClass', 'Tactical Radar Core');
    formAsset.append(
      'thumbnail',
      new Blob([dummyImage], { type: 'image/png' }),
      'thumbnail.png'
    );

    const assetRes = await fetch(`${API_BASE}/assets/mint`, {
      method: 'POST',
      body: formAsset,
    });
    assert.strictEqual(assetRes.status, 200);
    const asset = await assetRes.json();
    assert.strictEqual(asset.success, true);
    assert.ok(asset.tokenId);
    assert.ok(asset.thumbnailUrl);

    // Verify thumbnail is retrievable from MinIO via Gateway
    const thumbRes = await fetch(`http://127.0.0.1:3001${asset.thumbnailUrl}`);
    assert.strictEqual(thumbRes.status, 200);
    const thumbBuffer = await thumbRes.arrayBuffer();
    assert.ok(thumbBuffer.byteLength > 0);
    console.log(`[E2E] Asset #${asset.tokenId} thumbnail verified (${thumbBuffer.byteLength} bytes)!`);

    // 6. Test Document Upload (Streaming SHA-256 + MinIO storage)
    console.log('[E2E] Uploading Confidential Document V1...');
    const dummyDoc = Buffer.from('BEL DEFENCE RESTRICTED SPECIFICATION 2026 - CONFIDENTIAL');
    const formDoc = new FormData();
    formDoc.append('title', 'Tactical Specification 01');
    formDoc.append('file', new Blob([dummyDoc], { type: 'text/plain' }), 'spec.txt');

    const docRes = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      body: formDoc,
    });
    assert.strictEqual(docRes.status, 201);
    const doc = await docRes.json();
    assert.strictEqual(doc.status, 'UPLOAD_ACKNOWLEDGED');
    assert.ok(doc.documentId);
    assert.ok(doc.versionId);
    console.log(`[E2E] Document uploaded! Version ID: ${doc.versionId}, SHA-256: ${doc.sha256}`);

    // 7. Upload Document Revision (V2)
    console.log('[E2E] Uploading Document Revision V2...');
    const dummyDocV2 = Buffer.from('BEL DEFENCE RESTRICTED SPECIFICATION 2026 - REVISION 2');
    const formDocV2 = new FormData();
    formDocV2.append('file', new Blob([dummyDocV2], { type: 'text/plain' }), 'spec_v2.txt');

    const docV2Res = await fetch(`${API_BASE}/documents/${doc.documentId}/versions`, {
      method: 'POST',
      body: formDocV2,
    });
    assert.strictEqual(docV2Res.status, 201);
    const docV2 = await docV2Res.json();
    assert.strictEqual(docV2.seq, 2);
    console.log(`[E2E] Document V2 revision created! Version ID: ${docV2.versionId}`);

    // Wait 3s for BullMQ workers to compute leaf hashes & build Merkle batch
    console.log('[E2E] Waiting for Worker to generate Merkle batch...');
    await new Promise((r) => setTimeout(r, 4000));

    // 8. Test Verification Engine
    console.log(`[E2E] Running Independent Cryptographic Verification for V1: ${doc.versionId}...`);
    const verifyRes = await fetch(`${API_BASE}/verify/${doc.versionId}`, {
      method: 'POST',
    });
    assert.strictEqual(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    console.log('[E2E] Verification details:', JSON.stringify(verifyData.steps, null, 2));

    assert.strictEqual(verifyData.steps.objectRetrieved, true);
    assert.strictEqual(verifyData.steps.sha256Match, true);
    assert.strictEqual(verifyData.steps.merkleInclusionMatch, true);
    console.log('[E2E] All cryptographic checks succeeded!');

    // 9. Check Dashboard Stats
    console.log('[E2E] Verifying stats update...');
    const statsRes = await fetch(`${API_BASE}/audit/stats`);
    const stats = await statsRes.json();
    assert.ok(stats.identitiesCount >= 1);
    assert.ok(stats.documentsCount >= 1);
    assert.ok(stats.assetsCount >= 1);
    console.log('[E2E] Final Stats:', stats);

  } finally {
    gateway.kill();
    workers.kill();
  }
});
