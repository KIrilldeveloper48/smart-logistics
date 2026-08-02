import { setupWorker } from 'msw/browser';
import { auctionBidHandler, auctionReadHandlers } from '@/entities/auction/api/mocks';

export const mswBrowserWorker = setupWorker(...auctionReadHandlers, auctionBidHandler);
