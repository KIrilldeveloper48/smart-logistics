import { useEffect } from 'react';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import {
  AuctionListCard,
  type TAuctionListPrimaryAction,
  type TAuctionListItemViewModel,
  toAuctionListViewModels,
  useAuctionDetailPrefetch,
  useAuctionListQuery,
} from '@/entities/auction';
import { AuctionListFiltersPanel, type TAuctionListFilters } from '@/features/auction-list-filters';
import { Badge } from '@/shared/ui';
import {
  auctionsListSearchSchema,
  getAuctionListCorrectedPage,
  toAuctionListRequestFromSearch,
} from './model';
import {
  AuctionListEmptyState,
  AuctionListErrorState,
  AuctionListPagination,
  AuctionListSkeleton,
} from './ui';

export function AuctionsListPage() {
  const navigate = useNavigate({ from: '/' });
  const location = useLocation();
  const rawSearch = useSearch({ strict: false });
  const search = auctionsListSearchSchema.parse(rawSearch);
  const request = toAuctionListRequestFromSearch(search);
  const prefetchAuctionDetail = useAuctionDetailPrefetch();
  const auctionListQuery = useAuctionListQuery(request);
  const auctions = toAuctionListViewModels(auctionListQuery.data?.data ?? []);
  const currentPage = auctionListQuery.data?.meta?.current_page ?? search.page;
  const lastPage = auctionListQuery.data?.meta?.last_page ?? 1;
  const total = auctionListQuery.data?.meta?.total ?? 0;
  const correctedPage = auctionListQuery.isSuccess
    ? getAuctionListCorrectedPage(search.page, lastPage, total)
    : null;

  useEffect(() => {
    if (correctedPage !== null) {
      void navigate({
        search: (previous) => ({ ...previous, page: correctedPage }),
        replace: true,
      });
    }
  }, [correctedPage, navigate]);

  const handlePageChange = (page: number): void => {
    void navigate({
      search: (previous) => ({ ...previous, page }),
    });
  };

  const handleOpenDetails = (auctionUuid: string): void => {
    void navigate({
      to: '/auctions/$auctionUuid',
      params: { auctionUuid },
      search: { returnTo: location.href },
    });
  };

  const handlePrimaryAction = (
    auction: TAuctionListItemViewModel,
    action: TAuctionListPrimaryAction,
  ): void => {
    if (auction.auctionUuid === null) {
      return;
    }

    if (action.kind === 'bets') {
      void navigate({
        to: '/auctions/$auctionUuid',
        params: { auctionUuid: auction.auctionUuid },
        search: { returnTo: location.href },
        hash: 'auction-bets',
      });
      return;
    }

    if (action.kind === 'bid') {
      void navigate({
        to: '/auctions/$auctionUuid',
        params: { auctionUuid: auction.auctionUuid },
        search: { mode: 'bid', returnTo: location.href },
      });
    }
  };

  const handleFiltersApply = (filters: TAuctionListFilters): void => {
    void navigate({
      search: (previous) =>
        auctionsListSearchSchema.parse({
          ...previous,
          ...filters,
          page: 1,
        }),
    });
  };

  const handleFiltersReset = (): void => {
    void navigate({
      search: auctionsListSearchSchema.parse({
        page: 1,
        perPage: search.perPage,
      }),
    });
  };

  const content = (() => {
    if (auctionListQuery.isPending) {
      return <AuctionListSkeleton />;
    }

    if (auctionListQuery.isError) {
      return <AuctionListErrorState onRetry={() => void auctionListQuery.refetch()} />;
    }

    if (correctedPage !== null) {
      return <AuctionListSkeleton />;
    }

    if (auctions.length === 0) {
      return <AuctionListEmptyState />;
    }

    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {auctions.map((auction) => (
            <AuctionListCard
              key={auction.auctionUuid ?? auction.auctionId}
              auction={auction}
              onIntent={prefetchAuctionDetail}
              onOpenDetails={handleOpenDetails}
              onPrimaryAction={handlePrimaryAction}
            />
          ))}
        </div>
        <AuctionListPagination
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={handlePageChange}
        />
      </>
    );
  })();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Аукционы</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Управляйте грузовыми аукционами и ставками в одном рабочем пространстве.
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {auctionListQuery.isSuccess
            ? `Найдено: ${auctionListQuery.data.meta?.total ?? 0}`
            : 'Загрузка данных'}
        </Badge>
      </div>

      <AuctionListFiltersPanel
        className="mt-5"
        search={search}
        onApply={handleFiltersApply}
        onReset={handleFiltersReset}
      />

      <section className="mt-6 flex flex-col gap-6" aria-live="polite">
        {content}
      </section>
    </main>
  );
}
