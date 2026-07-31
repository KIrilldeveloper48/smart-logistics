import { HttpResponse, http, type DefaultBodyType } from 'msw';
import {
  problemDetailSchema,
  type TAuctionStatus,
  type TTradingStatus,
  type TValidationProblem,
  validationProblemSchema,
} from '../auction-common.schemas';
import {
  auctionDetailResponseSchema,
  auctionUuidSchema,
  betListResponseSchema,
  listBetsSearchSchema,
  type TListBetsSearch,
} from '../auction-detail.schemas';
import {
  auctionListRequestSchema,
  auctionListResponseSchema,
  type TAuctionListItem,
  type TAuctionListRequest,
} from '../auction-list.schemas';
import { auctionMockStore, type TAuctionMockRecord } from './auction-mock-store';

// OpenAPI принимает часть статусов как числа. Таблицы связывают эти legacy-значения
// с enum'ами DTO, чтобы один store поддерживал оба вида фильтра.
const auctionStatusCodes: Readonly<Record<TAuctionStatus, number>> = {
  Planning: 1,
  Auction: 2,
  DeterminateWinner: 3,
  WaitDeal: 4,
  InProgress: 5,
  Finished: 6,
  Stopped: 7,
  Canceled: 8,
  Unknown: 0,
};

// Числовые статусы пользователя используются отдельным параметром mobile_statuses.
const tradingStatusCodes: Readonly<Record<TTradingStatus, number>> = {
  NotParticipating: 1,
  Leading: 2,
  Losing: 3,
  OnPending: 4,
  Confirmed: 5,
  ChoosingWinner: 6,
  Winner: 7,
  Accepted: 8,
  Unknown: 0,
};

// Все ошибки валидации мока имеют тот же формат 422, что описан в OpenAPI.
const toValidationProblem = (errors: TValidationProblem['errors']): TValidationProblem =>
  validationProblemSchema.parse({
    code: 'validation_failed',
    title: 'Ошибка валидации',
    message: 'Параметры запроса содержат некорректные значения.',
    errors,
  });

// Преобразует ошибки Zod в готовый HTTP-ответ, не раскрывая внутренние детали MSW.
const validationResponse = (errors: TValidationProblem['errors']): HttpResponse<DefaultBodyType> =>
  HttpResponse.json(toValidationProblem(errors), { status: 422 });

// Detail и bets endpoint'ы используют одинаковый контракт ошибки для неизвестного UUID.
const notFoundResponse = (uuid: string): HttpResponse<DefaultBodyType> =>
  HttpResponse.json(
    problemDetailSchema.parse({
      code: 'auction_not_found',
      title: 'Аукцион не найден',
      message: `Аукцион ${uuid} не существует.`,
    }),
    { status: 404 },
  );

// Небольшие предикаты удерживают основную функцию фильтрации линейной и читаемой.
const hasText = (value: string | undefined, search: string | undefined): boolean =>
  !search || Boolean(value?.toLocaleLowerCase().includes(search.toLocaleLowerCase()));

const isWithinRange = (
  value: number | undefined | null,
  from: number | undefined | null,
  to: number | undefined | null,
): boolean =>
  (from === undefined ||
    from === null ||
    (value !== undefined && value !== null && value >= from)) &&
  (to === undefined || to === null || (value !== undefined && value !== null && value <= to));

const isWithinDateRange = (
  value: string | undefined,
  from: string | undefined,
  to: string | undefined,
): boolean =>
  (!from || (value !== undefined && value >= from)) &&
  (!to || (value !== undefined && value <= to));

