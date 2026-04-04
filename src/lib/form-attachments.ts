/** Allowed uploads for Contatti / Prenota (keep total request size under typical serverless limits). */
export const FORM_ATTACHMENT_ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export const FORM_ATTACHMENT_MAX_FILES = 5;
/** Per-file cap (bytes). */
export const FORM_ATTACHMENT_MAX_BYTES_PER_FILE = 2 * 1024 * 1024;
/** Total size of all attachments (bytes). */
export const FORM_ATTACHMENT_MAX_TOTAL_BYTES = 4 * 1024 * 1024;

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type FormFilesValidation =
  | { ok: true; files: File[] }
  | { ok: false; error: string };

/** When `File.type` is empty (common on some OS/browsers), infer from extension. */
export function mimeFromFilename(name: string): string | undefined {
  const ext = name.toLowerCase().split(/\.+/).pop() || "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    pdf: "application/pdf",
  };
  return map[ext];
}

export function validateFormAttachmentFiles(files: File[]): FormFilesValidation {
  const list = files.filter((f) => f.size > 0);
  if (list.length === 0) return { ok: true, files: [] };
  if (list.length > FORM_ATTACHMENT_MAX_FILES) {
    return { ok: false, error: "too_many" };
  }
  let total = 0;
  for (const f of list) {
    if (f.size > FORM_ATTACHMENT_MAX_BYTES_PER_FILE) {
      return { ok: false, error: "file_too_large" };
    }
    const t = f.type || mimeFromFilename(f.name) || "";
    if (!FORM_ATTACHMENT_ALLOWED_TYPES.has(t)) {
      return { ok: false, error: "invalid_type" };
    }
    total += f.size;
  }
  if (total > FORM_ATTACHMENT_MAX_TOTAL_BYTES) {
    return { ok: false, error: "total_too_large" };
  }
  return { ok: true, files: list };
}

export async function filesToEmailAttachments(
  files: File[],
): Promise<EmailAttachment[]> {
  const out: EmailAttachment[] = [];
  for (const f of files) {
    const buf = Buffer.from(await f.arrayBuffer());
    const name = f.name?.trim() || "allegato";
    out.push({
      filename: name.replace(/[^\w.\- ()\[\]]+/g, "_").slice(0, 180) || "file",
      content: buf,
      contentType: f.type || undefined,
    });
  }
  return out;
}
