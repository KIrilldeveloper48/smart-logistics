import { setupWorker } from 'msw/browser';
import { auctionBidHandler, auctionReadHandlers } from '@/entities/auction';

export const mswBrowserWorker = setupWorker(...auctionReadHandlers, auctionBidHandler);