// Применяет поддерживаемые фильтры запроса к одной карточке аукциона.
// Неуказанный фильтр всегда пропускает запись, а указанный требует совпадения.
const matchesRequest = (auction: TAuctionMockRecord, request: TAuctionListRequest): boolean => {
  const { listItem } = auction;
  const { main, cargo, organizer, payment, route, trading } = listItem;

  return (
    hasText(main?.cargo_num, request.cargo_num) &&
    hasText(organizer?.organization_name, request.customer) &&
    hasText(organizer?.organization_inn, request.customer) &&
    (!request.status || request.status.includes(trading?.status_mobile ?? 'Unknown')) &&
    (!request.mobile_statuses ||
      request.mobile_statuses.includes(tradingStatusCodes[trading?.status_mobile ?? 'Unknown'])) &&
    (!request.statuses ||
      request.statuses.includes(auctionStatusCodes[trading?.status ?? 'Unknown'])) &&
    (!request.auc_type ||
      (main?.auc_type !== undefined &&
        main.auc_type !== 'Unknown' &&
        request.auc_type.includes(main.auc_type))) &&
    (!request.body_types || request.body_types.includes(cargo?.body_type ?? '')) &&
    (request.form_type === undefined || request.form_type === payment?.form) &&
    (request.is_international_shipment === undefined ||
      request.is_international_shipment === cargo?.is_international) &&
    hasText(route?.load?.city, request.load_city) &&
    hasText(route?.unload?.city, request.unload_city) &&
    isWithinRange(cargo?.weight, request.weight_from, request.weight_to) &&
    isWithinRange(cargo?.volume, request.volume_from, request.volume_to) &&
    isWithinDateRange(route?.load?.date, request.load_date_from, request.load_date_to) &&
    isWithinDateRange(route?.unload?.date, request.unload_date_from, request.unload_date_to) &&
    isWithinDateRange(trading?.start_time, request.start_time_from, request.start_time_to) &&
    isWithinDateRange(trading?.stop_time, request.stop_time_from, request.stop_time_to) &&
    (request.is_available === undefined || request.is_available === trading?.is_available) &&
    (request.is_bidder === undefined || request.is_bidder === trading?.is_bidder) &&
    (!request.auction_ids || request.auction_ids.includes(main?.id ?? -1)) &&
    (!request.customer_ids || request.customer_ids.includes(organizer?.organization_id ?? -1)) &&
    isWithinRange(trading?.price?.current, request.current_price_from, request.current_price_to) &&
    isWithinRange(main?.price_per_km, request.price_per_km_from, request.price_per_km_to)
  );
};

// Не каждый ключ sort из OpenAPI нужен текущему UI. Неизвестный ключ остаётся
// нейтральным, чтобы mock не придумывал поведение, которого нет в приложении.
const sortValue = (auction: TAuctionListItem, field: string): number | string | null => {
  switch (field) {
    case 'start_time':
      return auction.trading?.start_time ?? null;
    case 'price_per_km':
      return auction.main?.price_per_km ?? null;
    case 'current_price':
      return auction.trading?.price?.current ?? null;
    default:
      return null;
  }
};

// null переносим в конец списка независимо от направления сортировки.
const compareValues = (left: number | string | null, right: number | string | null): number => {
  if (left === right) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  return left > right ? 1 : -1;
};

// Сортируем копию, не изменяя массив, полученный из store.
// is_oldest задаёт порядок по времени, если явный sort не передан.
const sortAuctions = (
  auctions: readonly TAuctionMockRecord[],
  request: TAuctionListRequest,
): TAuctionMockRecord[] => {
  const sortEntries = Object.entries(request.sort ?? {});

  if (sortEntries.length === 0 && request.is_oldest === undefined) {
    return [...auctions];
  }

  return [...auctions].sort((left, right) => {
    if (sortEntries.length === 0) {
      return (
        compareValues(
          left.listItem.trading?.start_time ?? null,
          right.listItem.trading?.start_time ?? null,
        ) * (request.is_oldest ? 1 : -1)
      );
    }

    for (const [field, direction] of sortEntries) {
      const comparison = compareValues(
        sortValue(left.listItem, field),
        sortValue(right.listItem, field),
      );

      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }
    }

    return 0;
  });
};

