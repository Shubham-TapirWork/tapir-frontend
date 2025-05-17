import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useActiveAccount, useWalletBalance, useActiveWalletChain } from "thirdweb/react";

import { StakingCard } from "./StakingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StakeCard } from "./StakeCard";
import { SellCard } from "./SellCard";
import { client } from "@/client";
import tethContract from "@/contracts/tethContract.json";
import dpContract from "@/contracts/dpContract.json";
import ybContract from "@/contracts/ybContract.json";

export const MainTradeWidget = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStrategy = (searchParams.get("strategy") as "safe" | "regular" | "boosted") || "regular";
  const selectedTab = searchParams.get("swapTab") || "buy";

  // Get connected wallet address
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const isWalletConnected = !!account;

  // Get native token balance
  const { data: ethBalance, isLoading: isLoadingBalance, isError: isErrorNativeBalance } = useWalletBalance({
    chain: activeChain,
    address: account?.address,
    client,
  });

  // Get tEth token balance
  const { data: tEthBalance, isLoading: isLoadingtEthBalance, isError: isErrortEthTokenBalance } = useWalletBalance({
    chain: activeChain,
    address: account?.address,
    client,
    tokenAddress: tethContract.address
  });

  // Get DP token balance
  const { data: dpBalance, isLoading: isLoadingdpBalance, isError: isErrordpTokenBalance } = useWalletBalance({
    chain: activeChain,
    address: account?.address,
    client,
    tokenAddress: dpContract.address
  });

  // Get YB token balance
  const { data: ybBalance, isLoading: isLoadingybBalance, isError: isErrorybTokenBalance } = useWalletBalance({
    chain: activeChain,
    address: account?.address,
    client,
    tokenAddress: ybContract.address
  });

  const handleStrategySelect = (strategy: "safe" | "regular" | "boosted") => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    newParams.set('strategy', strategy);
    setSearchParams(newParams);
  };

  const getBalanceForStrategy = () => {
    switch (selectedStrategy) {
      case "safe":
        return { balance: dpBalance, isLoading: isLoadingdpBalance };
      case "boosted":
        return { balance: ybBalance, isLoading: isLoadingybBalance };
      default:
        return { balance: tEthBalance, isLoading: isLoadingtEthBalance };
    }
  };

  const { balance: selectedBalance, isLoading: selectedIsLoading } = getBalanceForStrategy();

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('swapTab', value);
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StakingCard
          title="Base ETH Asset"
          description="Pendle asset"
          apy="4.15%"
          type="regular"
          isSelected={selectedStrategy === "regular"}
          onSelect={() => handleStrategySelect("regular")}
          disabled={!isWalletConnected}
        />
        <StakingCard
          title="Depeg Protected ETH Asset"
          description="Depeg Protected"
          apy="8.15%"
          type="safe"
          isSelected={selectedStrategy === "safe"}
          onSelect={() => handleStrategySelect("safe")}
          disabled={!isWalletConnected}
        />
        <StakingCard
          title="Yield Boosted ETH Asset"
          description="Yield Boosted"
          apy="12.50%"
          type="boosted"
          isSelected={selectedStrategy === "boosted"}
          onSelect={() => handleStrategySelect("boosted")}
          disabled={!isWalletConnected}
        />
      </div>

      <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full bg-tapir-card/50 border border-purple-500/20">
          <TabsTrigger 
            value="buy" 
            className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger 
            value="sell" 
            className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Sell
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy">
          <StakeCard
            isWalletConnected={isWalletConnected}
            userBalance={ethBalance}
            isLoadingBalance={isLoadingBalance}
            selectedStrategy={selectedStrategy}
          />
        </TabsContent>
        
        <TabsContent value="sell">
          <SellCard
            isWalletConnected={isWalletConnected}
            userBalance={selectedBalance}
            isLoadingBalance={selectedIsLoading}
            selectedStrategy={selectedStrategy}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};