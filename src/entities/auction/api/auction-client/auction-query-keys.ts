import { listBetsSearchSchema } from '../auction-detail/auction-detail.schemas';
import type { TListBetsSearch } from '../auction-detail/auction-detail.types';
import { auctionListRequestSchema } from '../auction-list/auction-list.schemas';
import type { TAuctionListRequest } from '../auction-list/auction-list.types';

export const auctionQueryKeys = {
  all: ['auctions'] as const,
  lists: () => ['auctions', 'list'] as const,
  list: (request: Readonly<TAuctionListRequest>) =>
    ['auctions', 'list', auctionListRequestSchema.parse(request)] as const,
  details: () => ['auctions', 'detail'] as const,
  detail: (auctionUuid: string) => ['auctions', 'detail', auctionUuid] as const,
  bets: (auctionUuid: string, search?: Readonly<TListBetsSearch>) =>
    ['auctions', 'bets', auctionUuid, listBetsSearchSchema.parse(search ?? {})] as const,
};
