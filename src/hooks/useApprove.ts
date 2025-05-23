import { useState } from "react";
import { defineChain, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "sonner";
import { client } from "@/client";
import { CHAIN_ID } from "@/constants/env";
import tethContract from "@/contracts/tethContract.json";
import liquidityPoolContract from "@/contracts/liquidityPoolContract.json";

interface UseApproveProps {
  onSuccess?: () => void;
}

export const useApprove = ({ onSuccess }: UseApproveProps = {}) => {
  const [isApproving, setIsApproving] = useState(false);
  const account = useActiveAccount();

  const tethContractinstance = getContract({
    client,
    chain: defineChain(CHAIN_ID),
    address: tethContract.address,
  });

  const handleApprove = async (tethAmount: string) => {
    if (!account) {
      toast.error("Please connect your wallet");
      return false;
    }

    if (!tethAmount || parseFloat(tethAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }

    setIsApproving(true);
    try {
      const amountInWei = BigInt(Math.floor(parseFloat(tethAmount) * 1e18));
      
      const transaction = await prepareContractCall({
        contract: tethContractinstance,
        method: "function approve(address spender, uint256 amount) returns (bool)",
        params: [liquidityPoolContract.address, amountInWei],
      });

      toast.info("Approving tETH transfer...");
      
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      console.log("Approval transaction sent:", transactionHash);
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