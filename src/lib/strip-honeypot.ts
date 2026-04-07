export function stripHoneypot<T extends { _gotcha?: string }>(
  data: T,
): Omit<T, "_gotcha"> {
  const rest = { ...data };
  delete rest._gotcha;
  return rest as Omit<T, "_gotcha">;
}
