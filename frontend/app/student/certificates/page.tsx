"use client";

import { useStudent } from "@/context/StudentContext";
import { FileBadge, Download, CheckCircle2, Building2, Calendar, Award } from "lucide-react";

export default function StudentCertificatesPage() {
  const { certificates } = useStudent();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
        <p className="mt-1 text-slate-500">Official verified certificates for completed SIH challenges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map(cert => (
          <div key={cert.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Certificate Header Banner */}
            <div className="h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600"></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <FileBadge size={24} />
                </div>
                {cert.status === "Verified" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1">{cert.challengeTitle}</h2>
              <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-1.5">
                <Building2 size={14} /> Issued by: {cert.issueAuthority}
              </p>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-semibold text-slate-900">{cert.studentName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Completion Date:</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1"><Calendar size={14} /> {cert.completionDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Certificate ID:</span>
                  <span className="font-mono font-medium text-slate-700">{cert.certificateId}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                  <Award size={16} /> View Certificate
                </button>
                <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition">
                  <Download size={18} />
                </button>
              </div>
            </div>
            
            {/* Watermark Logo Mock */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5 pointer-events-none">
              <Award size={120} />
            </div>
          </div>
        ))}
      </div>
      
      {certificates.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
          <FileBadge className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No Certificates Yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Complete your assigned challenge and pass the verification process to earn your official certificate.
          </p>
        </div>
      )}
    </div>
  );
}

