import type { TAuctionListItemViewModel } from '../../model';
import type { TAuctionListPrimaryAction } from './auction-list-card.types';

const auctionTypeLabels: Readonly<Record<TAuctionListItemViewModel['auctionType'], string>> = {
  Request: 'Запрос цен',
  Up: 'Торги на повышение',
  Down: 'Торги на понижение',
  FixPrice: 'Фиксированная цена',
  Unknown: 'Тип не указан',
};

const auctionStatusLabels: Readonly<Record<TAuctionListItemViewModel['auctionStatus'], string>> = {
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

const tradingStatusLabels: Readonly<Record<TAuctionListItemViewModel['tradingStatus'], string>> = {
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

export const formatAuctionType = (auctionType: TAuctionListItemViewModel['auctionType']): string =>
  auctionTypeLabels[auctionType];

export const formatAuctionStatus = (
  auctionStatus: TAuctionListItemViewModel['auctionStatus'],
): string => auctionStatusLabels[auctionStatus];

export const formatTradingStatus = (
  tradingStatus: TAuctionListItemViewModel['tradingStatus'],
): string => tradingStatusLabels[tradingStatus];

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

export const formatMetric = (value: number | null, unit: string): string =>
  value === null ? '—' : `${value.toLocaleString('ru-RU')} ${unit}`;

export const getAuctionListPrimaryAction = (
  auction: TAuctionListItemViewModel,
): TAuctionListPrimaryAction => {
  if (!auction.canSetBid || auction.auctionUuid === null) {
    return { label: 'Ставка недоступна', isDisabled: true };
  }

  return {
    label: auction.hasMyBid ? 'Изменить ставку' : 'Сделать ставку',
    isDisabled: false,
  };
};
