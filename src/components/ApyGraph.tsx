import { useState, useMemo } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { usePendleData } from "@/hooks/usePendleData";

import { formatDate } from "@/lib/pendle";
import { baseChartOptions } from "@/lib/chart-config";

export const ApyGraph = () => {
  const [timeframe, setTimeframe] = useState<"1h" | "1d" | "1w">("1w");
  const { data, isLoading, error } = usePendleData({
    timeframe,
    chainId: '1',
    marketAddress: '0xb451a36c8b6b2eac77ad0737ba732818143a0e25'
  });

  const chartOptions = useMemo((): Highcharts.Options => ({
    ...baseChartOptions,
    xAxis: {
      categories: data.map(item => formatDate(item.timestamp, timeframe)),
      labels: {
        style: { color: '#666' },
        rotation: 0
      },
      lineColor: '#666',
      tickColor: '#666',
      tickInterval: timeframe === '1w' ? 5 : timeframe === '1h' ? 16 : 8
    },
    yAxis: [
      {
        title: {
          text: 'APY',
          style: { color: '#9b87f5' }
        },
        labels: {
          formatter: function() {
            return this.value + '%';
          },
          style: { color: '#666' }
        },
        gridLineColor: 'rgba(102, 102, 102, 0.2)',
        softMin: Math.min(...data.map(item => Math.min(item.baseApy, item.maxApy))) * 0.9,
        softMax: Math.max(...data.map(item => Math.max(item.baseApy, item.maxApy))) * 1.1
      },
      {
        title: {
          text: 'TVL',
          style: { color: '#4CAF50' }
        },
        labels: {
          formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
            return '$' + (Number(this.value) / 1000000).toFixed(1) + 'M';
          },
          style: { color: '#666' }
        },
        opposite: true,
        gridLineWidth: 0
      }
    ],
    series: [
      {
        name: 'Base APY',
        data: data.map(item => item.baseApy),
        color: '#9b87f5',
        type: 'line',
        yAxis: 0
      },
      {
        name: 'Max APY',
        data: data.map(item => item.maxApy),
        color: '#7E69AB',
        type: 'line',
        yAxis: 0
      },
      {
        name: 'TVL',
        data: data.map(item => item.tvl),
        color: '#4CAF50',
        type: 'line',
        yAxis: 1,
        dashStyle: 'ShortDot'
      }
    ]
  }), [data, timeframe]);

  return (
    <Card className="bg-tapir-card border-purple-500/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-white">Historical APY</CardTitle>
        <div className="flex gap-2 text-white hover:text-white">
          {["1h", "1d", "1w"].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(period as typeof timeframe)}
              className={`text-xs ${timeframe === period ? "bg-purple-500 hover:bg-purple-500/90" : "hover:bg-purple-500/10"}`}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : isLoading ? (
          <div className="text-gray-400 text-center py-8">Loading...</div>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
          />
        )}
      </CardContent>
    </Card>
  );
};