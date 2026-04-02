"use client";

import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
};

/** Hidden field: leave empty; bots often fill it. */
export function HoneypotField<T extends FieldValues>({
  register,
  name,
}: Props<T>) {
  return (
    <input
      type="text"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0"
      {...register(name)}
    />
  );
}
