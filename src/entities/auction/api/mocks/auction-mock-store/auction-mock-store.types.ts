import type {
  TAuctionDetailResponse,
  TBetListResponse,
} from '../../auction-detail/auction-detail.types';
import type { TAuctionListItem } from '../../auction-list/auction-list.types';
import type { TMockBidder, TPlaceBidResult } from '../auction-bid/auction-bid.types';

export type TAuctionMockRecord = Readonly<{
  uuid: string;
  listItem: TAuctionListItem;
  detail: TAuctionDetailResponse;
  bets: TBetListResponse;
}>;

export type TAuctionMockStoreOptions = Readonly<{
  now?: () => Date;
  bidder?: TMockBidder;
}>;

export type TAuctionMockStore = Readonly<{
  getAuctions: () => readonly TAuctionMockRecord[];
  getAuctionByUuid: (uuid: string) => TAuctionMockRecord | null;
  getCities: () => readonly string[];
  placeBid: (uuid: string, price: number) => TPlaceBidResult;
  reset: () => void;
}>;
