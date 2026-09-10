"use client";

import { useStudent } from "@/context/StudentContext";
import { CheckSquare, Clock, AlertCircle, PlayCircle, Upload } from "lucide-react";
import Link from "next/link";
import { TaskStatus } from "@/types/student";

export default function StudentTasksPage() {
  const { tasks, updateTaskStatus } = useStudent();

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "To Do": return "bg-slate-100 text-slate-700 border-slate-200";
      case "In Progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Submitted": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Under Review": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Changes Requested": return "bg-red-50 text-red-700 border-red-200";
      case "Approved": return "bg-teal-50 text-teal-700 border-teal-200";
      case "Completed": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-amber-600 bg-amber-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
        <p className="mt-1 text-slate-500">Manage your assigned tasks and submit your work.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map(task => (
          <div key={task.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                {task.priority} Priority
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">{task.title}</h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{task.description}</p>
            
            {task.requirements && task.requirements.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Requirements</p>
                <ul className="list-disc list-inside text-sm text-slate-700">
                  {task.requirements.map((req, i) => <li key={i}>{req}</li>)}
                </ul>
              </div>
            )}

            {task.mentorFeedback && (
              <div className="mb-4 rounded-lg bg-amber-50 p-3 border border-amber-100">
                <p className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                  <AlertCircle size={14} /> Mentor Feedback
                </p>
                <p className="text-sm text-amber-900">{task.mentorFeedback}</p>
              </div>
            )}

            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock size={14} /> Due {task.dueDate}</span>
                <span>Assigned by: {task.assignedBy}</span>
              </div>
              
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div 
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${task.progress}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {task.status === "To Do" && (
                  <button 
                    onClick={() => updateTaskStatus(task.id, "In Progress")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <PlayCircle size={16} /> Start Task
                  </button>
                )}
                
                {(task.status === "In Progress" || task.status === "Changes Requested") && (
                  <>
                    <button 
                      onClick={() => alert("Open progress update modal")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Update Progress
                    </button>
                    <button 
                      onClick={() => updateTaskStatus(task.id, "Submitted")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                    >
                      <Upload size={16} /> Submit Work
                    </button>
                  </>
                )}
                
                {task.status === "Submitted" && (
                  <span className="w-full text-center text-sm font-medium text-slate-500 py-2">
                    Waiting for Mentor Review...
                  </span>
                )}
                
                {task.status === "Approved" && (
                  <span className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-teal-600 py-2">
                    <CheckSquare size={16} /> Task Approved
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

