// Add ethereum to the window type
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const SUPPORTED_CHAIN_IDS = ["0xaa36a7"]; // Array of supported chain IDs (currently only Sepolia testnet)

export const getMetaMaskProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return window.ethereum;
  }
  return undefined;
};

export const shortenAddress = (address: string) => {
  return `${address.substring(0, 4)}...${address.substring(38)}`;
};

export const startChainDetection = (callback: (chainId: string) => void) => {
  const provider = getMetaMaskProvider();
  if (provider) {
    provider.on('chainChanged', (chainId: string) => {
      callback(chainId);
    });
  }
};

export const startAccountsDetection = (callback: (accounts: string[]) => void) => {
  const provider = getMetaMaskProvider();
  if (provider) {
    provider.on('accountsChanged', (accounts: string[]) => {
      callback(accounts);
    });
  }
};

export const switchToSupportedNetwork = async () => {
  const provider = getMetaMaskProvider();
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SUPPORTED_CHAIN_IDS[0] }], // Default to first supported chain
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SUPPORTED_CHAIN_IDS[0],
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
          return false;
        }
      }
      console.error('Failed to switch to Sepolia network:', switchError);
      return false;
    }
  }
  return false;
};