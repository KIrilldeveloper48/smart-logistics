import { z } from 'zod';

export const auctionDetailSearchSchema = z.object({
  mode: z.enum(['bid']).optional(),
});
