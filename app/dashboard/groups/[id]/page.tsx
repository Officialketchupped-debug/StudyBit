"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGroupPulse } from "@/lib/groups/actions";
import { Flame, ArrowLeft, User, ShieldCheck, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GroupPulsePage() {
  const { id } = useParams();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const data = await getGroupPulse(id as string);
        setMembers(data);
      } catch (err) {
        console.error("Pulse error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPulse();
  }, [id]);

  const finishedCount = members.filter(m => m.hasFinishedToday).length;
  const progressPercent = (finishedCount / members.length) * 100;

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Back to Groups
      </button>

      {/* Group Status Hero */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
              <Flame className="text-white fill-current" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Group Pulse</h2>
              <p className="text-slate-400 text-sm">Collective daily goal: 30 minutes each</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Team Readiness
              </span>
              <span className="text-2xl font-bold text-orange-600">
                {finishedCount}/{members.length}
              </span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 text-center italic">
              {progressPercent === 100 ? "🔥 Everyone is on fire! Streak safe." : "Need everyone to finish to keep the flame burning."}
            </p>
          </div>
        </div>
      </div>

      {/* Member List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div 
            key={member.id} 
            className={`p-6 rounded-3xl border transition-all flex items-center justify-between ${
              member.hasFinishedToday 
              ? "bg-orange-50 border-orange-100 shadow-sm" 
              : "bg-white border-slate-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                member.hasFinishedToday ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800">{member.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  <Clock size={10} /> {member.totalMinutes}m Lifetime
                </div>
              </div>
            </div>

            {member.hasFinishedToday ? (
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="text-orange-600" size={24} />
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-tighter">Ready</span>
              </div>
            ) : (
              <div className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                Pending
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}