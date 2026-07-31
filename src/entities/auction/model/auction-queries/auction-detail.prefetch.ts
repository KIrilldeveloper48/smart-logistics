import type { QueryClient } from '@tanstack/react-query';
import { auctionDetailQueryOptions } from './auction-detail.query';

export const prefetchAuctionDetail = (
  queryClient: QueryClient,
  auctionUuid: string,
): Promise<void> => queryClient.prefetchQuery(auctionDetailQueryOptions(auctionUuid));
