import { describe, expect, it } from 'vitest';
import { auctionDetailSearchSchema } from './auction-detail-search.schema';

describe('auctionDetailSearchSchema', () => {
  it('accepts bid mode and a safe internal return URL', () => {
    expect(
      auctionDetailSearchSchema.parse({ mode: 'bid', returnTo: '/?page=2&loadCity=Пермь' }),
    ).toEqual({ mode: 'bid', returnTo: '/?page=2&loadCity=Пермь' });
  });

  it('rejects an unknown mode and drops an external return URL', () => {
    expect(auctionDetailSearchSchema.safeParse({ mode: 'edit' }).success).toBe(false);
    expect(auctionDetailSearchSchema.parse({ returnTo: '//external.example' })).toEqual({});
  });
});
