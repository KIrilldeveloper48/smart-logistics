import { HttpResponse, type DefaultBodyType } from 'msw';
import type { TAuctionStatus, TTradingStatus } from '../../auction-common/auction-common.types';
import { listBetsSearchSchema } from '../../auction-detail/auction-detail.schemas';
import type { TListBetsSearch } from '../../auction-detail/auction-detail.types';
import {
  auctionListRequestSchema,
  auctionListResponseSchema,
} from '../../auction-list/auction-list.schemas';
import type { TAuctionListItem, TAuctionListRequest } from '../../auction-list/auction-list.types';
import { auctionMockStore } from '../auction-mock-store/auction-mock-store';
import type { TAuctionMockRecord } from '../auction-mock-store/auction-mock-store.types';
import { validationResponse } from '../auction-response/auction-response.helpers';

const auctionStatusCodes: Readonly<Record<TAuctionStatus, number>> = {
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
  Canceled: 8,
  Unknown: 0,
};

const tradingStatusCodes: Readonly<Record<TTradingStatus, number>> = {
  NotParticipating: 1,
  Leading: 2,
  Losing: 3,
  OnPending: 4,
  Confirmed: 5,
  ChoosingWinner: 6,
  Winner: 7,
  Accepted: 8,
  Unknown: 0,
};

const hasText = (value: string | undefined, search: string | undefined): boolean =>
  !search || Boolean(value?.toLocaleLowerCase().includes(search.toLocaleLowerCase()));

const isWithinRange = (
  value: number | undefined | null,
  from: number | undefined | null,
  to: number | undefined | null,
): boolean =>
  (from == null || (value != null && value >= from)) &&
  (to == null || (value != null && value <= to));

const toTimestamp = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? null : timestamp;
};

const isWithinDateRange = (
  value: string | undefined,
  from: string | undefined,
  to: string | undefined,
): boolean => {
  const timestamp = toTimestamp(value);

  if (timestamp === null) {
    return !from && !to;
  }

  const fromTimestamp = toTimestamp(from);
  const toTimestampValue = toTimestamp(to);

  return (
    (fromTimestamp === null || timestamp >= fromTimestamp) &&
    (toTimestampValue === null || timestamp <= toTimestampValue)
  );
};

const matchesCustomer = (
  name: string | undefined,
  inn: string | undefined,
  search: string | undefined,
): boolean => !search || hasText(name, search) || hasText(inn, search);

const matchesMainFilters = (
  item: Readonly<TAuctionListItem>,
  request: Readonly<TAuctionListRequest>,
): boolean => {
  const { main } = item;

  return (
    hasText(main?.cargo_num, request.cargo_num) &&
    (!request.auc_type ||
      (main?.auc_type !== undefined &&
        main.auc_type !== 'Unknown' &&
        request.auc_type.includes(main.auc_type))) &&
    (!request.auction_ids || request.auction_ids.includes(main?.id ?? -1)) &&
    isWithinDateRange(main?.created_at, request.create_date_from, request.create_date_to) &&
    isWithinRange(main?.price_per_km, request.price_per_km_from, request.price_per_km_to)
  );
};

const matchesOrganizerFilters = (
  item: Readonly<TAuctionListItem>,
  request: Readonly<TAuctionListRequest>,
): boolean => {
  const { organizer } = item;

  return (
    matchesCustomer(organizer?.organization_name, organizer?.organization_inn, request.customer) &&
    (!request.customer_ids || request.customer_ids.includes(organizer?.organization_id ?? -1))
  );
};

const matchesCargoFilters = (
  item: Readonly<TAuctionListItem>,
  request: Readonly<TAuctionListRequest>,
): boolean => {
  const { cargo } = item;

  return (
    (!request.body_types || request.body_types.includes(cargo?.body_type ?? '')) &&
    (request.is_international_shipment === undefined ||
      request.is_international_shipment === cargo?.is_international) &&
    isWithinRange(cargo?.weight, request.weight_from, request.weight_to) &&
    isWithinRange(cargo?.volume, request.volume_from, request.volume_to)
  );
};

const matchesPaymentFilters = (
  item: Readonly<TAuctionListItem>,
  request: Readonly<TAuctionListRequest>,
): boolean => request.form_type === undefined || request.form_type === item.payment?.form;

const matchesRouteFilters = (
  item: Readonly<TAuctionListItem>,
  request: Readonly<TAuctionListRequest>,
): boolean => {
  const { route } = item;

  return (
    hasText(route?.load?.city, request.load_city) &&
    hasText(route?.unload?.city, request.unload_city) &&
    (request.load_gc_id === undefined || request.load_gc_id === route?.load?.city_gc_id) &&
    (request.unload_gc_id === undefined || request.unload_gc_id === route?.unload?.city_gc_id) &&
    isWithinDateRange(route?.load?.date, request.load_date_from, request.load_date_to) &&
    isWithinDateRange(route?.unload?.date, request.unload_date_from, request.unload_date_to)
  );
};

