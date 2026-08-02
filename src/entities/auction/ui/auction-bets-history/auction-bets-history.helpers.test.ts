import { describe, expect, it } from 'vitest';
import type { TBetViewModel } from '../../model';
import { getAuctionParticipantsCount } from './auction-bets-history.helpers';

const createBet = (
  id: number,
  organizationId: number | null,
  transporterName: string | null,
): TBetViewModel => ({
  id,
  organizationId,
  createdAt: null,
  transporterName,
  priceWithVat: null,
  priceWithoutVat: null,
  place: null,
  isWinner: false,
  isRejected: false,
  cancelReason: null,
});

describe('getAuctionParticipantsCount', () => {
  it('counts organizations rather than individual bids', () => {
    expect(
      getAuctionParticipantsCount([
        createBet(1, 10, 'Первый перевозчик'),
        createBet(2, 10, 'Первый перевозчик'),
        createBet(3, 20, 'Второй перевозчик'),
      ]),
    ).toBe(2);
  });

  it('uses the transporter name when the organization id is absent', () => {
    expect(
      getAuctionParticipantsCount([
        createBet(1, null, 'Перевозчик'),
        createBet(2, null, ' перевозчик '),
      ]),
    ).toBe(1);
  });
});
