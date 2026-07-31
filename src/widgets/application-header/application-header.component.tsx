import { Link } from '@tanstack/react-router';

export function ApplicationHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          search={{ page: 1, perPage: 20 }}
          className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            SL
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">Smart Logistics</span>
            <span className="text-xs text-muted-foreground">Грузовые аукционы</span>
          </span>
        </Link>
        <span className="hidden text-sm text-muted-foreground sm:block">
          Рабочее место перевозчика
        </span>
      </div>
    </header>
  );
}
