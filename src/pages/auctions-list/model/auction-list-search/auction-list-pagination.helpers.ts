export const getAuctionListCorrectedPage = (
  requestedPage: number,
  lastPage: number,
  total: number,
): number | null => (total > 0 && requestedPage > lastPage ? lastPage : null);
