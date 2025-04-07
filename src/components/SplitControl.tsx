import { useState } from "react";
import { toast } from "sonner";
import { parseEther } from "ethers";
import { defineChain, getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { useActiveAccount, useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { client } from "@/client";
import contracts from "@/contracts/contracts.json";
import { CHAIN_ID } from "@/constants/env";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EthInput } from "@/components/EthInput";

export const SplitControl = () => {
  const [ethAmount, setEthAmount] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);

  // Get connected wallet address
  const account = useActiveAccount();
  const chain = useActiveWalletChain();

  // Get native token balance
  const { data: balance, isLoading: isLoadingBalance, isError: isErrorNativeBalance } = useWalletBalance({
    chain,
    address: account?.address,
    client,
  });

  const contract = getContract({
    client,
    chain: defineChain(CHAIN_ID),
    address: contracts.depegPoolContract.address,
  });

  const transaction = prepareContractCall({
    contract,
    method: "function splitToken(uint256 _amount)",
    params: [parseEther(ethAmount || "0")],
    value: parseEther(ethAmount || "0"),
  });

  const validateInput = (amount: string): boolean => {
    if (!amount || !account?.address) {
      toast.error("Please enter an amount and connect your wallet");
      return false;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return false;
    }

    const walletBalance = parseFloat(balance?.displayValue || "0");
    if (parsedAmount > walletBalance) {
      toast.error("Insufficient balance");
      return false;
    }

    return true;
  };

  const handleSplit = async () => {
    if (!validateInput(ethAmount)) return;

    try {
      setIsSplitting(true);
      toast.info("Splitting ETH...");

      await sendAndConfirmTransaction({
        transaction,
        account: account!,
      });

      toast.success("Successfully split ETH into DP and YB tokens!");
    } catch (error) {
      console.error("Split failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to split ETH");
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <Card className="bg-tapir-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white text-lg font-medium">Split ETH into DP and YB</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <EthInput
            amount={ethAmount}
            setAmount={setEthAmount}
            userBalance={balance}
            isWalletConnected={!!account}
            isLoadingBalance={isLoadingBalance}
          />

          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Split ratio</span>
              <span>50% DP - 50% YB</span>
            </div>

            <div className="space-y-2">
              <label className="text-base text-white">You'll get:</label>
              <div className="grid grid-cols-2">
                <label className="text-sm text-gray-400">
                  DP Amount: {Number(ethAmount) / 2} DP
                </label>
                <label className="text-sm text-gray-400">
                  YB Amount: {Number(ethAmount) / 2} YB
                </label>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSplit}
          disabled={!ethAmount || Number(balance?.displayValue) < Number(ethAmount) || isSplitting || !account}
          className="w-full bg-purple-500 hover:bg-purple-500/90 text-white transition-all duration-300 hover:scale-[1.02] active:scale-95"
        >
          {!account ? "Connect Wallet" :
           Number(balance?.displayValue) < Number(ethAmount) ? "Insufficient balance" :
           isSplitting ? "Splitting..." : "Split ETH"}
        </Button>
      </CardContent>
    </Card>
  );
};
