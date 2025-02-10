import { useState, useEffect } from "react";
import { getTethContract, getLiquidityPoolContract } from "@/lib/contracts";
import { getMetaMaskProvider } from "@/lib/wallet";
import { ethers } from "ethers";
import { IERC20 } from "@/lib/types/contracts";

export const useTokenAllowance = (isWalletConnected: boolean) => {
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);

  const checkAllowance = async () => {
    if (!isWalletConnected) return;
    
    setIsCheckingAllowance(true);
    try {
      const provider = getMetaMaskProvider();
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (!accounts[0]) return;

      const tethContract = await getTethContract();
      const liquidityPoolContract = await getLiquidityPoolContract();
      
      if (!tethContract || !liquidityPoolContract) {
        throw new Error("Failed to get contracts");
      }

      console.log("Checking allowance for:");
      console.log("Owner (user wallet):", accounts[0]);
      console.log("Spender (liquidity pool):", liquidityPoolContract.target);

      const currentAllowance = await (tethContract as IERC20).allowance(
        accounts[0],
        liquidityPoolContract.target.toString()
      );
      
      console.log("Current allowance:", currentAllowance.toString());
      setAllowance(currentAllowance);
    } catch (error) {
      console.error('Error checking allowance:', error);
    } finally {
      setIsCheckingAllowance(false);
    }
  };

  useEffect(() => {
    checkAllowance();
  }, [isWalletConnected]);

  return { allowance, isCheckingAllowance, checkAllowance };
};