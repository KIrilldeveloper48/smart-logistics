import { z } from 'zod';
import { auctionListAuctionTypeFilterSchema, tradingStatusSchema } from '@/entities/auction';
import { toOptionalBoolean, toOptionalNumber } from './auction-list-filters.helpers';

const optionalNumberSchema = z.preprocess(toOptionalNumber, z.number().finite().optional());

export const auctionListFiltersFormSchema = z.object({
  cargoNum: z.string().optional(),
  status: tradingStatusSchema.optional(),
  auctionStatus: z.coerce.number().int().min(1).max(8).optional(),
  auctionType: auctionListAuctionTypeFilterSchema.optional(),
  loadCity: z.string().optional(),
  unloadCity: z.string().optional(),
  loadDateFrom: z.iso.date().optional(),
  loadDateTo: z.iso.date().optional(),
  isAvailable: z.preprocess(toOptionalBoolean, z.boolean().optional()),
  isBidder: z.preprocess(toOptionalBoolean, z.boolean().optional()),
  currentPriceFrom: optionalNumberSchema,
  currentPriceTo: optionalNumberSchema,
});
