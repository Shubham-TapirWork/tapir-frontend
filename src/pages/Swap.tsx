import { MainTradeWidget } from "@/components/MainTradingWidget";
import { ApyGraph } from "@/components/ApyGraph";

const SwapPage = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MainTradeWidget />
        <ApyGraph />
      </div>
    </div>
  );
};

export default SwapPage;
