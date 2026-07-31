import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';
import type { TAuctionListErrorStateProps } from './auction-list-states.types';

export function AuctionListErrorState({ onRetry }: TAuctionListErrorStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Не удалось загрузить аукционы</CardTitle>
        <CardDescription>Проверьте подключение и повторите попытку.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Повторить</Button>
      </CardContent>
    </Card>
  );
}
