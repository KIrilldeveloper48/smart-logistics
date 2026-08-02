import { describe, expect, it } from 'vitest';
import { auctionsListSearchSchema } from './auction-list-search.schema';

describe('auctionsListSearchSchema', () => {
  it('parses supported URL values', () => {
    expect(
      auctionsListSearchSchema.parse({
        page: '2',
        perPage: '50',
        status: 'Leading',
        statuses: ['2', '6'],
        auctionTypes: 'Down',
        isAvailable: 'true',
        currentPriceFrom: '1000',
        loadDateFrom: '2026-05-26',
      }),
    ).toMatchObject({
      page: 2,
      perPage: 50,
      status: ['Leading'],
      statuses: [2, 6],
      auctionTypes: ['Down'],
      isAvailable: true,
      currentPriceFrom: 1000,
      loadDateFrom: '2026-05-26',
    });
  });

  it('uses safe fallbacks for invalid URL values', () => {
    expect(
      auctionsListSearchSchema.parse({
        page: '-2',
        perPage: '1000',
        status: 'Invalid',
        statuses: '1.5',
        auctionTypes: 'Unknown',
        isBidder: 'yes',
        currentPriceTo: 'not-a-number',
        loadDateTo: '26.05.2026',
      }),
    ).toEqual({ page: 1, perPage: 20 });
  });
});
