import { useState } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";
import { getMetaMaskProvider } from "@/lib/wallet";
import { getLiquidityPoolContract } from "@/lib/contracts";
import { ILiquidityPool } from "@/lib/types/contracts";

interface UseWithdrawProps {
  onSuccess?: () => void;
}

export const useWithdraw = ({ onSuccess }: UseWithdrawProps = {}) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async (tethAmount: string) => {
    if (!tethAmount || parseFloat(tethAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsWithdrawing(true);
    try {
      const provider = getMetaMaskProvider();
      const signer = await new ethers.BrowserProvider(provider).getSigner();
      
      const liquidityPoolContract = await getLiquidityPoolContract();
      if (!liquidityPoolContract) {
        throw new Error("Failed to get liquidity pool contract");
      }

      const amountInWei = ethers.parseEther(tethAmount);
      const contractWithSigner = liquidityPoolContract.connect(signer) as ILiquidityPool;

      toast.info("Transaction submitted. Waiting for confirmation...");

      const signerAddress = await signer.getAddress();
      const tx = await contractWithSigner.withdraw(signerAddress, amountInWei);
      console.log("Withdrawal transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Withdrawal confirmed:", receipt);

      toast.success("Successfully withdrawn ETH!");
      onSuccess?.();
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      toast.error(error.message || "Failed to withdraw ETH");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return { handleWithdraw, isWithdrawing };
};