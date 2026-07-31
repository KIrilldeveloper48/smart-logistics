import type { z } from 'zod';
import type { auctionsListSearchSchema } from './auction-list-search.schema';

export type TAuctionListSearch = z.infer<typeof auctionsListSearchSchema>;
