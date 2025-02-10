import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getMetaMaskProvider,
  shortenAddress,
  startChainDetection,
  startAccountsDetection,
  switchToSupportedNetwork,
  SUPPORTED_CHAIN_IDS,
} from "@/lib/wallet";

export const WalletButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [balance, setBalance] = useState<string>("0");

  const fetchBalance = async (address: string) => {
    const provider = getMetaMaskProvider();
    if (provider) {
      try {
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
        setBalance(balanceInEth);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance("0");
      }
    }
  };

  const checkNetwork = async (chainId: string) => {
    const isSupported = SUPPORTED_CHAIN_IDS.includes(chainId);
    setIsWrongNetwork(!isSupported);
    if (!isSupported) {
      toast.error("Please switch to a supported network", {
        className: "sonner-toast",
      });
    } else if (address) {
      // Fetch balance when network is correct and address is available
      fetchBalance(address);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
      setBalance("0");
      toast.error("Please connect to MetaMask", {
        className: "sonner-toast",
      });
    } else {
      setAddress(accounts[0]);
      fetchBalance(accounts[0]);
      toast.success("Wallet connected successfully", {
        className: "sonner-toast",
      });
    }
  };

  useEffect(() => {
    // Start listening for network changes
    startChainDetection(checkNetwork);
    
    // Start listening for account changes
    startAccountsDetection(handleAccountsChanged);

    // Check if already connected
    const provider = getMetaMaskProvider();
    if (provider) {
      provider.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(console.error);
      
      provider.request({ method: 'eth_chainId' })
        .then(checkNetwork)
        .catch(console.error);
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    const provider = getMetaMaskProvider();

    if (!provider) {
      toast.error("Please install MetaMask!", {
        className: "sonner-toast",
      });
      setIsConnecting(false);
      return;
    }

    try {
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
      
      const chainId = await provider.request({ method: 'eth_chainId' });
      await checkNetwork(chainId);
      
      if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
        const switched = await switchToSupportedNetwork();
        if (!switched) {
          toast.error("Failed to switch network", {
            className: "sonner-toast",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet", {
        className: "sonner-toast",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (address) {
    return (
      <Button
        variant="outline"
        className="bg-tapir-purple hover:bg-tapir-purple/90 text-white font-semibold"
        onClick={() => {}}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isWrongNetwork ? "Wrong Network" : `${shortenAddress(address)} (${balance} ETH)`}
      </Button>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-tapir-purple hover:bg-tapir-purple/90 text-white font-semibold"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};