import type {
  TAuctionStatus,
  TAuctionType,
  TOperationType,
  TPaymentDelayType,
  TTradingStatus,
} from '../../api';

type TNullable<T> = T | null;

export type TAuctionPriceSource = Readonly<{
  current?: number | null | undefined;
  current_no_vat?: number | null | undefined;
  available?: number | null | undefined;
  min?: number | null | undefined;
  max?: number | null | undefined;
  step?: number | null | undefined;
}>;

export type TAuctionListItemViewModel = Readonly<{
  auctionId: TNullable<number>;
  auctionUuid: TNullable<string>;
  cargoNumber: TNullable<string>;
  auctionType: TAuctionType;
  auctionStatus: TAuctionStatus;
  tradingStatus: TTradingStatus;
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
  auctionType: TAuctionType;
  auctionStatus: TAuctionStatus;
  tradingStatus: TTradingStatus;
  organizer: TAuctionOrganizerViewModel;
  contacts: readonly TAuctionContactViewModel[];
  routes: readonly TAuctionRouteViewModel[];
  cargo: TAuctionDetailCargoViewModel;
  payment: TAuctionPaymentViewModel;
  price: TAuctionPriceSummary;
  hasMyBid: boolean;
  canSetBid: boolean;
  isBetsHistoryHidden: boolean;
  areBetPlacesHidden: boolean;
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
  operationType: TOperationType;
  city: TNullable<string>;
  address: TNullable<string>;
  startDate: TNullable<string>;
  endDate: TNullable<string>;
  contactName: TNullable<string>;
  contactPhone: TNullable<string>;
}>;

export type TAuctionDetailCargoViewModel = Readonly<{
  name: TNullable<string>;
  packageName: TNullable<string>;
  packageAmount: TNullable<number>;
  weight: TNullable<string>;
  volume: TNullable<string>;
  length: TNullable<string>;
  width: TNullable<string>;
  height: TNullable<string>;
  isOversized: boolean;
  bodyType: TNullable<string>;
  truckCount: TNullable<number>;
  distance: TNullable<number>;
  isInternational: boolean;
  temperatureFrom: TNullable<number>;
  temperatureTo: TNullable<number>;
  conics: TNullable<number>;
  belts: TNullable<number>;
  adr: TNullable<number>;
  coupling: boolean;
  airPass: boolean;
  lowLoader: boolean;
  additionalLoad: boolean;
  isContainerized: boolean;
  containerType: TNullable<string>;
  containerSize: TNullable<string>;
  loadingTypes: readonly TAuctionLoadingType[];
  documents: readonly TAuctionDocumentType[];
  vehicle: TNullable<TAuctionVehicleRequirementsViewModel>;
}>;

export type TAuctionLoadingType = 'Side' | 'Top' | 'Rear' | 'Full';

export type TAuctionDocumentType = 'Tir' | 'Cmr' | 'T1' | 'MedicalBook';

export type TAuctionVehicleRequirementsViewModel = Readonly<{
  type: TNullable<string>;
  weight: TNullable<number>;
  volume: TNullable<number>;
  width: TNullable<number>;
  length: TNullable<number>;
  height: TNullable<number>;
}>;

export type TAuctionPaymentViewModel = Readonly<{
  form: TNullable<string>;
  delay: TNullable<number>;
  delayType: TPaymentDelayType;
  currencyCode: TNullable<string>;
}>;

export type TBetViewModel = Readonly<{
  id: TNullable<number>;
  organizationId: TNullable<number>;
  createdAt: TNullable<string>;
  transporterName: TNullable<string>;
  priceWithVat: TNullable<number>;
  priceWithoutVat: TNullable<number>;
  place: TNullable<number>;
  isWinner: boolean;
  isRejected: boolean;
  cancelReason: TNullable<string>;
}>;
