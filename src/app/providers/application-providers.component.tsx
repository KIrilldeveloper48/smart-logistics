import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { TooltipProvider } from '@/shared/ui';
import { queryClient } from './query-client';
import { appRouter } from '../router/app-router';

export function ApplicationProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={appRouter} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
