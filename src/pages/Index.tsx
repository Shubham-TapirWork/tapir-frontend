import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import { useActiveWalletChain } from "thirdweb/react";

import { Navbar } from "@/components/Navbar";
import { WalletButton } from "@/components/WalletButton";
import { Footer } from "@/components/Footer";

import SwapPage from "./Swap";
import LiquidityPage from "./Liquidity";
import SplitPage from "./Split";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedAsset = searchParams.get("asset") || "ethereum";

  const activeChain = useActiveWalletChain();
  const isWrongNetwork = activeChain && activeChain.id !== 11155111;

  const handleAssetChange = (value: string) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("asset", value);
    setSearchParams(currentParams);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar selectedAsset={selectedAsset} onAssetChange={handleAssetChange} />
      <div className="container mx-auto px-4 grow my-8">
        {isWrongNetwork ? (
          <div className="text-purple-500 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6 text-center flex flex-col justify-center">
            <p className="font-medium">Please switch to Sepolia Test Network</p>
            <p className="text-sm my-2">
              To use this application, you need to connect to the Sepolia Test
              Network.
            </p>
            <WalletButton />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/swap" replace />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route
              path="/liquidity"
              element={<LiquidityPage selectedAsset={selectedAsset} />}
            />
            <Route path="/split" element={<SplitPage />} />
          </Routes>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
