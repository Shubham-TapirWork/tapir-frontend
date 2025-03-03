import { Button } from "@/components/ui/button";

interface StakeButtonProps {
  isWalletConnected: boolean;
  isStaking: boolean;
  ethAmount: string;
  onStake: () => void;
}

export const StakeButton = ({
  isWalletConnected,
  isStaking,
  ethAmount,
  onStake
}: StakeButtonProps) => {
  if (!isWalletConnected) {
    return (
      <Button
        disabled={true}
        className="w-full bg-purple-500 hover:opacity-90 text-white"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button
      onClick={onStake}
      disabled={isStaking}
      className="w-full bg-purple-500 hover:opacity-90 text-white"
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