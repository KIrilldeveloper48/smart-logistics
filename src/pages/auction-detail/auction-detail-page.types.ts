import type { TToastVariant } from '@/shared/ui';

export type TAuctionDetailNotification = Readonly<{
  message: string;
  variant: TToastVariant;
}>;
