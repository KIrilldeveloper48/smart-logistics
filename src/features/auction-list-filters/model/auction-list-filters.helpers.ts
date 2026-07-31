export const getOptionalFormString = (formData: FormData, name: string): string | undefined => {
  const value = formData.get(name);

  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
};

export const toOptionalBoolean = (value: unknown): unknown => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
};

export const toOptionalNumber = (value: unknown): unknown => {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  return Number(value);
};

export const toDateInputValue = (value: string | undefined): string => value?.slice(0, 10) ?? '';
