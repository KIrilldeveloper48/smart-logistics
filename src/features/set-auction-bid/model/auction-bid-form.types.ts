import type { z } from 'zod';
import type { TAuctionPriceSummary, TAuctionType } from '@/entities/auction';
import type { auctionBidFormSchema } from './auction-bid-form.schema';

export type TAuctionBidFormValues = z.infer<typeof auctionBidFormSchema>;

export type TAuctionBidFormDefaultValues = Readonly<{
  price?: number;
}>;

export type TAuctionBidConstraints = Readonly<{
  auctionType: TAuctionType;
  canSetBid: boolean;
  price: TAuctionPriceSummary;
}>;
