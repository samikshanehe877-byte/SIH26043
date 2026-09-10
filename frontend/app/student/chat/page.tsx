"use client";

import { useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { Send, Paperclip, Image as ImageIcon, Smile, MoreVertical, Hash } from "lucide-react";

export default function StudentChatPage() {
  const { profile, team } = useStudent();
  const [message, setMessage] = useState("");
  
  // Mock chat state
  const [messages, setMessages] = useState([
    {
      id: "1",
      senderId: "stu-2",
      senderName: "Maria Garcia",
      role: "Backend Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      text: "I completed the dataset preprocessing.",
      time: "10:15 AM",
      isSelf: false
    },
    {
      id: "2",
      senderId: "stu-1",
      senderName: profile.name,
      role: "Frontend Developer",
      avatar: profile.avatar,
      text: "I'll integrate it with the ML model.",
      time: "10:20 AM",
      isSelf: true
    },
    {
      id: "3",
      senderId: "mentor-1",
      senderName: "Prof. Sarah Connor",
      role: "Lead Mentor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      text: "Please upload the updated results before Friday.",
      time: "11:00 AM",
      isSelf: false,
      isMentor: true
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      senderId: profile.id,
      senderName: profile.name,
      role: "Frontend Developer",
      avatar: profile.avatar,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };
    
    setMessages([...messages, newMsg]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Hash size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Team {team.name} — General</h2>
            <p className="text-xs text-slate-500">{team.members.length + 1} members</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
            {!msg.isSelf && (
              <img src={msg.avatar} alt={msg.senderName} className="h-8 w-8 rounded-full bg-white shadow-sm" />
            )}
            
            <div className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'} max-w-[70%]`}>
              <div className={`flex items-baseline gap-2 mb-1 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
                <span className="text-xs font-semibold text-slate-700">{msg.senderName}</span>
                {msg.isMentor && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">Mentor</span>
                )}
                <span className="text-[10px] text-slate-400">{msg.time}</span>
              </div>
              
              <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                msg.isSelf 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="border-t border-slate-100 bg-white p-4">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition">
            <button type="button" className="text-slate-400 hover:text-slate-600 p-1">
              <Paperclip size={18} />
            </button>
            <button type="button" className="text-slate-400 hover:text-slate-600 p-1">
              <ImageIcon size={18} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400"
            />
            <button type="button" className="text-slate-400 hover:text-slate-600 p-1">
              <Smile size={18} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

