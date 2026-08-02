import { toAuctionListRequest } from '@/entities/auction';
import type { TAuctionListRequest } from '@/entities/auction';
import { orderRange } from '@/shared/lib';
import { toEndOfDay, toStartOfDay } from './auction-list-search-date.helpers';
import type { TAuctionListSearch } from './auction-list-search.types';

export const toAuctionListRequestFromSearch = (
  search: Readonly<TAuctionListSearch>,
): TAuctionListRequest => {
  const [loadDateFrom, loadDateTo] = orderRange(search.loadDateFrom, search.loadDateTo);
  const [currentPriceFrom, currentPriceTo] = orderRange(
    search.currentPriceFrom,
    search.currentPriceTo,
  );

  return toAuctionListRequest({
    ...search,
    loadDateFrom: toStartOfDay(loadDateFrom),
    loadDateTo: toEndOfDay(loadDateTo),
    currentPriceFrom,
    currentPriceTo,
  });
};
