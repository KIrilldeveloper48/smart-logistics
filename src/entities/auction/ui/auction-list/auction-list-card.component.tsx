import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIcon,
  Clock3Icon,
  PackageIcon,
  RouteIcon,
  WeightIcon,
} from 'lucide-react';
import {
  formatAuctionStatus,
  formatAuctionType,
  formatDate,
  DetailItem,
  formatMetric,
  formatPrice,
  formatTradingStatus,
  getAuctionTypeBadgeClassName,
  getTradingStatusBadgeClassName,
} from '../auction-presentation';
import { getAuctionListPrimaryAction } from './auction-list-card.helpers';
import type { TAuctionListCardProps } from './auction-list-card.types';

export function AuctionListCard({
  auction,
  onPrimaryAction,
  onOpenDetails,
  onIntent,
}: TAuctionListCardProps) {
  const action = getAuctionListPrimaryAction(auction);
  const isActionDisabled = action.isDisabled || onPrimaryAction === undefined;
  const handleIntent = (): void => {
    if (auction.auctionUuid !== null) {
      onIntent?.(auction.auctionUuid);
    }
  };

  return (
    <Card className="flex h-full flex-col" onPointerEnter={handleIntent} onFocus={handleIntent}>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Заявка</p>
            <CardTitle className="mt-1 break-all text-lg">
              {auction.cargoNumber ?? 'Номер не указан'}
            </CardTitle>
          </div>
          <Badge variant="outline" className={getAuctionTypeBadgeClassName(auction.auctionType)}>
            {auction.auctionType === 'Up' ? <ArrowUpIcon /> : null}
            {auction.auctionType === 'Down' ? <ArrowDownIcon /> : null}
            {formatAuctionType(auction.auctionType)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary" className="bg-muted text-foreground">
            {formatAuctionStatus(auction.auctionStatus)}
          </Badge>
          <Badge
            variant="secondary"
            className={getTradingStatusBadgeClassName(auction.tradingStatus)}
          >
            {formatTradingStatus(auction.tradingStatus)}
          </Badge>
          {auction.hasMyBid ? <Badge>Моя ставка</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5 text-sm">
        <section>
          <dl className="grid gap-2">
            <DetailItem
              term="Маршрут"
              value={`${auction.load.city ?? '—'} → ${auction.unload.city ?? '—'}`}
              icon={<RouteIcon className="size-4" aria-hidden="true" />}
            />
            <DetailItem
              term="Период"
              value={`${formatDate(auction.load.date)} — ${formatDate(auction.unload.date)}`}
              icon={<Clock3Icon className="size-4" aria-hidden="true" />}
            />
          </dl>
        </section>

        <section>
          <dl className="grid gap-2">
            <DetailItem
              term="Груз"
              value={auction.cargo.name ?? 'Не указан'}
              icon={<PackageIcon className="size-4" aria-hidden="true" />}
            />
            <DetailItem
              term="Вес и объём"
              value={`${formatMetric(auction.cargo.weight, 'т')} · ${formatMetric(auction.cargo.volume, 'м³')}`}
              icon={<WeightIcon className="size-4" aria-hidden="true" />}
            />
            <DetailItem
              term="Кузов"
              value={auction.cargo.bodyType ?? 'Тип кузова не указан'}
              icon={<BoxIcon className="size-4" aria-hidden="true" />}
            />
          </dl>
        </section>

        <section className="rounded-lg bg-muted/50 p-3">
          <dl className="grid gap-3">
            <DetailItem term="Текущая цена" value={formatPrice(auction.price.current)} />
            <DetailItem term="Цена за км" value={formatPrice(auction.price.pricePerKm)} />
            <DetailItem term="Шаг ставки" value={formatPrice(auction.price.step)} />
          </dl>
        </section>
      </CardContent>

      <CardFooter>
        <div className="grid w-full gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            disabled={auction.auctionUuid === null || onOpenDetails === undefined}
            onClick={() => {
              if (auction.auctionUuid !== null) {
                onOpenDetails?.(auction.auctionUuid);
              }
            }}
          >
            Подробнее
          </Button>
          <Button disabled={isActionDisabled} onClick={() => onPrimaryAction?.(auction, action)}>
            {action.label}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
