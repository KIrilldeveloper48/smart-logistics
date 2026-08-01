import { describe, expect, it } from 'vitest';
import { AuctionApiError } from '@/entities/auction';
import { getAuctionBidApiErrorMessage } from './auction-bid-api-error.helpers';

describe('getAuctionBidApiErrorMessage', () => {
  it('returns the price error from a 422 validation problem', () => {
    const error = new AuctionApiError('Validation failed.', {
      kind: 'http',
      status: 422,
      problem: {
        code: 'validation_error',
        title: 'Validation error',
        message: 'The request is invalid.',
        errors: [
          {
            field: 'price',
            message: 'Цена не соответствует шагу ставки.',
            code: null,
          },
        ],
      },
    });

    expect(getAuctionBidApiErrorMessage(error)).toBe('Цена не соответствует шагу ставки.');
  });
});
