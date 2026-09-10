"use client";

import { useStudent } from "@/context/StudentContext";
import { Folder, FileText, FileSpreadsheet, Image as ImageIcon, Download, UploadCloud, Search, MoreVertical, FileCode } from "lucide-react";
import { useState } from "react";

export default function StudentFilesPage() {
  const { recentFiles } = useStudent();
  const [searchTerm, setSearchTerm] = useState("");

  const folders = [
    "Research",
    "Dataset",
    "Documentation",
    "Design",
    "Code / Links",
    "Reports",
    "Final Submission"
  ];

  const getFileIcon = (type: string) => {
    switch(type) {
      case "document": return <FileText className="text-blue-500" size={24} />;
      case "dataset": return <FileSpreadsheet className="text-green-500" size={24} />;
      case "image": return <ImageIcon className="text-purple-500" size={24} />;
      case "code": return <FileCode className="text-amber-500" size={24} />;
      default: return <FileText className="text-slate-500" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shared Files</h1>
          <p className="mt-1 text-slate-500">Access and upload team documents and resources.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          <UploadCloud size={18} />
          Upload File
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {folders.map(folder => (
          <div key={folder} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm cursor-pointer transition">
            <Folder className="text-indigo-500" size={24} fill="currentColor" fillOpacity={0.2} />
            <span className="font-semibold text-slate-700 text-sm">{folder}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-bold text-slate-800">Recent Files</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search files..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Folder</th>
                <th className="px-6 py-4 font-semibold">Uploaded By</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Size</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentFiles.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(file => (
                <tr key={file.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <span className="font-medium text-slate-800">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {file.folder}
                    </span>
                  </td>
                  <td className="px-6 py-4">{file.uploadedBy}</td>
                  <td className="px-6 py-4">{file.uploadDate}</td>
                  <td className="px-6 py-4">{file.size}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {recentFiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No files found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

