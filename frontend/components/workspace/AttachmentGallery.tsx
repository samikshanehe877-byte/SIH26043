"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Film,
  Loader2,
  Play,
  Presentation,
  X,
} from "lucide-react";
import { API_URL, Attachment, downloadFile } from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";

export type PreviewKind = "image" | "video" | "pdf" | "document";

/** Something that can be previewed: an uploaded attachment, or a file picked but not yet uploaded. */
export interface PreviewItem {
  name: string;
  contentType: string;
  size: number;
  /** Where to load the preview from: the API for uploaded files, a blob: URL for local ones. */
  src: string;
  /** API path that downloads this file; omitted where downloading doesn't apply. */
  downloadPath?: string;
}

export function previewKind(contentType: string, name: string): PreviewKind {
  const type = contentType.toLowerCase();
  const lower = name.toLowerCase();

  if (type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/.test(lower))
    return "image";

  if (type.startsWith("video/") || /\.(mp4|webm|mov)$/.test(lower))
    return "video";

  if (type === "application/pdf" || lower.endsWith(".pdf"))
    return "pdf";

  return "document";
}

export function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toUpperCase() : "FILE";
}

export function DocumentIcon({
  name,
  size,
}: {
  name: string;
  size: number;
}) {
  const ext = extensionOf(name);

  if (ext === "PPT" || ext === "PPTX")
    return <Presentation size={size} className="text-orange-500" />;

  if (ext === "XLS" || ext === "XLSX")
    return <FileSpreadsheet size={size} className="text-emerald-600" />;

  return <FileText size={size} className="text-blue-600" />;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * The visual part of a preview tile (thumbnail, first video frame, first PDF page, or file card).
 * Shared by uploaded attachments and files waiting to be uploaded, so both look the same.
 */
export function PreviewThumbnail({
  item,
  compact = false,
  onFailed,
}: {
  item: PreviewItem;
  compact?: boolean;
  onFailed?: () => void;
}) {
  const kind = previewKind(item.contentType, item.name);

  if (kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={item.src}
        alt={item.name}
        loading="lazy"
        onError={onFailed}
        className="h-full w-full object-cover"
      />
    );
  }

  if (kind === "video") {
    return (
      <>
        {/* #t=0.1 makes browsers paint the first frame as a thumbnail without playing */}
        <video
          src={`${item.src}#t=0.1`}
          preload="metadata"
          muted
          playsInline
          onError={onFailed}
          className="pointer-events-none h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow">
            <Play size={16} className="ml-0.5 text-slate-800" />
          </span>
        </span>
      </>
    );
  }

  if (kind === "pdf" && !compact) {
    return (
      <>
        <iframe
          src={`${item.src}#toolbar=0&navpanes=0&view=FitH`}
          title={item.name}
          loading="lazy"
          className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-white"
        />
        <span className="absolute bottom-1 left-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
          PDF
        </span>
      </>
    );
  }

  if (kind === "pdf") {
    return (
      <div className="flex flex-col items-center gap-1 text-red-600">
        <FileText size={20} />
        <span className="text-[10px] font-bold">PDF</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <DocumentIcon name={item.name} size={compact ? 20 : 28} />
      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
        {extensionOf(item.name)}
      </span>
    </div>
  );
}

/** Tracks one download at a time so buttons can show progress and failures can be explained. */
export function useDownloader() {
  const [busyPath, setBusyPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const { language } = useLanguage();

  const hindi = language === "Hindi";

  useEffect(() => {
    if (!saved) return;

    const timer = window.setTimeout(() => setSaved(null), 5000);

    return () => window.clearTimeout(timer);
  }, [saved]);

  const download = useCallback(
    async (path: string, fileName: string) => {
      setBusyPath(path);
      setError(null);
      setSaved(null);

      try {
        await downloadFile(path, fileName);
        setSaved(fileName);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : hindi
              ? "डाउनलोड विफल हुआ।"
              : "Download failed."
        );
      } finally {
        setBusyPath(null);
      }
    },
    [hindi]
  );

  return {
    download,
    busyPath,
    error,
    saved,
    clearError: () => setError(null),
  };
}

export function DownloadStatus({
  error,
  saved,
  onDismiss,
}: {
  error: string | null;
  saved: string | null;
  onDismiss: () => void;
}) {
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  if (error) {
    return (
      <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
        <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />

        <span className="flex-1">{error}</span>

        <button
          onClick={onDismiss}
          aria-label={hindi ? "बंद करें" : "Dismiss"}
          className="flex-shrink-0 text-red-400 hover:text-red-600"
        >
          <X size={13} />
        </button>
      </p>
    );
  }

  if (saved) {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
        <CheckCircle2 size={13} />

        {hindi
          ? `"${saved}" डाउनलोड हो गया। अपना Downloads फ़ोल्डर देखें।`
          : `Downloaded "${saved}". Check your Downloads folder.`}
      </p>
    );
  }

  return null;
}

