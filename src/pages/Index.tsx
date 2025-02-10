import { WalletButton } from "@/components/WalletButton";
import { StethStaking } from "@/components/StethStaking";
import { ApyGraph } from "@/components/ApyGraph";
import { Twitter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-tapir-dark to-tapir-accent flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="/uploads/90d8609f-9772-4686-b125-07b559255d75.png" 
              alt="Tapir Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-white font-bold uppercase text-[20px] tracking-[4px]">Tapir Money</h1>
          </div>
          <WalletButton />
        </div>
        
        <Tabs defaultValue="staking" className="space-y-4">
          <TabsList className="bg-tapir-card/50 border border-tapir-purple/20">
            <TabsTrigger 
              value="staking"
              className="data-[state=active]:bg-tapir-purple data-[state=active]:text-white text-sm"
            >
              Staking
            </TabsTrigger>
            <TabsTrigger 
              value="lp"
              className="data-[state=active]:bg-tapir-purple data-[state=active]:text-white text-sm"
            >
              LP
            </TabsTrigger>
            <TabsTrigger 
              value="advanced"
              className="data-[state=active]:bg-tapir-purple data-[state=active]:text-white text-sm"
            >
              Split
            </TabsTrigger>
            <TabsTrigger 
              value="wrap"
              className="data-[state=active]:bg-tapir-purple data-[state=active]:text-white text-sm"
            >
              Wrap
            </TabsTrigger>
          </TabsList>
          
          <TabsContent 
            value="staking" 
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StethStaking />
              <ApyGraph />
            </div>
          </TabsContent>
          
          <TabsContent 
            value="lp"
          >
            <div className="text-center text-gray-400 py-12 text-sm">
              LP features coming soon
            </div>
          </TabsContent>
          
          <TabsContent 
            value="advanced"
          >
            <div className="text-center text-gray-400 py-12 text-sm">
              Advanced features coming soon
            </div>
          </TabsContent>

          <TabsContent 
            value="wrap"
          >
            <div className="text-center text-gray-400 py-12 text-sm">
              Wrap features coming soon
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