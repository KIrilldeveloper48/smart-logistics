import { describe, expect, it } from 'vitest';
import { getAuctionListCorrectedPage } from './auction-list-pagination.helpers';

describe('getAuctionListCorrectedPage', () => {
  it('returns the last page when the requested page is out of range', () => {
    expect(getAuctionListCorrectedPage(999, 2, 25)).toBe(2);
  });

  it('does not redirect an empty result or an existing page', () => {
    expect(getAuctionListCorrectedPage(999, 1, 0)).toBeNull();
    expect(getAuctionListCorrectedPage(2, 2, 25)).toBeNull();
  });
});
