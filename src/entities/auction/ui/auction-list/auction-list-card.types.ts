import type { TAuctionListItemViewModel } from '../../model';

export type TAuctionListCardProps = Readonly<{
  auction: TAuctionListItemViewModel;
  onPrimaryAction?: (auction: TAuctionListItemViewModel) => void;
  onOpenDetails?: (auctionUuid: string) => void;
  onIntent?: (auctionUuid: string) => void;
}>;

export type TAuctionListPrimaryAction = Readonly<{
  label: string;
  isDisabled: boolean;
}>;
