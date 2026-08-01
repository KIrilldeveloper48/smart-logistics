import { mockBidderSchema } from '../auction-bid/auction-bid.schema';
import auctionSeedData from './data/auctions.json';
import bidder from './data/bidder.json';
import { parseAuctionRecord } from './auction-mock-store.helpers';
import type { TAuctionMockRecord } from './auction-mock-store.types';

export const auctionMockBidder = mockBidderSchema.parse(bidder);

export const createAuctionSeeds = (): TAuctionMockRecord[] =>
  auctionSeedData.map(parseAuctionRecord);
