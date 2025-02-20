import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EthInput } from "@/components/EthInput";

export const SplitControl = () => {
  const [ethAmount, setEthAmount] = useState("");
  const [splitRatio, setSplitRatio] = useState([50]); // Single value representing DP percentage
  const [isWalletConnected] = useState(true); // TODO: Replace with real wallet connection state
  const [isLoadingBalance] = useState(false); // TODO: Replace with real loading state
  const userBalance = "1.5"; // TODO: Replace with real balance

  // Calculate token amounts based on split ratio
  const dpAmount = ethAmount ? (Number(ethAmount) * splitRatio[0] / 100).toFixed(6) : "0";
  const ybAmount = ethAmount ? (Number(ethAmount) * (100 - splitRatio[0]) / 100).toFixed(6) : "0";

  const handleSplit = () => {
    console.log("Splitting ETH:", {
      ethAmount,
      dpPercentage: splitRatio[0],
      ybPercentage: 100 - splitRatio[0],
      dpAmount,
      ybAmount
    });
    // TODO: Implement actual split functionality
  };

  return (
    <Card className="bg-tapir-card border-tapir-purple/20">
      <CardHeader>
        <CardTitle className="text-white text-lg font-medium">Split ETH into DP and YB</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <EthInput
            ethAmount={ethAmount}
            setEthAmount={setEthAmount}
            userBalance={userBalance}
            isWalletConnected={isWalletConnected}
            isLoadingBalance={isLoadingBalance}
            label="ETH to split"
          />

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Split ratio</span>
                <span class>{splitRatio[0]}% DP - {100 - splitRatio[0]}% YB</span>
              </div>
              <Slider
                value={splitRatio}
                onValueChange={setSplitRatio}
                max={100}
                step={1}
                className="py-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">DP Amount</label>
                <div className="relative">
                  <Input
                    value={dpAmount}
                    readOnly
                    className="bg-tapir-dark/50 border-tapir-purple/20 text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    DP
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">YB Amount</label>
                <div className="relative">
                  <Input
                    value={ybAmount}
                    readOnly
                    className="bg-tapir-dark/50 border-tapir-purple/20 text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    YB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSplit}
          disabled={!ethAmount || Number(ethAmount) <= 0}
          className="w-full bg-tapir-purple hover:bg-tapir-purple/90 text-white"
        >
          Split ETH
        </Button>
      </CardContent>
    </Card>
  );
};