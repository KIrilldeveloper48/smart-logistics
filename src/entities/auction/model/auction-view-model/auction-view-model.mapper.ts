import type { TAuctionDetailResponse, TAuctionListItem, TBetItem } from '../../api';
import type {
  TAuctionDetailViewModel,
  TAuctionListItemViewModel,
  TBetViewModel,
} from './auction-view-model.types';
import {
  toDetailCargoViewModel,
  toPriceSummary,
  toRouteSummary,
  toRouteViewModel,
} from './auction-view-model.helpers';

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
    cargo: toDetailCargoViewModel(auction),
    payment: {
      form: auction.payment.form ?? null,
      delay: auction.payment.delay ?? null,
      delayType: auction.payment.delay_type ?? null,
      currencyCode: auction.payment.currency_code ?? null,
    },
    price: auction.trading.no_view_cargo_price
      ? toPriceSummary(null)
      : toPriceSummary(auction.trading.price, auction.trading.price?.price_per_km),
    hasMyBid: auction.trading.your?.bet ?? false,
    canSetBid: auction.trading.can_set_bet ?? false,
    isBetsHistoryHidden,
    areBetPlacesHidden: auction.trading.hide_places ?? false,
    areRouteDetailsHidden,
  };
};

export const toBetViewModel = (bet: Readonly<TBetItem>): TBetViewModel => ({
  id: bet.id ?? null,
  organizationId: bet.organization_id ?? null,
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
