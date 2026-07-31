export const toStartOfDay = (date: string | undefined): string | undefined =>
  date ? `${date}T00:00:00Z` : undefined;

export const toEndOfDay = (date: string | undefined): string | undefined =>
  date ? `${date}T23:59:59Z` : undefined;
