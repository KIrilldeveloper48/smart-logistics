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

export const parseAuctionRecord = (auction: unknown): TAuctionMockRecord => {
  const record = z
    .object({
      uuid: auctionUuidSchema,
      listItem: z.unknown(),
      detail: z.unknown(),
      bets: z.unknown(),
    })
    .parse(auction);

  return {
    uuid: record.uuid,
    listItem: parseListItem(record.listItem),
    detail: auctionDetailResponseSchema.parse(record.detail),
    bets: betListResponseSchema.parse(record.bets),
  };
};
import { z } from 'zod';
import { auctionUuidSchema } from '../../auction-detail/auction-detail.schemas';
