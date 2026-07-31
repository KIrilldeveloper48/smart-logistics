import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { problemDetailSchema } from '../auction-common.schemas';
import { auctionDetailResponseSchema, betListResponseSchema } from '../auction-detail.schemas';
import { auctionListResponseSchema } from '../auction-list.schemas';
import { auctionMockStore } from './auction-mock-store';
import { auctionReadHandlers } from './auction-read.handlers';

const server = setupServer(...auctionReadHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  auctionMockStore.reset();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('auction read handlers', () => {
  it('returns the filtered and paginated auctions list', async () => {
    const response = await fetch('http://localhost/auctions/list', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ load_city: 'Пермь', current_price_to: 29_000, per_page: 1 }),
    });
    const payload = auctionListResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(1);
    expect(payload.data?.[0]?.main?.cargo_num).toBe('00000001059');
    expect(payload.meta).toMatchObject({ current_page: 1, per_page: 1, total: 1 });
  });

  it('returns a contract-valid detail response or a 404 problem', async () => {
    const detailResponse = await fetch(
      'http://localhost/auctions/550e8400-e29b-41d4-a716-446655440001',
    );
    const detail = auctionDetailResponseSchema.parse(await detailResponse.json());
    const missingResponse = await fetch(
      'http://localhost/auctions/550e8400-e29b-41d4-a716-446655440099',
    );
    const problem = problemDetailSchema.parse(await missingResponse.json());

    expect(detailResponse.status).toBe(200);
    expect(detail.main.cargo_num).toBe('00000001059');
    expect(missingResponse.status).toBe(404);
    expect(problem.code).toBe('auction_not_found');
  });

  it('hides bet history and includes cancelled bets only when all=true', async () => {
    const visibleResponse = await fetch(
      'http://localhost/auctions/550e8400-e29b-41d4-a716-446655440001/bets',
    );
    const visibleBets = betListResponseSchema.parse(await visibleResponse.json());
    const allResponse = await fetch(
      'http://localhost/auctions/550e8400-e29b-41d4-a716-446655440001/bets?all=true',
    );
    const allBets = betListResponseSchema.parse(await allResponse.json());
    const hiddenResponse = await fetch(
      'http://localhost/auctions/550e8400-e29b-41d4-a716-446655440002/bets?all=true',
    );
    const hiddenBets = betListResponseSchema.parse(await hiddenResponse.json());

    expect(visibleBets.bets).toHaveLength(1);
    expect(allBets.bets).toHaveLength(2);
    expect(hiddenBets.bets).toEqual([]);
  });

  it('returns a 422 contract error for invalid list filters', async () => {
    const response = await fetch('http://localhost/auctions/list', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ page: 1.5 }),
    });
    const problem = problemDetailSchema.parse(await response.json());

    expect(response.status).toBe(422);
    expect(problem.code).toBe('validation_failed');
  });
});
