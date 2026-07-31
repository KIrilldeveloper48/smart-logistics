import type { AuctionDetailResponse, AuctionListItem, BetItem } from '../api';

type Nullable<T> = T | null;

export type AuctionListItemViewModel = {
  auctionId: Nullable<number>;
  auctionUuid: Nullable<string>;
  cargoNumber: Nullable<string>;
  auctionType: NonNullable<AuctionListItem['main']>['auc_type'] | 'Unknown';
  auctionStatus: NonNullable<AuctionListItem['trading']>['status'] | 'Unknown';
  tradingStatus: NonNullable<AuctionListItem['trading']>['status_mobile'] | 'Unknown';
  organizerName: Nullable<string>;
  load: AuctionRouteSummary;
  unload: AuctionRouteSummary;
  cargo: AuctionCargoSummary;
  price: AuctionPriceSummary;
  hasMyBid: boolean;
  canSetBid: boolean;
};

export type AuctionRouteSummary = {
  city: Nullable<string>;
  address: Nullable<string>;
  date: Nullable<string>;
  pointsCount: Nullable<number>;
};

export type AuctionCargoSummary = {
  name: Nullable<string>;
  weight: Nullable<number>;
  volume: Nullable<number>;
  bodyType: Nullable<string>;
  truckCount: Nullable<number>;
};

export type AuctionPriceSummary = {
  current: Nullable<number>;
  currentWithoutVat: Nullable<number>;
  pricePerKm: Nullable<number>;
  available: Nullable<number>;
  min: Nullable<number>;
  max: Nullable<number>;
  step: Nullable<number>;
};

export type AuctionDetailViewModel = {
  auctionId: Nullable<number>;
  auctionUuid: Nullable<string>;
  cargoNumber: Nullable<string>;
  auctionType: NonNullable<AuctionDetailResponse['main']['auc_type']> | 'Unknown';
  auctionStatus: NonNullable<AuctionDetailResponse['trading']['status']> | 'Unknown';
  tradingStatus: NonNullable<AuctionDetailResponse['trading']['status_mobile']> | 'Unknown';
  organizer: AuctionOrganizerViewModel;
  contacts: AuctionContactViewModel[];
  routes: AuctionRouteViewModel[];
  cargo: AuctionDetailCargoViewModel;
  payment: AuctionPaymentViewModel;
  price: AuctionPriceSummary;
  hasMyBid: boolean;
  canSetBid: boolean;
  isBetsHistoryHidden: boolean;
  areRouteDetailsHidden: boolean;
};

export type AuctionOrganizerViewModel = {
  name: Nullable<string>;
  inn: Nullable<string>;
  kpp: Nullable<string>;
};

export type AuctionContactViewModel = {
  name: Nullable<string>;
  phone: Nullable<string>;
  email: Nullable<string>;
};

export type AuctionRouteViewModel = {
  sequence: Nullable<number>;
  operationType: 'Loading' | 'Unloading' | 'Unknown';
  city: Nullable<string>;
  address: Nullable<string>;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  contactName: Nullable<string>;
  contactPhone: Nullable<string>;
};

export type AuctionDetailCargoViewModel = {
  name: Nullable<string>;
  weight: Nullable<string>;
  volume: Nullable<string>;
  bodyType: Nullable<string>;
  truckCount: Nullable<number>;
  distance: Nullable<number>;
  isInternational: boolean;
  truckType: Nullable<string>;
};

export type AuctionPaymentViewModel = {
  form: Nullable<string>;
  delay: Nullable<number>;
  delayType: Nullable<'CalendarDays' | 'WorkDays' | 'Unknown'>;
  currencyCode: Nullable<string>;
};

export type BetViewModel = {
  id: Nullable<number>;
  createdAt: Nullable<string>;
  transporterName: Nullable<string>;
  priceWithVat: Nullable<number>;
  priceWithoutVat: Nullable<number>;
  place: Nullable<number>;
  isWinner: boolean;
  isRejected: boolean;
  cancelReason: Nullable<string>;
};

const toRouteSummary = (
  point: NonNullable<AuctionListItem['route']>['load'] | undefined,
): AuctionRouteSummary => ({
  city: point?.city ?? null,
  address: point?.address ?? null,
  date: point?.date ?? null,
  pointsCount: point?.points_count ?? null,
});

const toPriceSummary = (
  price:
    | {
        current?: number | null | undefined;
        current_no_vat?: number | null | undefined;
        available?: number | null | undefined;
        min?: number | null | undefined;
        max?: number | null | undefined;
        step?: number | null | undefined;
      }
    | null
    | undefined,
  pricePerKm?: number | null | undefined,
): AuctionPriceSummary => ({
  current: price?.current ?? null,
  currentWithoutVat: price?.current_no_vat ?? null,
  pricePerKm: pricePerKm ?? null,
  available: price?.available ?? null,
  min: price?.min ?? null,
  max: price?.max ?? null,
  step: price?.step ?? null,
});

