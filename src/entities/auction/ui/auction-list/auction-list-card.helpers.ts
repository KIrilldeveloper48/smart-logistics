import type { TAuctionListItemViewModel } from '../../model';
import type { TAuctionListPrimaryAction } from './auction-list-card.types';

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