const toItem = (
  attachment: Attachment,
  downloadPath?: string
): PreviewItem => ({
  name: attachment.name,
  contentType: attachment.content_type,
  size: attachment.size,
  src: `${API_URL}${attachment.url}`,
  downloadPath,
});

/**
 * Previews of files attached to a workspace update: image thumbnails, video first frames, the first
 * page of PDFs, and file cards for Word/PowerPoint/Excel. Clicking a tile opens a full-size viewer.
 * When `downloads` is given, every file has a download button and all of them can be saved as a zip.
 * A tile whose file can't be loaded says so, instead of looking attached when it isn't.
 */
export default function AttachmentGallery({
  attachments,
  compact = false,
  downloads,
}: {
  attachments: Attachment[];
  compact?: boolean;
    /** `zipPath`/`zipName` are optional: without them each file still gets its own download button,
   * there's just no "download all" (milestone evidence has no zip endpoint). */
  downloads?: {
    filePath: (index: number) => string;
    zipPath?: string;
    zipName?: string;
  };
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const downloader = useDownloader();
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  if (attachments.length === 0) return null;

  const items = attachments.map((attachment, index) =>
    toItem(attachment, downloads?.filePath(index))
  );
  const zip = downloads?.zipPath
    ? { path: downloads.zipPath, name: downloads.zipName ?? "files.zip" }
    : null;

  return (
    <>
      {!compact && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {attachments.length}{" "}
            {hindi
              ? "अटैचमेंट"
              : `attachment${attachments.length === 1 ? "" : "s"}`}
          </p>

          {zip && attachments.length > 1 && (
            <button
              type="button"
              onClick={() => void downloader.download(zip.path, zip.name)}
              disabled={downloader.busyPath !== null}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              {downloader.busyPath === zip.path ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Download size={12} />
              )}

              {downloader.busyPath === zip.path
                ? hindi
                  ? "ZIP तैयार हो रही है..."
                  : "Preparing zip..."
                : hindi
                  ? `सभी डाउनलोड करें (${attachments.length})`
                  : `Download all (${attachments.length})`}
            </button>
          )}
        </div>
      )}

      <ul
        className={`grid gap-2 ${
          compact
            ? "grid-cols-3 sm:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-3"
        }`}
      >
        {items.map((item, index) => (
          <li key={`${item.src}-${index}`}>
            <AttachmentTile
              item={item}
              compact={compact}
              onOpen={() => setOpenIndex(index)}
              onDownload={
                item.downloadPath
                  ? () =>
                      void downloader.download(
                        item.downloadPath!,
                        item.name
                      )
                  : undefined
              }
              downloading={
                downloader.busyPath !== null &&
                downloader.busyPath === item.downloadPath
              }
            />
          </li>
        ))}
      </ul>

      <DownloadStatus
        error={downloader.error}
        saved={downloader.saved}
        onDismiss={downloader.clearError}
      />

      {openIndex !== null && (
        <PreviewViewer
          items={items}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}

function AttachmentTile({
  item,
  compact,
  onOpen,
  onDownload,
  downloading,
}: {
  item: PreviewItem;
  compact: boolean;
  onOpen: () => void;
  onDownload?: () => void;
  downloading: boolean;
}) {
  const kind = previewKind(item.contentType, item.name);
  const [failed, setFailed] = useState(false);
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  useEffect(() => {
    if (kind !== "pdf" && kind !== "document") return;

    let cancelled = false;

    fetch(item.src, { method: "HEAD", cache: "no-store" })
      .then((response) => {
        if (!cancelled && !response.ok) setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [kind, item.src]);

  return (
    <div
      className={`group relative flex w-full flex-col overflow-hidden rounded-xl border transition hover:shadow-md ${
        failed
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        title={
          failed
            ? hindi
              ? "यह फ़ाइल लोड नहीं की जा सकी"
              : "This file could not be loaded"
            : `${hindi ? "पूर्वावलोकन" : "Preview"} ${item.name}`
        }
        className="flex w-full flex-col text-left"
      >
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden bg-slate-100 ${
            compact ? "aspect-square" : "aspect-video"
          }`}
        >
          {failed ? (
            <div className="flex flex-col items-center gap-1 px-2 text-center text-red-600">
              <AlertTriangle size={compact ? 16 : 22} />

              {!compact && (
                <span className="text-[11px] font-semibold">
                  {hindi ? "फ़ाइल उपलब्ध नहीं है" : "File not available"}
                </span>
              )}
            </div>
          ) : (
            <PreviewThumbnail
              item={item}
              compact={compact}
              onFailed={() => setFailed(true)}
            />
          )}
        </div>

        {!compact && (
          <div className="flex w-full items-center gap-1.5 px-2 py-1.5 pr-9">
            {failed ? (
              <AlertTriangle
                size={12}
                className="flex-shrink-0 text-red-500"
              />
            ) : (
              <CheckCircle2
                size={12}
                className="flex-shrink-0 text-emerald-600"
              />
            )}

            {kind === "video" && (
              <Film
                size={12}
                className="flex-shrink-0 text-slate-400"
              />
            )}

            <span className="min-w-0 flex-1 truncate text-xs text-slate-700">
              {item.name}
            </span>

            <span className="flex-shrink-0 text-[10px] text-slate-400">
              {formatFileSize(item.size)}
            </span>
          </div>
        )}
      </button>

      {onDownload && !failed && (
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          title={`${hindi ? "डाउनलोड करें" : "Download"} ${item.name}`}
          aria-label={`${hindi ? "डाउनलोड करें" : "Download"} ${item.name}`}
          className={`absolute flex items-center justify-center rounded-lg bg-white/95 text-slate-600 shadow ring-1 ring-slate-200 transition hover:bg-white hover:text-slate-900 disabled:opacity-70 ${
            compact
              ? "right-1 top-1 h-6 w-6"
              : "bottom-1 right-1 h-7 w-7"
          }`}
        >
          {downloading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Download size={13} />
          )}
        </button>
      )}
    </div>
  );
}

/** Full-screen preview with previous/next, used for uploaded attachments and files about to be uploaded. */
export function PreviewViewer({
  items,
  index,
  onChange,
  onClose,
  notice,
}: {
  items: PreviewItem[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
  /** Shown under the file name, e.g. "Not uploaded yet". */
  notice?: string;
}) {
  const item = items[index];
  const kind = previewKind(item.contentType, item.name);
  const hasMany = items.length > 1;
  const downloader = useDownloader();
  const { language } = useLanguage();

  const hindi = language === "Hindi";

  const go = useCallback(
    (delta: number) =>
      onChange((index + delta + items.length) % items.length),
    [items.length, index, onChange]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (hasMany && event.key === "ArrowRight") go(1);
      if (hasMany && event.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [go, hasMany, onClose]);

  const downloadButton = (
    label: string,
    className: string
  ) =>
    item.downloadPath ? (
      <button
        onClick={() =>
          void downloader.download(item.downloadPath!, item.name)
        }
        disabled={downloader.busyPath !== null}
        className={className}
      >
        {downloader.busyPath ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Download size={13} />
        )}

        {downloader.busyPath
          ? hindi
            ? "डाउनलोड हो रहा है..."
            : "Downloading..."
          : label}
      </button>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-slate-950/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{item.name}</p>

          <p className="text-xs text-white/60">
            {formatFileSize(item.size)}

            {hasMany && ` · ${index + 1} ${hindi ? "में से" : "of"} ${items.length}`}

            {notice && ` · ${notice}`}
          </p>
        </div>

        {downloadButton(
          hindi ? "डाउनलोड करें" : "Download",
          "flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 disabled:opacity-60"
        )}

        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-white/10"
          aria-label={hindi ? "पूर्वावलोकन बंद करें" : "Close preview"}
        >
          <X size={18} />
        </button>
      </div>

      {downloader.error && (
        <p
          className="mx-4 mb-2 rounded-lg bg-red-600/90 px-3 py-2 text-xs text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {downloader.error}
        </p>
      )}

      {downloader.saved && (
        <p
          className="mx-4 mb-2 rounded-lg bg-emerald-600/90 px-3 py-2 text-xs text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {hindi
            ? `"${downloader.saved}" डाउनलोड हो गया। अपना Downloads फ़ोल्डर देखें।`
            : `Downloaded "${downloader.saved}". Check your Downloads folder.`}
        </p>
      )}

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMany && (
          <button
            onClick={() => go(-1)}
            className="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label={hindi ? "पिछली फ़ाइल" : "Previous file"}
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.src}
            src={item.src}
            alt={item.name}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        )}

        {kind === "video" && (
          <video
            key={item.src}
            src={item.src}
            controls
            autoPlay
            playsInline
            className="max-h-full max-w-full rounded-lg bg-black"
          />
        )}

        {kind === "pdf" && (
          <iframe
            key={item.src}
            src={item.src}
            title={item.name}
            className="h-full w-full max-w-5xl rounded-lg border-0 bg-white"
          />
        )}

        {kind === "document" && (
          <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center">
            <DocumentIcon name={item.name} size={48} />

            <p className="font-semibold text-slate-900">
              {item.name}
            </p>

            <p className="text-sm text-slate-500">
              {hindi
                ? `${extensionOf(item.name)} फ़ाइलों का ब्राउज़र में पूर्वावलोकन नहीं किया जा सकता।`
                : `${extensionOf(item.name)} files can't be previewed inside the browser.`}

              {item.downloadPath
                ? hindi
                  ? " इसे Word, PowerPoint या Excel में खोलने के लिए डाउनलोड करें।"
                  : " Download it to open it in Word, PowerPoint or Excel."
                : hindi
                  ? " इसे इसी रूप में अटैच किया जाएगा।"
                  : " It will be attached as it is."}
            </p>

            {downloadButton(
              hindi ? "डाउनलोड करें" : "Download",
              "flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            )}
          </div>
        )}

        {hasMany && (
          <button
            onClick={() => go(1)}
            className="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label={hindi ? "अगली फ़ाइल" : "Next file"}
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
}