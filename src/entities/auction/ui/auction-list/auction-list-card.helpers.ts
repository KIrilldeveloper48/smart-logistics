import type { TAuctionListItemViewModel } from '../../model';
import type { TAuctionListPrimaryAction } from './auction-list-card.types';

export const getAuctionListPrimaryAction = (
  auction: TAuctionListItemViewModel,
): TAuctionListPrimaryAction => {
  if (auction.auctionUuid === null) {
    return { kind: 'disabled', label: 'Ставка недоступна', isDisabled: true };
  }

  if (!auction.canSetBid) {
    return { kind: 'bets', label: 'Смотреть ставки', isDisabled: false };
  }

  return {
    kind: 'bid',
    label: auction.hasMyBid ? 'Изменить ставку' : 'Сделать ставку',
    isDisabled: false,
  };
};
