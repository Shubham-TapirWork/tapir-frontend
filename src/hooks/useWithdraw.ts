import { toast } from "sonner";
import contracts from "@/contracts/contracts.json";
import { defineChain, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import { client } from "@/client";

interface UseWithdrawProps {
  onSuccess?: () => void;
}

export const useWithdraw = ({ onSuccess }: UseWithdrawProps = {}) => {
  const account = useActiveAccount();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: contracts.liquidityPoolContract.address,
  });

  const handleWithdraw = async (tethAmount: string) => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!tethAmount || parseFloat(tethAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsWithdrawing(true);
    try {
      toast.info("Transaction submitted. Waiting for confirmation...");

      const amountInWei = BigInt(Math.floor(parseFloat(tethAmount) * 1e18));
      const transaction = await prepareContractCall({
        contract,
        method: "function withdraw(address _recipient, uint256 _amount) returns (uint256)",
        params: [account.address, amountInWei],
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      console.log("Withdrawal transaction sent:", transactionHash);
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