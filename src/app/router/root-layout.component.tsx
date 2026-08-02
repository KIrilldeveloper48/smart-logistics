import { Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ApplicationHeader } from '@/widgets/application-header';

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ApplicationHeader />
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
            Загрузка страницы…
          </main>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}
