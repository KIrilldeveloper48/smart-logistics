import type { TDetailItemProps } from './detail-item.types';

export function DetailItem({ term, value, icon }: TDetailItemProps) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(8rem,auto)_1fr] sm:gap-3">
      <dt className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {term}
      </dt>
      <dd className="min-w-0 break-words">{value}</dd>
    </div>
  );
}
