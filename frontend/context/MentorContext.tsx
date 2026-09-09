"use client";

import React, { createContext, useContext, useState } from "react";
import {
  MentorProfile,
  Student,
  MentorChallenge,
  Team,
  Task,
  IndustryCollaborationRequest,
  UniversityProgressUpdate,
  MentorNotification,
  MentorActivityItem,
  TaskStatus,
  CollaborationStatus,
  IndustryHelpType,
  IndustryRequestDetails,
} from "@/types/mentor";
import {
  initialMentorProfile,
  initialStudents,
  initialChallenges,
  initialTeams,
  initialTasks,
  initialIndustryRequests,
  initialUniversityUpdates,
  initialMentorNotifications,
  initialActivities,
} from "@/data/mentorMockData";

interface CreateTeamParams {
  challengeId: string;
  name: string;
  description: string;
  objective: string;
  studentIds: string[];
  leaderStudentId?: string;
}

interface CreateTaskParams {
  title: string;
  description: string;
  teamId: string;
  assignedStudentId: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  deadline: string;
  expectedOutput: string;
}

interface CreateIndustryRequestParams {
  challengeId: string;
  teamId: string;
  helpType: IndustryHelpType;
  organization: string;
  requestTitle: string;
  requirement: string;
  whyNeeded: string;
  expectedSupport: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  requiredBy: string;
  attachmentName?: string;
  details?: IndustryRequestDetails;
}

interface SendUniversityUpdateParams {
  challengeId: string;
  progress: number;
  title: string;
  workCompleted: string;
  currentWork: string;
  blockers?: string;
  studentPerformance: string;
  industrySupport: string;
  nextSteps: string;
  expectedCompletionDate: string;
  attachments?: string[];
}

interface MentorContextType {
  profile: MentorProfile;
  challenges: MentorChallenge[];
  teams: Team[];
  students: Student[];
  tasks: Task[];
  industryRequests: IndustryCollaborationRequest[];
  universityUpdates: UniversityProgressUpdate[];
  notifications: MentorNotification[];
  activities: MentorActivityItem[];
  unreadNotificationsCount: number;

  // Actions
  createTeam: (params: CreateTeamParams) => { success: boolean; message: string; team?: Team };
  getTeamForChallenge: (challengeId: string) => Team | undefined;
  createTask: (params: CreateTaskParams) => { success: boolean; task?: Task };
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  reviewTask: (taskId: string, action: "approve" | "request_changes", feedback: string) => void;
  createIndustryRequest: (params: CreateIndustryRequestParams) => { success: boolean; request?: IndustryCollaborationRequest };
  updateIndustryRequestStatus: (requestId: string, status: CollaborationStatus) => void;
  addIndustryMessage: (requestId: string, text: string) => void;
  sendUniversityUpdate: (params: SendUniversityUpdateParams) => { success: boolean };
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateProfile: (updated: Partial<MentorProfile>) => void;
}

const MentorContext = createContext<MentorContextType | undefined>(undefined);

