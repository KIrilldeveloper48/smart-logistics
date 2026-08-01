import type { z } from 'zod';
import type { TValidationError } from '../../auction-common/auction-common.types';
import type { mockBidderSchema } from './auction-bid.schema';

export type TMockBidder = Readonly<z.infer<typeof mockBidderSchema>>;

export type TPlaceBidInput = Readonly<{
  price: number;
  bidder: TMockBidder;
  createdAt: string;
}>;

export type TPlaceBidResult =
  | Readonly<{ success: true }>
  | Readonly<{ success: false; reason: 'not-found' }>
  | Readonly<{ success: false; reason: 'validation'; errors: readonly TValidationError[] }>;
