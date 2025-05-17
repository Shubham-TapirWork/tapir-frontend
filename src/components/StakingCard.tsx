import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface StakingCardProps {
  title: string;
  description: string;
  apy: string;
  type: "safe" | "boosted" | "regular";
  isSelected?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const StakingCard = ({
  title,
  description,
  apy,
  type,
  isSelected,
  onSelect,
  disabled,
}: StakingCardProps) => {

  const getTooltipDescription = () => {
    switch (type) {
      case "regular":
        return "Regular staking provides standard yields with balanced risk and reward ratio. Perfect for beginners and conservative investors.";
      case "safe":
        return "Safe staking offers lower-risk yields with additional protection mechanisms. Ideal for those prioritizing capital preservation.";
      case "boosted":
        return "Boosted staking provides enhanced yields by taking on additional risk. In case of depeg events, this position may take larger losses in exchange for higher returns.";
      default:
        return description;
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            onClick={onSelect}
            className={cn(
              "bg-tapir-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300",
              "hover:scale-[1.02] transform transition-all",
              isSelected && "border-purple-500 border-2 shadow-lg shadow-purple-500/20",
              "relative after:absolute after:inset-0 after:rounded-lg after:border-2 after:border-purple-500/0 after:transition-all",
              isSelected && "after:border-purple-500/50 after:animate-pulse",
              disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
              !disabled && "hover:border-purple-500/40"
            )}
          >
            <CardHeader className="p-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <ArrowUpCircle className="h-6 w-6 text-purple-500" />
                <div className="flex flex-wrap flex-col">
                  <span className="flex-1">{title}</span>
                  <span className="text-gray-400 text-xs">{description}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">APY</span>
                <span className="text-purple-500 font-semibold text-xs">{apy}</span>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs max-w-54">{getTooltipDescription()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
