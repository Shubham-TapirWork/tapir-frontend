import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EthInput } from "./EthInput";
import { StakingInfo } from "./StakingInfo";
import { ethers } from "ethers";
import { getTethContract } from "@/lib/contracts";
import { getMetaMaskProvider } from "@/lib/wallet";
import contracts from "@/contracts/contracts.json";
import { StakeButton } from "./stake/StakeButton";

const executeTransaction = async (contract: any, methodName: string, params: any[], value: bigint) => {
  let gasEstimate;
  try {
    // Add 20% to estimated gas as a safety margin
    gasEstimate = await contract.estimateGas[methodName](...params, { value });
    console.log("Estimated Gas:", gasEstimate.toString());
    
    // Validate ETH value is positive
    if (value <= BigInt(0)) {
      throw new Error("Amount must be greater than 0");
    }

    const tx = await contract[methodName](...params, {
      value,
      gasLimit: (gasEstimate * BigInt(120)) / BigInt(100),
    });
    console.log("Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    return receipt;
  } catch (error: any) {
    // Improve error handling with more specific messages
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error("Insufficient funds to complete transaction");
    } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      throw new Error("Unable to estimate gas. The transaction may fail.");
    }
    throw error;
  }
};

export const StakeCard = ({
  isWalletConnected,
  userBalance,
  isLoadingBalance,
  selectedStrategy,
  fetchBalance,
  fetchTethBalance
}: {
  isWalletConnected: boolean;
  userBalance: string;
  isLoadingBalance: boolean;
  selectedStrategy: "safe" | "regular" | "boosted" | null;
  fetchBalance: (address: string) => Promise<void>;
  fetchTethBalance: (address: string) => Promise<void>;
}) => {
  const [ethAmount, setEthAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async () => {
    if (!ethAmount || !selectedStrategy) return;

    // Validate input amount
    try {
      const amount = parseFloat(ethAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }
      
      const balance = parseFloat(userBalance);
      if (amount > balance) {
        throw new Error("Insufficient balance");
      }
    } catch (error: any) {
      toast.error(error.message);
      return;
    }

    setIsStaking(true);
    try {
      const provider = getMetaMaskProvider();
      if (!provider) {
        throw new Error("MetaMask not found");
      }

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const amountInWei = ethers.parseEther(ethAmount);

      toast.info("Transaction submitted. Waiting for confirmation...");
      console.log("WETH amount in Wei: ", amountInWei);

      switch (selectedStrategy) {
        case "regular": {
          // Direct contract instantiation using ethers
          const liquidityPoolContract = new ethers.Contract(
            contracts.liquidityPoolContract.address,
            contracts.liquidityPoolContract.abi,
            signer
          );

          // Add 20% to estimated gas as a safety margin
          const gasEstimate = await liquidityPoolContract.deposit.estimateGas({
            value: amountInWei, // Pass ETH value to be sent
          });
          console.log("Estimated Gas:", gasEstimate.toString());
          
          // Validate ETH value is positive
          if (amountInWei <= BigInt(0)) {
            throw new Error("Amount must be greater than 0");
          }

          // Sending TX
          const tx = await liquidityPoolContract.deposit({
            value: amountInWei,
            gasLimit: (gasEstimate * BigInt(120)) / BigInt(100), // Adding 20% buffer
          });

          console.log("Transaction sent:", tx.hash);
          const receipt = await tx.wait();

          console.log("Transaction confirmed:", receipt);
          toast.info("Transaction confirmed.");
          break;
        }

        case "safe": {
          // Direct contract instantiation using ethers
          const liquidityPoolContract = new ethers.Contract(
            contracts.liquidityPoolContract.address,
            contracts.liquidityPoolContract.abi,
            signer
          );
          
          const depegPoolAddress = ethers.getAddress(contracts.depegPoolContract.address);
          const stableSwapAddress = ethers.getAddress(contracts.stableSwapContract.address);
          const ybAddress = ethers.getAddress(contracts.ybContract.address);
          const dpAddress = ethers.getAddress(contracts.dpContract.address);

          // Add 20% to estimated gas as a safety margin
          const gasEstimate = await liquidityPoolContract.getDPwtETHForETH.estimateGas(
            depegPoolAddress,
            stableSwapAddress,
            ybAddress,
            dpAddress, // Pass the method parameters here
            {
              value: amountInWei, // If the function is payable, include ETH value here
            }
          );
          console.log("Estimated Gas:", gasEstimate.toString());
          
          // Validate ETH value is positive
          if (amountInWei <= BigInt(0)) {
            throw new Error("Amount must be greater than 0");
          }

          // Sending TX
          const tx = await liquidityPoolContract.getDPwtETHForETH(
            depegPoolAddress,
            stableSwapAddress,
            ybAddress,
            dpAddress,
            {
              value: amountInWei,
              gasLimit: (gasEstimate * BigInt(120)) / BigInt(100), // Adding 20% buffer
            }
          );

          console.log("Transaction sent:", tx.hash);
          const receipt = await tx.wait();

          console.log("Transaction confirmed:", receipt);
          toast.info("Transaction confirmed.");
          break;
        }

        case "boosted": {
          // Direct contract instantiation using ethers
          const liquidityPoolContract = new ethers.Contract(
            contracts.liquidityPoolContract.address,
            contracts.liquidityPoolContract.abi,
            signer
          );
          
          const depegPoolAddress = ethers.getAddress(contracts.depegPoolContract.address);
          const stableSwapAddress = ethers.getAddress(contracts.stableSwapContract.address);
          const ybAddress = ethers.getAddress(contracts.ybContract.address);
          const dpAddress = ethers.getAddress(contracts.dpContract.address);

          // Add 20% to estimated gas as a safety margin
          const gasEstimate = await liquidityPoolContract.getYBwtETHForETH.estimateGas(
            depegPoolAddress,
            stableSwapAddress,
            ybAddress,
            dpAddress, // Pass the method parameters here
            {
              value: amountInWei, // If the function is payable, include ETH value here
            }
          );
          console.log("Estimated Gas:", gasEstimate.toString());
          
          // Validate ETH value is positive
          if (amountInWei <= BigInt(0)) {
            throw new Error("Amount must be greater than 0");
          }

          // Sending TX
          const tx = await liquidityPoolContract.getYBwtETHForETH(
            depegPoolAddress,
            stableSwapAddress,
            ybAddress,
            dpAddress,
            {
              value: amountInWei,
              gasLimit: (gasEstimate * BigInt(120)) / BigInt(100), // Adding 20% buffer
            }
          );

          console.log("Transaction sent:", tx.hash);
          const receipt = await tx.wait();

          console.log("Transaction confirmed:", receipt);
          toast.info("Transaction confirmed.");
          break;
        }

        default:
          throw new Error("Invalid strategy selected");
      }

      toast.success("Successfully staked ETH!");
      setEthAmount("");

      // Refresh balances
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts[0]) {
        await Promise.all([
          fetchBalance(accounts[0]),
          fetchTethBalance(accounts[0])
        ]);
      }
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
          Buy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <EthInput
            ethAmount={ethAmount}
            setEthAmount={setEthAmount}
            userBalance={userBalance}
            isWalletConnected={isWalletConnected}
            isLoadingBalance={isLoadingBalance}
          />

          <StakeButton
            isWalletConnected={isWalletConnected}
            selectedStrategy={selectedStrategy}
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