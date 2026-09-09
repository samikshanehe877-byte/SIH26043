"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle2, FileImage, FileVideo, FileText, AlertCircle } from "lucide-react";
import { Problem, ProblemCategory } from "@/types/problem";

const CATEGORIES: ProblemCategory[] = [
  "Infrastructure", "Environment", "Education", "Healthcare",
  "Transportation", "Public Safety", "Technology", "Water and Sanitation", "Other",
];

interface UploadedFile {
  name: string;
  size: string;
  type: "image" | "video" | "document";
}

interface PostProblemFormProps {
  onSubmitSuccess: (problem: Problem) => void;
}

export default function PostProblemForm({ onSubmitSuccess }: PostProblemFormProps) {
  const [title, setTitle]           = useState("");
  const [category, setCategory]     = useState<ProblemCategory | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation]     = useState("");
  const [files, setFiles]           = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted]   = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const fileInputRef                = useRef<HTMLInputElement>(null);

  const MAX_DESC = 1000;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())       e.title       = "Problem title is required.";
    if (!category)           e.category    = "Please select a category.";
    if (!description.trim()) e.description = "Description is required.";
    else if (description.length < 50) e.description = "Please provide at least 50 characters.";
    if (!location.trim())    e.location    = "Location is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const mapped: UploadedFile[] = selected.map((f) => ({
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : "document",
    }));
    setFiles((prev) => [...prev, ...mapped]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newProblem: Problem = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      category: category as ProblemCategory,
      location: location.trim(),
      citizenName: "Sarthak Nehe",
      citizenAvatar: "SN",
      date: "Just now",
      status: "Submitted",
      supporters: 0,
      comments: [],
      progress: 5,
      currentStep: 1,
      image: "📋",
    };

    onSubmitSuccess(newProblem);
    setSubmitted(true);
  };

  const handleReset = () => {
    setTitle(""); setCategory(""); setDescription("");
    setLocation(""); setFiles([]); setErrors({}); setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-green-100 bg-green-50 p-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-800">Problem Submitted Successfully!</h3>
        <p className="mt-2 max-w-sm text-sm text-green-700">
          Your problem has been submitted successfully and will be reviewed by our admin team. You will receive notifications as it progresses.
        </p>
        <button
          onClick={handleReset}
          className="mt-6 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          Submit Another Problem
        </button>
      </div>
    );
  }

  const fileIcons = { image: FileImage, video: FileVideo, document: FileText };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Problem Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
          placeholder="e.g. Broken streetlights on Main Road causing safety issues"
          className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100 ${errors.title ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
        />
        {errors.title && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} />{errors.title}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value as ProblemCategory); setErrors((p) => ({ ...p, category: "" })); }}
          className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100 ${errors.category ? "border-red-300" : "border-slate-200 focus:border-blue-400"}`}
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} />{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs font-medium ${description.length > MAX_DESC * 0.9 ? "text-red-500" : "text-slate-400"}`}>
            {description.length}/{MAX_DESC}
          </span>
        </div>
        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value.slice(0, MAX_DESC)); setErrors((p) => ({ ...p, description: "" })); }}
          placeholder="Describe the problem in detail — what is happening, how long it has been occurring, who is affected, and what impact it is having on the community..."
          rows={5}
          className={`w-full resize-none rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100 ${errors.description ? "border-red-300" : "border-slate-200 focus:border-blue-400"}`}
        />
        {errors.description && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} />{errors.description}</p>}
      </div>

      {/* Location */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => { setLocation(e.target.value); setErrors((p) => ({ ...p, location: "" })); }}
          placeholder="e.g. Kothrud, Pune, Maharashtra"
          className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100 ${errors.location ? "border-red-300" : "border-slate-200 focus:border-blue-400"}`}
        />
        {errors.location && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} />{errors.location}</p>}
      </div>

      {/* File Upload */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Attachments <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
        >
          <Upload size={24} className="text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-600">Click to upload files</p>
            <p className="text-xs text-slate-400">Images, Videos, or Documents (PDF, DOC)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* File previews */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file, index) => {
              const Icon = fileIcons[file.type];
              return (
                <div key={index} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm">
                  <Icon size={16} className="flex-shrink-0 text-blue-500" />
                  <span className="flex-1 truncate text-sm text-slate-700">{file.name}</span>
                  <span className="flex-shrink-0 text-xs text-slate-400">{file.size}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          Submit Problem
        </button>
      </div>
    </form>
  );
}
