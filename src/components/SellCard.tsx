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
  selectedStrategy
}: SellCardProps) => {
  const [tethAmount, setTethAmount] = useState("");

  const { handleOrder, isSelling } = useSelling();

  const getAssetDescription = () => {
    if (!selectedStrategy) return "";
    return `${selectedStrategy.charAt(0).toUpperCase()}${selectedStrategy.slice(1)}`;
  };

  return (
    <Card className="bg-tapir-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-purple-500" />
          Sell {selectedStrategy && <span className="text-tapir-purple font-normal text-sm">• { getAssetDescription() }</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <EthInput
            amount={tethAmount}
            setAmount={setTethAmount}
            userBalance={userBalance}
            isWalletConnected={isWalletConnected}
            isLoadingBalance={isLoadingBalance}
          />

          <Button
            onClick={() => handleOrder(tethAmount)}
            disabled={!isWalletConnected || isSelling || parseFloat(userBalance.displayValue) <= 0}
            className="w-full bg-purple-500 hover:opacity-90 text-white"
          >
            {!isWalletConnected &&
              <>
                Connect Wallet
              </>
            }

            {parseFloat(userBalance.displayValue) <= 0 &&
              <>
                Insufficient Amount
              </>
            }

            {isSelling &&
              <>
                <span className="animate-spin mr-2">◌</span>
                Swap in progress...
              </>
            }
          </Button>

          <StakingInfo
            ethAmount={tethAmount}
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