const API_BASE = 'http://127.0.0.1:3001/api';

async function run() {
  console.log('1. Testing /health...');
  const healthRes = await fetch('http://127.0.0.1:3001/health');
  console.log('Health:', await healthRes.json());

  console.log('\n2. Registering Identity...');
  const idRes = await fetch(`${API_BASE}/identity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      account: '0x1234567890123456789012345678901234567890',
      subjectId: 'BEL-EMP-5501',
    }),
  });
  const idData = await idRes.json();
  console.log('Identity registered:', idData);

  console.log('\n3. Minting Asset NFT with Thumbnail...');
  const dummyImage = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  const formAsset = new FormData();
  formAsset.append('to', '0x1234567890123456789012345678901234567890');
  formAsset.append('assetClass', 'Tactical Radar Core');
  formAsset.append('thumbnail', new Blob([dummyImage], { type: 'image/png' }), 'thumbnail.png');

  const assetRes = await fetch(`${API_BASE}/assets/mint`, {
    method: 'POST',
    body: formAsset,
  });
  const assetData = await assetRes.json();
  console.log('Asset minted:', assetData);

  console.log('\n4. Verifying Asset Thumbnail URL from MinIO...');
  const thumbRes = await fetch(`http://127.0.0.1:3001${assetData.thumbnailUrl}`);
  console.log('Thumbnail HTTP status:', thumbRes.status);
  const thumbBuf = await thumbRes.arrayBuffer();
  console.log('Thumbnail bytes received:', thumbBuf.byteLength);

  console.log('\n5. Uploading Confidential Document V1...');
  const dummyDoc = Buffer.from('BEL DEFENCE RESTRICTED SPECIFICATION 2026 - CONFIDENTIAL CLASSIFIED');
  const formDoc = new FormData();
  formDoc.append('title', 'Tactical Radar Spec 2026');
  formDoc.append('file', new Blob([dummyDoc], { type: 'text/plain' }), 'spec.txt');

  const docRes = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    body: formDoc,
  });
  const docData = await docRes.json();
  console.log('Document uploaded:', docData);

  console.log('\n6. Uploading Document Revision V2...');
  const dummyDocV2 = Buffer.from('BEL DEFENCE RESTRICTED SPECIFICATION 2026 - REVISED V2 CLASSIFIED');
  const formDocV2 = new FormData();
  formDocV2.append('file', new Blob([dummyDocV2], { type: 'text/plain' }), 'spec_v2.txt');

  const docV2Res = await fetch(`${API_BASE}/documents/${docData.documentId}/versions`, {
    method: 'POST',
    body: formDocV2,
  });
  const docV2Data = await docV2Res.json();
  console.log('Document V2 uploaded:', docV2Data);

  console.log('\n7. Waiting 5s for BullMQ Merkle batcher...');
  await new Promise((r) => setTimeout(r, 5000));

  console.log(`\n8. Running 4-Stage Cryptographic Verification for V1: ${docData.versionId}...`);
  const verifyRes = await fetch(`${API_BASE}/verify/${docData.versionId}`, {
    method: 'POST',
  });
  const verifyData = await verifyRes.json();
  console.log('Verification verdict:', verifyData);

  console.log('\n9. Checking Dashboard Metrics...');
  const statsRes = await fetch(`${API_BASE}/audit/stats`);
  console.log('Stats:', await statsRes.json());
}

run().catch(console.error);
