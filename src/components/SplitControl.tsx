import { useState } from "react";
import { toast } from "sonner";
import { parseEther } from "ethers";
import { defineChain, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount, useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { client } from "@/client";
import contracts from "@/contracts/contracts.json";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { EthInput } from "@/components/EthInput";

export const SplitControl = () => {
  const [ethAmount, setEthAmount] = useState("");
  const [splitRatio, setSplitRatio] = useState([50]); // Single value representing DP percentage
  const [isSplitting, setIsSplitting] = useState(false);

  // Get connected wallet address
  const account = useActiveAccount();
  const chain = useActiveWalletChain();

  // Get native token (ETH) balance
  const { data: balance, isLoading: isLoadingBalance, isError: isErrorNativeBalance } = useWalletBalance({
    chain,
    address: account?.address,
    client,
  });

  // Calculate token amounts based on split ratio
  const dpAmount = ethAmount ? (Number(ethAmount) * splitRatio[0] / 100) : "0";
  const ybAmount = ethAmount ? (Number(ethAmount) * (100 - splitRatio[0]) / 100) : "0";

  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: contracts.liquidityPoolContract.address,
  });

  const getDPETH = prepareContractCall({
    contract,
    method: "function getDPwtETHForETH(address _depegPoolAddress, address _stableSwap, address _ybAddress, address _dpAddress) payable",
    params: [contracts.depegPoolContract.address, contracts.stableSwapContract.address, contracts.ybContract.address, contracts.dpContract.address],
    value: parseEther(dpAmount.toString()),
  });

  const getYBETH = prepareContractCall({
    contract,
    method: "function getYBwtETHForETH(address _depegPoolAddress, address _stableSwap, address _ybAddress, address _dpAddress) payable",
    params: [contracts.depegPoolContract.address, contracts.stableSwapContract.address, contracts.ybContract.address, contracts.dpContract.address],
    value: parseEther(ybAmount.toString()),
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

  // TODO: Batch getDPETH and getYBETH calls into single transaction
  const handleSplit = async () => {
    if (!validateInput(ethAmount)) return;

    try {
      setIsSplitting(true);
      toast.info("Splitting ETH...");

      const { transactionHash: getDPETHtransactionHash } = await sendTransaction({
        transaction: getDPETH,
        account,
      });

      const { transactionHash: getYBETHtransactionHash } = await sendTransaction({
        transaction: getYBETH,
        account,
      });

      toast.success("Successfully split ETH into DP and YB tokens!");
    } catch (error) {
      console.error("Split failed:", error);
      toast.error(error.message || "Failed to split ETH");
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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Split ratio</span>
                <span>{splitRatio[0]}% DP - {100 - splitRatio[0]}% YB</span>
              </div>
              <Slider
                value={splitRatio}
                onValueChange={setSplitRatio}
                max={100}
                step={1}
                className="py-4"
                disabled={true}
              />
            </div>

            <div className="space-y-2">
              <label className="text-base text-white">You'll get:</label>
              <div className="grid grid-cols-2">
                <label className="text-sm text-gray-400">
                  DP Amount: {dpAmount} DP
                </label>
                <label className="text-sm text-gray-400">
                  YB Amount: {ybAmount} YB
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
