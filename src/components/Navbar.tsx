import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { graphqlClient, GET_ASSET_CATEGORIES } from "@/lib/graphql";

import { WalletButton } from "@/components/WalletButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NavbarProps {
  selectedAsset: string;
  onAssetChange: (value: string) => void;
}

interface AssetCategory {
  id: string;
  value: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  iconBackground: string;
}

interface GraphQLResponse {
  assetCategories: {
    id: string;
    name: string;
    description: string;
  }[];
}

const getAssetStyles = (id: string) => {
  switch (id) {
    case "bitcoin":
      return {
        icon: "₿",
        iconColor: "text-orange-500",
        iconBackground: "bg-orange-500/20",
      };
    case "ethereum":
      return {
        icon: "Ξ",
        iconColor: "text-blue-500",
        iconBackground: "bg-blue-500/20",
      };
    default:
      return {
        icon: "$",
        iconColor: "text-green-500",
        iconBackground: "bg-green-500/20",
      };
  }
};

export const Navbar = ({ selectedAsset, onAssetChange }: NavbarProps) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAssetCategories = async () => {
      try {
        const data = await graphqlClient.request<GraphQLResponse>(GET_ASSET_CATEGORIES);
        const transformedCategories = data.assetCategories.map(category => ({
          ...category,
          value: category.id,
          ...getAssetStyles(category.id),
        }));

        setAssetCategories(transformedCategories);
      } catch (error) {
        console.error("Error fetching asset categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetCategories();
  }, []);

  const getNavigationPath = (path: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("asset", selectedAsset);
    return `${path}?${newParams.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 sticky top-0 z-50 bg-slate-900/60 backdrop-blur-xl">
      <div className="flex p-2 border-b border-gray-800 items-center justify-between gap-8">
        <img src="/Logo.svg" alt="Logo" className="h-8 w-auto" />
        <div className="hidden md:flex gap-8 items-center justify-between w-full">
          <div className="flex gap-8 items-center">
            <Select value={selectedAsset} onValueChange={onAssetChange}>
              <SelectTrigger className="p-2 min-w-60 h-fit bg-tapir-card/50 border-purple-500/20 text-white hover:bg-tapir-card/70 focus:ring-purple-500/40 transition-all duration-200">
                <SelectValue placeholder="Select an asset to stake" />
              </SelectTrigger>
              <SelectContent className="bg-tapir-card border-purple-500/20 animate-in fade-in-0 zoom-in-95 duration-200">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-400">
                    Loading...
                  </div>
                ) : (
                  assetCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.value}
                      className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${category.iconBackground} flex items-center justify-center shrink-0`}
                        >
                          <span className={`${category.iconColor} text-xl`}>
                            {category.icon}
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="font-medium text-base">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Link
              to={getNavigationPath("/swap")}
              className={`text-sm transition-colors ${location.pathname === "/swap" ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Swap
            </Link>
            <Link
              to={getNavigationPath("/liquidity")}
              className={`text-sm transition-colors ${location.pathname === "/liquidity" ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Liquidity
            </Link>
            <Link
              to={getNavigationPath("/split")}
              className={`text-sm transition-colors ${location.pathname === "/split" ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              Split
            </Link>
          </div>
          <WalletButton />
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-purple-500/20 rounded-md transition-colors relative"
        >
          <div className="relative">
            <Menu 
              size={24} 
              className={`transition-all duration-300 origin-center ${
                mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
            <X 
              size={24} 
              className={`absolute top-0 transition-all duration-300 origin-center ${
                mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-slate-900 border border-purple-500/20 animate-in slide-in-from-top duration-300 z-20 mx-4 rounded-md">
          <div className="flex flex-col p-2 space-y-4">
            <Select value={selectedAsset} onValueChange={onAssetChange}>
              <SelectTrigger className="w-full p-2 h-fit bg-tapir-card/50 border-purple-500/20 text-white hover:bg-tapir-card/70 focus:ring-purple-500/40 transition-all duration-200">
                <SelectValue placeholder="Select an asset to stake" />
              </SelectTrigger>
              <SelectContent className="bg-tapir-card border-purple-500/20 animate-in fade-in-0 zoom-in-95 duration-200">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-400">
                    Loading...
                  </div>
                ) : (
                  assetCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.value}
                      className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30 py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${category.iconBackground} flex items-center justify-center shrink-0`}
                        >
                          <span className={`${category.iconColor} text-xl`}>
                            {category.icon}
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="font-medium text-base">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <div className="flex flex-col items-end space-y-4 px-2">
              <Link
                to={getNavigationPath("/swap")}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm transition-colors ${location.pathname === "/swap" ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                Swap
              </Link>
              <Link
                to={getNavigationPath("/liquidity")}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm transition-colors ${location.pathname === "/liquidity" ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                Liquidity
              </Link>
              <Link
                to={getNavigationPath("/split")}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm transition-colors ${location.pathname === "/split" ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                Split
              </Link>
            </div>
            <WalletButton />
          </div>
        </div>
      )}
    </div>
  );
};
