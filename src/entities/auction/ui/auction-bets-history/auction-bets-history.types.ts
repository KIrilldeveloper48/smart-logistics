import type { TBetViewModel } from '../../model';

export type TAuctionBetsHistoryProps = Readonly<{
  bets: readonly TBetViewModel[];
  isHidden: boolean;
  arePlacesHidden: boolean;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}>;
