import { toAuctionListRequest } from '@/entities/auction';
import type { TAuctionListRequest } from '@/entities/auction';
import { toEndOfDay, toStartOfDay } from './auction-list-search-date.helpers';
import type { TAuctionListSearch } from './auction-list-search.types';

export const toAuctionListRequestFromSearch = (
  search: Readonly<TAuctionListSearch>,
): TAuctionListRequest =>
  toAuctionListRequest({
    ...search,
    loadDateFrom: toStartOfDay(search.loadDateFrom),
    loadDateTo: toEndOfDay(search.loadDateTo),
  });
