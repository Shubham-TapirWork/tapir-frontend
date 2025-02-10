import { useState } from "react";
import { getLiquidityPoolContract, getTethContract } from "@/lib/contracts";
import { getMetaMaskProvider } from "@/lib/wallet";
import { ethers } from "ethers";
import { toast } from "sonner";
import { IERC20 } from "@/lib/types/contracts";

interface UseApproveProps {
  onSuccess?: () => void;
}

export const useApprove = ({ onSuccess }: UseApproveProps = {}) => {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async (tethAmount: string) => {
    if (!tethAmount || parseFloat(tethAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsApproving(true);
    try {
      const tethContract = await getTethContract();
      const liquidityPoolContract = await getLiquidityPoolContract();
      
      if (!tethContract || !liquidityPoolContract) {
        throw new Error("Failed to get contracts");
      }

      const provider = getMetaMaskProvider();
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      
      const tethContractWithSigner = tethContract.connect(signer) as IERC20;
      const amountInWei = ethers.parseEther(tethAmount);
      
      const approveTx = await tethContractWithSigner.approve(
        liquidityPoolContract.target.toString(),
        amountInWei
      );
      
      toast.info("Approving tETH transfer...");
      await approveTx.wait();
      toast.success("Successfully approved tETH!");
      
      onSuccess?.();
      return true;
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || "Failed to approve tETH");
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  return { handleApprove, isApproving };
};