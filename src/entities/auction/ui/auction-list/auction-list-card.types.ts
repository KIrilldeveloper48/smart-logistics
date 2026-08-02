import type { TAuctionListItemViewModel } from '../../model';

export type TAuctionListCardProps = Readonly<{
  auction: TAuctionListItemViewModel;
  onPrimaryAction?: (auction: TAuctionListItemViewModel, action: TAuctionListPrimaryAction) => void;
  onOpenDetails?: (auctionUuid: string) => void;
  onIntent?: (auctionUuid: string) => void;
}>;

export type TAuctionListPrimaryAction = Readonly<{
  kind: 'bid' | 'bets' | 'disabled';
  label: string;
  isDisabled: boolean;
}>;
