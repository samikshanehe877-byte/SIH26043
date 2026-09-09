"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Users2,
  GraduationCap,
  CheckSquare,
  Clock,
  Handshake,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import MentorStatsCard from "@/components/mentor/MentorStatsCard";
import ChallengeCard from "@/components/mentor/ChallengeCard";
import AttentionCard from "@/components/mentor/AttentionCard";
import DeadlineCard from "@/components/mentor/DeadlineCard";
import ActivityTimeline from "@/components/mentor/ActivityTimeline";
import CreateTeamModal from "@/components/mentor/CreateTeamModal";
import { useMentor } from "@/context/MentorContext";
import { MentorChallenge } from "@/types/mentor";

export default function MentorDashboardPage() {
  const {
    profile,
    challenges,
    teams,
    students,
    tasks,
    industryRequests,
    activities,
  } = useMentor();

  const [selectedChallengeForTeam, setSelectedChallengeForTeam] = useState<MentorChallenge | null>(null);

  // Computed statistics
  const assignedChallengesCount = challenges.length;
  const activeTeamsCount = teams.filter((t) => t.status === "Active").length;
  const studentsCount = students.length;
  const pendingTasksCount = tasks.filter(
    (t) => t.status === "To Do" || t.status === "In Progress"
  ).length;
  const awaitingReviewCount = tasks.filter(
    (t) => t.status === "Submitted" || t.status === "Under Review"
  ).length;
  const industryCollabsCount = industryRequests.filter(
    (r) => r.status === "Accepted" || r.status === "In Progress" || r.status === "Under Review"
  ).length;

  const totalProgress = challenges.reduce((acc, c) => acc + c.progress, 0);
  const averageProgress =
    challenges.length > 0 ? Math.round(totalProgress / challenges.length) : 0;

  // Attention items
  const attentionItems: Array<{
    id: string;
    type: "review" | "collab" | "university" | "deadline";
    title: string;
    description: string;
    actionText: string;
    actionHref?: string;
    urgency: "high" | "critical" | "medium";
  }> = [];

  if (awaitingReviewCount > 0) {
    attentionItems.push({
      id: "att-1",
      type: "review",
      title: `${awaitingReviewCount} student task${awaitingReviewCount > 1 ? "s" : ""} awaiting mentor review`,
      description: "Students have submitted deliverables requiring code review and quality validation.",
      actionText: "Review Tasks",
      actionHref: "/mentor/tasks",
      urgency: "high",
    });
  }

  const unassignedTeamChallenge = challenges.find((c) => c.status === "Team Creation Pending");
  if (unassignedTeamChallenge) {
    attentionItems.push({
      id: "att-2",
      type: "collab",
      title: `Team creation pending for '${unassignedTeamChallenge.title}'`,
      description: "Form an interdisciplinary student squad to kickstart development on this challenge.",
      actionText: "Create Team",
      actionHref: `/mentor/challenges/${unassignedTeamChallenge.id}`,
      urgency: "critical",
    });
  }

  const pendingIndustry = industryRequests.find((r) => r.status === "Under Review");
  if (pendingIndustry) {
    attentionItems.push({
      id: "att-3",
      type: "collab",
      title: `Industry request awaiting response: ${pendingIndustry.organization}`,
      description: `${pendingIndustry.helpType} assistance requested for ${pendingIndustry.challengeTitle}.`,
      actionText: "View Collaboration",
      actionHref: "/mentor/collaboration",
      urgency: "medium",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <MentorHeader />

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        <MentorStatsCard
          label="Assigned Challenges"
          value={assignedChallengesCount}
          icon={Award}
          color="emerald"
          sublabel="Active BVU mandates"
        />
        <MentorStatsCard
          label="Active Teams"
          value={activeTeamsCount}
          icon={Users2}
          color="teal"
          sublabel="Under Dr. Kulkarni"
        />
        <MentorStatsCard
          label="Students"
          value={studentsCount}
          icon={GraduationCap}
          color="blue"
          sublabel="Multidisciplinary pool"
        />
        <MentorStatsCard
          label="Pending Tasks"
          value={pendingTasksCount}
          icon={CheckSquare}
          color="amber"
          sublabel="In development pipeline"
        />
        <MentorStatsCard
          label="Awaiting Review"
          value={awaitingReviewCount}
          icon={Clock}
          color="purple"
          sublabel="Requires mentor sign-off"
          trend={awaitingReviewCount > 0 ? "Action needed" : undefined}
        />
        <MentorStatsCard
          label="Industry Collabs"
          value={industryCollabsCount}
          icon={Handshake}
          color="indigo"
          sublabel="Corporate & tech partners"
        />
        <div className="col-span-2 sm:col-span-1 lg:col-span-2">
          <MentorStatsCard
            label="Overall Delivery Progress"
            value={`${averageProgress}%`}
            icon={TrendingUp}
            color="emerald"
            sublabel="Across all assigned societal solutions"
            trend="+12% this month"
          />
        </div>
      </div>

      {/* Attention Section */}
      <AttentionCard items={attentionItems} />

      {/* Newly Assigned Challenges Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Newly Assigned Challenges
            </h2>
            <p className="text-xs text-slate-500">
              Review university problem statements, inspect AI recommendations, and form student teams
            </p>
          </div>
          <Link
            href="/mentor/challenges"
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>View All Challenges</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.slice(0, 2).map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onCreateTeam={(c) => setSelectedChallengeForTeam(c)}
            />
          ))}
        </div>
      </div>

      {/* Deadlines & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeadlineCard tasks={tasks} />
        <ActivityTimeline activities={activities} />
      </div>

      {/* Create Team Modal if opened from card */}
      {selectedChallengeForTeam && (
        <CreateTeamModal
          isOpen={!!selectedChallengeForTeam}
          onClose={() => setSelectedChallengeForTeam(null)}
          challenge={selectedChallengeForTeam}
        />
      )}
    </div>
  );
}

