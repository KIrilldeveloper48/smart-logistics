import type { z } from 'zod';
import type { auctionBidFormSchema } from './auction-bid-form.schema';

export type TAuctionBidFormValues = z.infer<typeof auctionBidFormSchema>;
