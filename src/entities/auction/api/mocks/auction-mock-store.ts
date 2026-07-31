import {
  auctionDetailResponseSchema,
  betListResponseSchema,
  type TAuctionDetailResponse,
  type TBetListResponse,
} from '../auction-detail.schemas';
import { auctionListResponseSchema, type TAuctionListItem } from '../auction-list.schemas';

export type TAuctionMockRecord = Readonly<{
  uuid: string;
  listItem: TAuctionListItem;
  detail: TAuctionDetailResponse;
  bets: TBetListResponse;
}>;

export type TAuctionMockStore = Readonly<{
  getAuctions: () => readonly TAuctionMockRecord[];
  getAuctionByUuid: (uuid: string) => TAuctionMockRecord | null;
  getCities: () => readonly string[];
  replaceAuction: (
    uuid: string,
    update: (auction: TAuctionMockRecord) => TAuctionMockRecord,
  ) => TAuctionMockRecord | null;
  reset: () => void;
}>;

const parseListItem = (item: unknown): TAuctionListItem => {
  const response = auctionListResponseSchema.parse({ data: [item] });
  const parsedItem = response.data?.[0];

  if (!parsedItem) {
    throw new Error('Auction list seed must contain one item.');
  }

  return parsedItem;
};

const parseAuctionRecord = (auction: TAuctionMockRecord): TAuctionMockRecord => ({
  uuid: auction.uuid,
  listItem: parseListItem(auction.listItem),
  detail: auctionDetailResponseSchema.parse(auction.detail),
  bets: betListResponseSchema.parse(auction.bets),
});

