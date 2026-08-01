import { describe, expect, it } from 'vitest';
import { createAuctionMockStore } from './auction-mock-store';

describe('auction mock store', () => {
  it('creates deterministic seeded auctions, bets and cities', () => {
    const store = createAuctionMockStore();

    expect(store.getAuctions()).toHaveLength(25);
    expect(store.getCities()).toHaveLength(10);
    expect(store.getCities()).toEqual(
      expect.arrayContaining([
        'Пермь',
        'Москва',
        'Казань',
        'Екатеринбург',
        'Санкт-Петербург',
        'Новосибирск',
        'Ростов-на-Дону',
        'Краснодар',
        'Уфа',
        'Самара',
      ]),
    );
    expect(store.getAuctionByUuid('550e8400-e29b-41d4-a716-446655440001')?.bets.bets).toHaveLength(
      2,
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

  it('places a bid atomically and resets the seed state', () => {
    const store = createAuctionMockStore({ now: () => new Date('2026-05-26T12:00:00Z') });
    const uuid = '550e8400-e29b-41d4-a716-446655440001';

    expect(store.placeBid(uuid, 28_500)).toEqual({ success: true });

    expect(store.getAuctionByUuid(uuid)?.detail.trading.price?.current).toBe(28_500);
    expect(store.getAuctionByUuid(uuid)?.bets.bets[0]?.created_at).toBe('2026-05-26T12:00:00.000Z');

    store.reset();

    expect(store.getAuctionByUuid(uuid)?.detail.trading.price?.current).toBe(29_000);
  });
});
