import { toast } from "sonner";
import contracts from "@/contracts/contracts.json";
import { defineChain, getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import { client } from "@/client";

interface UseSellProps {
  onSuccess?: () => void;
}

export const useSelling = ({ onSuccess }: UseSellProps = {}) => {
  const account = useActiveAccount();
  const [isSelling, setIsSelling] = useState(false);
  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: contracts.liquidityPoolContract.address,
  });

  const handleOrder = async (tethAmount: string) => {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!tethAmount || parseFloat(tethAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSelling(true);
    try {
      toast.info("Transaction submitted. Waiting for confirmation...");

      const amountInWei = BigInt(Math.floor(parseFloat(tethAmount) * 1e18));
      const transaction = await prepareContractCall({
        contract,
        method: "function withdraw(address _recipient, uint256 _amount) returns (uint256)",
        params: [account.address, amountInWei],
      });
      const { transactionHash } = await sendAndConfirmTransaction({
        transaction,
        account,
      });
      console.log("Swap transaction sent:", transactionHash);
      toast.success("Successfully sold!");
      onSuccess?.();
    } catch (error: any) {
      console.error("Swap failed:", error);
      toast.error(error.message || "Failed to sell tokens!");
    } finally {
      setIsSelling(false);
    }
  };

  return { handleOrder, isSelling };
};