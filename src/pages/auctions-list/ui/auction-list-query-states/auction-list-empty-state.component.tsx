import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';

export function AuctionListEmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Аукционы не найдены</CardTitle>
        <CardDescription>Измените фильтры или попробуйте открыть список позже.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        По текущим условиям подходящих аукционов нет.
      </CardContent>
    </Card>
  );
}
