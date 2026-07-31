import { describe, expect, it } from 'vitest';
import {
  auctionDetailResponseSchema,
  auctionUuidSchema,
  betListResponseSchema,
  listBetsSearchSchema,
  setBetRequestSchema,
} from './auction-detail.schemas';

describe('auction detail contract schema', () => {
  const requiredResponse = {
    main: { order_uid: '550e8400-e29b-41d4-a716-446655440000' },
    organizer: {},
    contacts: [],
    cargo: { car: null, distance: null },
    trading: {
      status: 'Auction',
      status_mobile: 'Leading',
      is_last_bet_with_vat: null,
      chat_id: null,
      price: { min: null, max: null, step: null },
      your: { last_bet: null, last_bet_with_vat: null },
      settings: { prolong_after_bet: null },
    },
    payment: { delay: null, delay_type: null },
    assembly: { num: null, date: null },
    routes: [{ op_type: 'Loading', comment: null, cargo: { package_amount: null } }],
    admitted_organizations: [{ site: null, subscriber_role: null }],
  };

  it('accepts required sections and nullable detail fields', () => {
    expect(auctionDetailResponseSchema.parse(requiredResponse).cargo.car).toBeNull();
  });

  it('rejects a detail response without a required root section', () => {
    const responseWithoutContacts: Record<string, unknown> = { ...requiredResponse };
    delete responseWithoutContacts['contacts'];

    expect(auctionDetailResponseSchema.safeParse(responseWithoutContacts).success).toBe(false);
  });

  it('validates the auction UUID path parameter', () => {
    expect(auctionUuidSchema.safeParse('not-a-uuid').success).toBe(false);
    expect(auctionUuidSchema.parse('550e8400-e29b-41d4-a716-446655440000')).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    );
  });
});

describe('bets contract schemas', () => {
  it('requires the bets collection while allowing nullable bet fields', () => {
    const response = betListResponseSchema.parse({
      bets: [{ transporter_comment: null, place: null, price_info: { vat_rate: null } }],
    });

    expect(response.bets).toHaveLength(1);
    expect(betListResponseSchema.safeParse({}).success).toBe(false);
  });

  it('validates the optional nullable all query parameter', () => {
    expect(listBetsSearchSchema.parse({ all: null }).all).toBeNull();
    expect(listBetsSearchSchema.safeParse({ all: 'true' }).success).toBe(false);
  });

  it('requires a positive bid price', () => {
    expect(setBetRequestSchema.parse({ price: 15_000 }).price).toBe(15_000);
    expect(setBetRequestSchema.safeParse({ price: 0 }).success).toBe(false);
    expect(setBetRequestSchema.safeParse({}).success).toBe(false);
  });
});
