import { z } from 'zod';

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

export type AuctionStatus = z.infer<typeof auctionStatusSchema>;
export type AuctionType = z.infer<typeof auctionTypeSchema>;
export type BidMeasurementType = z.infer<typeof bidMeasurementTypeSchema>;
export type OperationType = z.infer<typeof operationTypeSchema>;
export type PaymentDelayType = z.infer<typeof paymentDelayTypeSchema>;
export type TradingStatus = z.infer<typeof tradingStatusSchema>;
export type ProblemDetail = z.infer<typeof problemDetailSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type ValidationProblem = z.infer<typeof validationProblemSchema>;
export type ApiProblem = z.infer<typeof apiProblemSchema>;
