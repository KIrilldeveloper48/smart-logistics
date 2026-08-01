import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionClient, auctionQueryKeys } from '@/entities/auction';
import type { TAuctionBidMutationVariables } from './auction-bid-mutation.types';

export const useSetAuctionBidMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionUuid, price }: TAuctionBidMutationVariables) =>
      auctionClient.placeBid(auctionUuid, { price }),
    onSuccess: async (_result, { auctionUuid }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: auctionQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: auctionQueryKeys.detail(auctionUuid) }),
        queryClient.invalidateQueries({ queryKey: auctionQueryKeys.betsForAuction(auctionUuid) }),
      ]);
    },
  });
};
