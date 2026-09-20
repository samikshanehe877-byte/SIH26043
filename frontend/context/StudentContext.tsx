"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { StudentDashboardData } from "@/types/student";
import { emptyStudentDashboardData } from "@/data/studentMockData";
import { toAchievement, toStudentCertificate, useCertificates, useOwnActor, usePointsSummary } from "@/lib/points";

interface StudentContextType extends StudentDashboardData {
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: number) => void;
  updateTaskStatus: (id: string, status: string) => void;
  /** True while the real points/certificates fetch is in flight -- everything else in this
   * context is still static mock data, so this only covers achievements/certificates. */
  isPointsLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudentDashboardData>(emptyStudentDashboardData);

  // Only achievements, certificates, and their two summary counts come from the real,
  // government-verified points ledger. Everything else on StudentDashboardData (tasks, team,
  // chat, files, resources, activeChallenge) is intentionally left as the existing static mock --
  // wiring those up is a separate, unrelated piece of work.
  const actor = useOwnActor();
  const { data: summary, isLoading: isSummaryLoading } = usePointsSummary(actor?.actorType ?? null, actor?.actorId ?? null);
  const { data: certificateRecords, isLoading: isCertificatesLoading } = useCertificates(actor?.actorType ?? null, actor?.actorId ?? null);

  const achievements = actor
    ? (summary?.badges ?? []).map((badge) => toAchievement(badge, summary?.recent_events[0]?.created_at ?? ""))
    : data.profile.achievements;
  const certificates = actor ? certificateRecords.map(toStudentCertificate) : data.certificates;
  const completedChallenges = actor ? summary?.distinct_projects ?? 0 : data.profile.completedChallenges;
  const verifiedCertificateCount = actor
    ? certificateRecords.filter((c) => c.status === "Verified").length
    : data.profile.certificates;

  const unreadNotificationsCount = data.notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: number) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  };

  const updateTaskStatus = (id: string, status: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, status: status as any } : t
      ),
    }));
  };

  return (
    <StudentContext.Provider
      value={{
        ...data,
        profile: { ...data.profile, achievements, completedChallenges, certificates: verifiedCertificateCount },
        certificates,
        unreadNotificationsCount,
        markNotificationAsRead,
        updateTaskStatus,
        isPointsLoading: isSummaryLoading || isCertificatesLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
