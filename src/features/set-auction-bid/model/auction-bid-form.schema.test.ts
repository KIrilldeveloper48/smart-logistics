import { describe, expect, it } from 'vitest';
import type { TAuctionPriceSummary, TAuctionType } from '@/entities/auction';
import { auctionBidFormSchema, createAuctionBidFormSchema } from './auction-bid-form.schema';
import type { TAuctionBidConstraints } from './auction-bid-form.types';

const createConstraints = (
  auctionType: TAuctionType,
  price: TAuctionPriceSummary,
): TAuctionBidConstraints => ({
  auctionType,
  canSetBid: true,
  price,
});

const createPrice = (overrides: Partial<TAuctionPriceSummary> = {}): TAuctionPriceSummary => ({
  current: 100,
  currentWithoutVat: null,
  pricePerKm: null,
  available: 90,
  min: 50,
  max: 150,
  step: 10,
  ...overrides,
});

describe('auction bid form schema', () => {
  it('requires a finite positive price', () => {
    expect(auctionBidFormSchema.safeParse({}).success).toBe(false);
    expect(auctionBidFormSchema.safeParse({ price: 0 }).success).toBe(false);
    expect(auctionBidFormSchema.safeParse({ price: Number.POSITIVE_INFINITY }).success).toBe(false);
  });

  it('enforces the price range and auction availability', () => {
    const schema = createAuctionBidFormSchema(createConstraints('Down', createPrice()));

    expect(schema.safeParse({ price: 40 }).success).toBe(false);
    expect(schema.safeParse({ price: 100 }).success).toBe(false);
    expect(schema.safeParse({ price: 90 }).success).toBe(true);
  });

  it('requires an up auction bid to be no less than the available price', () => {
    const schema = createAuctionBidFormSchema(
      createConstraints('Up', createPrice({ available: 110 })),
    );

    expect(schema.safeParse({ price: 100 }).success).toBe(false);
    expect(schema.safeParse({ price: 120 }).success).toBe(true);
  });

  it('accepts only the fixed price for a fixed-price auction', () => {
    const schema = createAuctionBidFormSchema(
      createConstraints('FixPrice', createPrice({ available: 100, step: null })),
    );

    expect(schema.safeParse({ price: 90 }).success).toBe(false);
    expect(schema.safeParse({ price: 100 }).success).toBe(true);
  });

  it('supports a fractional bid step without using a remainder operation', () => {
    const schema = createAuctionBidFormSchema(
      createConstraints(
        'Request',
        createPrice({ available: 10, current: null, min: null, max: null, step: 0.1 }),
      ),
    );

    expect(schema.safeParse({ price: 10.3 }).success).toBe(true);
    expect(schema.safeParse({ price: 10.35 }).success).toBe(false);
  });
});
