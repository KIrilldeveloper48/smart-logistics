import type { z } from 'zod';
import type { auctionListSearchSchema } from './auction-list-search.schema';

export type TAuctionListSearch = z.infer<typeof auctionListSearchSchema>;
