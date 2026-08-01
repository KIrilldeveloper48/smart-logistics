import { mockBidderSchema } from '../auction-bid/auction-bid.schema';
import activeLeading from './data/auctions/active-leading.json';
import activeUp from './data/auctions/active-up.json';
import finishedWinner from './data/auctions/finished-winner.json';
import fixedPrice from './data/auctions/fixed-price.json';
import planningHiddenBets from './data/auctions/planning-hidden-bets.json';
import bidder from './data/bidder.json';
import { parseAuctionRecord } from './auction-mock-store.helpers';
import type { TAuctionMockRecord } from './auction-mock-store.types';

const auctionSeedData = [
  activeLeading,
  planningHiddenBets,
  activeUp,
  fixedPrice,
  finishedWinner,
] as const;

export const auctionMockBidder = mockBidderSchema.parse(bidder);

export const createAuctionSeeds = (): TAuctionMockRecord[] =>
  auctionSeedData.map(parseAuctionRecord);
