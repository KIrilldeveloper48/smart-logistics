import { applyBidToAuction, validateBid } from '../auction-bid/auction-bid.helpers';
import { auctionMockBidder, createAuctionSeeds } from './auction-mock-seeds';
import { parseAuctionRecord } from './auction-mock-store.helpers';
import type { TAuctionMockRecord, TAuctionMockStore } from './auction-mock-store.types';
import type { TAuctionMockStoreOptions } from './auction-mock-store.types';

export const createAuctionMockStore = (
  options: TAuctionMockStoreOptions = {},
): TAuctionMockStore => {
  let auctions = createAuctionSeeds();
  const now = options.now ?? (() => new Date());
  const bidder = options.bidder ?? auctionMockBidder;

  const getAuctions = (): readonly TAuctionMockRecord[] => structuredClone(auctions);

  const getAuctionByUuid = (uuid: string): TAuctionMockRecord | null => {
    const auction = auctions.find((item) => item.uuid === uuid);

    return auction ? structuredClone(auction) : null;
  };

  const getCities = (): readonly string[] => {
    const cities = auctions.flatMap((auction) => [
      auction.listItem.route?.load?.city,
      auction.listItem.route?.unload?.city,
    ]);

    return [...new Set(cities.filter((city): city is string => Boolean(city)))];
  };

  const placeBid: TAuctionMockStore['placeBid'] = (uuid, price) => {
    const auctionIndex = auctions.findIndex((auction) => auction.uuid === uuid);

    if (auctionIndex < 0) {
      return { success: false, reason: 'not-found' };
    }

    const auction = auctions[auctionIndex];

    if (!auction) {
      return { success: false, reason: 'not-found' };
    }

    const errors = validateBid(auction, price);

    if (errors.length > 0) {
      return { success: false, reason: 'validation', errors };
    }

    const updatedAuction = parseAuctionRecord(
      applyBidToAuction(auction, {
        price,
        bidder,
        createdAt: now().toISOString(),
      }),
    );
    auctions = auctions.map((item, index) => (index === auctionIndex ? updatedAuction : item));

    return { success: true };
  };

  const reset = (): void => {
    auctions = createAuctionSeeds();
  };

  return { getAuctions, getAuctionByUuid, getCities, placeBid, reset };
};

export const auctionMockStore = createAuctionMockStore();

export type { TAuctionMockRecord, TAuctionMockStore } from './auction-mock-store.types';
