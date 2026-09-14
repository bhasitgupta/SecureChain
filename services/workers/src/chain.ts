import { ethers } from 'ethers';
import { config } from './config.js';
import { DocumentAnchorRegistryAbi } from '@sih26125/contracts';

export const provider = new ethers.JsonRpcProvider(
  config.polygonRpcUrl || 'https://polygon-amoy.drpc.org'
);

export const adminSigner = config.adminPrivateKey
  ? new ethers.Wallet(config.adminPrivateKey, provider)
  : null;

export const getAnchorContract = (runner: ethers.ContractRunner | null = adminSigner || provider) =>
  config.anchorAddress && runner ? new ethers.Contract(config.anchorAddress, DocumentAnchorRegistryAbi, runner) : null;
