export declare function hashLeaf(documentId: string, versionId: string, sha256Hex: string): string;
export interface MerkleTree {
    root: string;
    leaves: string[];
    getProof(leafIndex: number): string[];
}
export declare function buildMerkleTree(leaves: string[]): MerkleTree;
export declare function verifyProof(leaf: string, proof: string[], root: string): boolean;
