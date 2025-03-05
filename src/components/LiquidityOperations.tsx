import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useActiveAccount } from "thirdweb/react";
import { defineChain, getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { client } from "@/client";
import { parseEther } from "ethers";
import contracts from "@/contracts/contracts.json";

interface PoolData {
  id: number;
  name: string;
  version: string;
  tvl: string;
  apr: string;
  volume24h: string;
  fee: string;
}

interface LiquidityOperationsProps {
  selectedPool?: PoolData;
}

export const LiquidityOperations = ({ selectedPool }: LiquidityOperationsProps) => {
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [shares, setShares] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const account = useActiveAccount();

  const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: contracts.stableSwapContract.address,
  });

  const handleSliderChange = (value: number[]) => {
    setPercentage(value[0]);
    // TODO: Update shares based on user's total LP position * percentage
    setShares((value[0] / 100).toString());
  };

  const handleAddLiquidity = async () => {
    if (!amount0 || !amount1) {
      toast.error("Please enter both amounts");
      return;
    }

    setIsLoading(true);
    try {
      const amounts = [
        parseEther(amount0),
        parseEther(amount1)
      ] as [bigint, bigint];
      
      const minShares = 0n;

      const transaction = prepareContractCall({
        contract,
        method: "function addLiquidity(uint256[2] calldata amounts, uint256 minShares) returns (uint256)",
        params: [amounts, minShares],
      });

      toast.info("Adding liquidity...");
      
      const { transactionHash } = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      toast.success("Successfully added liquidity!");
      
      setAmount0("");
      setAmount1("");
    } catch (error: any) {
      console.error("Error adding liquidity:", error);
      toast.error(error.message || "Failed to add liquidity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!shares) {
      toast.error("Please enter amount of LP tokens");
      return;
    }

    setIsLoading(true);
    try {
      const shareAmount = parseEther(shares);
      const minAmounts = [0n, 0n] as [bigint, bigint];

      const transaction = prepareContractCall({
        contract,
        method: "function removeLiquidity(uint256 shares, uint256[2] calldata minAmounts) returns (uint256[2])",
        params: [shareAmount, minAmounts],
      });

      toast.info("Removing liquidity...");
      
      const { transactionHash } = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      toast.success("Successfully removed liquidity!");
      
      setShares("");
      setPercentage(0);
    } catch (error: any) {
      console.error("Error removing liquidity:", error);
      toast.error(error.message || "Failed to remove liquidity");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPool) {
    return (
      <Card className="bg-tapir-card border-purple-500/20 transition-all duration-300 ease-in-out">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="text-gray-400">
              Select a pool from the list to start adding or removing liquidity
            </div>
            <div className="text-sm text-gray-500">
              Click on any pool in the table on the left
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-tapir-card border-purple-500/20 transition-all duration-300 ease-in-out animate-in fade-in-0 zoom-in-95">
      <CardContent className="pt-6">
        <div className="mb-6 animate-in fade-in-0 slide-in-from-right-5 duration-300">
          <h3 className="text-white font-medium">Selected Pool: {selectedPool.name}</h3>
          <div className="text-sm text-gray-400 mt-1">
            Fee: {selectedPool.fee} • APR: {selectedPool.apr}
          </div>
        </div>
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="w-full bg-tapir-dark/50 border border-purple-500/20 animate-in fade-in-0 slide-in-from-right-3 duration-500">
            <TabsTrigger 
              value="add" 
              className="w-1/2 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-200"
            >
              Add Liquidity
            </TabsTrigger>
            <TabsTrigger 
              value="remove" 
              className="w-1/2 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-200"
            >
              Remove Liquidity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="mt-4 animate-in fade-in-0 slide-in-from-right-1 duration-700">
            <div className="space-y-4">
              <div className="transition-all duration-200 hover:translate-x-1">
                <label className="text-sm text-gray-400 mb-2 block">Amount Token A</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount0}
                  onChange={(e) => setAmount0(e.target.value)}
                  className="bg-tapir-dark/50 border-purple-500/20 text-white transition-all duration-200 focus:scale-[1.02] hover:border-purple-500/40"
                />
              </div>
              <div className="transition-all duration-200 hover:translate-x-1">
                <label className="text-sm text-gray-400 mb-2 block">Amount Token B</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount1}
                  onChange={(e) => setAmount1(e.target.value)}
                  className="bg-tapir-dark/50 border-purple-500/20 text-white transition-all duration-200 focus:scale-[1.02] hover:border-purple-500/40"
                />
              </div>
              <Button
                onClick={handleAddLiquidity}
                disabled={isLoading}
                className="w-full bg-purple-500 hover:bg-purple-500/90 text-white transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {isLoading ? "Adding Liquidity..." : "Add Liquidity"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="remove" className="mt-4 animate-in fade-in-0 slide-in-from-right-1 duration-700">
            <div className="space-y-6">
              <div className="transition-all duration-200 hover:translate-x-1">
                <label className="text-sm text-gray-400 mb-2 block">LP Tokens to Remove</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="bg-tapir-dark/50 border-purple-500/20 text-white transition-all duration-200 focus:scale-[1.02] hover:border-purple-500/40"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400 mb-2 animate-in fade-in-0 slide-in-from-right-1 duration-1000">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
                <Slider 
                  value={[percentage]}
                  onValueChange={handleSliderChange}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-500 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_.relative]:bg-tapir-dark/50 [&_.absolute]:bg-purple-500 transition-all duration-200"
                />
              </div>
              <Button
                onClick={handleRemoveLiquidity}
                disabled={isLoading}
                className="w-full bg-purple-500 hover:bg-purple-500/90 text-white transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {isLoading ? "Removing Liquidity..." : "Remove Liquidity"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
