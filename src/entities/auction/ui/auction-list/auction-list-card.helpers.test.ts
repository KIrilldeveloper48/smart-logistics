import { describe, expect, it } from 'vitest';
import type { TAuctionListItemViewModel } from '../../model';
import { getAuctionListPrimaryAction } from './auction-list-card.helpers';

const auction: TAuctionListItemViewModel = {
  auctionId: 1,
  auctionUuid: '550e8400-e29b-41d4-a716-446655440001',
  cargoNumber: '00000001059',
  auctionType: 'Down',
  auctionStatus: 'Auction',
  tradingStatus: 'NotParticipating',
  organizerName: null,
  load: { city: null, address: null, date: null, pointsCount: null },
  unload: { city: null, address: null, date: null, pointsCount: null },
  cargo: { name: null, weight: null, volume: null, bodyType: null, truckCount: null },
  price: {
    current: null,
    currentWithoutVat: null,
    pricePerKm: null,
    available: null,
    min: null,
    max: null,
    step: null,
  },
  hasMyBid: false,
  canSetBid: true,
};

describe('getAuctionListPrimaryAction', () => {
  it('selects bid, bets and disabled actions', () => {
    expect(getAuctionListPrimaryAction(auction)).toMatchObject({ kind: 'bid', isDisabled: false });
    expect(getAuctionListPrimaryAction({ ...auction, canSetBid: false })).toMatchObject({
      kind: 'bets',
      label: 'Смотреть ставки',
      isDisabled: false,
    });
    expect(getAuctionListPrimaryAction({ ...auction, auctionUuid: null })).toMatchObject({
      kind: 'disabled',
      isDisabled: true,
    });
  });
});
