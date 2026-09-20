"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, UploadCloud, X } from "lucide-react";
import { formatFileSize, PreviewItem, PreviewThumbnail, PreviewViewer } from "./AttachmentGallery";
import { attachmentProblem, UPDATE_ATTACHMENT_ACCEPT, UploadError } from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";

export type UploadPhase = "idle" | "uploading" | "failed";

export interface RejectedFile {
  name: string;
  reason: string;
}

function useHindi() {
  const { language } = useLanguage();
  return language === "Hindi";
}

/**
 * Files picked for upload. Each pick is checked right away, so a file that can't be attached is
 * reported with its reason instead of silently disappearing or failing only after uploading.
 */
export function useStagedFiles(maxFiles: number) {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);

  const add = (picked: FileList | null) => {
    if (!picked || picked.length === 0) return;

    const next = [...files];
    const refused: RejectedFile[] = [];

    for (const file of Array.from(picked)) {
      if (
        next.some(
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
        )
      ) {
        refused.push({
          name: file.name,
          reason: "Already selected.",
        });
        continue;
      }

      const problem = attachmentProblem(file);

      if (problem) {
        refused.push({
          name: file.name,
          reason: problem,
        });
        continue;
      }

      if (next.length >= maxFiles) {
        refused.push({
          name: file.name,
          reason: `Only ${maxFiles} file${maxFiles === 1 ? "" : "s"} can be added here.`,
        });
        continue;
      }

      next.push(file);
    }

    setFiles(next);
    setRejected(refused);
  };

  return {
    files,
    rejected,
    add,
    remove: (index: number) =>
      setFiles((prev) => prev.filter((_, i) => i !== index)),
    clear: () => {
      setFiles([]);
      setRejected([]);
    },
    dismissRejected: () => setRejected([]),
  };
}

/** blob: URLs for local previews, released again when the files change or the component goes away. */
function useObjectUrls(files: File[]) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const created = files.map((file) => URL.createObjectURL(file));

    const timer = window.setTimeout(() => setUrls(created), 0);

    return () => {
      window.clearTimeout(timer);
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  return urls;
}

