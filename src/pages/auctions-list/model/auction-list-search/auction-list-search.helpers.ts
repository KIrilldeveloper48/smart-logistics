const toArray = (value: unknown): unknown[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
};

export const toSearchBoolean = (value: unknown): unknown => {
  if (value === true || value === false) {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
};

export const toSearchNumber = (value: unknown): unknown => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }

  return value;
};

export const toSearchNumberArray = (value: unknown): unknown => toArray(value)?.map(toSearchNumber);

export const toSearchStringArray = (value: unknown): unknown => toArray(value);
