import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import App from '@/app/app.component';
import { RootLayout } from '@/app/router/root-layout.component';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const appRouter = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof appRouter;
  }
}
