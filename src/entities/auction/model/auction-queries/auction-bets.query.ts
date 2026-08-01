import { queryOptions, useQuery } from '@tanstack/react-query';
import { auctionClient, auctionQueryKeys, auctionUuidSchema } from '../../api';

export const auctionBetsQueryOptions = (auctionUuid: string) => {
  const uuid = auctionUuidSchema.parse(auctionUuid);
  const search = { all: true } as const;

  return queryOptions({
    queryKey: auctionQueryKeys.bets(uuid, search),
    queryFn: () => auctionClient.getBets(uuid, search),
  });
};

export const useAuctionBetsQuery = (auctionUuid: string, enabled = true) =>
  useQuery({
    ...auctionBetsQueryOptions(auctionUuid),
    enabled,
  });
