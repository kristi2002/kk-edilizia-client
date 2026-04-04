"use client";

import { useEffect } from "react";
import type {
  UseFormRegister,
  UseFormSetValue,
  FieldValues,
  Path,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
};

/**
 * Hidden field: must stay empty (bots often fill it).
 * Autofill/extensions sometimes write into hidden inputs — we clear shortly after
 * mount so real users are not blocked; simple bots still fill later and fail.
 */
export function HoneypotField<T extends FieldValues>({
  register,
  setValue,
  name,
}: Props<T>) {
  useEffect(() => {
    const clear = () => {
      setValue(name, "" as never, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    };
    clear();
    const timeouts = [50, 300, 1000].map((ms) => setTimeout(clear, ms));
    return () => timeouts.forEach(clearTimeout);
  }, [setValue, name]);

  return (
    <input
      type="text"
      tabIndex={-1}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      aria-hidden="true"
      data-1p-ignore
      data-lpignore="true"
      data-form-type="other"
      className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0"
      suppressHydrationWarning
      {...register(name)}
      readOnly
    />
  );
}
