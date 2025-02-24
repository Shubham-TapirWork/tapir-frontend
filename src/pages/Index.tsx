import { WalletButton } from "@/components/WalletButton";
import { StethStaking } from "@/components/StethStaking";
import { ApyGraph } from "@/components/ApyGraph";
import { Twitter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LPPosition } from "@/components/LPPosition";
import { LiquidityOperations } from "@/components/LiquidityOperations";
import { PoolChart } from "@/components/PoolChart";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { TransactionHistory } from "@/components/TransactionHistory";
import { SplitControl } from "@/components/SplitControl";

interface PoolData {
  id: number;
  name: string;
  version: string;
  tvl: string;
  apr: string;
  volume24h: string;
  fee: string;
}

const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>("ethereum");
  const [selectedPool, setSelectedPool] = useState<PoolData>();

  const handleAssetChange = (value: string) => {
    setSelectedAsset(value);
    setSelectedPool(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/90d8609f-9772-4686-b125-07b559255d75.png" 
              alt="Tapir Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-white font-bold uppercase text-[20px] tracking-[4px]">Tapir Money</h1>
          </div>
          <WalletButton />
        </div>

        <Tabs defaultValue="staking" className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <Select 
              value={selectedAsset}
              onValueChange={handleAssetChange}
            >
              <SelectTrigger className="w-[300px] h-[60px] bg-tapir-card/50 border-purple-500/20 text-white hover:bg-tapir-card/70 focus:ring-purple-500/40 transition-all duration-200">
                <SelectValue placeholder="Select an asset to stake" />
              </SelectTrigger>
              <SelectContent className="bg-tapir-card border-purple-500/20 animate-in fade-in-0 zoom-in-95 duration-200">
                <SelectItem value="stablecoin" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 py-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <span className="text-green-500 text-xl">$</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="font-medium text-base">Stablecoin</div>
                      <div className="text-sm text-gray-400">Earn yield on USDC, USDT, or DAI</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="bitcoin" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 py-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <span className="text-orange-500 text-xl">₿</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="font-medium text-base">Bitcoin</div>
                      <div className="text-sm text-gray-400">BTC or wBTC</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="ethereum" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 py-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-blue-500 text-xl">Ξ</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="font-medium text-base">Ethereum</div>
                      <div className="text-sm text-gray-400">ETH or wETH</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <TabsList className="bg-tapir-card/50 border border-purple-500/20">
              <TabsTrigger 
                value="staking"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-sm"
              >
                Swap
              </TabsTrigger>
              <TabsTrigger 
                value="lp"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-sm"
              >
                Liquidity
              </TabsTrigger>
              <TabsTrigger 
                value="advanced"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-sm"
              >
                Split
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="staking" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <StethStaking />
              <ApyGraph />
            </div>
          </TabsContent>
          
          <TabsContent value="lp" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
              <div className="space-y-4">
                <LPPosition 
                  selectedAsset={selectedAsset} 
                  onPoolSelect={setSelectedPool}
                  selectedPool={selectedPool}
                />
                <LiquidityOperations selectedPool={selectedPool} />
              </div>
              <div className="space-y-4">
                <PoolChart selectedPool={selectedPool} />
                <TransactionHistory selectedPool={selectedPool} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SplitControl />
              <Card className="bg-tapir-card border-tapir-purple/20">
                <CardContent className="pt-6">
                  <div className="text-white space-y-4">
                    <h3 className="font-medium">About Splitting</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Splitting allows you to directly convert your ETH into both DP and YB tokens 
                      in a single transaction. Use the slider to adjust the ratio between the two tokens.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                      <li>DP (Depegging) tokens increase in value when USDT depegs</li>
                      <li>YB (Yield Bearing) tokens earn yield from protocol fees</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="container mx-auto px-4 py-6 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <a
            href="https://x.com/tapir_protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
          >
            <Twitter className="h-4 w-4" />
            <span>Follow us on X</span>
          </a>
          <span className="text-gray-400 text-sm">v0.0.1</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
