import { Link, useParams } from '@tanstack/react-router';
import {
  AuctionApiError,
  AuctionDetail,
  toAuctionDetailViewModel,
  useAuctionDetailQuery,
} from '@/entities/auction';
import { Button } from '@/shared/ui';
import { AuctionDetailErrorState, AuctionDetailNotFoundState, AuctionDetailSkeleton } from './ui';

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' });
  const auctionDetailQuery = useAuctionDetailQuery(auctionUuid);

  const content = (() => {
    if (auctionDetailQuery.isPending) {
      return <AuctionDetailSkeleton />;
    }

    if (auctionDetailQuery.isError) {
      if (
        auctionDetailQuery.error instanceof AuctionApiError &&
        auctionDetailQuery.error.context.status === 404
      ) {
        return <AuctionDetailNotFoundState />;
      }

      return <AuctionDetailErrorState onRetry={() => void auctionDetailQuery.refetch()} />;
    }

    return <AuctionDetail auction={toAuctionDetailViewModel(auctionDetailQuery.data)} />;
  })();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Button asChild variant="outline" className="w-fit">
        <Link to="/" search={{ page: 1, perPage: 20 }}>
          К списку аукционов
        </Link>
      </Button>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">Детали аукциона</h1>
      {content}
    </main>
  );
}
