import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { validationProblemSchema } from '../../auction-common/auction-common.schemas';
import {
  auctionDetailResponseSchema,
  betListResponseSchema,
} from '../../auction-detail/auction-detail.schemas';
import { auctionBidHandler } from './auction-bid.handler';
import { auctionMockStore } from '../auction-mock-store/auction-mock-store';
import { auctionReadHandlers } from '../auction-read/auction-read.handlers';

const server = setupServer(...auctionReadHandlers, auctionBidHandler);
const auctionUuid = '550e8400-e29b-41d4-a716-446655440001';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  auctionMockStore.reset();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('auction bid handler', () => {
  it('accepts a valid bid and updates detail and bet history', async () => {
    const response = await fetch(`http://localhost/auctions/${auctionUuid}/bets`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ price: 28_500 }),
    });
    const detailResponse = await fetch(`http://localhost/auctions/${auctionUuid}`);
    const detail = auctionDetailResponseSchema.parse(await detailResponse.json());
    const betsResponse = await fetch(`http://localhost/auctions/${auctionUuid}/bets`);
    const bets = betListResponseSchema.parse(await betsResponse.json());

    expect(response.status).toBe(200);
    expect(detail.trading.price?.current).toBe(28_500);
    expect(detail.trading.your?.last_bet).toBe(23_750);
    expect(detail.trading.your?.last_bet_with_vat).toBe(28_500);
    expect(bets.bets[0]?.price_with_vat).toBe(28_500);
  });

  it('returns a 422 validation problem for a price outside bid constraints', async () => {
    const response = await fetch(`http://localhost/auctions/${auctionUuid}/bets`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ price: 28_750 }),
    });
    const problem = validationProblemSchema.parse(await response.json());

    expect(response.status).toBe(422);
    expect(problem.errors[0]?.field).toBe('price');
  });
});
