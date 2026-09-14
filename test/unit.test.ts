import test from 'node:test';
import assert from 'node:assert';
import { formatDidPkh, hashDid } from '../packages/common/dist/index.js';
import { hashLeaf, buildMerkleTree, verifyProof } from '../packages/merkle/dist/index.js';

test('DID generation and hashing', () => {
  const address = '0x1234567890123456789012345678901234567890';
  const did = formatDidPkh(80002, address);
  assert.strictEqual(did, `did:pkh:eip155:80002:${address.toLowerCase()}`);

  const didHash = hashDid(did);
  assert.ok(didHash.startsWith('0x'));
  assert.strictEqual(didHash.length, 66);
});

test('Merkle tree construction and verification', () => {
  const leaves: `0x${string}`[] = [
    hashLeaf('doc1', 'v1', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
    hashLeaf('doc2', 'v1', 'ca978112ca1bbdcafac231b39a23dc4da7860814966a9bc298ff9d33261a8685'),
    hashLeaf('doc3', 'v1', '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce'),
    hashLeaf('doc4', 'v1', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'),
  ];

  const tree = buildMerkleTree(leaves);
  assert.ok(tree.root.startsWith('0x'));
  assert.strictEqual(tree.root.length, 66);

  // Check proof for each leaf
  for (let i = 0; i < leaves.length; i++) {
    const proof = tree.getProof(i);
    const valid = verifyProof(leaves[i], proof, tree.root);
    assert.strictEqual(valid, true, `Proof for leaf ${i} must be valid`);

    // Tamper test: flipped leaf must fail
    const tamperedLeaf = '0x0000000000000000000000000000000000000000000000000000000000000001' as `0x${string}`;
    const tamperedValid = verifyProof(tamperedLeaf, proof, tree.root);
    assert.strictEqual(tamperedValid, false, 'Tampered leaf must fail verification');
  }
});

test('Odd leaf count Merkle tree', () => {
  const leaves: `0x${string}`[] = [
    hashLeaf('doc1', 'v1', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
    hashLeaf('doc2', 'v1', 'ca978112ca1bbdcafac231b39a23dc4da7860814966a9bc298ff9d33261a8685'),
    hashLeaf('doc3', 'v1', '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce'),
  ];

  const tree = buildMerkleTree(leaves);
  for (let i = 0; i < leaves.length; i++) {
    const proof = tree.getProof(i);
    assert.strictEqual(verifyProof(leaves[i], proof, tree.root), true);
  }
});
