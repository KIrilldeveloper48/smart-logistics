import { describe, expect, it } from 'vitest';
import { toAuctionListRequestFromSearch } from './auction-list-search-request.mapper';

describe('toAuctionListRequestFromSearch', () => {
  it('orders inverted date and price ranges before building the request', () => {
    expect(
      toAuctionListRequestFromSearch({
        page: 1,
        perPage: 20,
        loadDateFrom: '2026-05-30',
        loadDateTo: '2026-05-20',
        currentPriceFrom: 30_000,
        currentPriceTo: 20_000,
      }),
    ).toMatchObject({
      load_date_from: '2026-05-20T00:00:00Z',
      load_date_to: '2026-05-30T23:59:59Z',
      current_price_from: 20_000,
      current_price_to: 30_000,
    });
  });
});
