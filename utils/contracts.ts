import { ethers } from 'ethers';

const addresses = require('./addresses.json');

export function getMarketplaceContract(chainId: string, signer: any) {
  const abi = require('./abi/marketplace.json').abi;
  const contractAddress = addresses[chainId].marketPlaceAddress;

  return new ethers.Contract(contractAddress, abi, signer);
}

export function getMinterContract(chainId: string, signer: any) {
  const abi = require('./abi/nft.json').abi;
  const contractAddress = addresses[chainId].nftMinterAddress;

  return new ethers.Contract(contractAddress, abi, signer);
}
