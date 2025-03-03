import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Transaction {
  user: string;
  action: string;
  value: string;
  time: string;
  type: 'trade' | 'liquidity';
  position?: 'YB' | 'DP';
  direction?: 'buy' | 'sell';
}

const mockTransactions: Transaction[] = [
  {
    user: "0xff28...20d1",
    action: "Remove Liquidity",
    value: "$1,693.16",
    time: "26m",
    type: "liquidity"
  },
  {
    user: "0x2f3e...5ed8",
    action: "Remove Liquidity",
    value: "$981.70",
    time: "4h 39m",
    type: "liquidity"
  },
  {
    user: "0x893c...f4ae",
    action: "Buy YB",
    value: "$2,012.10",
    time: "4h 53m",
    type: "trade",
    position: "YB",
    direction: "buy"
  },
  {
    user: "0xd30b...c0c7",
    action: "Add Liquidity",
    value: "$150,808",
    time: "15h 37m",
    type: "liquidity"
  },
  {
    user: "0xdb5e...71f4",
    action: "Sell DP",
    value: "$3,696.00",
    time: "16h 16m",
    type: "trade",
    position: "DP",
    direction: "sell"
  }
];

interface TransactionHistoryProps {
  selectedPool?: {
    id: number;
    name: string;
    version: string;
    tvl: string;
    apr: string;
    volume24h: string;
    fee: string;
  };
}

export const TransactionHistory = ({ selectedPool }: TransactionHistoryProps) => {
  const [activeTab, setActiveTab] = useState<'trade' | 'liquidity'>('trade');
  const [filterValue, setFilterValue] = useState("");
  const [valueFilter, setValueFilter] = useState("all");

  const filteredTransactions = mockTransactions
    .filter(tx => tx.type === activeTab)
    .filter(tx => 
      filterValue ? tx.user.toLowerCase().includes(filterValue.toLowerCase()) : true
    )
    .filter(tx => {
      if (valueFilter === "all") return true;
      const value = parseFloat(tx.value.replace("$", "").replace(",", ""));
      return value >= 50;
    });

  if (!selectedPool) {
    return (
      <Card className="bg-tapir-card border-purple-500/20">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400 py-12 text-sm">
            Select a pool to view transactions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-tapir-card border-purple-500/20">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Transactions</h3>
            <div className="flex items-center gap-4">
              <Select 
                value={valueFilter}
                onValueChange={setValueFilter}
              >
                <SelectTrigger className="w-[140px] h-8 bg-tapir-dark/50 border-purple-500/20 text-white text-sm">
                  <SelectValue placeholder="Filter by value" />
                </SelectTrigger>
                <SelectContent className="bg-tapir-card border-purple-500/20">
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="50">$50 & above</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Filter by wallet address"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="pl-10 h-8 w-[200px] bg-tapir-dark/50 border-purple-500/20 text-white text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('trade')}
              className={`px-4 py-1 rounded-md text-sm transition-colors ${
                activeTab === 'trade'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Trades
            </button>
            <button
              onClick={() => setActiveTab('liquidity')}
              className={`px-4 py-1 rounded-md text-sm transition-colors ${
                activeTab === 'liquidity'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Liquidity
            </button>
          </div>
        </div>

        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/20 hover:bg-transparent">
                <TableHead className="text-gray-400">User</TableHead>
                <TableHead className="text-gray-400">Action</TableHead>
                <TableHead className="text-gray-400">Value</TableHead>
                <TableHead className="text-gray-400 text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx, i) => (
                <TableRow 
                  key={i} 
                  className="border-purple-500/20 hover:bg-purple-500/5"
                >
                  <TableCell className="text-white">{tx.user}</TableCell>
                  <TableCell>
                    <span className={`${
                      tx.type === 'liquidity' 
                        ? tx.action.includes('Add') ? 'text-green-400' : 'text-red-400'
                        : tx.direction === 'buy' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tx.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-white">{tx.value}</TableCell>
                  <TableCell className="text-gray-400 text-right">{tx.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};