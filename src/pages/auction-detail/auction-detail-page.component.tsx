import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import {
  AuctionApiError,
  AuctionBetsHistory,
  AuctionDetail,
  toAuctionDetailViewModel,
  toBetViewModels,
  useAuctionBetsQuery,
  useAuctionDetailQuery,
} from '@/entities/auction';
import { AuctionBidForm } from '@/features/set-auction-bid';
import { Button } from '@/shared/ui';
import { AuctionDetailErrorState, AuctionDetailNotFoundState, AuctionDetailSkeleton } from './ui';

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' });
  const navigate = useNavigate({ from: '/auctions/$auctionUuid' });
  const search = useSearch({ from: '/auctions/$auctionUuid' });
  const auctionDetailQuery = useAuctionDetailQuery(auctionUuid);
  const auction = auctionDetailQuery.data
    ? toAuctionDetailViewModel(auctionDetailQuery.data)
    : null;
  const auctionBetsQuery = useAuctionBetsQuery(
    auctionUuid,
    auction !== null && !auction.isBetsHistoryHidden,
  );

  const handleBidModeChange = (isOpen: boolean): void => {
    void navigate({ search: isOpen ? { mode: 'bid' } : {} });
  };

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

    if (auction === null) {
      return null;
    }

    return (
      <>
        <AuctionDetail auction={auction} />
        <AuctionBidForm
          auction={auction}
          isOpen={search.mode === 'bid'}
          onOpenChange={handleBidModeChange}
        />
        <div className="mt-5">
          <AuctionBetsHistory
            bets={toBetViewModels(auctionBetsQuery.data?.bets ?? [])}
            isHidden={auction.isBetsHistoryHidden}
            arePlacesHidden={auction.areBetPlacesHidden}
            isPending={auctionBetsQuery.isPending}
            isError={auctionBetsQuery.isError}
            onRetry={() => void auctionBetsQuery.refetch()}
          />
        </div>
      </>
    );
  })();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Button asChild variant="outline" className="w-fit">
        <Link to="/" search={{ page: 1, perPage: 20 }}>
          <ArrowLeftIcon aria-hidden="true" />К списку аукционов
        </Link>
      </Button>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">Детали аукциона</h1>
      {content}
    </main>
  );
}
