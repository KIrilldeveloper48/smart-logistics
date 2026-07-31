import type { TValidationError } from '../../auction-common/auction-common.types';
import type { TBetItem } from '../../auction-detail/auction-detail.types';
import type { TPlaceBidInput } from './auction-bid.types';
import type { TAuctionMockRecord } from '../auction-mock-store/auction-mock-store.types';

const BID_STEP_TOLERANCE = 1e-8;

const isDefined = (value: number | null | undefined): value is number =>
  value !== null && value !== undefined;

const isBidStepValid = (price: number, base: number, step: number): boolean => {
  const steps = (price - base) / step;

  return Math.abs(steps - Math.round(steps)) <= BID_STEP_TOLERANCE;
};

const roundMoney = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const toPriceWithoutVat = (price: number, vatRate: number): number =>
  roundMoney(price / (1 + vatRate / 100));

const toNextAvailablePrice = (
  price: number,
  auctionType: TAuctionMockRecord['detail']['main']['auc_type'],
  step: number | null | undefined,
  min: number | null | undefined,
  max: number | null | undefined,
): number => {
  if (!isDefined(step)) {
    return price;
  }

  if (step <= 0) {
    throw new Error('Auction bid step must be greater than zero.');
  }

  if (auctionType === 'Down') {
    return isDefined(min) ? Math.max(min, price - step) : price - step;
  }

  if (auctionType === 'Up') {
    return isDefined(max) ? Math.min(max, price + step) : price + step;
  }

  return price;
};

export const validateBid = (
  auction: TAuctionMockRecord,
  price: number,
): readonly TValidationError[] => {
  const { trading } = auction.detail;
  const constraints = trading.price;
  const errors: TValidationError[] = [];

  if (trading.status !== 'Auction' || !trading.can_set_bet) {
    return [
      {
        field: 'price',
        message: 'Установка ставки недоступна для этого аукциона.',
      },
    ];
  }

  if (!Number.isFinite(price) || price <= 0) {
    return [{ field: 'price', message: 'Цена должна быть конечным числом больше нуля.' }];
  }

  if (isDefined(constraints?.min) && price < constraints.min) {
    errors.push({ field: 'price', message: `Цена не может быть меньше ${constraints.min}.` });
  }

  if (isDefined(constraints?.max) && price > constraints.max) {
    errors.push({ field: 'price', message: `Цена не может быть больше ${constraints.max}.` });
  }

  const available = constraints?.available;
  const auctionType = auction.detail.main.auc_type;

  const current = constraints?.current;

  if (
    auctionType === 'Down' &&
    ((isDefined(available) && price > available) ||
      (!isDefined(available) && isDefined(current) && price >= current))
  ) {
    errors.push({
      field: 'price',
      message: isDefined(available)
        ? `Цена не может быть больше ${available}.`
        : 'Новая ставка должна быть меньше текущей.',
    });
  }

  if (
    auctionType === 'Up' &&
    ((isDefined(available) && price < available) ||
      (!isDefined(available) && isDefined(current) && price <= current))
  ) {
    errors.push({
      field: 'price',
      message: isDefined(available)
        ? `Цена не может быть меньше ${available}.`
        : 'Новая ставка должна быть больше текущей.',
    });
  }

  if (
    (auctionType === 'Request' || auctionType === 'Unknown') &&
    isDefined(current) &&
    price === current
  ) {
    errors.push({ field: 'price', message: 'Новая ставка должна отличаться от текущей.' });
  }

  if (
    auctionType === 'FixPrice' &&
    isDefined(available ?? current) &&
    price !== (available ?? current)
  ) {
    errors.push({
      field: 'price',
      message: `Допустима только фиксированная цена ${available ?? current}.`,
    });
  }

  const step = constraints?.step;

  if (isDefined(step)) {
    if (step <= 0) {
      throw new Error('Auction bid step must be greater than zero.');
    }

    const base = constraints?.available ?? constraints?.current ?? constraints?.min ?? 0;

    if (!isBidStepValid(price, base, step)) {
      errors.push({ field: 'price', message: `Цена должна соответствовать шагу ${step}.` });
    }
  }

  return errors;
};

