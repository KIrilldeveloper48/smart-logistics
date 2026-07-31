import type { TAuctionListSearch, TAuctionType, TTradingStatus } from '@/entities/auction';

export type TAuctionListFilters = Readonly<{
  cargoNum: string | undefined;
  status: TTradingStatus[] | undefined;
  statuses: number[] | undefined;
  auctionTypes: Exclude<TAuctionType, 'Unknown'>[] | undefined;
  loadCity: string | undefined;
  unloadCity: string | undefined;
  loadDateFrom: string | undefined;
  loadDateTo: string | undefined;
  isAvailable: boolean | undefined;
  isBidder: boolean | undefined;
  currentPriceFrom: number | undefined;
  currentPriceTo: number | undefined;
}>;

export type TAuctionListFiltersProps = Readonly<{
  search: Readonly<TAuctionListSearch>;
  onApply: (filters: TAuctionListFilters) => void;
  onReset: () => void;
  className?: string;
}>;
