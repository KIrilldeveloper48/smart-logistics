import {
  auctionUuidSchema,
  betListResponseSchema,
  listBetsSearchSchema,
  setBetRequestSchema,
  auctionDetailResponseSchema,
} from '../auction-detail/auction-detail.schemas';
import {
  auctionListRequestSchema,
  auctionListResponseSchema,
} from '../auction-list/auction-list.schemas';
import { requestEmpty, requestJson, toApiUrl } from './auction-client.helpers';
import type { TAuctionClient, TAuctionClientOptions } from './auction-client.types';

const jsonHeaders = { 'content-type': 'application/json' } as const;

const toBetsPath = (auctionUuid: string, search: unknown): string => {
  const parsedSearch = listBetsSearchSchema.parse(search);
  const all = parsedSearch.all;

  if (all === undefined || all === null) {
    return `/auctions/${encodeURIComponent(auctionUuid)}/bets`;
  }

  return `/auctions/${encodeURIComponent(auctionUuid)}/bets?all=${all}`;
};

export const createAuctionClient = (options: TAuctionClientOptions = {}): TAuctionClient => {
  const baseUrl = options.baseUrl ?? '';
  const fetcher = options.fetcher ?? fetch;

  const getList: TAuctionClient['getList'] = async (request) =>
    requestJson(
      fetcher,
      toApiUrl(baseUrl, '/auctions/list'),
      {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(auctionListRequestSchema.parse(request)),
      },
      auctionListResponseSchema,
    );

  const getDetail: TAuctionClient['getDetail'] = async (auctionUuid) => {
    const uuid = auctionUuidSchema.parse(auctionUuid);

    return requestJson(
      fetcher,
      toApiUrl(baseUrl, `/auctions/${encodeURIComponent(uuid)}`),
      { method: 'GET' },
      auctionDetailResponseSchema,
    );
  };

  const getBets: TAuctionClient['getBets'] = async (auctionUuid, search = {}) => {
    const uuid = auctionUuidSchema.parse(auctionUuid);

    return requestJson(
      fetcher,
      toApiUrl(baseUrl, toBetsPath(uuid, search)),
      { method: 'GET' },
      betListResponseSchema,
    );
  };

  const placeBid: TAuctionClient['placeBid'] = async (auctionUuid, request) => {
    const uuid = auctionUuidSchema.parse(auctionUuid);

    await requestEmpty(fetcher, toApiUrl(baseUrl, `/auctions/${encodeURIComponent(uuid)}/bets`), {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(setBetRequestSchema.parse(request)),
    });
  };

  return { getList, getDetail, getBets, placeBid };
};

export const auctionClient = createAuctionClient();
