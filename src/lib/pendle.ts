export interface PendleData {
  timestamp: number;
  maxApy: number;
  baseApy: number;
  tvl: number;
}

export const parsePendleData = (csvData: string): PendleData[] => {
  const lines = csvData.trim().split('\n');
  return lines.slice(1).map(line => {
    const [timestamp, maxApy, baseApy, tvl] = line.split(',').map(Number);
    return {
      timestamp,
      maxApy: maxApy * 100,
      baseApy: baseApy * 100,
      tvl
    };
  });
};

export const formatDate = (timestamp: number, timeframe: string): string => {
  const date = new Date(timestamp * 1000);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  switch (timeframe) {
    case '1h':
      return `${month}/${day} ${hours}:${minutes}`;
    case '1d':
      return `${month}/${day}`;
    default:
      return `${date.getFullYear()}/${month}/${day}`;
  }
};
