"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole } from "@prisma/client";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: string;
  profilePhoto?: string;
  location?: string;
  createdAt?: string;
  regionId?: string;
  universityId?: string;
  industryId?: string;
  needsProfileCompletion?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; redirectTo?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CITIZEN" | "UNIVERSITY" | "INDUSTRY";
  universityData?: {
    name: string;
    registrationNumber: string;
    description?: string;
    website?: string;
    address?: string;
    district?: string;
    state: string;
    regionId: string;
  };
  industryData?: {
    companyName: string;
    registrationNumber: string;
    industryType: string;
    description?: string;
    website?: string;
    address?: string;
    district?: string;
    state: string;
    regionId: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (error) {
      return { success: false, message: "Registration failed. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function getRedirectPath(role: UserRole, needsProfileCompletion?: boolean): string {
  if (needsProfileCompletion) {
    switch (role) {
      case "FACULTY":
        return "/complete-profile/university";
      case "INDUSTRY_EMPLOYEE":
      case "INDUSTRY_EXPERT":
        return "/complete-profile/industry";
    }
  }
  
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "GOVERNMENT_OFFICER":
      return "/government";
    case "STUDENT":
      return "/student";
    case "MENTOR":
      return "/mentor";
    case "FACULTY":
      return "/university";
    case "INDUSTRY_EMPLOYEE":
    case "INDUSTRY_EXPERT":
      return "/industry";
    case "CITIZEN":
    default:
      return "/";
  }
}