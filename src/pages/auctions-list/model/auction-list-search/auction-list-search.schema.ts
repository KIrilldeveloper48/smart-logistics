import { z } from 'zod';
import { tradingStatusSchema } from '@/entities/auction';
import { auctionListAuctionTypeFilterSchema, dateTimeWithOffsetSchema } from '@/entities/auction';
import {
  toSearchBoolean,
  toSearchNumber,
  toSearchNumberArray,
  toSearchStringArray,
} from './auction-list-search.helpers';

const optionalBooleanSchema = z.preprocess(
  toSearchBoolean,
  z.boolean().optional().catch(undefined),
);

const optionalNumberSchema = z.preprocess(
  toSearchNumber,
  z.number().finite().optional().catch(undefined),
);

const optionalIntegerArraySchema = z.preprocess(
  toSearchNumberArray,
  z.array(z.number().int()).optional().catch(undefined),
);

export const auctionsListSearchSchema = z.object({
  page: z.preprocess(toSearchNumber, z.number().int().positive().catch(1)),
  perPage: z.preprocess(toSearchNumber, z.number().int().positive().max(100).catch(20)),
  cargoNum: z.string().optional().catch(undefined),
  status: z.preprocess(
    toSearchStringArray,
    z.array(tradingStatusSchema).optional().catch(undefined),
  ),
  statuses: optionalIntegerArraySchema,
  auctionTypes: z.preprocess(
    toSearchStringArray,
    z.array(auctionListAuctionTypeFilterSchema).optional().catch(undefined),
  ),
  loadCity: z.string().optional().catch(undefined),
  unloadCity: z.string().optional().catch(undefined),
  loadDateFrom: dateTimeWithOffsetSchema.optional().catch(undefined),
  loadDateTo: dateTimeWithOffsetSchema.optional().catch(undefined),
  isAvailable: optionalBooleanSchema,
  isBidder: optionalBooleanSchema,
  currentPriceFrom: optionalNumberSchema,
  currentPriceTo: optionalNumberSchema,
});
