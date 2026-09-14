import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org'
);

const signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);

console.log('🚀 Compiling and deploying to Polygon Amoy with deployer:', signer.address);

// Read contract sources
const contractsDir = path.resolve('contracts/src');
const sources = {
  'IdentityAndAccessManager.sol': {
    content: fs.readFileSync(path.join(contractsDir, 'IdentityAndAccessManager.sol'), 'utf8'),
  },
  'EnterpriseAssetNFT.sol': {
    content: fs.readFileSync(path.join(contractsDir, 'EnterpriseAssetNFT.sol'), 'utf8'),
  },
  'DocumentAnchorRegistry.sol': {
    content: fs.readFileSync(path.join(contractsDir, 'DocumentAnchorRegistry.sol'), 'utf8'),
  },
  'RecoveryManager.sol': {
    content: fs.readFileSync(path.join(contractsDir, 'RecoveryManager.sol'), 'utf8'),
  },
};

const input = {
  language: 'Solidity',
  sources,
  settings: {
    evmVersion: 'paris',
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

console.log('📦 Compiling Solidity contracts with solc...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  const errors = output.errors.filter((e) => e.severity === 'error');
  if (errors.length > 0) {
    console.error('Compilation errors:', errors);
    process.exit(1);
  }
}
console.log('✅ Compilation successful!');

async function deployContract(name, sourceFile, args = []) {
  console.log(`\n⏳ Deploying ${name}...`);
  const contractData = output.contracts[sourceFile][name];
  const bytecode = `0x${contractData.evm.bytecode.object}`;
  const abi = contractData.abi;

  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy(...args);
  console.log(`  Tx sent: https://amoy.polygonscan.com/tx/${contract.deploymentTransaction().hash}`);

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log(`  ✅ ${name} deployed at: ${address}`);
  return address;
}

async function main() {
  // 1. Deploy IdentityAndAccessManager with initialAdmin = signer.address
  const iamAddress = await deployContract(
    'IdentityAndAccessManager',
    'IdentityAndAccessManager.sol',
    [signer.address]
  );

  // 2. Deploy EnterpriseAssetNFT
  const nftAddress = await deployContract(
    'EnterpriseAssetNFT',
    'EnterpriseAssetNFT.sol',
    ['Enterprise Asset', 'EASSET', iamAddress]
  );

  // 3. Deploy DocumentAnchorRegistry
  const anchorAddress = await deployContract(
    'DocumentAnchorRegistry',
    'DocumentAnchorRegistry.sol',
    [iamAddress]
  );

  // 4. Deploy RecoveryManager
  const recoveryAddress = await deployContract(
    'RecoveryManager',
    'RecoveryManager.sol',
    [iamAddress]
  );

  console.log('\n================ DEPLOYMENT SUMMARY ================');
  console.log('IAM_ADDRESS=' + iamAddress);
  console.log('NFT_ADDRESS=' + nftAddress);
  console.log('ANCHOR_ADDRESS=' + anchorAddress);
  console.log('RECOVERY_ADDRESS=' + recoveryAddress);
  console.log('====================================================');

  // Update .env file
  let envContent = fs.readFileSync('.env', 'utf8');
  envContent = envContent.replace(/IAM_ADDRESS=.*/, `IAM_ADDRESS=${iamAddress}`);
  envContent = envContent.replace(/NFT_ADDRESS=.*/, `NFT_ADDRESS=${nftAddress}`);
  envContent = envContent.replace(/ANCHOR_ADDRESS=.*/, `ANCHOR_ADDRESS=${anchorAddress}`);
  envContent = envContent.replace(/RECOVERY_ADDRESS=.*/, `RECOVERY_ADDRESS=${recoveryAddress}`);
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env updated with live Polygon Amoy contract addresses!');
}

main().catch(console.error);
