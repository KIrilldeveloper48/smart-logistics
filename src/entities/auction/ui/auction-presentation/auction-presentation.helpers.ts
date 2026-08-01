import type {
  TAuctionStatus,
  TAuctionType,
  TOperationType,
  TPaymentDelayType,
  TTradingStatus,
} from '../../api';

const auctionTypeLabels: Readonly<Record<TAuctionType, string>> = {
  Request: 'Запрос цен',
  Up: 'Торги на повышение',
  Down: 'Торги на понижение',
  FixPrice: 'Фиксированная цена',
  Unknown: 'Тип не указан',
};

const auctionStatusLabels: Readonly<Record<TAuctionStatus, string>> = {
  Planning: 'Планирование',
  Auction: 'Торги',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Приостановлен',
  Canceled: 'Отменён',
  Unknown: 'Статус не указан',
};

const tradingStatusLabels: Readonly<Record<TTradingStatus, string>> = {
  NotParticipating: 'Не участвую',
  Leading: 'Лидирую',
  Losing: 'Проигрываю',
  OnPending: 'На рассмотрении',
  Confirmed: 'Подтверждено',
  ChoosingWinner: 'Выбор победителя',
  Winner: 'Победитель',
  Accepted: 'Принято',
  Unknown: 'Статус не указан',
};

const operationTypeLabels: Readonly<Record<TOperationType, string>> = {
  Loading: 'Погрузка',
  Unloading: 'Разгрузка',
  Unknown: 'Операция не указана',
};

const paymentDelayTypeLabels: Readonly<Record<NonNullable<TPaymentDelayType>, string>> = {
  CalendarDays: 'календарных дней',
  WorkDays: 'рабочих дней',
  Unknown: 'дней',
};

export const formatAuctionType = (auctionType: TAuctionType): string =>
  auctionTypeLabels[auctionType] ?? auctionTypeLabels.Unknown;

export const formatAuctionStatus = (auctionStatus: TAuctionStatus): string =>
  auctionStatusLabels[auctionStatus] ?? auctionStatusLabels.Unknown;

export const formatTradingStatus = (tradingStatus: TTradingStatus): string =>
  tradingStatusLabels[tradingStatus] ?? tradingStatusLabels.Unknown;

export const formatOperationType = (operationType: TOperationType): string =>
  operationTypeLabels[operationType] ?? operationTypeLabels.Unknown;

export const formatPrice = (price: number | null): string =>
  price === null ? '—' : `${price.toLocaleString('ru-RU')} ₽`;

export const formatDate = (value: string | null): string => {
  if (value === null) {
    return '—';
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp)
    ? value
    : new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(timestamp);
};

export const formatMetric = (value: string | number | null, unit: string): string =>
  value === null ? '—' : `${value.toLocaleString('ru-RU')} ${unit}`;

export const formatPaymentDelay = (delay: number | null, delayType: TPaymentDelayType): string => {
  if (delay === null || delayType === null) {
    return 'Не указан';
  }

  return `${delay} ${paymentDelayTypeLabels[delayType] ?? paymentDelayTypeLabels.Unknown}`;
};
