import type { z } from 'zod';
import type { auctionListRequestSchema, auctionListResponseSchema } from './auction-list.schemas';

export type TAuctionListRequest = z.infer<typeof auctionListRequestSchema>;
export type TAuctionListResponse = z.infer<typeof auctionListResponseSchema>;
export type TAuctionListItem = NonNullable<TAuctionListResponse['data']>[number];
