import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

// Submits a project milestone, with its evidence (files and links), for government verification on
// behalf of the signed-in user's own organization. Like the sibling members route, this exists to
// resolve a trustworthy identity server-side before calling the FastAPI service, which has no auth
// of its own. Only milestone_type, note, links and files are read from the request: the party and
// user identity sent upstream is built here from the session, so nothing a client puts in the body
// can claim to be someone else.
//
// Accepts multipart/form-data (what the workspace form sends) or plain JSON, and always forwards
// multipart to FastAPI's .../milestones/with-attachments endpoint, which owns the file rules (allowed
// types, size and count limits) so there's a single source of truth for them.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Submission {
  milestoneType: string;
  note?: string;
  links: string[];
  files: File[];
}

async function readSubmission(request: Request): Promise<Submission | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData().catch(() => null);
    if (!form) return null;
    const note = form.get("note");
    return {
      milestoneType: String(form.get("milestone_type") ?? ""),
      note: typeof note === "string" && note.trim() ? note : undefined,
      links: form.getAll("links").filter((value): value is string => typeof value === "string"),
      files: form.getAll("files").filter((value): value is File => typeof value !== "string"),
    };
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return null;
  return {
    milestoneType: typeof body.milestone_type === "string" ? body.milestone_type : "",
    note: typeof body.note === "string" && body.note.trim() ? body.note : undefined,
    links: Array.isArray(body.links) ? body.links.filter((link: unknown): link is string => typeof link === "string") : [],
    files: [],
  };
}

export async function POST(request: Request, { params }: { params: Promise<{ problemId: string }> }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partyType = user.universityId ? "university" : user.industryId ? "industry" : null;
  if (!partyType || !user.organizationName) {
    return NextResponse.json(
      { error: "Complete your organization profile before submitting a milestone" },
      { status: 403 }
    );
  }

  const submission = await readSubmission(request);
  if (!submission || !submission.milestoneType.trim()) {
    return NextResponse.json({ error: "milestone_type is required" }, { status: 400 });
  }

  const { problemId } = await params;

  const upstream = new FormData();
  upstream.set("party_type", partyType);
  upstream.set("party_name", user.organizationName);
  upstream.set("user_id", user.id);
  upstream.set("user_name", user.name);
  upstream.set("milestone_type", submission.milestoneType);
  if (submission.note) upstream.set("note", submission.note);
  submission.links.forEach((link) => upstream.append("links", link));
  submission.files.forEach((file) => upstream.append("files", file, file.name));

  let response: Response;
  try {
    // No Content-Type header: fetch adds the multipart boundary itself.
    response = await fetch(`${API_URL}/projects/${problemId}/milestones/with-attachments`, {
      method: "POST",
      body: upstream,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to reach the project API while submitting a milestone:", error);
    return NextResponse.json({ error: "Project service unavailable" }, { status: 502 });
  }

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
