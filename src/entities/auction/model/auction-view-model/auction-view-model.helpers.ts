import type { TAuctionDetailResponse, TAuctionListItem } from '../../api';
import type {
  TAuctionDetailCargoViewModel,
  TAuctionDocumentType,
  TAuctionLoadingType,
  TAuctionPriceSource,
  TAuctionPriceSummary,
  TAuctionRouteSummary,
  TAuctionRouteViewModel,
} from './auction-view-model.types';

export const toRouteSummary = (
  point: Readonly<NonNullable<TAuctionListItem['route']>['load']> | undefined,
): TAuctionRouteSummary => ({
  city: point?.city ?? null,
  address: point?.address ?? null,
  date: point?.date ?? null,
  pointsCount: point?.points_count ?? null,
});

export const toPriceSummary = (
  price: TAuctionPriceSource | null | undefined,
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

export const toRouteViewModel = (
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

const toLoadingTypes = (
  loadingTypes: TAuctionDetailResponse['cargo']['loading_types'],
): readonly TAuctionLoadingType[] => {
  const result: TAuctionLoadingType[] = [];

  if (loadingTypes?.side) result.push('Side');
  if (loadingTypes?.top) result.push('Top');
  if (loadingTypes?.rear) result.push('Rear');
  if (loadingTypes?.full) result.push('Full');

  return result;
};

const toDocuments = (
  documents: TAuctionDetailResponse['cargo']['docs'],
): readonly TAuctionDocumentType[] => {
  const result: TAuctionDocumentType[] = [];

  if (documents?.tir) result.push('Tir');
  if (documents?.cmr) result.push('Cmr');
  if (documents?.t1) result.push('T1');
  if (documents?.med) result.push('MedicalBook');

  return result;
};

export const toDetailCargoViewModel = (
  auction: Readonly<TAuctionDetailResponse>,
): TAuctionDetailCargoViewModel => {
  const routeCargo = auction.routes[0]?.cargo;
  const vehicle = auction.cargo.car;

  return {
    name: routeCargo?.name ?? null,
    packageName: routeCargo?.package_name ?? null,
    packageAmount: routeCargo?.package_amount ?? null,
    weight: routeCargo?.weight ?? null,
    volume: routeCargo?.volume ?? null,
    length: routeCargo?.length ?? null,
    width: routeCargo?.width ?? null,
    height: routeCargo?.height ?? null,
    isOversized: routeCargo?.oversized ?? false,
    bodyType: auction.cargo.body_type ?? null,
    truckCount: auction.cargo.truck_count ?? null,
    distance: auction.cargo.distance ?? null,
    isInternational: auction.cargo.is_international ?? false,
    temperatureFrom: auction.cargo.temp_from ?? null,
    temperatureTo: auction.cargo.temp_to ?? null,
    conics: auction.cargo.conics ?? null,
    belts: auction.cargo.belts ?? null,
    adr: auction.cargo.adr ?? null,
    coupling: auction.cargo.coupling ?? false,
    airPass: auction.cargo.air_pass ?? false,
    lowLoader: auction.cargo.low_loader ?? false,
    additionalLoad: auction.cargo.additional_load ?? false,
    isContainerized: auction.cargo.containered ?? false,
    containerType: auction.cargo.container_type ?? null,
    containerSize: auction.cargo.container_size ?? null,
    loadingTypes: toLoadingTypes(auction.cargo.loading_types),
    documents: toDocuments(auction.cargo.docs),
    vehicle:
      vehicle === null || vehicle === undefined
        ? null
        : {
            type: vehicle.type ?? null,
            weight: vehicle.weight ?? null,
            volume: vehicle.volume ?? null,
            width: vehicle.width ?? null,
            length: vehicle.length ?? null,
            height: vehicle.height ?? null,
          },
  };
};
