import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuctionApiError, auctionClient, toAuctionDetailViewModel } from '@/entities/auction';
import { auctionMockStore } from '@/entities/auction/api/mocks';
import { AuctionBidForm } from './auction-bid-form.component';

const auctionUuid = '550e8400-e29b-41d4-a716-446655440001';

const getAuction = () => {
  const record = auctionMockStore.getAuctionByUuid(auctionUuid);

  if (record === null) {
    throw new Error('Expected the bid-enabled auction fixture.');
  }

  return toAuctionDetailViewModel(record.detail);
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('AuctionBidForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    auctionMockStore.reset();
  });

  it('does not open when setting a bid is unavailable', () => {
    render(
      <AuctionBidForm
        auction={{ ...getAuction(), canSetBid: false }}
        isOpen
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows a 422 price error next to the field', async () => {
    vi.spyOn(auctionClient, 'placeBid').mockRejectedValue(
      new AuctionApiError('Validation failed.', {
        kind: 'http',
        status: 422,
        problem: {
          code: 'validation_failed',
          title: 'Validation failed',
          message: 'Некорректная ставка.',
          errors: [{ field: 'price', message: 'Цена не соответствует шагу ставки.' }],
        },
      }),
    );
    const onError = vi.fn();

    render(
      <AuctionBidForm
        auction={getAuction()}
        isOpen
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={onError}
      />,
      { wrapper: createWrapper() },
    );

    fireEvent.submit(screen.getByRole('spinbutton').closest('form')!);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Цена не соответствует шагу ставки.',
    );
    expect(onError).not.toHaveBeenCalled();
  });

  it('sends a general API error to the toast callback', async () => {
    vi.spyOn(auctionClient, 'placeBid').mockRejectedValue(
      new AuctionApiError('Service unavailable.', {
        kind: 'http',
        status: 503,
        problem: null,
      }),
    );
    const onError = vi.fn();

    render(
      <AuctionBidForm
        auction={getAuction()}
        isOpen
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={onError}
      />,
      { wrapper: createWrapper() },
    );

    fireEvent.submit(screen.getByRole('spinbutton').closest('form')!);

    await waitFor(() => expect(onError).toHaveBeenCalledWith('Service unavailable.'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('resets the field when refreshed auction constraints arrive', async () => {
    const auction = getAuction();
    const { rerender } = render(
      <AuctionBidForm
        auction={auction}
        isOpen
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
      { wrapper: createWrapper() },
    );
    const input = screen.getByRole<HTMLInputElement>('spinbutton');

    rerender(
      <AuctionBidForm
        auction={{ ...auction, price: { ...auction.price, available: 27_500 } }}
        isOpen
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
    );

    await waitFor(() => expect(input).toHaveValue(27_500));
  });
});
