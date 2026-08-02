import { describe, expect, it } from 'vitest';
import { toAuctionListRequest } from './auction-list-request.mapper';
import { auctionListRequestSchema, auctionListResponseSchema } from './auction-list.schemas';

describe('auction list contract schemas', () => {
  it('accepts a request with contract filter values', () => {
    const request = auctionListRequestSchema.parse({
      page: 1,
      per_page: 20,
      sort: { start_time: 'asc' },
      status: ['Leading'],
      load_date_from: '2026-05-26T15:30:00+03:00',
      auction_ids: [1224, 1236],
      current_price_from: null,
      auc_type: ['Request', 'Up'],
    });

    expect(request.sort).toEqual({ start_time: 'asc' });
  });

  it('rejects invalid request filter boundaries', () => {
    expect(auctionListRequestSchema.safeParse({ page: 1.5 }).success).toBe(false);
    expect(
      auctionListRequestSchema.safeParse({ load_date_from: '2026-05-26T15:30:00' }).success,
    ).toBe(false);
    expect(auctionListRequestSchema.safeParse({ auc_type: ['Unknown'] }).success).toBe(false);
  });

  it('accepts nullable list response fields declared by the contract', () => {
    const response = auctionListResponseSchema.parse({
      data: [
        {
          main: { id: 10, auc_type: 'Down', price_per_km: null },
          cargo: { car: null },
          trading: {
            status: 'Auction',
            bid_measurement_type: null,
            price: null,
            your: { last_bet: null },
          },
        },
      ],
      meta: { current_page: 1, total: 1 },
    });

    expect(response.data?.[0]?.cargo?.car).toBeNull();
    expect(response.data?.[0]?.trading?.bid_measurement_type).toBeNull();
  });

  it('rejects a non-UUID order identifier in a list response', () => {
    expect(
      auctionListResponseSchema.safeParse({ data: [{ main: { order_uid: 'not-a-uuid' } }] })
        .success,
    ).toBe(false);
  });
});

describe('toAuctionListRequest', () => {
  it('maps UI search state to the snake_case API payload', () => {
    expect(
      toAuctionListRequest({
        page: 2,
        perPage: 50,
        isOldest: true,
        loadCity: 'Пермь',
        loadGcId: 59,
        currentPriceFrom: null,
        auctionTypes: ['Down'],
      }),
    ).toEqual({
      page: 2,
      per_page: 50,
      is_oldest: true,
      load_city: 'Пермь',
      load_gc_id: 59,
      current_price_from: null,
      auc_type: ['Down'],
    });
  });

  it('rejects invalid UI search values before mapping them', () => {
    expect(() => toAuctionListRequest({ loadDateFrom: '2026-05-26' })).toThrow();
  });
});
