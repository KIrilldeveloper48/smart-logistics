import { Link } from '@tanstack/react-router';

export function ApplicationHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          search={{ page: 1, perPage: 20 }}
          className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-sm font-bold text-background shadow-sm">
            SL
          </span>
          <span className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">Smart Logistics</span>
            <span className="text-xs text-muted-foreground">Грузовые аукционы</span>
          </span>
        </Link>
        <div className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
          <span className="size-1.5 rounded-full bg-blue-600" aria-hidden="true" />
          <span>Рабочее место перевозчика</span>
        </div>
      </div>
    </header>
  );
}
