import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  disabled
}: StakingCardProps) => {
  return (
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-6 w-6 text-gray-400 hover:text-gray-300 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">APY</span>
          <span className="text-purple-500 font-semibold text-xs">{apy}</span>
        </div>
      </CardContent>
    </Card>
  );
};