import type { TDetailItemProps } from './detail-item.types';

export function DetailItem({ term, value }: TDetailItemProps) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(8rem,auto)_1fr] sm:gap-3">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="min-w-0">{value}</dd>
    </div>
  );
}
