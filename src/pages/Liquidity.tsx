import { useSearchParams } from "react-router-dom";
import { LPPosition } from "@/components/LPPosition";
import { LiquidityOperations } from "@/components/LiquidityOperations";
import { PoolChart } from "@/components/PoolChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import { POOL_DATA } from "@/components/LPPosition";

interface PoolData {
  id: number;
  name: string;
  version: string;
  tvl: string;
  apr: string;
  volume24h: string;
  fee: string;
}

interface LiquidityPageProps {
  selectedAsset: string;
}

const LiquidityPage = ({ selectedAsset }: LiquidityPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const poolName = searchParams.get("pool");
  const selectedPool = poolName
    ? POOL_DATA[selectedAsset]?.find((pool) => pool.name === poolName)
    : undefined;

  const handlePoolSelect = (pool: PoolData) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("pool", pool.name);
    setSearchParams(currentParams);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
        <div className="space-y-4">
          <LPPosition
            selectedAsset={selectedAsset}
            onPoolSelect={handlePoolSelect}
            selectedPool={selectedPool}
          />
          <LiquidityOperations selectedPool={selectedPool} />
        </div>
        <div className="space-y-4">
          <PoolChart selectedPool={selectedPool} />
          <TransactionHistory selectedPool={selectedPool} />
        </div>
      </div>
    </div>
  );
};

export default LiquidityPage;
