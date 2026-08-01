import type {
  TAuctionBidConstraints,
  TAuctionBidFormDefaultValues,
} from './auction-bid-form.types';

const BID_STEP_TOLERANCE = 1e-8;

const isDefined = (value: number | null): value is number => value !== null;

export const getAuctionBidInitialPrice = ({ price }: TAuctionBidConstraints): number | undefined =>
  price.available ?? price.current ?? price.min ?? undefined;

export const getAuctionBidDefaultValues = (
  constraints: TAuctionBidConstraints,
): TAuctionBidFormDefaultValues => {
  const price = getAuctionBidInitialPrice(constraints);

  return price === undefined ? {} : { price };
};

export const isAuctionBidStepValid = (price: number, base: number, step: number): boolean => {
  const steps = (price - base) / step;

  return Math.abs(steps - Math.round(steps)) <= BID_STEP_TOLERANCE;
};

export const isBidPriceDefined = isDefined;
