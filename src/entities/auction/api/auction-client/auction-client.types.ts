import type { TApiProblem } from '../auction-common/auction-common.types';
import type {
  TAuctionDetailResponse,
  TBetListResponse,
  TListBetsSearch,
  TSetBetRequest,
} from '../auction-detail/auction-detail.types';
import type { TAuctionListRequest, TAuctionListResponse } from '../auction-list/auction-list.types';

export type TAuctionApiErrorKind = 'contract' | 'http' | 'network';

export type TAuctionApiErrorContext = Readonly<{
  kind: TAuctionApiErrorKind;
  status: number | null;
  problem: TApiProblem | null;
}>;

export type TAuctionClientOptions = Readonly<{
  baseUrl?: string;
  fetcher?: typeof fetch;
}>;

export type TAuctionClient = Readonly<{
  getList: (request: Readonly<TAuctionListRequest>) => Promise<TAuctionListResponse>;
  getDetail: (auctionUuid: string) => Promise<TAuctionDetailResponse>;
  getBets: (auctionUuid: string, search?: Readonly<TListBetsSearch>) => Promise<TBetListResponse>;
  placeBid: (auctionUuid: string, request: Readonly<TSetBetRequest>) => Promise<void>;
}>;
