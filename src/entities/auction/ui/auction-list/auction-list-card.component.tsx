import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui';
import {
  formatAuctionType,
  formatDate,
  formatMetric,
  formatPrice,
  getAuctionListPrimaryAction,
} from './auction-list-card.helpers';
import type { TAuctionListCardProps } from './auction-list-card.types';

export function AuctionListCard({ auction, onPrimaryAction }: TAuctionListCardProps) {
  const action = getAuctionListPrimaryAction(auction);
  const isActionDisabled = action.isDisabled || onPrimaryAction === undefined;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Заявка</p>
            <CardTitle className="mt-1 text-lg">
              {auction.cargoNumber ?? 'Номер не указан'}
            </CardTitle>
          </div>
          <Badge variant="outline">{formatAuctionType(auction.auctionType)}</Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">{auction.auctionStatus}</Badge>
          <Badge variant="secondary">{auction.tradingStatus}</Badge>
          {auction.hasMyBid ? <Badge>Моя ставка</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5 text-sm">
        <section>
          <p className="text-muted-foreground">Маршрут</p>
          <p className="mt-1 font-medium">
            {auction.load.city ?? '—'} → {auction.unload.city ?? '—'}
          </p>
          <p className="mt-1 text-muted-foreground">
            {formatDate(auction.load.date)} — {formatDate(auction.unload.date)}
          </p>
        </section>

        <section>
          <p className="text-muted-foreground">Груз</p>
          <p className="mt-1 font-medium">{auction.cargo.name ?? 'Не указан'}</p>
          <p className="mt-1 text-muted-foreground">
            {formatMetric(auction.cargo.weight, 'т')} · {formatMetric(auction.cargo.volume, 'м³')} ·{' '}
            {auction.cargo.bodyType ?? 'Тип кузова не указан'}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Текущая цена</p>
            <p className="mt-1 font-medium">{formatPrice(auction.price.current)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Цена за км</p>
            <p className="mt-1 font-medium">{formatPrice(auction.price.pricePerKm)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Шаг ставки</p>
            <p className="mt-1 font-medium">{formatPrice(auction.price.step)}</p>
          </div>
        </section>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          disabled={isActionDisabled}
          onClick={() => onPrimaryAction?.(auction)}
        >
          {action.label}
        </Button>
      </CardFooter>
    </Card>
  );
}
