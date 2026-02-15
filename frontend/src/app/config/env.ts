const DEFAULT_PAGE_SIZE = 10;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const appEnv = {
  defaultPageSize: parsePositiveInt(
    import.meta.env.VITE_DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZE,
  ),
};
