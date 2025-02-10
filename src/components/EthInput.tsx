import { Input } from "@/components/ui/input";

interface EthInputProps {
  ethAmount: string;
  setEthAmount: (value: string) => void;
  userBalance: string;
  isWalletConnected: boolean;
  isLoadingBalance: boolean;
  label?: string;
}

export const EthInput = ({
  ethAmount,
  setEthAmount,
  userBalance,
  isWalletConnected,
  isLoadingBalance,
  label = "ETH amount"
}: EthInputProps) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
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
              `Balance: ${userBalance} ETH`
            )
          ) : ""}
        </span>
      </div>
      <Input
        type="number"
        placeholder="0.0"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
        className="bg-tapir-dark/50 border-tapir-purple/20 text-white pr-16"
        disabled={!isWalletConnected}
      />
      <button
        onClick={() => setEthAmount(userBalance)}
        className="absolute right-3 top-[70%] -translate-y-1/2 text-xs font-medium text-tapir-purple hover:text-tapir-purple/80 transition-colors"
        disabled={!isWalletConnected}
      >
        MAX
      </button>
    </div>
  );
};