// Собирает ответ /auctions/list: фильтрация → сортировка → пагинация →
// финальная Zod-проверка данных и meta перед отправкой клиенту.
const listAuctions = (request: TAuctionListRequest) => {
  const matchedAuctions = auctionMockStore
    .getAuctions()
    .filter((auction) => matchesRequest(auction, request));
  const auctions = sortAuctions(matchedAuctions, request);
  const page = Math.max(1, request.page ?? 1);
  const perPage = Math.max(1, request.per_page ?? 20);
  const total = auctions.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const startIndex = (page - 1) * perPage;
  const data = auctions.slice(startIndex, startIndex + perPage).map((auction) => auction.listItem);

  return auctionListResponseSchema.parse({
    data,
    meta: {
      current_page: page,
      from: data.length > 0 ? startIndex + 1 : 0,
      last_page: lastPage,
      per_page: perPage,
      to: data.length > 0 ? startIndex + data.length : 0,
      total,
    },
  });
};

// Разбирает JSON body POST-запроса. Некорректный payload сразу превращается в 422.
const parseListRequest = async (
  request: Request,
): Promise<TAuctionListRequest | HttpResponse<DefaultBodyType>> => {
  const payload = await request.json().catch(() => ({}));
  const result = auctionListRequestSchema.safeParse(payload);

  if (result.success) {
    return result.data;
  }

  return validationResponse(
    result.error.issues.map((issue) => ({
      field: issue.path.join('.') || 'request',
      message: issue.message,
    })),
  );
};

// URL query всегда строковый, поэтому явно преобразуем all в boolean до проверки Zod.
const parseBetsSearch = (request: Request): TListBetsSearch | HttpResponse<DefaultBodyType> => {
  const all = new URL(request.url).searchParams.get('all');
  const value = all === null ? undefined : all === 'true' ? true : all === 'false' ? false : all;
  const result = listBetsSearchSchema.safeParse({ all: value });

  if (result.success) {
    return result.data;
  }

  return validationResponse(
    result.error.issues.map((issue) => ({
      field: issue.path.join('.') || 'all',
      message: issue.message,
    })),
  );
};

// Обработчики используют wildcard origin: те же endpoint'ы работают и в node-тестах,
// и в browser worker Vite, где origin различается.
export const auctionReadHandlers = [
  // POST /auctions/list — валидирует фильтры и возвращает страницу карточек.
  http.post('*/auctions/list', async ({ request }) => {
    const payload = await parseListRequest(request);

    return payload instanceof HttpResponse ? payload : HttpResponse.json(listAuctions(payload));
  }),
  // GET /auctions/:auctionUuid — возвращает detail или контрактный 404.
  http.get('*/auctions/:auctionUuid', ({ params }) => {
    const uuid = String(params['auctionUuid']);

    if (!auctionUuidSchema.safeParse(uuid).success) {
      return notFoundResponse(uuid);
    }

    const auction = auctionMockStore.getAuctionByUuid(uuid);

    return auction
      ? HttpResponse.json(auctionDetailResponseSchema.parse(auction.detail))
      : notFoundResponse(uuid);
  }),
  // GET /auctions/:auctionUuid/bets — скрывает историю по DTO-флагу и включает
  // отменённые ставки только при ?all=true.
  http.get('*/auctions/:auctionUuid/bets', ({ params, request }) => {
    const uuid = String(params['auctionUuid']);

    if (!auctionUuidSchema.safeParse(uuid).success) {
      return notFoundResponse(uuid);
    }

    const search = parseBetsSearch(request);

    if (search instanceof HttpResponse) {
      return search;
    }

    const auction = auctionMockStore.getAuctionByUuid(uuid);

    if (!auction) {
      return notFoundResponse(uuid);
    }

    const isHistoryHidden =
      auction.detail.hide_bets_history ?? auction.detail.trading.hide_bets_history;
    const bets = isHistoryHidden
      ? []
      : auction.bets.bets.filter((bet) => search.all === true || !bet.is_rejected);

    return HttpResponse.json(betListResponseSchema.parse({ bets }));
  }),
] as const;
