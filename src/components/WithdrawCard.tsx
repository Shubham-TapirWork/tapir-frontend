import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useState } from "react";
import { EthInput } from "./EthInput";
import { StakingInfo } from "./StakingInfo";
import { useWithdraw } from "@/hooks/useWithdraw";

interface WithdrawCardProps {
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

export const WithdrawCard = ({
  isWalletConnected,
  userBalance,
  isLoadingBalance,
  selectedStrategy
}: WithdrawCardProps) => {
  const [tethAmount, setTethAmount] = useState("");

  const { handleWithdraw, isWithdrawing } = useWithdraw();

  return (
    <Card className="bg-tapir-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-purple-500" />
          Withdraw {userBalance?.symbol}
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
            onClick={() => handleWithdraw(tethAmount)}
            disabled={!isWalletConnected || isWithdrawing || parseFloat(userBalance.displayValue) <= 0}
            className="w-full bg-purple-500 hover:opacity-90 text-white"
          >
            {isWithdrawing ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Withdrawing...
              </>
            ) : "Sell"}
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