const createAuctionSeeds = (): TAuctionMockRecord[] => [
  parseAuctionRecord({
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    listItem: {
      main: {
        id: 1236,
        cargo_num: '00000001059',
        cargo_date: '2026-05-26T09:00:00',
        auc_type: 'Down',
        order_uid: '550e8400-e29b-41d4-a716-446655440001',
        created_at: '2026-05-25T11:48:20',
        price_per_km: 16.39,
      },
      organizer: { organization_id: 340, organization_name: 'ЛИМ', organization_inn: '7703769184' },
      route: {
        load: { city: 'Пермь', address: 'Транспортная, 9', date: '2026-05-26T09:00:00' },
        unload: { city: 'Москва', address: 'Варшавское шоссе, 125', date: '2026-05-28T18:00:00' },
      },
      cargo: {
        name: 'Мороженое',
        weight: 20,
        volume: 82,
        body_type: 'Рефрижератор',
        truck_count: 1,
      },
      trading: {
        status: 'Auction',
        status_mobile: 'Leading',
        can_set_bet: true,
        is_available: true,
        is_bidder: true,
        bid_measurement_type: 'PerRoute',
        price: { start: 30_000, current: 29_000, current_no_vat: 24_166 },
        your: { bet: true, last_bet: 29_000 },
      },
      payment: { form: 'Безналичная с НДС', currency_code: '643' },
    },
    detail: {
      main: {
        id: 1236,
        cargo_num: '00000001059',
        cargo_date: '2026-05-26T09:00:00',
        order_uid: '550e8400-e29b-41d4-a716-446655440001',
        auc_type: 'Down',
        created_at: '2026-05-25T11:48:20',
      },
      organizer: {
        organization_id: 340,
        organization_name: 'ЛИМ',
        organization_inn: '7703769184',
        organization_kpp: '770301001',
      },
      contacts: [{ name: 'Иван Иванов', phone: '+79001234567', email: 'ivanov@example.com' }],
      cargo: {
        distance: 1_769,
        truck_count: 1,
        body_type: 'Рефрижератор',
        is_international: false,
        car: { type: 'Тягач', weight: 20, volume: 82 },
      },
      trading: {
        status: 'Auction',
        status_mobile: 'Leading',
        start_time: '2026-05-25T16:03:00',
        stop_time: '2026-05-26T16:18:00',
        bid_measurement_type: 'PerRoute',
        can_set_bet: true,
        allow_counter_bets: true,
        hide_bets_history: false,
        hide_points_address_and_contacts: false,
        is_bidder: true,
        price: {
          start: 30_000,
          current: 29_000,
          current_no_vat: 24_166,
          available: 28_500,
          min: 20_000,
          max: 30_000,
          step: 500,
          price_per_km: 16.39,
        },
        your: { bet: true, last_bet: 29_000, last_bet_with_vat: 29_000, win: false },
        settings: { prolong_after_bet: 10 },
      },
      payment: {
        form: 'Безналичная с НДС',
        delay: 30,
        delay_type: 'CalendarDays',
        currency_code: '643',
      },
      assembly: { num: null, date: null },
      routes: [
        {
          row_num: 1,
          op_type: 'Loading',
          start_date: '2026-05-26T09:00:00',
          location: { city_name: 'Пермь', city_gc_id: 59, loading_address: 'Транспортная, 9' },
          cargo: { name: 'Мороженое', weight: '20.000', volume: '82.000' },
          contact: { name: 'Иван Иванов', phone: '+79001234567' },
        },
        {
          row_num: 2,
          op_type: 'Unloading',
          end_date: '2026-05-28T18:00:00',
          location: {
            city_name: 'Москва',
            city_gc_id: 77,
            loading_address: 'Варшавское шоссе, 125',
          },
        },
      ],
      admitted_organizations: [
        { id: 14, inn: '9616244307', name: 'ООО Перевозчик', is_main: true },
      ],
      hide_bets_history: false,
    },
    bets: {
      bets: [
        {
          id: 42,
          created_at: '2026-05-25T16:05:00',
          auction_id: 1236,
          subscriber_id: 13,
          contact_name: 'Иван Иванов',
          contact_phone: '+79001234567',
          price_with_vat: 29_000,
          price_no_vat: 24_166,
          organization_id: 14,
          organization_inn: '9616244307',
          organization_name: 'ООО Перевозчик',
          is_rejected: false,
          is_counter: false,
          place: 1,
          is_win: false,
          run_number: 0,
          cancel_reason: '',
          price_info: { price_with_vat: 29_000, price_no_vat: 24_166, vat_rate: '20' },
        },
      ],
    },
  }),
  parseAuctionRecord({
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    listItem: {
      main: {
        id: 1237,
        cargo_num: '00000001060',
        auc_type: 'Request',
        order_uid: '550e8400-e29b-41d4-a716-446655440002',
      },
      organizer: { organization_name: 'ТрансЛогистика' },
      route: {
        load: { city: 'Казань', date: '2026-05-27T10:00:00' },
        unload: { city: 'Екатеринбург', date: '2026-05-29T12:00:00' },
      },
      cargo: {
        name: 'Строительные материалы',
        weight: 18,
        volume: 60,
        body_type: 'Тент',
        truck_count: 1,
      },
      trading: {
        status: 'Planning',
        status_mobile: 'NotParticipating',
        can_set_bet: false,
        is_available: false,
        is_bidder: false,
      },
    },
    detail: {
      main: {
        id: 1237,
        cargo_num: '00000001060',
        order_uid: '550e8400-e29b-41d4-a716-446655440002',
        auc_type: 'Request',
      },
      organizer: { organization_name: 'ТрансЛогистика' },
      contacts: [],
      cargo: {
        distance: 1_080,
        truck_count: 1,
        body_type: 'Тент',
        is_international: false,
        car: null,
      },
      trading: {
        status: 'Planning',
        status_mobile: 'NotParticipating',
        can_set_bet: false,
        hide_bets_history: true,
        hide_points_address_and_contacts: true,
        price: { min: null, max: null, step: null },
        your: { bet: false, last_bet: null, win: false },
      },
      payment: { form: 'Безналичная без НДС', delay_type: null, currency_code: '643' },
      assembly: { num: null, date: null },
      routes: [
        { row_num: 1, op_type: 'Loading', location: { city_name: 'Казань' } },
        { row_num: 2, op_type: 'Unloading', location: { city_name: 'Екатеринбург' } },
      ],
      admitted_organizations: [],
      hide_bets_history: true,
    },
    bets: { bets: [] },
  }),
];

export const createAuctionMockStore = (): TAuctionMockStore => {
  let auctions = createAuctionSeeds();

  const getAuctions = (): readonly TAuctionMockRecord[] => structuredClone(auctions);

  const getAuctionByUuid = (uuid: string): TAuctionMockRecord | null => {
    const auction = auctions.find((item) => item.uuid === uuid);

    return auction ? structuredClone(auction) : null;
  };

  const getCities = (): readonly string[] => {
    const cities = auctions.flatMap((auction) => [
      auction.listItem.route?.load?.city,
      auction.listItem.route?.unload?.city,
    ]);

    return [...new Set(cities.filter((city): city is string => Boolean(city)))];
  };

  const replaceAuction: TAuctionMockStore['replaceAuction'] = (uuid, update) => {
    const auction = getAuctionByUuid(uuid);

    if (!auction) {
      return null;
    }

    const updatedAuction = parseAuctionRecord(update(auction));
    auctions = auctions.map((item) => (item.uuid === uuid ? updatedAuction : item));

    return structuredClone(updatedAuction);
  };

  const reset = (): void => {
    auctions = createAuctionSeeds();
  };

  return { getAuctions, getAuctionByUuid, getCities, replaceAuction, reset };
};

export const auctionMockStore = createAuctionMockStore();
