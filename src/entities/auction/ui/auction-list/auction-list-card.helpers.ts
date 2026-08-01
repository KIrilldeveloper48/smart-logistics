import type { TAuctionListItemViewModel } from '../../model';
import type { TAuctionListPrimaryAction } from './auction-list-card.types';

export const getAuctionTypeBadgeClassName = (
  auctionType: TAuctionListItemViewModel['auctionType'],
): string => {
  if (auctionType === 'Up') {
    return 'border-emerald-100 bg-emerald-50 text-emerald-700';
  }

  if (auctionType === 'Down') {
    return 'border-blue-100 bg-blue-50 text-blue-700';
  }

  return 'border-border bg-muted/50 text-foreground';
};

export const getTradingStatusBadgeClassName = (
  tradingStatus: TAuctionListItemViewModel['tradingStatus'],
): string => {
  if (tradingStatus === 'Leading') {
    return 'bg-blue-50 text-blue-700';
  }

  if (tradingStatus === 'Winner') {
    return 'bg-emerald-50 text-emerald-700';
  }

  return 'bg-muted text-foreground';
};

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
