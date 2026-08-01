import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';
import type { TAuctionDetailErrorStateProps } from './auction-detail-query-states.types';

export function AuctionDetailErrorState({ onRetry }: TAuctionDetailErrorStateProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Не удалось загрузить детали аукциона</CardTitle>
        <CardDescription>Проверьте подключение и повторите попытку.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Повторить</Button>
      </CardContent>
    </Card>
  );
}
