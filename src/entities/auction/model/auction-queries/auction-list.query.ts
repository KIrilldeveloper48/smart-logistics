import { queryOptions, useQuery } from '@tanstack/react-query';
import { auctionClient, auctionQueryKeys } from '../../api';
import type { TAuctionListRequest } from '../../api';

export const auctionListQueryOptions = (request: Readonly<TAuctionListRequest>) =>
  queryOptions({
    queryKey: auctionQueryKeys.list(request),
    queryFn: () => auctionClient.getList(request),
  });

export const useAuctionListQuery = (request: Readonly<TAuctionListRequest>) =>
  useQuery(auctionListQueryOptions(request));
