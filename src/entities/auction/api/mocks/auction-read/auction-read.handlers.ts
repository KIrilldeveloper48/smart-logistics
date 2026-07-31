import { HttpResponse, http } from 'msw';
import {
  auctionDetailResponseSchema,
  auctionUuidSchema,
  betListResponseSchema,
} from '../../auction-detail/auction-detail.schemas';
import { auctionMockStore } from '../auction-mock-store/auction-mock-store';
import { listAuctions, parseBetsSearch, parseListRequest } from './auction-read.helpers';
import { notFoundResponse } from '../auction-response/auction-response.helpers';

export const auctionReadHandlers = [
  http.post('*/auctions/list', async ({ request }) => {
    const payload = await parseListRequest(request);

    return payload instanceof HttpResponse ? payload : HttpResponse.json(listAuctions(payload));
  }),
  http.get('*/auctions/:auctionUuid', ({ params }) => {
    const uuid = params['auctionUuid'];

    if (typeof uuid !== 'string' || !auctionUuidSchema.safeParse(uuid).success) {
      return notFoundResponse(typeof uuid === 'string' ? uuid : 'unknown');
    }

    const auction = auctionMockStore.getAuctionByUuid(uuid);

    return auction
      ? HttpResponse.json(auctionDetailResponseSchema.parse(auction.detail))
      : notFoundResponse(uuid);
  }),
  http.get('*/auctions/:auctionUuid/bets', ({ params, request }) => {
    const uuid = params['auctionUuid'];

    if (typeof uuid !== 'string' || !auctionUuidSchema.safeParse(uuid).success) {
      return notFoundResponse(typeof uuid === 'string' ? uuid : 'unknown');
    }

    const search = parseBetsSearch(request);

    if (search instanceof HttpResponse) {
      return search;
    }

    const auction = auctionMockStore.getAuctionByUuid(uuid);

    if (!auction) {
      return notFoundResponse(uuid);
    }

    const isHistoryHidden =
      auction.detail.hide_bets_history ?? auction.detail.trading.hide_bets_history;
    const bets = isHistoryHidden
      ? []
      : auction.bets.bets.filter((bet) => search.all === true || !bet.is_rejected);

    return HttpResponse.json(betListResponseSchema.parse({ bets }));
  }),
] as const;
