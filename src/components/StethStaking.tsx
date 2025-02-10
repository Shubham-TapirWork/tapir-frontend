import { useState, useEffect } from "react";
import { StakingCard } from "./StakingCard";
import { getMetaMaskProvider } from "@/lib/wallet";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StakeCard } from "./StakeCard";
import { WithdrawCard } from "./WithdrawCard";
import { getTethContract } from "@/lib/contracts";
import { ethers } from "ethers";

export const StethStaking = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<"safe" | "regular" | "boosted" | null>(null);
  const [userBalance, setUserBalance] = useState<string>("0");
  const [userTethBalance, setUserTethBalance] = useState<string>("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingTethBalance, setIsLoadingTethBalance] = useState(false);

  useEffect(() => {
    const provider = getMetaMaskProvider();
    if (provider) {
      provider.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          setIsWalletConnected(accounts.length > 0);
          if (accounts.length > 0) {
            fetchBalance(accounts[0]);
            fetchTethBalance(accounts[0]);
          }
        })
        .catch(console.error);

      provider.on('accountsChanged', (accounts: string[]) => {
        setIsWalletConnected(accounts.length > 0);
        if (accounts.length > 0) {
          fetchBalance(accounts[0]);
          fetchTethBalance(accounts[0]);
        } else {
          setUserBalance("0");
          setUserTethBalance("0");
        }
      });
    }
  }, []);

  const fetchBalance = async (address: string) => {
    const provider = getMetaMaskProvider();
    if (provider) {
      setIsLoadingBalance(true);
      try {
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        const balanceInEth = (parseInt(balance, 16) / 1e18).toFixed(4);
        setUserBalance(balanceInEth);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setUserBalance("0");
      } finally {
        setIsLoadingBalance(false);
      }
    }
  };

  const fetchTethBalance = async (address: string) => {
    setIsLoadingTethBalance(true);
    try {
      const tethContract = await getTethContract();
      if (!tethContract) {
        throw new Error("Failed to get tETH contract");
      }
      const balance = await tethContract.balanceOf(address);
      const balanceInEth = ethers.formatEther(balance);
      setUserTethBalance(balanceInEth);
    } catch (error) {
      console.error('Error fetching tETH balance:', error);
      setUserTethBalance("0");
    } finally {
      setIsLoadingTethBalance(false);
    }
  };

  const handleStrategySelect = (strategy: "safe" | "regular" | "boosted") => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setSelectedStrategy(strategy);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StakingCard
          title="Regular Staking"
          description="Balanced risk and reward"
          apy="4.20%"
          type="regular"
          isSelected={selectedStrategy === "regular"}
          onSelect={() => handleStrategySelect("regular")}
          disabled={!isWalletConnected}
        />
        <StakingCard
          title="Safe Staking"
          description="Lower risk, stable returns"
          apy="8.15%"
          type="safe"
          isSelected={selectedStrategy === "safe"}
          onSelect={() => handleStrategySelect("safe")}
          disabled={!isWalletConnected}
        />
        <StakingCard
          title="Boosted Staking"
          description="Higher risk, higher returns"
          apy="12.50%"
          type="boosted"
          isSelected={selectedStrategy === "boosted"}
          onSelect={() => handleStrategySelect("boosted")}
          disabled={!isWalletConnected}
        />
      </div>

      <Tabs defaultValue="stake" className="w-full">
        <TabsList className="w-full bg-tapir-card/50 border border-tapir-purple/20">
          <TabsTrigger 
            value="stake" 
            className="flex-1 data-[state=active]:bg-tapir-purple data-[state=active]:text-white"
          >
            Stake
          </TabsTrigger>
          <TabsTrigger 
            value="withdraw" 
            className="flex-1 data-[state=active]:bg-tapir-purple data-[state=active]:text-white"
          >
            Withdraw
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stake">
          <StakeCard
            isWalletConnected={isWalletConnected}
            userBalance={userBalance}
            isLoadingBalance={isLoadingBalance}
            selectedStrategy={selectedStrategy}
            fetchBalance={fetchBalance}
            fetchTethBalance={fetchTethBalance}
          />
        </TabsContent>
        
        <TabsContent value="withdraw">
          <WithdrawCard
            isWalletConnected={isWalletConnected}
            userBalance={userTethBalance}
            isLoadingBalance={isLoadingTethBalance}
            fetchBalance={fetchTethBalance}
            fetchEthBalance={fetchBalance}
            selectedStrategy={selectedStrategy}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};