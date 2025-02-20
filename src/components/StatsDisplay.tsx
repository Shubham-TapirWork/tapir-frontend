import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

export const StatsDisplay = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="bg-tapir-card border-purple-500/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-500" />
            <span className="text-gray-400">Total Value Locked</span>
          </div>
          <span className="text-white font-semibold">$1,234,567</span>
        </CardContent>
      </Card>
      <Card className="bg-tapir-card border-purple-500/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <span className="text-gray-400">Average APY</span>
          </div>
          <span className="text-white font-semibold">12.34%</span>
        </CardContent>
      </Card>
    </div>
  );
};