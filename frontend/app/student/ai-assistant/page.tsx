"use client";

import { useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { Bot, User, Send, Sparkles, Lightbulb } from "lucide-react";

export default function StudentAIAssistantPage() {
  const { activeChallenge } = useStudent();
  const [input, setInput] = useState("");
  
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "ai",
      text: `Hello! I'm your AI Project Assistant for the "${activeChallenge.title}" challenge. I can help you understand the problem, suggest technologies, debug code, or explain documentation. How can I assist you today?`
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        text: "Based on the current project requirements, I recommend checking the documentation for the specific framework you are using. Would you like me to generate a template or explain a concept in more detail?" 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const suggestAction = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            AI Project Assistant <Sparkles size={14} className="text-amber-500" />
          </h2>
          <p className="text-xs text-slate-500">Powered by SIH Platform AI</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
              msg.role === "user" ? "bg-indigo-100 text-indigo-600" : "bg-purple-600 text-white shadow-sm"
            }`}>
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`rounded-2xl px-5 py-3.5 text-sm max-w-[80%] ${
              msg.role === "user" 
                ? 'bg-indigo-600 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm leading-relaxed'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-100 bg-white p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <button onClick={() => suggestAction("Explain the problem statement simply.")} className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 transition">
            <Lightbulb size={12} /> Explain Problem
          </button>
          <button onClick={() => suggestAction("What ML model should we test for this?")} className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 transition">
            <Lightbulb size={12} /> Suggest ML Model
          </button>
          <button onClick={() => suggestAction("Generate a task checklist.")} className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100 transition">
            <Lightbulb size={12} /> Generate Checklist
          </button>
        </div>
        
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="flex flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI Assistant..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

