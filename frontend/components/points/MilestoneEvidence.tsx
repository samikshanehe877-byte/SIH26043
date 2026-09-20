"use client";

import { ExternalLink, Link2 } from "lucide-react";
import AttachmentGallery from "@/components/workspace/AttachmentGallery";
import type { MilestoneRecord } from "@/lib/points";

/** The API already refuses anything but http(s) links, but a link is user-supplied text going into
 * an href, so it's checked again here at the one place it becomes clickable. */
function isWebLink(value: string) {
  return /^https?:\/\//i.test(value);
}

function linkLabel(url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    return `${hostname.replace(/^www\./, "")}${pathname === "/" ? "" : pathname}`;
  } catch {
    return url;
  }
}

/**
 * The evidence a team attached to a milestone: photos, videos, PDFs and Office documents as a
 * previewable gallery (click a tile to view it full size, or download it), plus any links. Shown to
 * the team and to the officer reviewing the submission, so both look at the same thing.
 */
export default function MilestoneEvidence({
  milestone,
}: {
  milestone: Pick<MilestoneRecord, "submitted_attachments" | "submitted_links">;
}) {
  const attachments = milestone.submitted_attachments ?? [];
  const links = (milestone.submitted_links ?? []).filter(isWebLink);
  if (attachments.length === 0 && links.length === 0) return null;

  return (
    <div className="mt-3 space-y-3">
      <AttachmentGallery attachments={attachments} downloads={{ filePath: (index) => attachments[index].url }} />
      {links.length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {links.length} link{links.length === 1 ? "" : "s"}
          </p>
          <ul className="space-y-1">
            {links.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={url}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                >
                  <Link2 size={12} className="flex-shrink-0" />
                  <span className="truncate">{linkLabel(url)}</span>
                  <ExternalLink size={11} className="flex-shrink-0 text-slate-400" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
