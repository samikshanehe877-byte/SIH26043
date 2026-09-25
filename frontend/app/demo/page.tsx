"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  Copy,
  GitMerge,
  Languages,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const PASSWORD = "password123";

const ACCOUNTS = [
  { role: "Citizen", org: "—", email: "rahul.citizen@example.com" },
  { role: "Government Officer", org: "Maharashtra", email: "officer.patil@maharashtra.gov.in" },
  { role: "University Coordinator", org: "ABC Institute, Pune", email: "coordinator@abcit.edu.in" },
  { role: "Industry Employee", org: "TechSolutions, Pune", email: "amit.engineer@techsolutions.com" },
  { role: "Mentor", org: "ABC Institute, Pune", email: "dr.sharma@abcit.edu.in" },
  { role: "Student", org: "ABC Institute, Pune", email: "priya.student@abcit.edu.in" },
  { role: "Industry Employee", org: "AquaTech Infra, Pune", email: "shweta.pillai@aquatech.co.in" },
  { role: "Industry Employee", org: "GreenEnergy, Mumbai", email: "manoj.tiwari@greenenergy.in" },
];

const WALKTHROUGH = [
  {
    account: "rahul.citizen@example.com",
    role: "Citizen",
    title: "Post a problem in plain language",
    body:
      "Go to Post a Problem and paste the text below. You describe the situation the way you would to a neighbour; the system extracts a title, category, affected population and the capabilities needed to solve it. Before it saves, it compares the problem against every existing one and warns you if somebody nearby has already reported the same thing.",
    watch: "The AI-structured summary shown back to you, and the duplicate check that runs on submit.",
  },
  {
    account: "officer.patil@maharashtra.gov.in",
    role: "Government Officer",
    title: "Verify it",
    body:
      "Open Verify. The problem is waiting in the queue with its evidence and a similarity score against anything it resembles. Approve it, ask for more proof, or reject it. Nothing reaches an organisation until an officer approves it, so this step is what makes the next one possible.",
    watch:
      "Ask for Proof and Reject are colour-coded, and every decision is appended to a history that is never overwritten.",
  },
  {
    account: "coordinator@abcit.edu.in",
    role: "University Coordinator",
    title: "See who the system thinks should solve it",
    body:
      "The dashboard now shows the problem under Best Match with a score, a proposed team, and the reason each person is on it. Scroll to the partnership suggestion: two organisations that together cover what neither covers alone. Press Not interested on the top match and the whole list reorders.",
    watch:
      "Each member's contribution is only what nobody before them covered, so the team carries no redundant seats.",
  },
  {
    account: "amit.engineer@techsolutions.com",
    role: "Industry Employee",
    title: "Volunteer, and watch it leave the pool",
    body:
      "The same problem appears from the industry side, scored against your own people. Volunteer for it. Sign back in as the citizen, accept the offer, and a workspace opens with chat, milestones and file sharing. The problem then disappears from every Best Match list, because it is being worked on.",
    watch: "Points are written only when the government verifies a milestone, never on submission.",
  },
];

const PROBLEM_TEXT =
  "When a streetlight fails or a drain blocks, we go to the ward office and someone writes it in a register. After that there is no number, no acknowledgement and no way to find out what happened. Half the time we are told it belongs to a different department and sent somewhere else. The same complaint gets written three or four times by different neighbours because nobody knows it has already been reported. There is no list anywhere of which office handles what, and the notice board is in English which many families here cannot read.";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI problem structuring",
    what: "Free text becomes a structured problem: title, category, domain, affected population, frequency, and the capabilities needed to solve it. Uploaded photographs are read as well.",
    test: "Post a problem as the citizen and write it as loosely as you like. Compare what you typed with the summary shown back to you before you submit.",
  },
  {
    icon: Search,
    title: "Duplicate detection",
    what: "Five weighted signals: meaning 45%, location 20%, domain 15%, affected area 10%, characteristics 10%. Above 0.90 a submission is blocked, above 0.60 it is flagged. The embeddings run on our own server rather than through an API.",
    test: "Post a problem, then post a near-identical one in completely different words. The second is caught on meaning rather than on matching words, and spelling variants of a locality are treated as the same place.",
  },
  {
    icon: GitMerge,
    title: "Consent-based merging",
    what: "When several reports describe one problem, the government proposes a merge. Every owner accepts or declines for themselves, and the original owner then approves each acceptance. Up to three people can co-own the result.",
    test: "As the officer, open a flagged problem and propose a merge, then sign in as the other citizen to accept it. Nobody is merged into somebody else's report without agreeing to it.",
  },
  {
    icon: Users,
    title: "Team matchmaking",
    what: "Needs are extracted from the problem text and weighted so that rare skills count for more than common ones. Teams are built by repeatedly picking whoever covers the most that is still uncovered, and every team is guaranteed both a guide and a contributor.",
    test: "Open Best Match on a university or industry dashboard. Each member lists only what they add beyond everyone before them, and required skills are separated from merely helpful ones.",
  },
  {
    icon: Building2,
    title: "Partnership suggestions",
    what: "Pairs of organisations where each covers something the other cannot, proposed only when the pair beats the better organisation alone by at least ten points.",
    test: "Find a problem needing both technical and community work and look below the single-organisation ranking. The pairing shows exactly what each side contributes.",
  },
  {
    icon: ShieldCheck,
    title: "Government verification",
    what: "Approve, request proof, or reject, each with a note. Decisions are appended to a permanent history rather than overwriting a status field, so the trail of who decided what survives.",
    test: "Request proof on a problem, sign in as the citizen to see the request and upload evidence, then return as the officer. Both decisions remain visible in the history.",
  },
  {
    icon: CheckCircle2,
    title: "Workspaces and milestones",
    what: "Accepting a volunteer opens a workspace with chat, progress updates, file attachments and milestones. Files can be downloaded one at a time or as a single archive.",
    test: "Accept a volunteer as the citizen, then open the workspace from either side. Submit a milestone with a file attached and verify it as the officer.",
  },
  {
    icon: Trophy,
    title: "Points and leaderboards",
    what: "Points are written to an append-only ledger, and only when the government verifies a milestone. Totals, badges and certificates are recomputed from that ledger rather than stored as a running total that could drift out of step.",
    test: "Verify a milestone as the officer, then check the organisation leaderboard. Nothing is awarded for merely claiming progress.",
  },
  {
    icon: Languages,
    title: "Regional languages",
    what: "Problems can be written in Hindi, Nagpuri, Santali, Mundari, Ho or Kurukh and are translated for review. Translations the system is less sure of are flagged rather than presented as reliable.",
    test: "Use the language toggle, or post a problem in Hindi and watch it structured into English with the original preserved alongside.",
  },
  {
    icon: MapPin,
    title: "Evidence and attachments",
    what: "Photographs, video and documents up to 20 MB, held in object storage so that every machine sees the same file. Attachments can be removed while a problem is still under review, but not after it has been verified.",
    test: "Attach a photo when posting, then open it from the government side. The same file is served to both, from shared storage rather than from one laptop.",
  },
];