export const toAuctionListItemViewModel = (item: AuctionListItem): AuctionListItemViewModel => ({
  auctionId: item.main?.id ?? null,
  auctionUuid: item.main?.order_uid ?? null,
  cargoNumber: item.main?.cargo_num ?? null,
  auctionType: item.main?.auc_type ?? 'Unknown',
  auctionStatus: item.trading?.status ?? 'Unknown',
  tradingStatus: item.trading?.status_mobile ?? 'Unknown',
  organizerName: item.organizer?.organization_name ?? null,
  load: toRouteSummary(item.route?.load),
  unload: toRouteSummary(item.route?.unload),
  cargo: {
    name: item.cargo?.name ?? null,
    weight: item.cargo?.weight ?? null,
    volume: item.cargo?.volume ?? null,
    bodyType: item.cargo?.body_type ?? null,
    truckCount: item.cargo?.truck_count ?? null,
  },
  price: toPriceSummary(item.trading?.price, item.main?.price_per_km),
  hasMyBid: item.trading?.your?.bet ?? false,
  canSetBid: item.trading?.can_set_bet ?? false,
});

export const toAuctionListViewModels = (items: AuctionListItem[]): AuctionListItemViewModel[] =>
  items.map(toAuctionListItemViewModel);

const toRouteViewModel = (
  route: AuctionDetailResponse['routes'][number],
  areRouteDetailsHidden: boolean,
): AuctionRouteViewModel => ({
  sequence: route.row_num ?? null,
  operationType: route.op_type ?? 'Unknown',
  city: route.location?.city_name ?? null,
  address: areRouteDetailsHidden ? null : (route.location?.loading_address ?? null),
  startDate: route.start_date ?? null,
  endDate: route.end_date ?? null,
  contactName: areRouteDetailsHidden ? null : (route.contact?.name ?? null),
  contactPhone: areRouteDetailsHidden ? null : (route.contact?.phone ?? null),
});

export const toAuctionDetailViewModel = (
  auction: AuctionDetailResponse,
): AuctionDetailViewModel => {
  const areRouteDetailsHidden = auction.trading.hide_points_address_and_contacts ?? false;
  const isBetsHistoryHidden =
    auction.hide_bets_history ?? auction.trading.hide_bets_history ?? false;

  return {
    auctionId: auction.main.id ?? null,
    auctionUuid: auction.main.order_uid ?? null,
    cargoNumber: auction.main.cargo_num ?? null,
    auctionType: auction.main.auc_type ?? 'Unknown',
    auctionStatus: auction.trading.status ?? 'Unknown',
    tradingStatus: auction.trading.status_mobile ?? 'Unknown',
    organizer: {
      name: auction.organizer.organization_name ?? null,
      inn: auction.organizer.organization_inn ?? null,
      kpp: auction.organizer.organization_kpp ?? null,
    },
    contacts: areRouteDetailsHidden
      ? []
      : auction.contacts.map((contact) => ({
          name: contact.name ?? null,
          phone: contact.phone ?? null,
          email: contact.email ?? null,
        })),
    routes: auction.routes.map((route) => toRouteViewModel(route, areRouteDetailsHidden)),
    cargo: {
      name: auction.routes[0]?.cargo?.name ?? null,
      weight: auction.routes[0]?.cargo?.weight ?? null,
      volume: auction.routes[0]?.cargo?.volume ?? null,
      bodyType: auction.cargo.body_type ?? null,
      truckCount: auction.cargo.truck_count ?? null,
      distance: auction.cargo.distance ?? null,
      isInternational: auction.cargo.is_international ?? false,
      truckType: auction.cargo.car?.type ?? null,
    },
    payment: {
      form: auction.payment.form ?? null,
      delay: auction.payment.delay ?? null,
      delayType: auction.payment.delay_type ?? null,
      currencyCode: auction.payment.currency_code ?? null,
    },
    price: toPriceSummary(auction.trading.price),
    hasMyBid: auction.trading.your?.bet ?? false,
    canSetBid: auction.trading.can_set_bet ?? false,
    isBetsHistoryHidden,
    areRouteDetailsHidden,
  };
};

export const toBetViewModel = (bet: BetItem): BetViewModel => ({
  id: bet.id ?? null,
  createdAt: bet.created_at ?? null,
  transporterName: bet.organization_name ?? null,
  priceWithVat: bet.price_with_vat ?? null,
  priceWithoutVat: bet.price_no_vat ?? null,
  place: bet.place ?? null,
  isWinner: bet.is_win ?? false,
  isRejected: bet.is_rejected ?? false,
  cancelReason: bet.cancel_reason || null,
});

export const toBetViewModels = (bets: BetItem[]): BetViewModel[] => bets.map(toBetViewModel);
