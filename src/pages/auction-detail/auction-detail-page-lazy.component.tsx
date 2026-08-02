import { lazy } from 'react';

export const AuctionDetailPage = lazy(async () => {
  const page = await import('./auction-detail-page.component');

  return { default: page.AuctionDetailPage };
});
