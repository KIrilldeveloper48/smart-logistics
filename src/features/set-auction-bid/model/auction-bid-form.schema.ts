import { z } from 'zod';
import { isAuctionBidStepValid, isBidPriceDefined } from './auction-bid-form.helpers';
import type { TAuctionBidConstraints } from './auction-bid-form.types';

export const auctionBidFormSchema = z.object({
  price: z
    .number({ error: 'Укажите сумму ставки числом.' })
    .finite('Сумма ставки должна быть конечным числом.')
    .positive('Сумма ставки должна быть больше нуля.'),
});

export const createAuctionBidFormSchema = (constraints: TAuctionBidConstraints) =>
  auctionBidFormSchema.superRefine(({ price }, context) => {
    const { auctionType, canSetBid } = constraints;
    const { available, current, max, min, step } = constraints.price;

    if (!canSetBid) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: 'Установка ставки недоступна для этого аукциона.',
      });
    }

    if (isBidPriceDefined(min) && price < min) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: `Цена не может быть меньше ${min}.`,
      });
    }

    if (isBidPriceDefined(max) && price > max) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: `Цена не может быть больше ${max}.`,
      });
    }

    if (
      auctionType === 'Down' &&
      ((isBidPriceDefined(available) && price > available) ||
        (!isBidPriceDefined(available) && isBidPriceDefined(current) && price >= current))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: isBidPriceDefined(available)
          ? `Цена не может быть больше ${available}.`
          : 'Новая ставка должна быть меньше текущей.',
      });
    }

    if (
      auctionType === 'Up' &&
      ((isBidPriceDefined(available) && price < available) ||
        (!isBidPriceDefined(available) && isBidPriceDefined(current) && price <= current))
    ) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: isBidPriceDefined(available)
          ? `Цена не может быть меньше ${available}.`
          : 'Новая ставка должна быть больше текущей.',
      });
    }

    if (
      (auctionType === 'Request' || auctionType === 'Unknown') &&
      isBidPriceDefined(current) &&
      price === current
    ) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: 'Новая ставка должна отличаться от текущей.',
      });
    }

    const fixedPrice = available ?? current;

    if (auctionType === 'FixPrice' && isBidPriceDefined(fixedPrice) && price !== fixedPrice) {
      context.addIssue({
        code: 'custom',
        path: ['price'],
        message: `Допустима только фиксированная цена ${fixedPrice}.`,
      });
    }

    if (isBidPriceDefined(step) && step > 0) {
      const base = available ?? current ?? min ?? 0;

      if (!isAuctionBidStepValid(price, base, step)) {
        context.addIssue({
          code: 'custom',
          path: ['price'],
          message: `Цена должна соответствовать шагу ${step}.`,
        });
      }
    }
  });
