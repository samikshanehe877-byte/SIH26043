"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { IndustryDashboardData, CollaborationRequestStatus, SupportStatus } from "@/types/industry";
import { industryMockData } from "@/data/industryMockData";

interface IndustryContextType extends IndustryDashboardData {
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: number) => void;
  updateRequestStatus: (id: string, status: CollaborationRequestStatus) => void;
  updateSupportStatus: (collaborationId: string, supportId: string, status: SupportStatus) => void;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export function IndustryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<IndustryDashboardData>(industryMockData);

  const unreadNotificationsCount = data.notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: number) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  };

  const updateRequestStatus = (id: string, status: CollaborationRequestStatus) => {
    setData((prev) => ({
      ...prev,
      requests: prev.requests.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    }));
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
        unreadNotificationsCount,
        markNotificationAsRead,
        updateRequestStatus,
        updateSupportStatus,
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error("useIndustry must be used within an IndustryProvider");
  }
  return context;
}
