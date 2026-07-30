import { Outlet } from '@tanstack/react-router';
import { ApplicationHeader } from '@/widgets/application-header';

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ApplicationHeader />
      <Outlet />
    </div>
  );
}
