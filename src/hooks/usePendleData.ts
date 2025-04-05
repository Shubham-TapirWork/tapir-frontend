import { useState, useEffect, useCallback } from "react";
import { parsePendleData } from "../lib/pendle";

interface PendleData {
  timestamp: number;
  maxApy: number;
  baseApy: number;
  tvl: number;
}

interface UsePendleDataProps {
  timeframe: string;
  chainId?: string;
  marketAddress?: string;
}

export const usePendleData = ({
  timeframe,
  chainId,
  marketAddress
}: UsePendleDataProps) => {
  const [data, setData] = useState<PendleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cachedData, setCachedData] = useState<Record<string, PendleData[]>>({});

  const fetchData = useCallback(async () => {
    if (cachedData[timeframe]) {
      setData(cachedData[timeframe]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const now = new Date();
      let startDate = new Date(now);
      let timeFrameParam: string;

      switch (timeframe) {
        case '1h':
          startDate.setHours(now.getHours() - 72);
          timeFrameParam = 'hour';
          break;
        case '1d':
          startDate.setDate(now.getDate() - 60);
          timeFrameParam = 'day';
          break;
        default:
          startDate.setDate(now.getDate() - 180);
          timeFrameParam = 'week';
      }

      const url = new URL(`https://api-v2.pendle.finance/core/v1/${chainId}/markets/${marketAddress}/stat-history`);
      url.searchParams.append('time_frame', timeFrameParam);
      url.searchParams.append('timestamp_start', startDate.toISOString());
      url.searchParams.append('timestamp_end', now.toISOString());

      const response = await fetch(url);
      const jsonData = await response.json();
      const parsedData = parsePendleData(jsonData.results);
      
      // Update cache and current data
      setCachedData(prev => ({ ...prev, [timeframe]: parsedData }));
      setData(parsedData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
      console.error('Error fetching Pendle data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, chainId, marketAddress, cachedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
};