const compareBets = (
  left: TBetItem,
  right: TBetItem,
  auctionType: TAuctionMockRecord['detail']['main']['auc_type'],
): number => {
  const leftPrice = left.price_with_vat;
  const rightPrice = right.price_with_vat;

  if (leftPrice == null) return 1;
  if (rightPrice == null) return -1;

  const priceComparison = leftPrice - rightPrice;

  if (priceComparison !== 0) {
    return auctionType === 'Up' ? -priceComparison : priceComparison;
  }

  const dateComparison = (left.created_at ?? '').localeCompare(right.created_at ?? '');

  return dateComparison || (left.id ?? 0) - (right.id ?? 0);
};

const rankBets = (
  bets: readonly TBetItem[],
  auctionType: TAuctionMockRecord['detail']['main']['auc_type'],
): TBetItem[] => {
  const active = bets
    .filter((bet) => !bet.is_rejected)
    .sort((left, right) => compareBets(left, right, auctionType))
    .map((bet, index) => ({ ...bet, place: index + 1, is_win: false }));
  const rejected = bets
    .filter((bet) => bet.is_rejected)
    .map((bet) => ({ ...bet, place: null, is_win: false }));

  return [...active, ...rejected];
};

export const applyBidToAuction = (
  auction: TAuctionMockRecord,
  input: TPlaceBidInput,
): TAuctionMockRecord => {
  const { bidder, price } = input;
  const priceWithoutVat = toPriceWithoutVat(price, bidder.vatRate);
  const nextBetId = Math.max(0, ...auction.bets.bets.map((bet) => bet.id ?? 0)) + 1;
  const previousBets = auction.bets.bets.map((bet) =>
    !bet.is_rejected && bet.organization_id === bidder.organizationId
      ? { ...bet, is_rejected: true, place: null, cancel_reason: 'Ставка заменена новой' }
      : bet,
  );
  const newBet: TBetItem = {
    id: nextBetId,
    created_at: input.createdAt,
    auction_id: auction.detail.main.id,
    subscriber_id: bidder.subscriberId,
    contact_name: bidder.contactName,
    contact_phone: bidder.contactPhone,
    price_with_vat: price,
    price_no_vat: priceWithoutVat,
    organization_id: bidder.organizationId,
    organization_inn: bidder.organizationInn,
    organization_name: bidder.organizationName,
    is_rejected: false,
    is_counter: false,
    place: null,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    price_info: {
      price_with_vat: price,
      price_no_vat: priceWithoutVat,
      payment_type: auction.detail.payment.form,
      vat_rate: String(bidder.vatRate),
    },
  };
  const bets = rankBets([newBet, ...previousBets], auction.detail.main.auc_type);
  const newBetPlace = bets.find((bet) => bet.id === nextBetId)?.place;
  const winningBet = bets.find((bet) => bet.place === 1);
  const currentPrice = winningBet?.price_with_vat ?? price;
  const currentPriceWithoutVat = winningBet?.price_no_vat ?? priceWithoutVat;
  const status = newBetPlace === 1 ? 'Leading' : 'Losing';
  const constraints = auction.detail.trading.price;
  const available = toNextAvailablePrice(
    currentPrice,
    auction.detail.main.auc_type,
    constraints?.step,
    constraints?.min,
    constraints?.max,
  );

  return {
    ...auction,
    listItem: {
      ...auction.listItem,
      trading: {
        ...auction.listItem.trading,
        status_mobile: status,
        is_bidder: true,
        your: { ...auction.listItem.trading?.your, bet: true, last_bet: price },
        price: {
          ...auction.listItem.trading?.price,
          current: currentPrice,
          current_no_vat: currentPriceWithoutVat,
        },
      },
    },
    detail: {
      ...auction.detail,
      trading: {
        ...auction.detail.trading,
        status_mobile: status,
        is_bidder: true,
        your: {
          ...auction.detail.trading.your,
          bet: true,
          last_bet: priceWithoutVat,
          last_bet_with_vat: price,
          win: false,
        },
        price: {
          ...constraints,
          current: currentPrice,
          current_no_vat: currentPriceWithoutVat,
          available,
          available_no_vat: toPriceWithoutVat(available, bidder.vatRate),
        },
      },
    },
    bets: { bets },
  };
};
