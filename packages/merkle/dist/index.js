"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashLeaf = hashLeaf;
exports.buildMerkleTree = buildMerkleTree;
exports.verifyProof = verifyProof;
const ethers_1 = require("ethers");
function hashLeaf(documentId, versionId, sha256Hex) {
    const docHash = ethers_1.ethers.id(documentId);
    const verHash = ethers_1.ethers.id(versionId);
    const cleanSha = sha256Hex.startsWith('0x') ? sha256Hex : `0x${sha256Hex}`;
    return ethers_1.ethers.solidityPackedKeccak256(['bytes32', 'bytes32', 'bytes32'], [docHash, verHash, cleanSha]);
}
function hashPair(a, b) {
    // Sort pairs strictly matching Solidity: hash < p ? keccak256(hash, p) : keccak256(p, hash)
    const aBig = BigInt(a);
    const bBig = BigInt(b);
    return aBig < bBig
        ? ethers_1.ethers.solidityPackedKeccak256(['bytes32', 'bytes32'], [a, b])
        : ethers_1.ethers.solidityPackedKeccak256(['bytes32', 'bytes32'], [b, a]);
}
function buildMerkleTree(leaves) {
    if (leaves.length === 0) {
        throw new Error('Cannot build tree with zero leaves');
    }
    // Work with a copy
    const leafNodes = [...leaves];
    const layers = [leafNodes];
    while (layers[layers.length - 1].length > 1) {
        const currentLayer = layers[layers.length - 1];
        const nextLayer = [];
        for (let i = 0; i < currentLayer.length; i += 2) {
            if (i + 1 < currentLayer.length) {
                nextLayer.push(hashPair(currentLayer[i], currentLayer[i + 1]));
            }
            else {
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
        getProof(leafIndex) {
            if (leafIndex < 0 || leafIndex >= leafNodes.length) {
                throw new Error(`Leaf index ${leafIndex} out of bounds`);
            }
            const proof = [];
            let index = leafIndex;
            for (let l = 0; l < layers.length - 1; l++) {
                const layer = layers[l];
                const isRight = index % 2 === 1;
                const pairIndex = isRight ? index - 1 : index + 1;
                if (pairIndex < layer.length) {
                    proof.push(layer[pairIndex]);
                }
                else {
                    // If odd and at end, paired with itself
                    proof.push(layer[index]);
                }
                index = Math.floor(index / 2);
            }
            return proof;
        },
    };
}
function verifyProof(leaf, proof, root) {
    let hash = leaf;
    for (const p of proof) {
        hash = hashPair(hash, p);
    }
    return hash.toLowerCase() === root.toLowerCase();
}
