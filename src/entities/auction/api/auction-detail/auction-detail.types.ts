import type { z } from 'zod';
import type {
  auctionDetailResponseSchema,
  betListResponseSchema,
  listBetsSearchSchema,
  setBetRequestSchema,
} from './auction-detail.schemas';

export type TAuctionDetailResponse = z.infer<typeof auctionDetailResponseSchema>;
export type TBetListResponse = z.infer<typeof betListResponseSchema>;
export type TBetItem = TBetListResponse['bets'][number];
export type TListBetsSearch = z.infer<typeof listBetsSearchSchema>;
export type TSetBetRequest = z.infer<typeof setBetRequestSchema>;
