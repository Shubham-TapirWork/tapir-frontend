import { useState } from "react";
import { Coins } from "lucide-react";
import { toast } from "sonner";

import { parseEther } from "ethers";
import { useActiveAccount } from "thirdweb/react";
import { defineChain, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { client } from "@/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EthInput } from "./EthInput";
import { StakingInfo } from "./StakingInfo";
import { StakeButton } from "./stake/StakeButton";
import contracts from "@/contracts/contracts.json";

export const StakeCard = ({
  isWalletConnected,
  userBalance,
  isLoadingBalance,
  selectedStrategy,
}: {
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
}) => {
  const [ethAmount, setEthAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);

  const getAssetDescription = () => {
    if (!selectedStrategy) return "";
    return `${selectedStrategy.charAt(0).toUpperCase()}${selectedStrategy.slice(1)}`;
  };

  const account = useActiveAccount();
  const amountInWei = ethAmount ? parseEther(ethAmount) : parseEther("0");

  const depegPoolAddress = contracts.depegPoolContract.address;
  const stableSwapAddress = contracts.stableSwapContract.address;
  const ybAddress = contracts.ybContract.address;
  const dpAddress = contracts.dpContract.address;

  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: contracts.liquidityPoolContract.address,
  });

  const transaction = prepareContractCall({
    contract,
    method: "function deposit() payable returns (uint256)",
    params: [],
    value: amountInWei,
  });

  const safeTransaction = prepareContractCall({
    contract,
    method: "function getDPwtETHForETH(address _depegPoolAddress, address _stableSwap, address _ybAddress, address _dpAddress) payable",
    params: [depegPoolAddress, stableSwapAddress, ybAddress, dpAddress],
    value: amountInWei,
  });

  const boostedTransaction = prepareContractCall({
    contract,
    method: "function getYBwtETHForETH(address _depegPoolAddress, address _stableSwap, address _ybAddress, address _dpAddress) payable",
    params: [depegPoolAddress, stableSwapAddress, ybAddress, dpAddress],
    value: amountInWei,
  });

  const handleStake = async () => {
    if (!ethAmount || !selectedStrategy || !account?.address) return;

    // Validate input amount
    try {
      const amount = parseFloat(ethAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount greater than 0");
      }
      
      const balance = parseFloat(userBalance.displayValue);
      if (amount > balance) {
        toast.error("Insufficient balance");
      }
    } catch (error: any) {
      toast.error(error.message);
      return;
    }

    setIsStaking(true);
    try {
      toast.info("Transaction submitted. Waiting for confirmation...");

      switch (selectedStrategy) {
        case "regular": {
          const { transactionHash } = await sendTransaction({
            transaction,
            account,
          });
          break;
        }

        case "safe": {
          const { transactionHash } = await sendTransaction({
            transaction: safeTransaction,
            account,
          });
          break;
        }

        case "boosted": {
          const { transactionHash } = await sendTransaction({
            transaction: boostedTransaction,
            account,
          });
          break;
        }

        default:
          throw new Error("Invalid strategy selected");
      }

      toast.success("Successfully staked ETH!");
      setEthAmount("");

    } catch (error: any) {
      console.error("Staking failed:", error);
      toast.error(error.message || "Failed to stake ETH");
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Card className="bg-tapir-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-purple-500" />
          Buy {selectedStrategy && <span className="text-tapir-purple font-normal text-sm">• {getAssetDescription()}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <EthInput
            amount={ethAmount}
            setAmount={setEthAmount}
            userBalance={userBalance}
            isWalletConnected={isWalletConnected}
            isLoadingBalance={isLoadingBalance}
          />

          <StakeButton
            isWalletConnected={isWalletConnected}
            ethAmount={ethAmount}
            isStaking={isStaking}
            onStake={handleStake}
          />

          <StakingInfo
            ethAmount={ethAmount}
            exchangeRate={1}
            maxTransactionCost="$12.48"
            rewardFee="10%"
            selectedStrategy={selectedStrategy}
          />
        </div>
      </CardContent>
    </Card>
  );
};