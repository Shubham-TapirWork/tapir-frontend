import { useState } from "react";
import { StakingCard } from "./StakingCard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StakeCard } from "./StakeCard";
import { WithdrawCard } from "./WithdrawCard";
import { useActiveAccount, useWalletBalance, useActiveWalletChain } from "thirdweb/react";
import contracts from "@/contracts/contracts.json";
import { client } from "@/client";

export const StethStaking = () => {
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

  // Get tETH token balance
  const { data: tethBalance, isLoading: isLoadingTethBalance, isError: isErrorTokenBalance } = useWalletBalance({
    chain: activeChain,
    address: account?.address,
    client,
    tokenAddress: contracts.tethContract.address
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* <StakingCard
          title="Safe Staking"
          description="Lower risk, stable returns"
          apy="4.20%"
          type="regular"
          isSelected={selectedStrategy === "regular"}
          onSelect={() => handleStrategySelect("regular")}
          disabled={!isWalletConnected}
        /> */}
        <StakingCard
          title="DP_token"
          description="Depeg-protected asset"
          apy="8.15%"
          type="safe"
          isSelected={selectedStrategy === "safe"}
          onSelect={() => handleStrategySelect("safe")}
          disabled={!isWalletConnected}
        />
        <StakingCard
          title="YB_token"
          description="Yield-boosted asset"
          apy="12.50%"
          type="boosted"
          isSelected={selectedStrategy === "boosted"}
          onSelect={() => handleStrategySelect("boosted")}
          disabled={!isWalletConnected}
        />
      </div>

      <Tabs defaultValue="stake" className="w-full">
        <TabsList className="w-full bg-tapir-card/50 border border-purple-500/20">
          <TabsTrigger 
            value="stake" 
            className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger 
            value="withdraw" 
            className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Sell
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stake">
          <StakeCard
            isWalletConnected={isWalletConnected}
            userBalance={ethBalance}
            isLoadingBalance={isLoadingBalance}
            selectedStrategy={selectedStrategy}
          />
        </TabsContent>
        
        <TabsContent value="withdraw">
          <WithdrawCard
            isWalletConnected={isWalletConnected}
            userBalance={tethBalance}
            isLoadingBalance={isLoadingTethBalance}
            selectedStrategy={selectedStrategy}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};