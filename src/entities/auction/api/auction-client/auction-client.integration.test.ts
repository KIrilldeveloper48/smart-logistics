import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { AuctionApiError } from './auction-api-error';
import { createAuctionClient } from './auction-client';
import { auctionBidHandler } from '../mocks/auction-bid/auction-bid.handler';
import { auctionMockStore } from '../mocks/auction-mock-store/auction-mock-store';
import { auctionReadHandlers } from '../mocks/auction-read/auction-read.handlers';

const server = setupServer(...auctionReadHandlers, auctionBidHandler);
const auctionClient = createAuctionClient({ baseUrl: 'http://localhost' });
const auctionUuid = '550e8400-e29b-41d4-a716-446655440001';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  auctionMockStore.reset();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('auction client state transitions', () => {
  it('reads the seeded auction list through the contract client', async () => {
    const response = await auctionClient.getList({});

    expect(response.data?.[0]?.main?.order_uid).toBe(auctionUuid);
  });

  it('persists a successful bid and exposes the updated state through reads', async () => {
    await auctionClient.placeBid(auctionUuid, { price: 28_500 });

    const [detail, bets] = await Promise.all([
      auctionClient.getDetail(auctionUuid),
      auctionClient.getBets(auctionUuid),
    ]);

    expect(detail.trading.price?.current).toBe(28_500);
    expect(detail.trading.your?.last_bet_with_vat).toBe(28_500);
    expect(bets.bets[0]?.price_with_vat).toBe(28_500);
  });

  it('maps a rejected bid to a typed API error', async () => {
    await expect(auctionClient.placeBid(auctionUuid, { price: 28_750 })).rejects.toMatchObject({
      name: AuctionApiError.name,
      context: {
        kind: 'http',
        status: 422,
        problem: {
          code: 'validation_failed',
        },
      },
    });
  });
});
