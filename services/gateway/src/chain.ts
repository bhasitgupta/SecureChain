import { ethers } from 'ethers';
import { config } from './config.js';
import {
  IdentityAndAccessManagerAbi,
  EnterpriseAssetNFTAbi,
  DocumentAnchorRegistryAbi,
  RecoveryManagerAbi,
} from '@securechain/contracts';

export const provider = new ethers.JsonRpcProvider(
  config.polygonRpcUrl || 'https://polygon-amoy.drpc.org',
  undefined,
  { batchMaxCount: 1 }
);

export const adminSigner = config.adminPrivateKey
  ? new ethers.Wallet(config.adminPrivateKey, provider)
  : null;

export const getIamContract = (runner: ethers.ContractRunner | null = adminSigner || provider) =>
  config.iamAddress && runner ? new ethers.Contract(config.iamAddress, IdentityAndAccessManagerAbi, runner) : null;

export const getNftContract = (runner: ethers.ContractRunner | null = adminSigner || provider) =>
  config.nftAddress && runner ? new ethers.Contract(config.nftAddress, EnterpriseAssetNFTAbi, runner) : null;

export const getAnchorContract = (runner: ethers.ContractRunner | null = adminSigner || provider) =>
  config.anchorAddress && runner ? new ethers.Contract(config.anchorAddress, DocumentAnchorRegistryAbi, runner) : null;

export const getRecoveryContract = (runner: ethers.ContractRunner | null = adminSigner || provider) =>
  config.recoveryAddress && runner ? new ethers.Contract(config.recoveryAddress, RecoveryManagerAbi, runner) : null;
