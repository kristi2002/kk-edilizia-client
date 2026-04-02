export function stripHoneypot<T extends { _gotcha?: string }>(
  data: T,
): Omit<T, "_gotcha"> {
  const { _gotcha: _, ...rest } = data;
  return rest;
}
