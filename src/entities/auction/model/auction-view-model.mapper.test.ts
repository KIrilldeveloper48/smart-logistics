import { describe, expect, it } from 'vitest';
import type { TAuctionDetailResponse, TAuctionListItem, TBetItem } from '../api';
import {
  toAuctionDetailViewModel,
  toAuctionListItemViewModel,
  toBetViewModel,
} from './auction-view-model.mapper';

describe('auction view-model mappers', () => {
  it('maps a list DTO to a UI model with safe fallbacks', () => {
    const item: TAuctionListItem = {
      main: { id: 10, order_uid: 'auction-uuid', cargo_num: '00000001059', auc_type: 'Down' },
      route: { load: { city: 'Пермь' }, unload: { city: 'Москва' } },
      trading: { status: 'Auction', status_mobile: 'Leading', can_set_bet: true },
    };

    expect(toAuctionListItemViewModel(item)).toMatchObject({
      auctionId: 10,
      auctionStatus: 'Auction',
      tradingStatus: 'Leading',
      load: { city: 'Пермь', address: null },
      price: { current: null, step: null },
      canSetBid: true,
    });
  });

  it('hides route contact details and contacts when the detail DTO requires it', () => {
    const auction: TAuctionDetailResponse = {
      main: {},
      organizer: {},
      contacts: [{ name: 'Иван Иванов', phone: '+79000000000' }],
      cargo: {},
      trading: {
        hide_points_address_and_contacts: true,
        hide_bets_history: true,
        price: { min: 10_000, max: 20_000, step: 500 },
      },
      payment: {},
      assembly: {},
      routes: [
        {
          op_type: 'Loading',
          location: { city_name: 'Пермь', loading_address: 'Транспортная, 9' },
          contact: { name: 'Иван Иванов', phone: '+79000000000' },
        },
      ],
      admitted_organizations: [],
    };

    expect(toAuctionDetailViewModel(auction)).toMatchObject({
      contacts: [],
      routes: [{ city: 'Пермь', address: null, contactName: null, contactPhone: null }],
      price: { min: 10_000, max: 20_000, step: 500 },
      isBetsHistoryHidden: true,
    });
  });

  it('maps empty string cancellation reasons to null for the UI', () => {
    const bet: TBetItem = { organization_name: 'ООО Перевозчик', cancel_reason: '' };

    expect(toBetViewModel(bet)).toMatchObject({
      transporterName: 'ООО Перевозчик',
      cancelReason: null,
      isWinner: false,
      isRejected: false,
    });
  });
});
