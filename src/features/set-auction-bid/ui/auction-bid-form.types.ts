import type { TAuctionDetailViewModel } from '@/entities/auction';

export type TAuctionBidFormProps = Readonly<{
  auction: TAuctionDetailViewModel;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}>;
