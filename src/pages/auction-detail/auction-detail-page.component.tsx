import { useLocation, useNavigate, useParams, useRouter, useSearch } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Button, Toast } from '@/shared/ui';
import { AuctionDetailErrorState, AuctionDetailNotFoundState, AuctionDetailSkeleton } from './ui';
import type { TAuctionDetailNotification } from './auction-detail-page.types';

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' });
  const navigate = useNavigate({ from: '/auctions/$auctionUuid' });
  const router = useRouter();
  const location = useLocation();
  const search = useSearch({ from: '/auctions/$auctionUuid' });
  const [notification, setNotification] = useState<TAuctionDetailNotification | null>(null);
  const auctionDetailQuery = useAuctionDetailQuery(auctionUuid);
  const auction = useMemo(
    () => (auctionDetailQuery.data ? toAuctionDetailViewModel(auctionDetailQuery.data) : null),
    [auctionDetailQuery.data],
  );
  const auctionBetsQuery = useAuctionBetsQuery(
    auctionUuid,
    auction !== null && !auction.isBetsHistoryHidden,
  );
  const isUnavailableBidMode = auction !== null && search.mode === 'bid' && !auction.canSetBid;
  const visibleNotification =
    notification ??
    (isUnavailableBidMode
      ? { variant: 'error' as const, message: 'Ставка для этого аукциона недоступна.' }
      : null);

  const handleBidModeChange = (isOpen: boolean): void => {
    void navigate({
      search: (previous) => ({ ...previous, mode: isOpen ? 'bid' : undefined }),
    });
  };

  const handleNotificationOpenChange = useCallback(
    (isOpen: boolean): void => {
      if (!isOpen) {
        setNotification(null);

        if (isUnavailableBidMode) {
          void navigate({
            search: (previous) => ({ ...previous, mode: undefined }),
            replace: true,
          });
        }
      }
    },
    [isUnavailableBidMode, navigate],
  );

  useEffect(() => {
    if (auction === null || location.hash.replace(/^#/, '') !== 'auction-bets') {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById('auction-bets')?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [auction, location.hash]);

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
        <AuctionDetail auction={auction} onSetBid={() => handleBidModeChange(true)} />
        <AuctionBidForm
          auction={auction}
          isOpen={search.mode === 'bid' && auction.canSetBid}
          onOpenChange={handleBidModeChange}
          onSuccess={() =>
            setNotification({
              variant: 'success',
              message: 'Ставка успешно отправлена. Данные аукциона обновлены.',
            })
          }
          onError={(message) => setNotification({ variant: 'error', message })}
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
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        onClick={() => router.history.push(search.returnTo ?? '/')}
      >
        <ArrowLeftIcon aria-hidden="true" />К списку аукционов
      </Button>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">Детали аукциона</h1>
      {content}
      <Toast
        isOpen={visibleNotification !== null}
        message={visibleNotification?.message ?? ''}
        variant={visibleNotification?.variant ?? 'success'}
        onOpenChange={handleNotificationOpenChange}
      />
    </main>
  );
}
