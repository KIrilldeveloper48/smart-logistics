import {
  auctionDetailResponseSchema,
  betListResponseSchema,
} from '../../auction-detail/auction-detail.schemas';
import { auctionListResponseSchema } from '../../auction-list/auction-list.schemas';
import type { TAuctionListItem } from '../../auction-list/auction-list.types';
import type { TAuctionMockRecord } from './auction-mock-store.types';

const parseListItem = (item: unknown): TAuctionListItem => {
  const response = auctionListResponseSchema.parse({ data: [item] });
  const parsedItem = response.data?.[0];

  if (!parsedItem) {
    throw new Error('Auction list seed must contain one item.');
  }

  return parsedItem;
};

export const parseAuctionRecord = (auction: TAuctionMockRecord): TAuctionMockRecord => ({
  uuid: auction.uuid,
  listItem: parseListItem(auction.listItem),
  detail: auctionDetailResponseSchema.parse(auction.detail),
  bets: betListResponseSchema.parse(auction.bets),
});
