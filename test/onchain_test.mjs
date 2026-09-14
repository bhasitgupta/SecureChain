const API_BASE = 'http://127.0.0.1:3001/api';

async function testOnChain() {
  console.log('--- 1. Testing On-Chain DID Registration ---');
  const targetAccount = '0x111122223333444455556666777788889999aaaa';
  const idRes = await fetch(`${API_BASE}/identity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      account: targetAccount,
      subjectId: 'BEL-AIRFORCE-901',
    }),
  });
  const idData = await idRes.json();
  console.log('Identity API Result:', idData);
  if (idData.txHash) {
    console.log(`✅ On-Chain Identity Tx: https://amoy.polygonscan.com/tx/${idData.txHash}`);
  }

  console.log('\n--- 2. Testing On-Chain Asset NFT Minting with Thumbnail ---');
  const dummyImage = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  const formAsset = new FormData();
  formAsset.append('to', targetAccount);
  formAsset.append('assetClass', 'Tactical Radar Receiver');
  formAsset.append('thumbnail', new Blob([dummyImage], { type: 'image/png' }), 'radar_thumb.png');

  const assetRes = await fetch(`${API_BASE}/assets/mint`, {
    method: 'POST',
    body: formAsset,
  });
  const assetData = await assetRes.json();
  console.log('Asset Mint Result:', assetData);
  if (assetData.txHash) {
    console.log(`✅ On-Chain NFT Mint Tx: https://amoy.polygonscan.com/tx/${assetData.txHash}`);
  }

  console.log('\n--- 3. Testing Document Ingestion + On-Chain Anchoring ---');
  const docPayload = Buffer.from(`CONFIDENTIAL BEL SYSTEM ARCHITECTURE DOCUMENT ${Date.now()}`);
  const formDoc = new FormData();
  formDoc.append('title', 'Aero Space Spec 2026');
  formDoc.append('file', new Blob([docPayload], { type: 'text/plain' }), 'aero.txt');

  const docRes = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    body: formDoc,
  });
  const docData = await docRes.json();
  console.log('Document Upload Result:', docData);

  console.log('\n--- 4. Waiting 12s for Worker to batch and submit anchor transaction on Polygon Amoy ---');
  await new Promise((r) => setTimeout(r, 12000));

  console.log(`\n--- 5. Verifying Document Cryptographic Proof ---`);
  const verifyRes = await fetch(`${API_BASE}/verify/${docData.versionId}`, {
    method: 'POST',
  });
  const verifyData = await verifyRes.json();
  console.log('Verification Complete:');
  console.log('Valid:', verifyData.valid);
  console.log('Steps:', JSON.stringify(verifyData.steps, null, 2));
  console.log('Details:', JSON.stringify(verifyData.details, null, 2));
}

testOnChain().catch(console.error);
