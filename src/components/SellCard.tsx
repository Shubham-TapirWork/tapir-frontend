import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useState } from "react";
import { EthInput } from "./EthInput";
import { StakingInfo } from "./StakingInfo";
import { useSelling } from "@/hooks/useSell";

interface SellCardProps {
  isWalletConnected: boolean;
  userBalance: {
    value: bigint;
    decimals: number;
    displayValue: string;
    symbol: string;
    name: string;
  };
  isLoadingBalance: boolean;
  selectedStrategy: "safe" | "regular" | "boosted" | null;
}

export const SellCard = ({
  isWalletConnected,
  userBalance,
  isLoadingBalance,
  selectedStrategy,
}: SellCardProps) => {
  const [amount, setAmount] = useState("");

  const { handleOrder, isSelling } = useSelling();

  const getAssetDescription = () => {
    if (!selectedStrategy) return "";
    switch (selectedStrategy) {
      case "safe":
        return "Depeg Protected Asset";
      case "regular":
        return "tEth";
      case "boosted":
        return "Yield Boosted Asset";
      default:
        return "";
    }
  };

  return (
    <Card className="bg-tapir-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-purple-500" />
          Sell {selectedStrategy && getAssetDescription()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <EthInput
            amount={amount}
            setAmount={setAmount}
            userBalance={userBalance}
            isWalletConnected={isWalletConnected}
            isLoadingBalance={isLoadingBalance}
          />

          <Button
            onClick={() => handleOrder(amount)}
            disabled={!isWalletConnected || isSelling || parseFloat(userBalance?.displayValue) <= parseFloat(amount || '0')}
            className="w-full bg-purple-500 hover:opacity-90 text-white"
          >
            {(() => {
              if (!isWalletConnected) return "Connect Wallet";
              if (parseFloat(userBalance?.displayValue) <= parseFloat(amount || '0'))
                return "Insufficient Balance";
              if (isSelling)
                return (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Swap in progress...
                  </>
                );
              return "Sell";
            })()}
          </Button>

          <StakingInfo
            ethAmount={amount}
            exchangeRate={1}
            maxTransactionCost="$12.48"
            rewardFee="10%"
            selectedStrategy={selectedStrategy || "regular"}
          />
        </div>
      </CardContent>
    </Card>
  );
};
