import type { TAuctionDetailViewModel } from '../../model';

export type TAuctionDetailProps = Readonly<{
  auction: TAuctionDetailViewModel;
  onSetBid: () => void;
}>;
