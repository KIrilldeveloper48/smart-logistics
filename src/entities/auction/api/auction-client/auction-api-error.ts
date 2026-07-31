import type { TAuctionApiErrorContext } from './auction-client.types';

export class AuctionApiError extends Error {
  readonly context: TAuctionApiErrorContext;

  constructor(message: string, context: TAuctionApiErrorContext) {
    super(message);
    this.name = 'AuctionApiError';
    this.context = context;
  }
}
