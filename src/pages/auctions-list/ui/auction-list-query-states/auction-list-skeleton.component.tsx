import { Card, CardContent, CardFooter, CardHeader, Skeleton } from '@/shared/ui';
import type { TAuctionListSkeletonProps } from './auction-list-query-states.types';

export function AuctionListSkeleton({ count = 6 }: TAuctionListSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <Card key={index}>
          <CardHeader className="gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
