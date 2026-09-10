"use client";

import { useStudent } from "@/context/StudentContext";
import { BookOpen, ExternalLink, FileText, LayoutTemplate, Database, Code, ShieldQuestion } from "lucide-react";

export default function StudentResourcesPage() {
  const { resources } = useStudent();

  const getIcon = (type: string) => {
    switch(type) {
      case "Tutorial": return <LayoutTemplate className="text-pink-500" size={24} />;
      case "Research Paper": return <FileText className="text-blue-500" size={24} />;
      case "Dataset": return <Database className="text-green-500" size={24} />;
      case "API": return <Code className="text-amber-500" size={24} />;
      default: return <BookOpen className="text-indigo-500" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Project Resources</h1>
        <p className="mt-1 text-slate-500">Curated materials to help you complete your challenge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <div key={resource.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                {getIcon(resource.type)}
              </div>
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {resource.type}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">{resource.title}</h3>
            <p className="text-sm text-slate-600 mb-4 flex-grow">{resource.description}</p>
            
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill:</span>
                <span className="text-sm font-medium text-slate-700">{resource.relatedSkill}</span>
              </div>
              
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                Open Resource <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}

        {/* Suggestion Card */}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 mb-4">
            <ShieldQuestion size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Need something else?</h3>
          <p className="text-sm text-slate-500 mb-4">Ask the AI Assistant or your mentor for specific resources.</p>
          <a href="/student/ai-assistant" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Ask AI Assistant
          </a>
        </div>
      </div>
    </div>
  );
}

