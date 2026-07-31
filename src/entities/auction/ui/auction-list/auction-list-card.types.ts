import type { TAuctionListItemViewModel } from '../../model';

export type TAuctionListCardProps = Readonly<{
  auction: TAuctionListItemViewModel;
  onPrimaryAction?: (auction: TAuctionListItemViewModel) => void;
}>;

export type TAuctionListPrimaryAction = Readonly<{
  label: string;
  isDisabled: boolean;
}>;
