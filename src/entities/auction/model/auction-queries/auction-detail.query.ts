import { queryOptions, useQuery } from '@tanstack/react-query';
import { auctionClient, auctionQueryKeys, auctionUuidSchema } from '../../api';

export const auctionDetailQueryOptions = (auctionUuid: string) => {
  const uuid = auctionUuidSchema.parse(auctionUuid);

  return queryOptions({
    queryKey: auctionQueryKeys.detail(uuid),
    queryFn: () => auctionClient.getDetail(uuid),
  });
};

export const useAuctionDetailQuery = (auctionUuid: string) =>
  useQuery(auctionDetailQueryOptions(auctionUuid));
