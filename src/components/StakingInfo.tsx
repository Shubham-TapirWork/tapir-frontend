import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StakingInfoProps {
  ethAmount: string;
  exchangeRate: number;
  maxTransactionCost: string;
  rewardFee: string;
  selectedStrategy: "safe" | "regular" | "boosted" | null;
}

export const StakingInfo = ({ 
  ethAmount, 
  exchangeRate, 
  maxTransactionCost, 
  rewardFee,
  selectedStrategy
}: StakingInfoProps) => {
  const getTokenName = () => {
    switch (selectedStrategy) {
      case "safe":
        return "DP";
      case "boosted":
        return "YB";
      case "regular":
        return "tETH";
      default:
        return "tETH";
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">You will receive</span>
        <span className="text-white font-medium">
          {ethAmount ? `${ethAmount} ${getTokenName()}` : `0.0 ${getTokenName()}`}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Exchange rate</span>
        <span className="text-white font-medium">1 ETH = 1 {getTokenName()}</span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Max transaction cost</span>
        <span className="text-white font-medium">{maxTransactionCost}</span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="flex items-center gap-1">
          <span className="text-gray-400">Reward fee</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Fee charged on staking rewards</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
        <span className="text-white font-medium">{rewardFee}</span>
      </div>
    </div>
  );
};