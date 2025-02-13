import { Button } from "@/components/ui/button";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";
import { useApprove } from "@/hooks/useApprove";
import { ethers } from "ethers";

interface StakeButtonProps {
  isWalletConnected: boolean;
  isStaking: boolean;
  selectedStrategy: "safe" | "regular" | "boosted" | null;
  ethAmount: string;
  onStake: () => void;
}

export const StakeButton = ({
  isWalletConnected,
  isStaking,
  selectedStrategy,
  ethAmount,
  onStake
}: StakeButtonProps) => {
  const { allowance, isCheckingAllowance, checkAllowance } = useTokenAllowance(isWalletConnected);
  
  const { handleApprove, isApproving } = useApprove({
    onSuccess: checkAllowance
  });

  const needsApproval = () => {
    if (!ethAmount) return false;
    try {
      const amountInWei = ethers.parseEther(ethAmount);
      return allowance < amountInWei;
    } catch {
      return false;
    }
  };

  if (!isWalletConnected) {
    return (
      <Button
        disabled={true}
        className="w-full bg-gradient-to-r from-tapir-purple to-tapir-accent hover:opacity-90 text-white"
      >
        Connect Wallet
      </Button>
    );
  }

  if (!selectedStrategy) {
    return (
      <Button
        disabled={true}
        className="w-full bg-gradient-to-r from-tapir-purple to-tapir-accent hover:opacity-90 text-white"
      >
        Select a Strategy Above
      </Button>
    );
  }

  if (needsApproval()) {
    return (
      <Button
        onClick={() => handleApprove(ethAmount)}
        disabled={isApproving || isCheckingAllowance}
        className="w-full bg-gradient-to-r from-tapir-purple to-tapir-accent hover:opacity-90 text-white"
      >
        {isApproving ? (
          <>
            <span className="animate-spin mr-2">◌</span>
            Approving...
          </>
        ) : "Approve ETH"}
      </Button>
    );
  }

  return (
    <Button
      onClick={onStake}
      disabled={isStaking || isCheckingAllowance}
      className="w-full bg-gradient-to-r from-tapir-purple to-tapir-accent hover:opacity-90 text-white"
    >
      {isStaking ? (
        <>
          <span className="animate-spin mr-2">◌</span>
          Staking...
        </>
      ) : "Buy"}
    </Button>
  );
};