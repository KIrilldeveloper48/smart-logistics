import { z } from 'zod';

export const auctionUuidSchema = z.uuid();

export const openApiDateTimeSchema = z.iso.datetime({ local: true, offset: true });

export const auctionStatusSchema = z.enum([
  'Planning',
  'Auction',
  'DeterminateWinner',
  'WaitDeal',
  'InProgress',
  'Finished',
  'Stopped',
  'Canceled',
  'Unknown',
]);

export const auctionTypeSchema = z.enum(['Request', 'Up', 'Down', 'FixPrice', 'Unknown']);

export const bidMeasurementTypeSchema = z.enum(['PerRoute', 'PerKm', 'Unknown']);

export const operationTypeSchema = z.enum(['Loading', 'Unloading', 'Unknown']);

export const paymentDelayTypeSchema = z.enum(['CalendarDays', 'WorkDays', 'Unknown']).nullable();

export const tradingStatusSchema = z.enum([
  'NotParticipating',
  'Leading',
  'Losing',
  'OnPending',
  'Confirmed',
  'ChoosingWinner',
  'Winner',
  'Accepted',
  'Unknown',
]);

export const problemDetailSchema = z.object({
  code: z.string(),
  title: z.string(),
  message: z.string(),
  trace_id: z.string().nullable().optional(),
});

export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string().nullable().optional(),
});

export const validationProblemSchema = z.object({
  code: z.string(),
  title: z.string(),
  message: z.string(),
  trace_id: z.string().nullable().optional(),
  errors: z.array(validationErrorSchema),
});

export const apiProblemSchema = z.union([validationProblemSchema, problemDetailSchema]);
