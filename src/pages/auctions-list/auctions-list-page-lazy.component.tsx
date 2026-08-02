import { lazy } from 'react';

export const AuctionsListPage = lazy(async () => {
  const page = await import('./auctions-list-page.component');

  return { default: page.AuctionsListPage };
});
