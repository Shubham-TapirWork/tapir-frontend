
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";

interface PoolData {
  id: number;
  name: string;
  version: string;
  tvl: string;
  apr: string;
  volume24h: string;
  fee: string;
}

export const POOL_DATA: Record<string, PoolData[]> = {
  ethereum: [
    {
      id: 1,
      name: "ETH/USDC",
      version: "v3",
      tvl: "$54.5M",
      apr: "17.747%",
      volume24h: "$53.0M",
      fee: "0.05%"
    },
    {
      id: 2,
      name: "ETH/USDT",
      version: "v3",
      tvl: "$95.7M",
      apr: "6.276%",
      volume24h: "$5.5M",
      fee: "0.3%"
    }
  ],
  bitcoin: [
    {
      id: 1,
      name: "WBTC/USDC",
      version: "v3",
      tvl: "$125.6M",
      apr: "10.75%",
      volume24h: "$12.3M",
      fee: "0.3%"
    },
    {
      id: 2,
      name: "WBTC/USDT",
      version: "v3",
      tvl: "$82.3M",
      apr: "8.92%",
      volume24h: "$9.1M",
      fee: "0.3%"
    }
  ],
  stable: [
    {
      id: 1,
      name: "USDC/USDT",
      version: "v3",
      tvl: "$234.1M",
      apr: "4.52%",
      volume24h: "$142.3M",
      fee: "0.01%"
    },
    {
      id: 2,
      name: "USDC/DAI",
      version: "v3",
      tvl: "$156.8M",
      apr: "3.89%",
      volume24h: "$98.5M",
      fee: "0.01%"
    }
  ]
};

interface LPPositionProps {
  selectedAsset: string;
  onPoolSelect: (pool: PoolData) => void;
  selectedPool?: PoolData;
}

export const LPPosition = ({ selectedAsset, onPoolSelect, selectedPool }: LPPositionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolData[]>([]);

  useEffect(() => {
    const fetchPoolData = async () => {
      setIsLoading(true);
      try {
        setPools(POOL_DATA[selectedAsset] || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching pool data:", error);
        setIsLoading(false);
      }
    };

    fetchPoolData();
  }, [selectedAsset]);

  return (
    <Card className="bg-tapir-card border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 max-h-max">
      <CardHeader>
        <CardTitle className="text-white">Liquidity Pools</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-purple-500/20 rounded w-3/4"></div>
            <div className="h-4 bg-purple-500/20 rounded w-1/2"></div>
            <div className="h-4 bg-purple-500/20 rounded w-2/3"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-purple-500/5 border-purple-500/20">
                <TableHead className="text-gray-400 w-12">#</TableHead>
                <TableHead className="text-gray-400">Pool</TableHead>
                <TableHead className="text-right text-gray-400">
                  <div className="flex items-center justify-end gap-1">
                    TVL
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right text-gray-400">APR</TableHead>
                <TableHead className="text-right text-gray-400">1D vol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pools.map((pool, index) => (
                <TableRow 
                  key={pool.id} 
                  className={`hover:bg-purple-500/5 border-purple-500/20 cursor-pointer transition-colors ${
                    selectedPool?.id === pool.id ? 'bg-purple-500/10' : ''
                  }`}
                  onClick={() => onPoolSelect(pool)}
                >
                  <TableCell className="text-gray-400 font-medium">
                    {pool.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-white font-medium">{pool.name}</div>
                      <div className="text-xs text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">
                        {pool.version}
                      </div>
                      <div className="text-xs text-gray-400">
                        {pool.fee}
                      </div>
                      {index === 0 &&
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 font-medium">
                          Active
                        </span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-white font-medium">
                    {pool.tvl}
                  </TableCell>
                  <TableCell className="text-right text-white font-medium">
                    {pool.apr}
                  </TableCell>
                  <TableCell className="text-right text-white font-medium">
                    {pool.volume24h}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
