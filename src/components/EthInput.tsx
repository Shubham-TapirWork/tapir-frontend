import { Input } from "@/components/ui/input";

interface EthInputProps {
  amount: string;
  setAmount: (value: string) => void;
  userBalance: {
    value: bigint;
    decimals: number;
    displayValue: string;
    symbol: string;
    name: string;
  };
  isWalletConnected: boolean;
  isLoadingBalance: boolean;
}

export const EthInput = ({
  amount,
  setAmount,
  userBalance,
  isWalletConnected,
  isLoadingBalance,
}: EthInputProps) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{userBalance?.symbol} Amount</span>
        <span className={`text-gray-400 text-sm transition-opacity duration-300 ${isLoadingBalance ? 'animate-pulse' : ''}`}>
          {isWalletConnected ? (
            isLoadingBalance ? (
              <span className="inline-flex items-center">
                Loading balance
                <span className="ml-1 inline-block animate-[bounce_1s_infinite]">.</span>
                <span className="ml-0.5 inline-block animate-[bounce_1s_infinite_0.2s]">.</span>
                <span className="ml-0.5 inline-block animate-[bounce_1s_infinite_0.4s]">.</span>
              </span>
            ) : (
              `Balance: ${userBalance.displayValue} ${userBalance.symbol}`
            )
          ) : ""}
        </span>
      </div>
      <Input
        type="number"
        placeholder="0.0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="bg-transparent border-purple-500/20 text-white pr-16"
        disabled={!isWalletConnected}
        step={0.001}
      />
      <button
        onClick={() => setAmount(userBalance.displayValue)}
        className="absolute right-3 top-[70%] -translate-y-1/2 text-xs font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 hover:opacity-80 transition-all duration-300"
        disabled={!isWalletConnected}
      >
        MAX
      </button>
    </div>
  );
};