export const createUrl = (base: string, params?: Record<string, string>) => {
  if (!params) return base;
  const searchParams = new URLSearchParams(params);
  return `${base}?${searchParams.toString()}`;
};