export default function DemoGuidePage() {
  const [copied, setCopied] = useState(false);
  const [openFeature, setOpenFeature] = useState<number | null>(0);

  const copyProblem = async () => {
    try {
      await navigator.clipboard.writeText(PROBLEM_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 flex-shrink-0 text-blue-700" />
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">How to try SamasyaLink</h1>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            SamasyaLink connects a community problem to the people who can actually solve it. A citizen
            reports something in their own words, a government officer verifies it, and the platform
            proposes the university or industry team best placed to take it on.
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            The workflow deliberately spans four roles, so seeing it through means signing in as each in
            turn. Every account below uses the password{" "}
            <span className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-900">
              {PASSWORD}
            </span>
            .
          </p>

          <Link
            href="/signin"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Go to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="mb-12">
          <h2 className="text-lg font-bold text-slate-900">The ten-minute walkthrough</h2>
          <p className="mt-1 text-sm text-slate-600">
            Suggestion: Open two browsers and make use of incognito tabs in each. Example: Microsoft Edge - Citizen Dashboard, Microsoft Edge (incognito) - Government Dashboard , Google Chrome - University Dashboard , Google Chrome (incognito) - Industry Dashboard. 
            Four steps, in order. Each one hands off to the next.
          </p>

          <div className="mt-5 space-y-4">
            {WALKTHROUGH.map((step, index) => (
              <div
                key={step.account}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-0.5 break-words text-xs font-medium text-blue-700">
                      Sign in as {step.role} &middot;{" "}
                      <span className="font-mono">{step.account}</span>
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{step.body}</p>
                    <p className="mt-2.5 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                      <span className="font-semibold">Worth noticing: </span>
                      {step.watch}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-lg font-bold text-emerald-950">Text to use in step 1</h2>
          <p className="mt-1 text-sm leading-relaxed text-emerald-900">
            Any text works, but this one exercises the matcher properly: it never mentions software, yet
            the capabilities it needs are held by one organisation far more than by the others.
          </p>

          <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-4">
            <p className="text-sm leading-relaxed text-slate-700">{PROBLEM_TEXT}</p>
          </div>

          <button
            type="button"
            onClick={copyProblem}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy this text"}
          </button>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-bold text-slate-900">Every feature, and how to see it</h2>
          <p className="mt-1 text-sm text-slate-600">
            Open any row for what it does and how to try it yourself.
          </p>

          <div className="mt-5 space-y-2">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const open = openFeature === index;
              return (
                <div
                  key={feature.title}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFeature(open ? null : index)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-blue-700" />
                    <span className="flex-1 text-sm font-semibold text-slate-900">{feature.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <div className="border-t border-slate-100 px-4 py-3.5">
                      <p className="text-sm leading-relaxed text-slate-600">{feature.what}</p>
                      <p className="mt-2.5 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-900">
                        <span className="font-semibold">To see it: </span>
                        {feature.test}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900">All demo accounts</h2>
          <p className="mt-1 text-sm text-slate-600">
            Password for every account:{" "}
            <span className="font-mono font-semibold">{PASSWORD}</span>
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Role</th>
                  <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Organisation</th>
                  <th className="px-4 py-2.5 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ACCOUNTS.map((account) => (
                  <tr key={account.email}>
                    <td className="whitespace-nowrap px-4 py-2.5 font-medium text-slate-900">
                      {account.role}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-2.5 text-slate-500 sm:table-cell">
                      {account.org}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{account.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Mentor accounts land on their own dashboard rather than an organisation&apos;s. To reach a
            university or industry dashboard, use the Coordinator or Employee account.
          </p>
        </section>

        <footer className="border-t border-slate-200 pt-6">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          >
            Start with the citizen account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Demo data only. Every account shares one password, so nothing here should hold real
            information.
          </p>
        </footer>
      </div>
    </div>
  );
}
