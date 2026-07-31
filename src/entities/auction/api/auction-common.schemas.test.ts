import { describe, expect, it } from 'vitest';
import {
  apiProblemSchema,
  auctionStatusSchema,
  auctionTypeSchema,
  paymentDelayTypeSchema,
  tradingStatusSchema,
  validationProblemSchema,
} from './auction-common.schemas';

describe('auction common contract schemas', () => {
  it('accepts enum values declared by the OpenAPI contract', () => {
    expect(auctionStatusSchema.parse('Auction')).toBe('Auction');
    expect(auctionTypeSchema.parse('FixPrice')).toBe('FixPrice');
    expect(tradingStatusSchema.parse('ChoosingWinner')).toBe('ChoosingWinner');
  });

  it('rejects enum values outside the OpenAPI contract', () => {
    expect(auctionStatusSchema.safeParse('Pending')).toMatchObject({ success: false });
    expect(auctionTypeSchema.safeParse('Reverse')).toMatchObject({ success: false });
  });

  it('accepts the nullable payment delay type', () => {
    expect(paymentDelayTypeSchema.parse(null)).toBeNull();
    expect(paymentDelayTypeSchema.parse('CalendarDays')).toBe('CalendarDays');
  });

  it('accepts a validation problem with nullable optional fields', () => {
    const problem = validationProblemSchema.parse({
      code: 'validation_failed',
      title: 'Ошибка валидации',
      message: 'Запрос содержит некорректные поля.',
      trace_id: null,
      errors: [
        {
          field: 'price',
          message: 'Значение должно быть больше нуля.',
          code: null,
        },
      ],
    });

    expect(problem.errors).toHaveLength(1);
    expect(apiProblemSchema.parse(problem)).toMatchObject({ code: 'validation_failed' });
  });

  it('accepts omitted optional error correlation fields', () => {
    const problem = validationProblemSchema.parse({
      code: 'validation_failed',
      title: 'Ошибка валидации',
      message: 'Запрос содержит некорректные поля.',
      errors: [
        {
          field: 'price',
          message: 'Значение должно быть больше нуля.',
        },
      ],
    });

    expect(problem.trace_id).toBeUndefined();
    expect(problem.errors[0]?.code).toBeUndefined();
  });

  it('rejects a validation problem without required field errors', () => {
    expect(
      validationProblemSchema.safeParse({
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Запрос содержит некорректные поля.',
      }),
    ).toMatchObject({ success: false });
  });
});
