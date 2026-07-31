import type { TValidationError } from '../../auction-common/auction-common.types';

export type TMockBidder = Readonly<{
  subscriberId: number;
  contactName: string;
  contactPhone: string;
  organizationId: number;
  organizationInn: string;
  organizationName: string;
  vatRate: number;
}>;

export type TPlaceBidInput = Readonly<{
  price: number;
  bidder: TMockBidder;
  createdAt: string;
}>;

export type TPlaceBidResult =
  | Readonly<{ success: true }>
  | Readonly<{ success: false; reason: 'not-found' }>
  | Readonly<{ success: false; reason: 'validation'; errors: readonly TValidationError[] }>;
