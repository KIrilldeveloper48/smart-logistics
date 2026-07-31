import type { TAuctionDetailResponse, TAuctionListItem, TBetItem } from '../api';

type TNullable<T> = T | null;

export type TAuctionListItemViewModel = Readonly<{
  auctionId: TNullable<number>;
  auctionUuid: TNullable<string>;
  cargoNumber: TNullable<string>;
  auctionType: NonNullable<TAuctionListItem['main']>['auc_type'] | 'Unknown';
  auctionStatus: NonNullable<TAuctionListItem['trading']>['status'] | 'Unknown';
  tradingStatus: NonNullable<TAuctionListItem['trading']>['status_mobile'] | 'Unknown';
  organizerName: TNullable<string>;
  load: TAuctionRouteSummary;
  unload: TAuctionRouteSummary;
  cargo: TAuctionCargoSummary;
  price: TAuctionPriceSummary;
  hasMyBid: boolean;
  canSetBid: boolean;
}>;

export type TAuctionRouteSummary = Readonly<{
  city: TNullable<string>;
  address: TNullable<string>;
  date: TNullable<string>;
  pointsCount: TNullable<number>;
}>;

export type TAuctionCargoSummary = Readonly<{
  name: TNullable<string>;
  weight: TNullable<number>;
  volume: TNullable<number>;
  bodyType: TNullable<string>;
  truckCount: TNullable<number>;
}>;

export type TAuctionPriceSummary = Readonly<{
  current: TNullable<number>;
  currentWithoutVat: TNullable<number>;
  pricePerKm: TNullable<number>;
  available: TNullable<number>;
  min: TNullable<number>;
  max: TNullable<number>;
  step: TNullable<number>;
}>;

export type TAuctionDetailViewModel = Readonly<{
  auctionId: TNullable<number>;
  auctionUuid: TNullable<string>;
  cargoNumber: TNullable<string>;
  auctionType: NonNullable<TAuctionDetailResponse['main']['auc_type']> | 'Unknown';
  auctionStatus: NonNullable<TAuctionDetailResponse['trading']['status']> | 'Unknown';
  tradingStatus: NonNullable<TAuctionDetailResponse['trading']['status_mobile']> | 'Unknown';
  organizer: TAuctionOrganizerViewModel;
  contacts: readonly TAuctionContactViewModel[];
  routes: readonly TAuctionRouteViewModel[];
  cargo: TAuctionDetailCargoViewModel;
  payment: TAuctionPaymentViewModel;
  price: TAuctionPriceSummary;
  hasMyBid: boolean;
  canSetBid: boolean;
  isBetsHistoryHidden: boolean;
  areRouteDetailsHidden: boolean;
}>;

export type TAuctionOrganizerViewModel = Readonly<{
  name: TNullable<string>;
  inn: TNullable<string>;
  kpp: TNullable<string>;
}>;

export type TAuctionContactViewModel = Readonly<{
  name: TNullable<string>;
  phone: TNullable<string>;
  email: TNullable<string>;
}>;

export type TAuctionRouteViewModel = Readonly<{
  sequence: TNullable<number>;
  operationType: 'Loading' | 'Unloading' | 'Unknown';
  city: TNullable<string>;
  address: TNullable<string>;
  startDate: TNullable<string>;
  endDate: TNullable<string>;
  contactName: TNullable<string>;
  contactPhone: TNullable<string>;
}>;

export type TAuctionDetailCargoViewModel = Readonly<{
  name: TNullable<string>;
  weight: TNullable<string>;
  volume: TNullable<string>;
  bodyType: TNullable<string>;
  truckCount: TNullable<number>;
  distance: TNullable<number>;
  isInternational: boolean;
  truckType: TNullable<string>;
}>;

export type TAuctionPaymentViewModel = Readonly<{
  form: TNullable<string>;
  delay: TNullable<number>;
  delayType: TNullable<'CalendarDays' | 'WorkDays' | 'Unknown'>;
  currencyCode: TNullable<string>;
}>;

export type TBetViewModel = Readonly<{
  id: TNullable<number>;
  createdAt: TNullable<string>;
  transporterName: TNullable<string>;
  priceWithVat: TNullable<number>;
  priceWithoutVat: TNullable<number>;
  place: TNullable<number>;
  isWinner: boolean;
  isRejected: boolean;
  cancelReason: TNullable<string>;
}>;

const toRouteSummary = (
  point: Readonly<NonNullable<TAuctionListItem['route']>['load']> | undefined,
): TAuctionRouteSummary => ({
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
): TAuctionPriceSummary => ({
  current: price?.current ?? null,
  currentWithoutVat: price?.current_no_vat ?? null,
  pricePerKm: pricePerKm ?? null,
  available: price?.available ?? null,
  min: price?.min ?? null,
  max: price?.max ?? null,
  step: price?.step ?? null,
});

export const toAuctionListItemViewModel = (
  item: Readonly<TAuctionListItem>,
): TAuctionListItemViewModel => ({
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

export const toAuctionListViewModels = (
  items: readonly TAuctionListItem[],
): readonly TAuctionListItemViewModel[] => items.map(toAuctionListItemViewModel);

const toRouteViewModel = (
  route: Readonly<TAuctionDetailResponse['routes'][number]>,
  areRouteDetailsHidden: boolean,
): TAuctionRouteViewModel => ({
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
  auction: Readonly<TAuctionDetailResponse>,
): TAuctionDetailViewModel => {
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

export const toBetViewModel = (bet: Readonly<TBetItem>): TBetViewModel => ({
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

export const toBetViewModels = (bets: readonly TBetItem[]): readonly TBetViewModel[] =>
  bets.map(toBetViewModel);