export function FilePickerButton({
  label,
  disabled,
  onPick,
  className,
}: {
  label: string;
  disabled?: boolean;
  onPick: (files: FileList | null) => void;
  className: string;
}) {
  return (
    <label
      className={`${className} ${
        disabled ? "pointer-events-none opacity-40" : "cursor-pointer"
      }`}
    >
      <UploadCloud size={15} />
      {label}

      <input
        type="file"
        multiple
        accept={UPDATE_ATTACHMENT_ACCEPT}
        disabled={disabled}
        onChange={(e) => {
          onPick(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
    </label>
  );
}

/** Preview grid of files waiting to be uploaded, with each file's upload status. */
export function StagedFilesGrid({
  files,
  phase,
  failedFileName,
  onRemove,
}: {
  files: File[];
  phase: UploadPhase;
  failedFileName: string | null;
  onRemove: (index: number) => void;
}) {
  const hindi = useHindi();
  const urls = useObjectUrls(files);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (files.length === 0) return null;

  const items: PreviewItem[] = files.map((file, index) => ({
    name: file.name,
    contentType: file.type,
    size: file.size,
    src: urls[index] ?? "",
  }));

  const uploading = phase === "uploading";

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item, index) => {
          const isCulprit =
            phase === "failed" && failedFileName === item.name;

          const status = uploading
            ? {
                label: hindi ? "अपलोड हो रहा है..." : "Uploading...",
                className: "bg-blue-50 text-blue-700",
                icon: <Loader2 size={11} className="animate-spin" />,
              }
            : isCulprit
              ? {
                  label: hindi ? "अस्वीकृत" : "Rejected",
                  className: "bg-red-100 text-red-700",
                  icon: <AlertTriangle size={11} />,
                }
              : phase === "failed"
                ? {
                    label: hindi ? "अपलोड नहीं हुआ" : "Not uploaded",
                    className: "bg-amber-50 text-amber-700",
                    icon: <AlertTriangle size={11} />,
                  }
                : {
                    label: hindi ? "अपलोड के लिए तैयार" : "Ready to upload",
                    className: "bg-slate-100 text-slate-600",
                    icon: null,
                  };

          return (
            <li
              key={`${item.name}-${item.size}-${index}`}
              className={`relative overflow-hidden rounded-xl border bg-white ${
                isCulprit
                  ? "border-red-300 ring-2 ring-red-100"
                  : "border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => item.src && setOpenIndex(index)}
                title={
                  hindi
                    ? `${item.name} का पूर्वावलोकन करें`
                    : `Preview ${item.name}`
                }
                className="block w-full text-left"
              >
                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-slate-100">
                  {item.src ? (
                    <PreviewThumbnail item={item} />
                  ) : (
                    <Loader2
                      size={16}
                      className="animate-spin text-slate-400"
                    />
                  )}

                  {uploading && (
                    <span className="absolute inset-0 bg-white/40" />
                  )}
                </div>

                <div className="px-2 py-1.5">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {item.name}
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {formatFileSize(item.size)}
                    </span>
                  </div>
                </div>
              </button>

              {!uploading && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label={
                    hindi
                      ? `${item.name} हटाएँ`
                      : `Remove ${item.name}`
                  }
                  title={hindi ? "हटाएँ" : "Remove"}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow ring-1 ring-slate-200 hover:text-red-600"
                >
                  <X size={12} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {openIndex !== null && items[openIndex] && (
        <PreviewViewer
          items={items}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          notice={hindi ? "अभी तक अपलोड नहीं हुआ" : "Not uploaded yet"}
        />
      )}
    </>
  );
}

export function RejectedFilesNotice({
  rejected,
  onDismiss,
}: {
  rejected: RejectedFile[];
  onDismiss: () => void;
}) {
  const hindi = useHindi();

  if (rejected.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
      <div className="flex items-start gap-2">
        <AlertTriangle
          size={14}
          className="mt-0.5 flex-shrink-0 text-amber-600"
        />

        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {hindi
              ? rejected.length === 1
                ? "1 फ़ाइल नहीं जोड़ी गई:"
                : `${rejected.length} फ़ाइलें नहीं जोड़ी गईं:`
              : rejected.length === 1
                ? "1 file wasn't added:"
                : `${rejected.length} files weren't added:`}
          </p>

          <ul className="mt-0.5 space-y-0.5">
            {rejected.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <span className="font-medium">{file.name}</span>: {file.reason}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onDismiss}
          aria-label={hindi ? "बंद करें" : "Dismiss"}
          className="flex-shrink-0 text-amber-500 hover:text-amber-700"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

export function UploadProgress({
  fileCount,
  fraction,
}: {
  fileCount: number;
  fraction: number;
}) {
  const hindi = useHindi();
  const percent = Math.round(fraction * 100);
  const sending = percent < 100;

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
      <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
        <span className="flex items-center gap-1.5">
          <Loader2 size={13} className="animate-spin" />

          {sending
            ? hindi
              ? `${fileCount} फ़ाइल${fileCount === 1 ? "" : "ें"} अपलोड हो रही हैं...`
              : `Uploading ${fileCount} file${fileCount === 1 ? "" : "s"}...`
            : hindi
              ? "अपलोड पूरा हुआ। सर्वर पर सेव किया जा रहा है और फ़ाइलों की जाँच हो रही है..."
              : "Upload complete. Saving on the server and checking the files..."}
        </span>

        <span>{percent}%</span>
      </div>

      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-blue-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-1 text-[11px] text-blue-700">
        {hindi
          ? "पूरा होने तक यह पेज खुला रखें।"
          : "Keep this page open until it finishes."}
      </p>
    </div>
  );
}

export function UploadFailedNotice({
  error,
  hadFiles,
  onRetry,
  onDismiss,
  failedTitle = "Couldn't post the update.",
}: {
  error: UploadError | Error;
  hadFiles: boolean;
  onRetry: () => void;
  onDismiss: () => void;
  /** Heading shown when there were no files, for callers that aren't posting an update. */
  failedTitle?: string;
}) {
  const hindi = useHindi();
  const fileName =
    error instanceof UploadError ? error.fileName : null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle
          size={15}
          className="mt-0.5 flex-shrink-0 text-red-600"
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{hadFiles ? "Upload failed. Nothing was attached." : failedTitle}</p>
          <p className="text-sm font-bold">
            {hindi
              ? hadFiles
                ? "अपलोड विफल हुआ। कोई फ़ाइल संलग्न नहीं हुई।"
                : "अपडेट पोस्ट नहीं किया जा सका।"
              : hadFiles
                ? "Upload failed. Nothing was attached."
                : "Couldn't post the update."}
          </p>

          <p className="mt-0.5">{error.message}</p>

          <p className="mt-1 text-red-700">
            {fileName
              ? hindi
                ? `"${fileName}" को हटाएँ या बदलें (नीचे चिह्नित है), फिर दोबारा प्रयास करें। आपकी अन्य फ़ाइलें और टेक्स्ट अभी भी यहाँ हैं।`
                : `Remove or replace "${fileName}" (marked below), then try again. Your other files and text are still here.`
              : hadFiles
                ? hindi
                  ? "आपकी फ़ाइलें और टेक्स्ट अभी भी यहाँ हैं, इसलिए आप दोबारा प्रयास कर सकते हैं।"
                  : "Your files and text are still here, so you can try again."
                : hindi
                  ? "आपका टेक्स्ट अभी भी यहाँ है, इसलिए आप दोबारा प्रयास कर सकते हैं।"
                  : "Your text is still here, so you can try again."}
          </p>

          <button
            onClick={onRetry}
            className="mt-2 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
          >
            {hindi ? "दोबारा प्रयास करें" : "Try again"}
          </button>
        </div>

        <button
          onClick={onDismiss}
          aria-label={hindi ? "बंद करें" : "Dismiss"}
          className="flex-shrink-0 text-red-400 hover:text-red-600"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

export function UploadSucceededNotice({
  message,
  fileNames,
  onView,
  onDismiss,
}: {
  message: string;
  fileNames: string[];
  onView?: () => void;
  onDismiss: () => void;
}) {
  const hindi = useHindi();

  return (
    <div
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-900"
    >
      <div className="flex items-start gap-2">
        <CheckCircle2
          size={15}
          className="mt-0.5 flex-shrink-0 text-emerald-600"
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{message}</p>

          {fileNames.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {fileNames.map((name, index) => (
                <li
                  key={`${name}-${index}`}
                  className="flex items-center gap-1"
                >
                  <CheckCircle2
                    size={11}
                    className="flex-shrink-0 text-emerald-600"
                  />
                  <span className="truncate">{name}</span>
                </li>
              ))}
            </ul>
          )}

          {onView && (
            <button
              onClick={onView}
              className="mt-1.5 font-semibold text-emerald-700 underline hover:text-emerald-900"
            >
              {hindi
                ? "इसे अपडेट सूची में दिखाएँ"
                : "Show it in the updates list"}
            </button>
          )}
        </div>

        <button
          onClick={onDismiss}
          aria-label={hindi ? "बंद करें" : "Dismiss"}
          className="flex-shrink-0 text-emerald-500 hover:text-emerald-700"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}