const matchesTradingFilters = (
  item: Readonly<TAuctionListItem>,
  request: Readonly<TAuctionListRequest>,
): boolean => {
  const { trading } = item;

  return (
    (!request.status || request.status.includes(trading?.status_mobile ?? 'Unknown')) &&
    (!request.mobile_statuses ||
      request.mobile_statuses.includes(tradingStatusCodes[trading?.status_mobile ?? 'Unknown'])) &&
    (!request.statuses ||
      request.statuses.includes(auctionStatusCodes[trading?.status ?? 'Unknown'])) &&
    isWithinDateRange(trading?.start_time, request.start_time_from, request.start_time_to) &&
    isWithinDateRange(trading?.stop_time, request.stop_time_from, request.stop_time_to) &&
    (request.is_available === undefined || request.is_available === trading?.is_available) &&
    (request.is_favorite === undefined || request.is_favorite === trading?.is_favorite) &&
    (request.is_bidder === undefined || request.is_bidder === trading?.is_bidder) &&
    isWithinRange(trading?.price?.current, request.current_price_from, request.current_price_to)
  );
};

const matchesRequest = (auction: TAuctionMockRecord, request: TAuctionListRequest): boolean =>
  matchesMainFilters(auction.listItem, request) &&
  matchesOrganizerFilters(auction.listItem, request) &&
  matchesCargoFilters(auction.listItem, request) &&
  matchesPaymentFilters(auction.listItem, request) &&
  matchesRouteFilters(auction.listItem, request) &&
  matchesTradingFilters(auction.listItem, request);

const sortValue = (auction: TAuctionListItem, field: string): number | string | null => {
  switch (field) {
    case 'start_time':
      return toTimestamp(auction.trading?.start_time);
    case 'price_per_km':
      return auction.main?.price_per_km ?? null;
    case 'current_price':
      return auction.trading?.price?.current ?? null;
    default:
      return null;
  }
};

const compareValues = (left: number | string | null, right: number | string | null): number => {
  if (left === right) return 0;
  if (left === null) return 1;
  if (right === null) return -1;

  return left > right ? 1 : -1;
};

const sortAuctions = (
  auctions: readonly TAuctionMockRecord[],
  request: TAuctionListRequest,
): TAuctionMockRecord[] => {
  const sortEntries = Object.entries(request.sort ?? {});

  if (sortEntries.length === 0 && request.is_oldest === undefined) {
    return [...auctions];
  }

  return [...auctions].sort((left, right) => {
    if (sortEntries.length === 0) {
      return (
        compareValues(
          toTimestamp(left.listItem.trading?.start_time),
          toTimestamp(right.listItem.trading?.start_time),
        ) * (request.is_oldest ? 1 : -1)
      );
    }

    for (const [field, direction] of sortEntries) {
      const comparison = compareValues(
        sortValue(left.listItem, field),
        sortValue(right.listItem, field),
      );

      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }
    }

    return 0;
  });
};

export const listAuctions = (request: TAuctionListRequest) => {
  const matchedAuctions = auctionMockStore
    .getAuctions()
    .filter((auction) => matchesRequest(auction, request));
  const auctions = sortAuctions(matchedAuctions, request);
  const page = Math.max(1, request.page ?? 1);
  const perPage = Math.max(1, request.per_page ?? 20);
  const total = auctions.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const startIndex = (page - 1) * perPage;
  const data = auctions.slice(startIndex, startIndex + perPage).map((auction) => auction.listItem);

  return auctionListResponseSchema.parse({
    data,
    meta: {
      current_page: page,
      from: data.length > 0 ? startIndex + 1 : 0,
      last_page: lastPage,
      per_page: perPage,
      to: data.length > 0 ? startIndex + data.length : 0,
      total,
    },
  });
};

export const parseListRequest = async (
  request: Request,
): Promise<TAuctionListRequest | HttpResponse<DefaultBodyType>> => {
  const payload = await request.json().catch(() => null);
  const result = auctionListRequestSchema.safeParse(payload);

  return result.success
    ? result.data
    : validationResponse(
        result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'request',
          message: issue.message,
        })),
      );
};

export const parseBetsSearch = (
  request: Request,
): TListBetsSearch | HttpResponse<DefaultBodyType> => {
  const all = new URL(request.url).searchParams.get('all');
  const value = all === null ? undefined : all === 'true' ? true : all === 'false' ? false : all;
  const result = listBetsSearchSchema.safeParse({ all: value });

  return result.success
    ? result.data
    : validationResponse(
        result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'all',
          message: issue.message,
        })),
      );
};
