"use client";

import { X } from "lucide-react";
import {
  FORM_ATTACHMENT_MAX_FILES,
  validateFormAttachmentFiles,
} from "@/lib/form-attachments";

export type AttachmentItem = { id: string; file: File };

function newAttachmentId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

type Props = {
  items: AttachmentItem[];
  onItemsChange: (items: AttachmentItem[]) => void;
  chooseLabel: string;
  onInvalid: (code: string) => void;
  removeAriaLabel: (fileName: string) => string;
  accept?: string;
  inputId: string;
};

/**
 * Hidden file input + label-styled control (native label → file dialog; no programmatic click).
 * Multiple selections merge into state; each file row has a remove control.
 */
export function FormAttachmentPicker({
  items,
  onItemsChange,
  chooseLabel,
  onInvalid,
  removeAriaLabel,
  accept = "image/jpeg,image/png,image/webp,image/gif,application/pdf",
  inputId,
}: Props) {
  const atMax = items.length >= FORM_ATTACHMENT_MAX_FILES;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list?.length) return;
    /** Copy before resetting input: `FileList` is live; clearing value empties it. */
    const incoming = Array.from(list);
    e.target.value = "";
    const combined = [...items.map((i) => i.file), ...incoming];
    const v = validateFormAttachmentFiles(combined);
    if (!v.ok) {
      onInvalid(v.error);
      return;
    }

    onItemsChange([
      ...items,
      ...incoming.map((file) => ({ id: newAttachmentId(), file })),
    ]);
  }

  function remove(id: string) {
    onItemsChange(items.filter((i) => i.id !== id));
  }

  return (
    <div className="relative mt-2 space-y-2">
      {/* sr-only: visually hidden; avoid `hidden` (display:none) for file inputs. */}
      <input
        id={inputId}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        onChange={handleInputChange}
      />
      {atMax ? (
        <span className="inline-flex shrink-0 cursor-not-allowed items-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/50">
          {chooseLabel}
        </span>
      ) : (
        <label
          htmlFor={inputId}
          className="inline-flex shrink-0 cursor-pointer items-center rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15"
        >
          {chooseLabel}
        </label>
      )}

      {items.length > 0 ? (
        <ul className="space-y-1.5" aria-live="polite">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-2 py-1.5"
            >
              <span
                className="min-w-0 flex-1 truncate text-sm text-zinc-300"
                title={item.file.name}
              >
                {item.file.name}
              </span>
              <button
                type="button"
                className="inline-flex shrink-0 cursor-pointer rounded-md p-1 text-zinc-500 transition hover:bg-white/10 hover:text-red-400"
                aria-label={removeAriaLabel(item.file.name)}
                onClick={() => remove(item.id)}
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