export function MentorProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<MentorProfile>(initialMentorProfile);
  const [challenges, setChallenges] = useState<MentorChallenge[]>(initialChallenges);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [industryRequests, setIndustryRequests] = useState<IndustryCollaborationRequest[]>(initialIndustryRequests);
  const [universityUpdates, setUniversityUpdates] = useState<UniversityProgressUpdate[]>(initialUniversityUpdates);
  const [notifications, setNotifications] = useState<MentorNotification[]>(initialMentorNotifications);
  const [activities, setActivities] = useState<MentorActivityItem[]>(initialActivities);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const getTeamForChallenge = (challengeId: string): Team | undefined => {
    return teams.find((t) => t.challengeId === challengeId);
  };

  const createTeam = (params: CreateTeamParams) => {
    // Check if challenge already has a team (Strict rule: ONE team per challenge)
    const existingTeam = teams.find((t) => t.challengeId === params.challengeId);
    if (existingTeam) {
      return {
        success: false,
        message: `Team "${existingTeam.name}" has already been created for this challenge. Each challenge can have only one team.`,
      };
    }

    const challenge = challenges.find((c) => c.id === params.challengeId);
    const challengeTitle = challenge ? challenge.title : "Assigned Challenge";

    const newTeamId = `team-${Date.now()}`;
    const newTeam: Team = {
      id: newTeamId,
      name: params.name,
      challengeId: params.challengeId,
      challengeTitle,
      description: params.description,
      objective: params.objective,
      leaderStudentId: params.leaderStudentId || params.studentIds[0],
      studentIds: params.studentIds,
      progress: 5,
      tasksTotal: 0,
      tasksCompleted: 0,
      tasksInProgress: 0,
      tasksPendingReview: 0,
      lastActivity: "Team created just now",
      industrySupport: "Not Requested",
      status: "Active",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      progressBreakdown: {
        research: 20,
        dataCollection: 10,
        modelDevelopment: 0,
        backend: 0,
        testing: 0,
        documentation: 10,
      },
    };

    setTeams((prev) => [newTeam, ...prev]);

    // Update challenge status to "Team Active" and link teamId
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === params.challengeId
          ? {
              ...c,
              status: "Team Active",
              teamId: newTeamId,
              progress: Math.max(c.progress, 5),
            }
          : c
      )
    );

    // Update students workload and activity
    setStudents((prev) =>
      prev.map((s) => {
        if (params.studentIds.includes(s.id)) {
          return {
            ...s,
            workload: Math.min(100, s.workload + 15),
            lastActivity: `Assigned to ${params.name} just now`,
          };
        }
        return s;
      })
    );

    // Update profile count
    setProfile((prev) => ({
      ...prev,
      activeTeamsCount: prev.activeTeamsCount + 1,
    }));

    // Add activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "team_update",
        text: `Created new student team '${params.name}' for challenge '${challengeTitle}'`,
        timestamp: "Just now",
        actorName: profile.name,
        actorAvatar: profile.avatar,
        challengeTitle,
        teamName: params.name,
      },
      ...prev,
    ]);

    return { success: true, message: "Team created successfully!", team: newTeam };
  };

  const createTask = (params: CreateTaskParams) => {
    const team = teams.find((t) => t.id === params.teamId);
    const student = students.find((s) => s.id === params.assignedStudentId);

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: params.title,
      description: params.description,
      teamId: params.teamId,
      teamName: team ? team.name : "Team",
      challengeId: team ? team.challengeId : "",
      assignedStudentId: params.assignedStudentId,
      assignedStudentName: student ? student.name : "Unassigned",
      assignedStudentAvatar: student ? student.avatar : "ST",
      priority: params.priority,
      deadline: params.deadline,
      status: "To Do",
      expectedOutput: params.expectedOutput,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setTasks((prev) => [newTask, ...prev]);

    // Update team task counters
    if (team) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === team.id
            ? {
                ...t,
                tasksTotal: t.tasksTotal + 1,
                tasksInProgress: t.tasksInProgress + 1,
                lastActivity: `New task assigned to ${student?.name || "student"}`,
              }
            : t
        )
      );
    }

    // Update student task count
    if (student) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id
            ? {
                ...s,
                pendingTasks: s.pendingTasks + 1,
                lastActivity: `Assigned task '${params.title}'`,
              }
            : s
        )
      );
    }

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "assignment",
        title: "Task Assigned",
        message: `Task '${params.title}' assigned to ${student?.name || "student"} on ${team?.name || "team"}.`,
        timeAgo: "Just now",
        isRead: false,
        link: "/mentor/tasks",
      },
      ...prev,
    ]);

    return { success: true, task: newTask };
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const reviewTask = (
    taskId: string,
    action: "approve" | "request_changes",
    feedback: string
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;

        if (action === "approve") {
          return {
            ...t,
            status: "Approved",
            submission: t.submission
              ? { ...t.submission, feedback }
              : {
                  submittedAt: "Recently",
                  description: "Completed",
                  files: [],
                  links: [],
                  feedback,
                },
          };
        } else {
          return {
            ...t,
            status: "Changes Requested",
            submission: t.submission
              ? { ...t.submission, changesRequestedReason: feedback }
              : {
                  submittedAt: "Recently",
                  description: "Revision requested",
                  files: [],
                  links: [],
                  changesRequestedReason: feedback,
                },
          };
        }
      })
    );

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (action === "approve") {
      // Update student completed tasks
      setStudents((prev) =>
        prev.map((s) =>
          s.id === task.assignedStudentId
            ? {
                ...s,
                completedTasks: s.completedTasks + 1,
                pendingTasks: Math.max(0, s.pendingTasks - 1),
                workload: Math.max(10, s.workload - 10),
                lastActivity: `Task '${task.title}' approved by mentor`,
              }
            : s
        )
      );

      // Update team tasks completed and progress
      setTeams((prev) =>
        prev.map((t) => {
          if (t.id !== task.teamId) return t;
          const completed = t.tasksCompleted + 1;
          const inProgress = Math.max(0, t.tasksInProgress - 1);
          const total = Math.max(completed, t.tasksTotal);
          const newProgress = Math.min(100, Math.round((completed / total) * 100));
          return {
            ...t,
            tasksCompleted: completed,
            tasksInProgress: inProgress,
            progress: newProgress,
            lastActivity: `Task '${task.title}' approved`,
          };
        })
      );

      // Activity
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: "task_completed",
          text: `Approved task submission '${task.title}' by ${task.assignedStudentName}`,
          timestamp: "Just now",
          actorName: profile.name,
          actorAvatar: profile.avatar,
          teamName: task.teamName,
        },
        ...prev,
      ]);
    } else {
      // Changes requested
      setStudents((prev) =>
        prev.map((s) =>
          s.id === task.assignedStudentId
            ? {
                ...s,
                status: "Needs Attention",
                lastActivity: `Changes requested on '${task.title}'`,
              }
            : s
        )
      );
    }
  };

  const createIndustryRequest = (params: CreateIndustryRequestParams) => {
    const challenge = challenges.find((c) => c.id === params.challengeId);
    const team = teams.find((t) => t.id === params.teamId);

    const newRequest: IndustryCollaborationRequest = {
      id: `collab-${Date.now()}`,
      challengeId: params.challengeId,
      challengeTitle: challenge ? challenge.title : "Challenge",
      teamId: params.teamId,
      teamName: team ? team.name : "Team",
      helpType: params.helpType,
      organization: params.organization,
      requestTitle: params.requestTitle,
      requirement: params.requirement,
      whyNeeded: params.whyNeeded,
      expectedSupport: params.expectedSupport,
      priority: params.priority,
      requiredBy: params.requiredBy,
      status: "Sent",
      dateSubmitted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUpdate: "Submitted today",
      attachmentName: params.attachmentName,
      details: params.details,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: profile.name,
          role: "mentor",
          text: `Submitted request for ${params.helpType}: "${params.requestTitle}" to ${params.organization}.`,
          timestamp: "Just now",
        },
      ],
    };

    setIndustryRequests((prev) => [newRequest, ...prev]);

    // Update challenge status
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === params.challengeId
          ? {
              ...c,
              industrySupportStatus: "Request Sent",
              status: c.status === "Completed" ? "Completed" : "Industry Collaboration Active",
            }
          : c
      )
    );

    // Update team industry status
    if (team) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === team.id
            ? {
                ...t,
                industrySupport: `${params.helpType} requested from ${params.organization}`,
              }
            : t
        )
      );
    }

    // Activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "industry_update",
        text: `Requested ${params.helpType} assistance from ${params.organization} for '${challenge?.title || "Challenge"}'`,
        timestamp: "Just now",
        actorName: profile.name,
        actorAvatar: profile.avatar,
        challengeTitle: challenge?.title,
      },
      ...prev,
    ]);

    return { success: true, request: newRequest };
  };

  const updateIndustryRequestStatus = (requestId: string, status: CollaborationStatus) => {
    setIndustryRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              lastUpdate: `Status updated to ${status} today`,
            }
          : r
      )
    );
  };

  const addIndustryMessage = (requestId: string, text: string) => {
    setIndustryRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: profile.name,
          role: "mentor" as const,
          text,
          timestamp: "Just now",
        };
        return {
          ...r,
          messages: [...(r.messages || []), newMsg],
          lastUpdate: "New message sent",
        };
      })
    );
  };

  const sendUniversityUpdate = (params: SendUniversityUpdateParams) => {
    const challenge = challenges.find((c) => c.id === params.challengeId);
    const challengeTitle = challenge ? challenge.title : "Challenge";

    const newUpdate: UniversityProgressUpdate = {
      id: `upd-${Date.now()}`,
      challengeId: params.challengeId,
      challengeTitle,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      progress: params.progress,
      title: params.title,
      workCompleted: params.workCompleted,
      currentWork: params.currentWork,
      blockers: params.blockers,
      studentPerformance: params.studentPerformance,
      industrySupport: params.industrySupport,
      nextSteps: params.nextSteps,
      expectedCompletionDate: params.expectedCompletionDate,
      attachments: params.attachments,
    };

    setUniversityUpdates((prev) => [newUpdate, ...prev]);

    // Update challenge progress and notes
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === params.challengeId
          ? {
              ...c,
              progress: Math.max(c.progress, params.progress),
              mentorNotes: `Latest University Update: ${params.title}`,
            }
          : c
      )
    );

    // Update team progress if exists
    const team = teams.find((t) => t.challengeId === params.challengeId);
    if (team) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === team.id
            ? {
                ...t,
                progress: Math.max(t.progress, params.progress),
                lastActivity: `Progress update sent to University`,
              }
            : t
        )
      );
    }

    // Add activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: "university_update",
        text: `Sent progress update (${params.progress}%) to University for '${challengeTitle}'`,
        timestamp: "Just now",
        actorName: profile.name,
        actorAvatar: profile.avatar,
        challengeTitle,
      },
      ...prev,
    ]);

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: "university_update",
        title: "Progress Update Dispatched",
        message: `University Coordinator notified of milestone: "${params.title}" (${params.progress}% complete).`,
        timeAgo: "Just now",
        isRead: false,
        link: `/mentor/challenges/${params.challengeId}`,
        relatedChallengeTitle: challengeTitle,
      },
      ...prev,
    ]);

    return { success: true };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const updateProfile = (updated: Partial<MentorProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <MentorContext.Provider
      value={{
        profile,
        challenges,
        teams,
        students,
        tasks,
        industryRequests,
        universityUpdates,
        notifications,
        activities,
        unreadNotificationsCount,
        createTeam,
        getTeamForChallenge,
        createTask,
        updateTaskStatus,
        reviewTask,
        createIndustryRequest,
        updateIndustryRequestStatus,
        addIndustryMessage,
        sendUniversityUpdate,
        markNotificationRead,
        markAllNotificationsRead,
        updateProfile,
      }}
    >
      {children}
    </MentorContext.Provider>
  );
}

export function useMentor() {
  const context = useContext(MentorContext);
  if (!context) {
    throw new Error("useMentor must be used within a MentorProvider");
  }
  return context;
}

