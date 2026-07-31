import { HttpResponse, type DefaultBodyType } from 'msw';
import {
  problemDetailSchema,
  validationProblemSchema,
} from '../../auction-common/auction-common.schemas';
import type { TValidationProblem } from '../../auction-common/auction-common.types';

export const validationResponse = (
  errors: Readonly<TValidationProblem['errors']>,
): HttpResponse<DefaultBodyType> =>
  HttpResponse.json(
    validationProblemSchema.parse({
      code: 'validation_failed',
      title: 'Ошибка валидации',
      message: 'Параметры запроса содержат некорректные значения.',
      errors,
    }),
    { status: 422 },
  );

export const notFoundResponse = (uuid: string): HttpResponse<DefaultBodyType> =>
  HttpResponse.json(
    problemDetailSchema.parse({
      code: 'auction_not_found',
      title: 'Аукцион не найден',
      message: `Аукцион ${uuid} не существует.`,
    }),
    { status: 404 },
  );
