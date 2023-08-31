import { InjectedConnector } from '@web3-react/injected-connector';

const SUPPORTED_CHAIN_IDS = [
  11155111 //for sepolia
];

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS
});
