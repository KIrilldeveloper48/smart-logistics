import type {
  TAuctionDetailCargoViewModel,
  TAuctionDocumentType,
  TAuctionLoadingType,
} from '../../model';

const loadingTypeLabels: Readonly<Record<TAuctionLoadingType, string>> = {
  Side: 'боковая',
  Top: 'верхняя',
  Rear: 'задняя',
  Full: 'полная растентовка',
};

const documentLabels: Readonly<Record<TAuctionDocumentType, string>> = {
  Tir: 'TIR',
  Cmr: 'CMR',
  T1: 'T1',
  MedicalBook: 'медкнижка',
};

const formatDimensions = (
  length: string | number | null,
  width: string | number | null,
  height: string | number | null,
): string => {
  if (length === null && width === null && height === null) {
    return 'Не указаны';
  }

  return `${length ?? '—'} × ${width ?? '—'} × ${height ?? '—'} м`;
};

export const formatCargoDimensions = (cargo: TAuctionDetailCargoViewModel): string =>
  formatDimensions(cargo.length, cargo.width, cargo.height);

export const formatVehicleDimensions = (cargo: TAuctionDetailCargoViewModel): string =>
  cargo.vehicle === null
    ? 'Не указаны'
    : formatDimensions(cargo.vehicle.length, cargo.vehicle.width, cargo.vehicle.height);

export const formatTemperatureRange = (cargo: TAuctionDetailCargoViewModel): string => {
  if (cargo.temperatureFrom === null && cargo.temperatureTo === null) {
    return 'Не указана';
  }

  return `${cargo.temperatureFrom ?? '—'}…${cargo.temperatureTo ?? '—'} °C`;
};

export const formatLoadingTypes = (loadingTypes: readonly TAuctionLoadingType[]): string =>
  loadingTypes.length === 0
    ? 'Не указаны'
    : loadingTypes.map((type) => loadingTypeLabels[type]).join(', ');

export const formatRequiredDocuments = (documents: readonly TAuctionDocumentType[]): string =>
  documents.length === 0
    ? 'Не указаны'
    : documents.map((document) => documentLabels[document]).join(', ');

export const getAdditionalRequirements = (
  cargo: TAuctionDetailCargoViewModel,
): readonly string[] => {
  const requirements: string[] = [];

  if (cargo.isOversized) requirements.push('Негабаритный груз');
  if (cargo.adr !== null) requirements.push(`ADR: ${cargo.adr}`);
  if (cargo.belts !== null) requirements.push(`Ремни: ${cargo.belts}`);
  if (cargo.conics !== null) requirements.push(`Коники: ${cargo.conics}`);
  if (cargo.coupling) requirements.push('Сцепка');
  if (cargo.airPass) requirements.push('Авиапропуск');
  if (cargo.lowLoader) requirements.push('Низкорамная платформа');
  if (cargo.additionalLoad) requirements.push('Догруз');
  if (cargo.isContainerized) {
    requirements.push(
      `Контейнер${cargo.containerType ? `: ${cargo.containerType}` : ''}${cargo.containerSize ? `, ${cargo.containerSize}` : ''}`,
    );
  }

  return requirements;
};
