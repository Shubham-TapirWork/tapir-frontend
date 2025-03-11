import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState, useEffect } from "react";

interface PendleData {
  timestamp: number;
  maxApy: number;
  baseApy: number;
  tvl: number;
}

const parsePendleData = (csvData: string): PendleData[] => {
  const lines = csvData.trim().split('\n');
  return lines.slice(1).map(line => {
    const [timestamp, maxApy, baseApy, tvl] = line.split(',').map(Number);
    return {
      timestamp,
      maxApy: maxApy * 100, // Convert to percentage
      baseApy: baseApy * 100,
      tvl
    };
  });
};

const formatDate = (timestamp: number, timeframe: string): string => {
  const date = new Date(timestamp * 1000);
  if (timeframe === '1h') {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (timeframe === '1d') {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
  } else {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  }
};

export const ApyGraph = () => {
  const [timeframe, setTimeframe] = useState<"1h" | "1d" | "1w">("1w");
  const [data, setData] = useState<PendleData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if (timeframe === '1h') {
          url = 'https://api-v2.pendle.finance/bff/v1/1/markets/0xb451a36c8b6b2eac77ad0737ba732818143a0e25/stat-history?time_frame=hour&timestamp_start=2024-12-10T11:00:00.000Z&timestamp_end=2025-03-10T10:00:00.000Z';
        } else if (timeframe === '1d') {
          url = 'https://api-v2.pendle.finance/bff/v1/1/markets/0xb451a36c8b6b2eac77ad0737ba732818143a0e25/stat-history?time_frame=day&timestamp_start=2024-12-11T00:00:00.000Z&timestamp_end=2025-03-10T00:00:00.000Z';
        } else {
          url = 'https://api-v2.pendle.finance/bff/v1/1/markets/0xb451a36c8b6b2eac77ad0737ba732818143a0e25/stat-history?time_frame=week&timestamp_start=2024-12-16T00:00:00.000Z&timestamp_end=2025-03-10T00:00:00.000Z';
        }
        
        const response = await fetch(url);
        const jsonData = await response.json();
        const parsedData = parsePendleData(jsonData.results);
        setData(parsedData);
      } catch (error) {
        console.error('Error fetching Pendle data:', error);
      }
    };

    fetchData();
  }, [timeframe]);

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: data.map(item => formatDate(item.timestamp, timeframe)),
      labels: {
        style: {
          color: '#666'
        },
        rotation: timeframe === '1h' ? -45 : 0
      },
      lineColor: '#666',
      tickColor: '#666',
      tickInterval: timeframe === '1h' ? 4 : 1
    },
    yAxis: [
      {
        title: {
          text: 'APY',
          style: {
            color: '#9b87f5'
          }
        },
        labels: {
          formatter: function() {
            return this.value + '%';
          },
          style: {
            color: '#666'
          }
        },
        gridLineColor: 'rgba(102, 102, 102, 0.2)',
        softMin: Math.min(...data.map(item => Math.min(item.baseApy, item.maxApy))) * 0.9,
        softMax: Math.max(...data.map(item => Math.max(item.baseApy, item.maxApy))) * 1.1
      },
      {
        title: {
          text: 'TVL',
          style: {
            color: '#4CAF50'
          }
        },
        labels: {
          formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
            return '$' + (Number(this.value) / 1000000).toFixed(1) + 'M';
          },
          style: {
            color: '#666'
          }
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
    ],
    legend: {
      itemStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<div style="font-size: 12px; font-weight: bold; padding-bottom: 5px">{point.key}</div>',
      pointFormatter: function() {
        if (this.series.name === 'TVL') {
          return `<div style="color: ${this.color}">${this.series.name}: $${(this.y / 1000000).toFixed(2)}M</div>`;
        }
        return `<div style="color: ${this.color}">${this.series.name}: ${this.y.toFixed(2)}%</div>`;
      },
      backgroundColor: '#1A1F2C',
      borderColor: 'rgba(155, 135, 245, 0.2)',
      borderRadius: 8,
      padding: 12,
      style: {
        color: '#fff'
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false
        }
      }
    },
    credits: {
      enabled: false
    }
  };

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
              className={`text-xs ${
                timeframe === period
                  ? "bg-purple-500 hover:bg-purple-500/90"
                  : "hover:bg-purple-500/10"
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </CardContent>
    </Card>
  );
};