import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { useState } from "react";
import { EthInput } from "./EthInput";
import { StakingInfo } from "./StakingInfo";
import { useWithdraw } from "@/hooks/useWithdraw";
import { getMetaMaskProvider } from "@/lib/wallet";

interface WithdrawCardProps {
  isWalletConnected: boolean;
  userBalance: string;
  isLoadingBalance: boolean;
  fetchBalance: (address: string) => Promise<void>;
  fetchEthBalance: (address: string) => Promise<void>;
  selectedStrategy: "safe" | "regular" | "boosted" | null;
}

export const WithdrawCard = ({
  isWalletConnected,
  userBalance,
  isLoadingBalance,
  fetchBalance,
  fetchEthBalance,
  selectedStrategy
}: WithdrawCardProps) => {
  const [tethAmount, setTethAmount] = useState("");
  
  const refreshBalances = async () => {
    const provider = getMetaMaskProvider();
    const accounts = await provider.request({ method: 'eth_accounts' });
    if (accounts[0]) {
      await Promise.all([
        fetchBalance(accounts[0]),
        fetchEthBalance(accounts[0])
      ]);
    }
  };

  const { handleWithdraw, isWithdrawing } = useWithdraw({
    onSuccess: refreshBalances
  });

  const getTokenName = () => {
    switch (selectedStrategy) {
      case "safe":
        return "DP_wETH";
      case "boosted":
        return "YB_wETH";
      case "regular":
      default:
        return "tETH";
    }
  };

  return (
    <Card className="bg-tapir-card border-tapir-purple/20 hover:border-tapir-purple/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-tapir-purple" />
          Withdraw {getTokenName()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <EthInput
            ethAmount={tethAmount}
            setEthAmount={setTethAmount}
            userBalance={userBalance}
            isWalletConnected={isWalletConnected}
            isLoadingBalance={isLoadingBalance}
            label={`${getTokenName()} amount`}
          />

          <Button
            onClick={() => handleWithdraw(tethAmount)}
            disabled={!isWalletConnected || isWithdrawing || parseFloat(userBalance) <= 0}
            className="w-full bg-gradient-to-r from-tapir-purple to-tapir-accent hover:opacity-90 text-white"
          >
            {isWithdrawing ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Withdrawing...
              </>
            ) : "Withdraw Now"}
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