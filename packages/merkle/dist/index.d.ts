export declare function hashLeaf(documentId: string, versionId: string, sha256Hex: string): `0x${string}`;
export interface MerkleTree {
    root: `0x${string}`;
    leaves: `0x${string}`[];
    getProof(leafIndex: number): `0x${string}`[];
}
export declare function buildMerkleTree(leaves: `0x${string}`[]): MerkleTree;
export declare function verifyProof(leaf: `0x${string}`, proof: `0x${string}`[], root: `0x${string}`): boolean;
