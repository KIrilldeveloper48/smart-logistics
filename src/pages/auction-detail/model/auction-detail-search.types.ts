import type { z } from 'zod';
import type { auctionDetailSearchSchema } from './auction-detail-search.schema';

export type TAuctionDetailSearch = z.infer<typeof auctionDetailSearchSchema>;
