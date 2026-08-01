import { z } from 'zod';

export const mockBidderSchema = z.object({
  subscriberId: z.number().int().positive(),
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  organizationId: z.number().int().positive(),
  organizationInn: z.string().min(1),
  organizationName: z.string().min(1),
  vatRate: z.number().min(0).max(100),
});
