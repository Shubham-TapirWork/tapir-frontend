import { useState } from "react";
import { StakingCard } from "./StakingCard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StakeCard } from "./StakeCard";
import { SellCard } from "./SellCard";
import { useActiveAccount, useWalletBalance, useActiveWalletChain } from "thirdweb/react";
import contracts from "@/contracts/contracts.json";
import { client } from "@/client";

export const MainTradeWidget = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<"safe" | "regular" | "boosted" | null>(null);

  // Get connected wallet address
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const isWalletConnected = !!account;

  // Get native token (ETH) balance
  const { data: ethBalance, isLoading: isLoadingBalance, isError: isErrorNativeBalance } = useWalletBalance({
    chain: activeChain,
    address: account?.address,
    client,
  });

  // Get DP token balance
  const { data: dpBalance, isLoading: isLoadingTethBalance, isError: isErrorTokenBalance } = useWalletBalance({
    chain: activeChain,
    address: account?.address,
    client,
    tokenAddress: contracts.dpContract.address
  });

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
          title="Regular Token"
          description="Pendle asset"
          apy="4.15%"
          type="regular"
          isSelected={selectedStrategy === "regular"}
          onSelect={() => handleStrategySelect("regular")}
          disabled={!isWalletConnected}
        />
        <StakingCard
          title="DP Token"
          description="Depeg-protected"
          apy="8.15%"
          type="safe"
          isSelected={selectedStrategy === "safe"}
          onSelect={() => handleStrategySelect("safe")}
          disabled={!isWalletConnected}
        />
        <StakingCard
          title="YB Token"
          description="Yield-boosted"
          apy="12.50%"
          type="boosted"
          isSelected={selectedStrategy === "boosted"}
          onSelect={() => handleStrategySelect("boosted")}
          disabled={!isWalletConnected}
        />
      </div>

      <Tabs defaultValue="buy" className="w-full">
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
            userBalance={dpBalance}
            isLoadingBalance={isLoadingTethBalance}
            selectedStrategy={selectedStrategy}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};