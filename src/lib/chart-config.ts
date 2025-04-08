import type { Options } from 'highcharts';

export const baseChartOptions: Partial<Options> = {
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
        return `<div style="color: ${this.color}">${this.series.name}: $${((this.y ?? 0) / 1000000).toFixed(2)}M</div>`;
      }
      return `<div style="color: ${this.color}">${this.series.name}: ${(this.y ?? 0).toFixed(2)}%</div>`;
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
