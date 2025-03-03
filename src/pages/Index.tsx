import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import SwapPage from "./Swap";
import LiquidityPage from "./Liquidity";
import SplitPage from "./Split";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedAsset = searchParams.get("asset") || "ethereum";

  const handleAssetChange = (value: string) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('asset', value);
    setSearchParams(currentParams);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar
        selectedAsset={selectedAsset}
        onAssetChange={handleAssetChange}
      />
      <div className="container mx-auto px-4 flex-grow my-8">
        <Routes>
          <Route path="/" element={<Navigate to="/swap" replace />} />
          <Route path="/swap" element={<SwapPage />} />
          <Route
            path="/liquidity"
            element={<LiquidityPage selectedAsset={selectedAsset} />}
          />
          <Route path="/split" element={<SplitPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
