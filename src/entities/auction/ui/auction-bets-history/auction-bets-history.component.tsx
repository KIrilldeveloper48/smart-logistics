import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/ui';
import { Clock3Icon } from 'lucide-react';
import { formatDate, formatPrice } from '../auction-presentation';
import {
  formatParticipantsCount,
  getAuctionParticipantsCount,
} from './auction-bets-history.helpers';
import type { TAuctionBetsHistoryProps } from './auction-bets-history.types';

export function AuctionBetsHistory({
  bets,
  isHidden,
  arePlacesHidden,
  isPending,
  isError,
  onRetry,
}: TAuctionBetsHistoryProps) {
  const participantsCount = getAuctionParticipantsCount(bets);
  const renderContent = () => {
    if (isHidden) {
      return <p className="text-sm text-muted-foreground">История ставок скрыта организатором.</p>;
    }

    if (isPending) {
      return (
        <div className="grid gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">Не удалось загрузить историю ставок.</p>

          <Button className="w-fit" onClick={onRetry}>
            Повторить
          </Button>
        </div>
      );
    }

    if (bets.length === 0) {
      return <p className="text-sm text-muted-foreground">Ставок пока нет.</p>;
    }

    return (
      <div className="grid gap-3">
        {bets.map((bet, index) => (
          <article
            key={bet.id ?? index}
            className="grid gap-3 rounded-xl border p-4 text-sm sm:grid-cols-2"
          >
            <div>
              <p className="font-medium">{bet.transporterName ?? 'Перевозчик не указан'}</p>

              <p className="mt-1 text-muted-foreground">{formatDate(bet.createdAt)}</p>
            </div>

            <div className="flex flex-wrap content-start gap-2 sm:justify-end">
              <Badge variant="outline" className="bg-muted/50 text-foreground">
                С НДС: {formatPrice(bet.priceWithVat)}
              </Badge>

              <Badge variant="outline" className="bg-muted/50 text-foreground">
                Без НДС: {formatPrice(bet.priceWithoutVat)}
              </Badge>

              {!arePlacesHidden && bet.place !== null && (
                <Badge variant="secondary">Место: {bet.place}</Badge>
              )}

              {bet.isWinner && <Badge>Победитель</Badge>}

              {bet.isRejected && (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-600">
                  Отменена
                </Badge>
              )}
            </div>

            {bet.cancelReason !== null && (
              <p className="text-muted-foreground sm:col-span-2">
                Причина отмены: {bet.cancelReason}
              </p>
            )}
          </article>
        ))}
      </div>
    );
  };

  return (
    <Card id="auction-bets" className="scroll-mt-6">
      <CardHeader className="flex-row flex-wrap items-center gap-3">
        <Clock3Icon className="size-5 text-muted-foreground" aria-hidden="true" />
        <CardTitle>История ставок</CardTitle>
        {!isHidden && !isPending && !isError ? (
          <Badge variant="outline" className="ml-auto bg-muted/50 text-foreground">
            {formatParticipantsCount(participantsCount)}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
