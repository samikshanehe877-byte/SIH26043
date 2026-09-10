"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { StudentDashboardData } from "@/types/student";
import { studentMockData } from "@/data/studentMockData";

interface StudentContextType extends StudentDashboardData {
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: number) => void;
  updateTaskStatus: (id: string, status: string) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudentDashboardData>(studentMockData);

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
        unreadNotificationsCount,
        markNotificationAsRead,
        updateTaskStatus,
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

