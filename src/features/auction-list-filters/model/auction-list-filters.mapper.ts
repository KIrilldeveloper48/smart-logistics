import { auctionListFiltersFormSchema } from './auction-list-filters.schema';
import { getOptionalFormString } from './auction-list-filters.helpers';
import type { TAuctionListFilters } from './auction-list-filters.types';

export const toAuctionListFilters = (formData: FormData): TAuctionListFilters => {
  const values = auctionListFiltersFormSchema.parse({
    cargoNum: getOptionalFormString(formData, 'cargoNum'),
    status: getOptionalFormString(formData, 'status'),
    auctionStatus: getOptionalFormString(formData, 'auctionStatus'),
    auctionType: getOptionalFormString(formData, 'auctionType'),
    loadCity: getOptionalFormString(formData, 'loadCity'),
    unloadCity: getOptionalFormString(formData, 'unloadCity'),
    loadDateFrom: getOptionalFormString(formData, 'loadDateFrom'),
    loadDateTo: getOptionalFormString(formData, 'loadDateTo'),
    isAvailable: getOptionalFormString(formData, 'isAvailable'),
    isBidder: getOptionalFormString(formData, 'isBidder'),
    currentPriceFrom: getOptionalFormString(formData, 'currentPriceFrom'),
    currentPriceTo: getOptionalFormString(formData, 'currentPriceTo'),
  });

  return {
    cargoNum: values.cargoNum,
    status: values.status ? [values.status] : undefined,
    statuses: values.auctionStatus ? [values.auctionStatus] : undefined,
    auctionTypes: values.auctionType ? [values.auctionType] : undefined,
    loadCity: values.loadCity,
    unloadCity: values.unloadCity,
    loadDateFrom: values.loadDateFrom,
    loadDateTo: values.loadDateTo,
    isAvailable: values.isAvailable,
    isBidder: values.isBidder,
    currentPriceFrom: values.currentPriceFrom,
    currentPriceTo: values.currentPriceTo,
  };
};
