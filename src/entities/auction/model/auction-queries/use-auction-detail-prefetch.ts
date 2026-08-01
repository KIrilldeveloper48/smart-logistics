import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchAuctionDetail } from './auction-detail.prefetch';

export const useAuctionDetailPrefetch = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (auctionUuid: string) => {
      void prefetchAuctionDetail(queryClient, auctionUuid);
    },
    [queryClient],
  );
};
