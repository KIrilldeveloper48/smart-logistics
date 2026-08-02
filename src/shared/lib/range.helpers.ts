export const orderRange = <T extends number | string>(
  from: T | undefined,
  to: T | undefined,
): readonly [T | undefined, T | undefined] =>
  from !== undefined && to !== undefined && from > to ? [to, from] : [from, to];
