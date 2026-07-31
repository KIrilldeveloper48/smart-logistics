import type { z } from 'zod';
import { apiProblemSchema } from '../auction-common/auction-common.schemas';
import { AuctionApiError } from './auction-api-error';

const toResponsePayload = async (response: Response): Promise<unknown> =>
  response.json().catch(() => null);

const toApiError = (status: number, payload: unknown): AuctionApiError => {
  const problem = apiProblemSchema.safeParse(payload);

  return new AuctionApiError(
    problem.success ? problem.data.message : `API request failed with status ${status}.`,
    {
      kind: 'http',
      status,
      problem: problem.success ? problem.data : null,
    },
  );
};

const fetchResponse = async (
  fetcher: typeof fetch,
  url: string,
  init: RequestInit,
): Promise<Response> => {
  try {
    return await fetcher(url, init);
  } catch {
    throw new AuctionApiError('Network request failed.', {
      kind: 'network',
      status: null,
      problem: null,
    });
  }
};

export const toApiUrl = (baseUrl: string, path: string): string =>
  baseUrl ? `${baseUrl.replace(/\/$/, '')}${path}` : path;

export const requestJson = async <TResponse>(
  fetcher: typeof fetch,
  url: string,
  init: RequestInit,
  schema: z.ZodType<TResponse>,
): Promise<TResponse> => {
  const response = await fetchResponse(fetcher, url, init);
  const payload = await toResponsePayload(response);

  if (!response.ok) {
    throw toApiError(response.status, payload);
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new AuctionApiError('API response does not match the contract.', {
      kind: 'contract',
      status: response.status,
      problem: null,
    });
  }

  return result.data;
};

export const requestEmpty = async (
  fetcher: typeof fetch,
  url: string,
  init: RequestInit,
): Promise<void> => {
  const response = await fetchResponse(fetcher, url, init);

  if (!response.ok) {
    throw toApiError(response.status, await toResponsePayload(response));
  }
};
