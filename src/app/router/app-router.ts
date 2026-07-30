import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { RootLayout } from '@/app/router/root-layout.component';
import { AuctionsListPage } from '@/pages/auctions-list';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuctionsListPage,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const appRouter = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof appRouter;
  }
}
