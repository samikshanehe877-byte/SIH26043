"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  IndustryDashboardData,
  CollaborationRequest,
  CollaborationRequestStatus,
  CollaborationResponse,
  SupportStatus,
  SupportType,
} from "@/types/industry";
import { emptyIndustryDashboardData, emptyProjectMilestones } from "@/data/industryMockData";
import { getOrganizationName, useAuth } from "@/context/AuthContext";

interface IndustryContextType extends IndustryDashboardData {
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: number | string) => void;
  markAllNotificationsAsRead: () => void;
  /** Accept / reject / ask for clarification on a university's request. Resolves to an error message, or null on success. */
  respondToRequest: (id: string, action: CollaborationResponse, note?: string) => Promise<string | null>;
  updateSupportStatus: (collaborationId: string, supportId: string, status: SupportStatus) => void;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

const INDUSTRY_ROLES: string[] = ["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"];

export function IndustryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<IndustryDashboardData>(emptyIndustryDashboardData);
  const { user, isAuthenticated } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const companyName = getOrganizationName(user);

  useEffect(() => {
    // The root layout mounts this provider for every portal; only industry accounts have an industry inbox.
    if (!isAuthenticated || !user || !INDUSTRY_ROLES.includes(user.role)) return;

    const loadNotifications = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/notifications?citizen_name=${encodeURIComponent(companyName)}&audience=industry`,
          { cache: "no-store" },
        );
        if (!response.ok) return;
        const records = await response.json();
        if (!Array.isArray(records)) return;
        setData((previous) => ({
          ...previous,
          notifications: records.map((record) => ({
            id: String(record.id),
            type: record.type,
            title: record.title,
            message: record.message,
            timeAgo: toTimeAgo(new Date(record.created_at)),
            isRead: record.is_read,
          })),
        }));
      } catch (error) {
        console.error("Failed to load industry notifications:", error);
      }
    };

    const loadRequests = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/collaboration-requests?industry_name=${encodeURIComponent(companyName)}&limit=500`,
          { cache: "no-store" },
        );
        if (!response.ok) return;
        const records = await response.json();
        if (!Array.isArray(records)) return;
        setData((previous) => ({ ...previous, requests: records.map(toCollaborationRequest) }));
      } catch (error) {
        console.error("Failed to load collaboration requests:", error);
      }
    };

    const refresh = () => {
      void loadNotifications();
      void loadRequests();
    };
    refresh();
    const interval = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(interval);
  }, [apiUrl, isAuthenticated, user, companyName]);

  const unreadNotificationsCount = data.notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: number | string) => {
    void fetch(`${apiUrl}/notifications/${id}/read`, { method: "PATCH" });
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  };

  const markAllNotificationsAsRead = () => {
    void fetch(`${apiUrl}/notifications/read-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citizen_name: companyName, audience: "industry" }),
    });
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  };

  const respondToRequest = async (id: string, action: CollaborationResponse, note = ""): Promise<string | null> => {
    try {
      const response = await fetch(`${apiUrl}/collaboration-requests/${id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actor_type: "industry", actor_name: companyName, action, note }),
      });
      const body = await response.json();
      if (!response.ok) return String(body.detail ?? "Could not update the request");
      const updated = toCollaborationRequest(body);
      setData((prev) => ({
        ...prev,
        requests: prev.requests.map((r) => (r.id === id ? updated : r)),
      }));
      return null;
    } catch {
      return "Could not reach the server. Please try again.";
    }
  };

  const updateSupportStatus = (collaborationId: string, supportId: string, status: SupportStatus) => {
    setData((prev) => ({
      ...prev,
      collaborations: prev.collaborations.map(col => {
        if (col.id === collaborationId) {
          return {
            ...col,
            industrySupport: col.industrySupport.map(sup =>
              sup.id === supportId ? { ...sup, status } : sup
            )
          };
        }
        return col;
      })
    }));
  };

  return (
    <IndustryContext.Provider
      value={{
        ...data,
        // The company is whoever is signed in; its name keys volunteer proposals, assignments and alerts.
        company: { ...data.company, id: user?.industryId ?? "", name: companyName },
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        respondToRequest,
        updateSupportStatus,
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
}

const REQUEST_STATUSES: Record<string, CollaborationRequestStatus> = {
  pending: "Received",
  clarification_needed: "Clarification Needed",
  accepted: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCollaborationRequest(record: any): CollaborationRequest {
  const supportTypes: SupportType[] = Array.isArray(record.support_types) ? record.support_types : [];
  const history = Array.isArray(record.history) ? record.history : [];
  return {
    id: String(record.id),
    challengeTitle: String(record.challenge_title ?? "Untitled challenge"),
    problemDescription: String(record.problem_description ?? record.description ?? ""),
    category: String(record.category ?? "General"),
    expectedOutcome: String(record.description ?? "Not specified"),
    university: {
      id: String(record.university_name ?? ""),
      name: String(record.university_name ?? "University"),
      department: "",
      location: "",
    },
    mentor: {
      id: "",
      name: String(record.requester_contact ?? "Not assigned yet"),
      department: "",
      expertise: [],
    },
    studentTeam: { id: "", name: "Not formed yet", size: 0, skills: [] },
    aiAnalysis: {
      problemCategory: String(record.category ?? "General"),
      requiredSkills: [],
      suggestedTechnologies: [],
      difficulty: "",
      suggestedSupportRequirements: [],
    },
    requestedSupportTypes: supportTypes,
    whySupportIsNeeded: String(record.description ?? ""),
    expectedIndustryContribution: supportTypes.join(", ") || "Not specified",
    projectProgress: 0,
    currentMilestoneIndex: 0,
    milestones: emptyProjectMilestones,
    requestDate: record.created_at ? new Date(record.created_at).toLocaleDateString() : "Recently",
    status: REQUEST_STATUSES[record.status] ?? "Received",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history: history.map((entry: any) => ({
      actorType: entry.actor_type,
      actorName: String(entry.actor_name ?? ""),
      action: entry.action,
      note: String(entry.note ?? ""),
      timestamp: String(entry.timestamp ?? ""),
    })),
  };
}

function toTimeAgo(date: Date): string {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function useIndustry() {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error("useIndustry must be used within an IndustryProvider");
  }
  return context;
}
