import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const generateMockData = (days: number) => {
  const data = [];
  const date = new Date();
  for (let i = days; i >= 0; i--) {
    date.setDate(date.getDate() - 1);
    data.push({
      date: date.toISOString().split('T')[0],
      fees: Math.random() * 10000,
      volume: Math.random() * 1000000,
      apr: 5 + Math.random() * 15,
    });
  }
  return data;
};

interface PoolChartProps {
  selectedPool?: {
    name: string;
    apr: string;
  };
}

export const PoolChart = ({ selectedPool }: PoolChartProps) => {
  const [data] = useState(() => generateMockData(30));
  const [timeframe, setTimeframe] = useState<"1H" | "1D" | "1W">("1W");

  if (!selectedPool) {
    return (
      <Card className="bg-tapir-card border-purple-500/20 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4 animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="text-gray-400">
              Select a pool to view detailed analytics
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = (metric: string) => {
    if (metric === 'apr') {
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradient-apr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3C" />
          <XAxis
            dataKey="date"
            stroke="#666"
            tickFormatter={(value) => value.split('-').slice(1).join('/')}
          />
          <YAxis
            stroke="#666"
            tickFormatter={(value) => `${value.toFixed(2)}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1F2C",
              border: "1px solid #2A2F3C",
              color: "#fff",
            }}
            formatter={(value: any) => [`${Number(value).toFixed(2)}%`, 'APR']}
          />
          <Area
            type="monotone"
            dataKey="apr"
            stroke="#a855f7"
            fill="url(#gradient-apr)"
          />
        </AreaChart>
      );
    }

    return (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3C" />
        <XAxis
          dataKey="date"
          stroke="#666"
          tickFormatter={(value) => value.split('-').slice(1).join('/')}
        />
        <YAxis
          stroke="#666"
          tickFormatter={(value) =>
            metric === 'volume'
              ? `$${(value / 1000).toFixed(0)}K`
              : `$${value.toFixed(0)}`
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1A1F2C",
            border: "1px solid #2A2F3C",
            color: "#fff",
          }}
          formatter={(value: any) =>
            [`$${Number(value).toLocaleString()}`, metric.charAt(0).toUpperCase() + metric.slice(1)]
          }
        />
        <Bar
          dataKey={metric}
          fill="#a855f7"
          opacity={0.8}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    );
  };

  return (
    <Card className="bg-tapir-card border-purple-500/20 transition-all duration-300 animate-in fade-in-0 zoom-in-95">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-white text-lg">Pool Analytics: {selectedPool.name}</CardTitle>
        <div className="flex gap-2">
          {["1H", "1D", "1W"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period as typeof timeframe)}
              className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                timeframe === period
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:bg-purple-500/20"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fees" className="w-full">
          <TabsList className="w-full bg-tapir-dark/50 border border-purple-500/20">
            <TabsTrigger
              value="fees"
              className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Fees
            </TabsTrigger>
            <TabsTrigger
              value="volume"
              className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Volume
            </TabsTrigger>
            <TabsTrigger
              value="apr"
              className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              APR
            </TabsTrigger>
          </TabsList>

          {["fees", "volume", "apr"].map((metric) => (
            <TabsContent key={metric} value={metric} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart(metric)}
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};