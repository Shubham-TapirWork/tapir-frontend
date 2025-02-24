import { useState, useEffect } from "react";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/client";
import contracts from "@/contracts/contracts.json";

export const useTokenAllowance = (isWalletConnected: boolean) => {
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const account = useActiveAccount();

  const tethContract = getContract({
    client,
    chain: defineChain(11155111),
    address: contracts.tethContract.address,
  });

  const liquidityPoolContract = getContract({
    client,
    chain: defineChain(11155111),
    address: contracts.liquidityPoolContract.address,
  });

  const checkAllowance = async () => {
    if (!isWalletConnected || !account?.address) return;
    
    setIsCheckingAllowance(true);
    try {
      console.log("Checking allowance for:");
      console.log("Owner (user wallet):", account.address);
      console.log("Spender (liquidity pool):", liquidityPoolContract.address);

      const allowanceCall = prepareContractCall({
        contract: tethContract,
        method: "function allowance(address owner, address spender) view returns (uint256)",
        params: [account.address, liquidityPoolContract.address],
      });

      const currentAllowance = await allowanceCall.data;
      console.log("Current allowance:", currentAllowance.toString());
      // setAllowance(BigInt(currentAllowance));
    } catch (error) {
      console.error('Error checking allowance:', error);
    } finally {
      setIsCheckingAllowance(false);
    }
  };

  useEffect(() => {
    checkAllowance();
  }, [isWalletConnected, account?.address]);

  return { allowance, isCheckingAllowance, checkAllowance };
};