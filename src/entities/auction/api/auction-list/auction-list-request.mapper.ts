import { auctionListSearchSchema } from './auction-list-search.schema';
import { auctionListRequestSchema } from './auction-list.schemas';
import type { TAuctionListRequest } from './auction-list.types';
import type { TAuctionListSearch } from './auction-list-request.types';

export const toAuctionListRequest = (search: Readonly<TAuctionListSearch>): TAuctionListRequest => {
  const params = auctionListSearchSchema.parse(search);

  const request = {
    page: params.page,
    per_page: params.perPage,
    is_oldest: params.isOldest,
    sort: params.sort,
    status: params.status,
    mobile_statuses: params.mobileStatuses,
    statuses: params.statuses,
    cargo_num: params.cargoNum,
    weight_from: params.weightFrom,
    weight_to: params.weightTo,
    volume_from: params.volumeFrom,
    volume_to: params.volumeTo,
    body_types: params.bodyTypes,
    form_type: params.formType,
    is_international_shipment: params.isInternationalShipment,
    load_city: params.loadCity,
    load_gc_id: params.loadGcId,
    load_range: params.loadRange,
    unload_city: params.unloadCity,
    unload_gc_id: params.unloadGcId,
    unload_range: params.unloadRange,
    load_date_from: params.loadDateFrom,
    load_date_to: params.loadDateTo,
    unload_date_from: params.unloadDateFrom,
    unload_date_to: params.unloadDateTo,
    create_date_from: params.createDateFrom,
    create_date_to: params.createDateTo,
    start_time_from: params.startTimeFrom,
    start_time_to: params.startTimeTo,
    stop_time_from: params.stopTimeFrom,
    stop_time_to: params.stopTimeTo,
    is_available: params.isAvailable,
    is_favorite: params.isFavorite,
    is_bidder: params.isBidder,
    customer: params.customer,
    customer_ids: params.customerIds,
    contractor: params.contractor,
    auction_ids: params.auctionIds,
    replace_external_pads: params.replaceExternalPads,
    current_price_from: params.currentPriceFrom,
    current_price_to: params.currentPriceTo,
    price_per_km_from: params.pricePerKmFrom,
    price_per_km_to: params.pricePerKmTo,
    auc_type: params.auctionTypes,
  };

  return auctionListRequestSchema.parse(
    Object.fromEntries(Object.entries(request).filter(([, value]) => value !== undefined)),
  );
};
