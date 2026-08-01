import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { auctionClient, auctionQueryKeys } from '@/entities/auction';
import { useSetAuctionBidMutation } from './auction-bid-mutation';

const auctionUuid = '550e8400-e29b-41d4-a716-446655440001';

const createQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

describe('useSetAuctionBidMutation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('invalidates list, detail and bets cache after a successful bid', async () => {
    const queryClient = createQueryClient();
    const listKey = auctionQueryKeys.list({ page: 1 });
    const detailKey = auctionQueryKeys.detail(auctionUuid);
    const betsKey = auctionQueryKeys.bets(auctionUuid, { all: true });
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const placeBid = vi.spyOn(auctionClient, 'placeBid').mockResolvedValue(undefined);

    queryClient.setQueryData(listKey, {});
    queryClient.setQueryData(detailKey, {});
    queryClient.setQueryData(betsKey, {});

    const { result } = renderHook(() => useSetAuctionBidMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ auctionUuid, price: 28_500 });
    });

    expect(placeBid).toHaveBeenCalledWith(auctionUuid, { price: 28_500 });
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(true);
    expect(queryClient.getQueryState(betsKey)?.isInvalidated).toBe(true);
  });
});
