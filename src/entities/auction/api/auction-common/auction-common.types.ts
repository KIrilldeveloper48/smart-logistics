import type { z } from 'zod';
import type {
  apiProblemSchema,
  auctionStatusSchema,
  auctionTypeSchema,
  bidMeasurementTypeSchema,
  operationTypeSchema,
  paymentDelayTypeSchema,
  problemDetailSchema,
  tradingStatusSchema,
  validationErrorSchema,
  validationProblemSchema,
} from './auction-common.schemas';

export type TAuctionStatus = z.infer<typeof auctionStatusSchema>;
export type TAuctionType = z.infer<typeof auctionTypeSchema>;
export type TBidMeasurementType = z.infer<typeof bidMeasurementTypeSchema>;
export type TOperationType = z.infer<typeof operationTypeSchema>;
export type TPaymentDelayType = z.infer<typeof paymentDelayTypeSchema>;
export type TTradingStatus = z.infer<typeof tradingStatusSchema>;
export type TProblemDetail = z.infer<typeof problemDetailSchema>;
export type TValidationError = z.infer<typeof validationErrorSchema>;
export type TValidationProblem = z.infer<typeof validationProblemSchema>;
export type TApiProblem = z.infer<typeof apiProblemSchema>;
