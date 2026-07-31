import { describe, expect, it } from 'vitest';
import { createAuctionMockStore } from './auction-mock-store';

describe('auction mock store', () => {
  it('creates deterministic seeded auctions, bets and cities', () => {
    const store = createAuctionMockStore();

    expect(store.getAuctions()).toHaveLength(2);
    expect(store.getCities()).toEqual(['Пермь', 'Москва', 'Казань', 'Екатеринбург']);
    expect(store.getAuctionByUuid('550e8400-e29b-41d4-a716-446655440001')?.bets.bets).toHaveLength(
      1,
    );
  });

  it('does not expose mutable state through reads', () => {
    const store = createAuctionMockStore();
    const auction = store.getAuctionByUuid('550e8400-e29b-41d4-a716-446655440001');

    if (!auction) {
      throw new Error('Expected the seeded auction.');
    }

    auction.detail.main.cargo_num = 'changed outside the store';

    expect(store.getAuctionByUuid(auction.uuid)?.detail.main.cargo_num).toBe('00000001059');
  });

  it('replaces one auction through a validated update and resets the seed state', () => {
    const store = createAuctionMockStore();
    const uuid = '550e8400-e29b-41d4-a716-446655440001';

    store.replaceAuction(uuid, (auction) => ({
      ...auction,
      detail: {
        ...auction.detail,
        trading: { ...auction.detail.trading, can_set_bet: false },
      },
    }));

    expect(store.getAuctionByUuid(uuid)?.detail.trading.can_set_bet).toBe(false);

    store.reset();

    expect(store.getAuctionByUuid(uuid)?.detail.trading.can_set_bet).toBe(true);
  });
});
