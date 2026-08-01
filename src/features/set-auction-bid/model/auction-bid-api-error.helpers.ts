import { AuctionApiError } from '@/entities/auction';

export const getAuctionBidApiErrorMessage = (error: unknown): string => {
  if (!(error instanceof AuctionApiError)) {
    return 'Не удалось отправить ставку. Повторите попытку.';
  }

  const { problem, status } = error.context;

  if (status === 422 && problem && 'errors' in problem) {
    return problem.errors.find((item) => item.field === 'price')?.message ?? problem.message;
  }

  return problem?.message ?? error.message;
};
