import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { auctionUuidSchema } from '@/entities/auction';
import { RootLayout } from '@/app/router/root-layout.component';
import { AuctionDetailPage } from '@/pages/auction-detail';
import { AuctionsListPage, auctionsListSearchSchema } from '@/pages/auctions-list';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuctionsListPage,
  validateSearch: auctionsListSearchSchema,
});

const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'auctions/$auctionUuid',
  params: {
    parse: ({ auctionUuid }) => ({ auctionUuid: auctionUuidSchema.parse(auctionUuid) }),
  },
  component: AuctionDetailPage,
});

const routeTree = rootRoute.addChildren([indexRoute, auctionDetailRoute]);

export const appRouter = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof appRouter;
  }
}
