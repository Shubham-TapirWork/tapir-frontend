import { WalletButton } from "@/components/WalletButton";
import { StethStaking } from "@/components/StethStaking";
import { ApyGraph } from "@/components/ApyGraph";
import { Twitter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>("ethereum");

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="container mx-auto px-4 flex-grow">
        <div className="flex p-2 justify-between border-b border-gray-800 items-center mb-8">
          <img src="/Logo.svg" alt="Logo" className="h-8 w-auto" />
          <WalletButton />
        </div>

        <div className="mb-6">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-full md:w-[300px] h-[60px] bg-tapir-card/50 border-purple-500/20 text-white hover:bg-tapir-card/70 focus:ring-purple-500/40 transition-all duration-200">
              <SelectValue placeholder="Select an asset to stake" />
            </SelectTrigger>
            <SelectContent className="bg-tapir-card border-purple-500/20 animate-in fade-in-0 zoom-in-95 duration-200">
              <SelectItem
                value="stablecoin"
                className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <span className="text-green-500 text-xl">$</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="font-medium text-base">Stablecoin</div>
                    <div className="text-sm text-gray-400">
                      Stake your stablecoins
                    </div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem
                value="bitcoin"
                className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-orange-500 text-xl">₿</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="font-medium text-base">Bitcoin</div>
                    <div className="text-sm text-gray-400">
                      Stake your BTC or wBTC
                    </div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem
                value="ethereum"
                className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 py-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-blue-500 text-xl">Ξ</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="font-medium text-base">Ethereum</div>
                    <div className="text-sm text-gray-400">
                      Stake ETH or wETH
                    </div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="trade" className="space-y-4">
          <TabsList className="bg-tapir-card/50 border border-purple-500/20">
            <TabsTrigger
              value="trade"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-sm"
            >
              Trade
            </TabsTrigger>
            <TabsTrigger
              value="lp"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-sm"
            >
              LP
            </TabsTrigger>
            <TabsTrigger
              value="split"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-sm"
            >
              Split
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trade" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StethStaking />
              <ApyGraph />
            </div>
          </TabsContent>

          <TabsContent value="lp">
            <div className="text-center text-gray-400 py-12 text-sm">
              LP features coming soon
            </div>
          </TabsContent>

          <TabsContent value="split">
            <div className="text-center text-gray-400 py-12 text-sm">
              Split features coming soon
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
