import { Card, CardContent, CardHeader, Skeleton } from '@/shared/ui';

export function AuctionDetailSkeleton() {
  return (
    <Card className="mt-6">
      <CardHeader className="gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-72" />
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </CardContent>
    </Card>
  );
}
