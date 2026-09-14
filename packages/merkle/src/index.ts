import { keccak256, encodePacked, stringToHex } from 'viem';

export function hashLeaf(documentId: string, versionId: string, sha256Hex: string): `0x${string}` {
  const docHash = keccak256(stringToHex(documentId));
  const verHash = keccak256(stringToHex(versionId));
  const cleanSha = (sha256Hex.startsWith('0x') ? sha256Hex : `0x${sha256Hex}`) as `0x${string}`;
  return keccak256(
    encodePacked(
      ['bytes32', 'bytes32', 'bytes32'],
      [docHash, verHash, cleanSha]
    )
  );
}

function hashPair(a: `0x${string}`, b: `0x${string}`): `0x${string}` {
  // Sort pairs strictly matching Solidity: hash < p ? keccak256(hash, p) : keccak256(p, hash)
  const aBig = BigInt(a);
  const bBig = BigInt(b);
  return aBig < bBig
    ? keccak256(encodePacked(['bytes32', 'bytes32'], [a, b]))
    : keccak256(encodePacked(['bytes32', 'bytes32'], [b, a]));
}

export interface MerkleTree {
  root: `0x${string}`;
  leaves: `0x${string}`[];
  getProof(leafIndex: number): `0x${string}`[];
}

export function buildMerkleTree(leaves: `0x${string}`[]): MerkleTree {
  if (leaves.length === 0) {
    throw new Error('Cannot build tree with zero leaves');
  }

  // Work with a copy
  const leafNodes = [...leaves];
  const layers: `0x${string}`[][] = [leafNodes];

  while (layers[layers.length - 1].length > 1) {
    const currentLayer = layers[layers.length - 1];
    const nextLayer: `0x${string}`[] = [];

    for (let i = 0; i < currentLayer.length; i += 2) {
      if (i + 1 < currentLayer.length) {
        nextLayer.push(hashPair(currentLayer[i], currentLayer[i + 1]));
      } else {
        // Odd leaf: duplicate or carry over. We duplicate to complete pair
        nextLayer.push(hashPair(currentLayer[i], currentLayer[i]));
      }
    }
    layers.push(nextLayer);
  }

  const root = layers[layers.length - 1][0];

  return {
    root,
    leaves: leafNodes,
    getProof(leafIndex: number): `0x${string}`[] {
      if (leafIndex < 0 || leafIndex >= leafNodes.length) {
        throw new Error(`Leaf index ${leafIndex} out of bounds`);
      }
      const proof: `0x${string}`[] = [];
      let index = leafIndex;

      for (let l = 0; l < layers.length - 1; l++) {
        const layer = layers[l];
        const isRight = index % 2 === 1;
        const pairIndex = isRight ? index - 1 : index + 1;

        if (pairIndex < layer.length) {
          proof.push(layer[pairIndex]);
        } else {
          // If odd and at end, paired with itself
          proof.push(layer[index]);
        }
        index = Math.floor(index / 2);
      }

      return proof;
    },
  };
}

export function verifyProof(leaf: `0x${string}`, proof: `0x${string}`[], root: `0x${string}`): boolean {
  let hash = leaf;
  for (const p of proof) {
    hash = hashPair(hash, p);
  }
  return hash.toLowerCase() === root.toLowerCase();
}
