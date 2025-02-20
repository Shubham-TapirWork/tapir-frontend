import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from "react";

const generateData = () => {
  const data = [];
  const date = new Date();
  for (let i = 30; i >= 0; i--) {
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      safeApy: 4 + Math.random(), // Random APY around 4-5%
      regularApy: 7 + Math.random() * 2, // Random APY around 7-9%
      boostedApy: 11 + Math.random() * 3, // Random APY around 11-14%
    });
  }
  return data;
};

export const ApyGraph = () => {
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "3M" | "1Y">("1M");
  const data = generateData();

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
      categories: data.map(item => item.date.split('-').slice(1).join('/')),
      labels: {
        style: {
          color: '#666'
        }
      },
      lineColor: '#666',
      tickColor: '#666'
    },
    yAxis: {
      title: {
        text: undefined
      },
      labels: {
        formatter: function() {
          return this.value + '%';
        },
        style: {
          color: '#666'
        }
      },
      gridLineColor: 'rgba(102, 102, 102, 0.2)'
    },
    series: [
      {
        name: 'Regular Staking',
        data: data.map(item => item.safeApy),
        color: '#6E59A5',
        type: 'line'
      },
      {
        name: 'Safe Staking',
        data: data.map(item => item.regularApy),
        color: '#9b87f5',
        type: 'line'
      },
      {
        name: 'Boosted Staking',
        data: data.map(item => item.boostedApy),
        color: '#7E69AB',
        type: 'line'
      }
    ],
    legend: {
      itemStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      shared: true,
      formatter: function(this: any): string {
        if (!this.points) return '';
        
        return this.points.reduce((s: string, point: any) => {
          return s + `<br/><span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y?.toFixed(2)}%</b>`;
        }, `<b>${this.x}</b>`);
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
          {["1W", "1M", "3M", "1Y"].map((period) => (
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