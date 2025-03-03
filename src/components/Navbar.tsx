import { WalletButton } from "@/components/WalletButton";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NavbarProps {
  selectedAsset: string;
  onAssetChange: (value: string) => void;
}

export const Navbar = ({ selectedAsset, onAssetChange }: NavbarProps) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getNavigationPath = (path: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('asset', selectedAsset);
    return `${path}?${newParams.toString()}`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex p-2 justify-between border-b border-gray-800 items-center">
        <div className="flex items-center gap-8">
          <img src="/Logo.svg" alt="Logo" className="h-8 w-auto" />
          <Select value={selectedAsset} onValueChange={onAssetChange}>
            <SelectTrigger className="w-auto min-w-80 h-[60px] bg-tapir-card/50 border-purple-500/20 text-white hover:bg-tapir-card/70 focus:ring-purple-500/40 transition-all duration-200">
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
                      Earn yield on USDC, USDT, or DAI
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
                    <div className="text-sm text-gray-400">BTC or wBTC</div>
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
                    <div className="text-sm text-gray-400">ETH or wETH</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to={getNavigationPath('/swap')}
              className={`text-sm transition-colors ${location.pathname === "/swap" ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Swap
            </Link>
            <Link
              to={getNavigationPath('/liquidity')}
              className={`text-sm transition-colors ${location.pathname === "/liquidity" ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Liquidity
            </Link>
            <Link
              to={getNavigationPath('/split')}
              className={`text-sm transition-colors ${location.pathname === "/split" ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Split
            </Link>
          </nav>
        </div>
        <WalletButton />
      </div>
    </div>
  );
};
