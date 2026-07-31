import { HttpResponse, http } from 'msw';
import {
  auctionUuidSchema,
  setBetRequestSchema,
} from '../../auction-detail/auction-detail.schemas';
import { auctionMockStore } from '../auction-mock-store/auction-mock-store';
import { notFoundResponse, validationResponse } from '../auction-response/auction-response.helpers';

export const auctionBidHandler = http.post(
  '*/auctions/:auctionUuid/bets',
  async ({ params, request }) => {
    const uuid = params['auctionUuid'];

    if (typeof uuid !== 'string' || !auctionUuidSchema.safeParse(uuid).success) {
      return notFoundResponse(typeof uuid === 'string' ? uuid : 'unknown');
    }

    const payload = await request.json().catch(() => null);
    const result = setBetRequestSchema.safeParse(payload);

    if (!result.success) {
      return validationResponse(
        result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'price',
          message: issue.message,
        })),
      );
    }

    const placeBidResult = auctionMockStore.placeBid(uuid, result.data.price);

    if (!placeBidResult.success && placeBidResult.reason === 'not-found') {
      return notFoundResponse(uuid);
    }

    if (!placeBidResult.success) {
      return validationResponse(placeBidResult.errors);
    }

    return new HttpResponse(null, { status: 200 });
  },
);
