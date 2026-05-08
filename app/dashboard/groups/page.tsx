"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Users, Plus, Hash, Flame, LogOut, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { getUserGroups, leaveGroup, joinGroup, createGroup } from "@/lib/groups/actions";

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form States
  const [joinId, setJoinId] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const userGroups = await getUserGroups(user.id);
        setGroups(userGroups);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleJoin = async () => {
    if (!joinId || !user) return;
    setIsSubmitting(true);
    try {
      await joinGroup(joinId, user.id);
      const updated = await getUserGroups(user.id);
      setGroups(updated);
      setShowModal(false);
      setJoinId("");
    } catch (err: any) {
      alert(err.message || "Could not join group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async () => {
    if (!newGroupName || !user) return;
    setIsSubmitting(true);
    try {
      await createGroup(newGroupName, user.id);
      const updated = await getUserGroups(user.id);
      setGroups(updated);
      setShowModal(false);
      setNewGroupName("");
    } catch (err: any) {
      alert("Error creating group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeave = async (groupId: string, name: string) => {
    if (confirm(`Are you sure you want to leave ${name}?`)) {
      if (user) {
        await leaveGroup(groupId, user.id);
        setGroups(groups.filter(g => g.id !== groupId));
      }
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Your Groups</h2>
          <p className="text-slate-500">Manage your collective study streaks.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-6 py-6 font-bold shadow-lg shadow-orange-100 flex items-center gap-2"
        >
          <Plus size={20} /> Create or Join Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Groups Yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm">
            StudyBit is better with friends. Join a group or create one to start a streak.
          </p>
          <Button onClick={() => setShowModal(true)} variant="outline" className="rounded-xl border-slate-200 text-slate-600">
            Get Started
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:border-orange-200 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <Users className="text-orange-600" size={24} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Flame size={14} className="fill-current" /> {group.group_streak} Day Streak
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">{group.name}</h3>
              <p className="text-[10px] font-mono text-slate-400 mb-6 uppercase tracking-tight">ID: {group.id.slice(0, 8)}...</p>
              
              <div className="flex items-center gap-2">
                <Link 
                  href={`/dashboard/groups/${group.id}`}
                  className="flex-1 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 font-bold py-3 rounded-xl text-[10px] uppercase transition-colors flex items-center justify-center gap-2"
                >
                  View Pulse <ArrowRight size={14} />
                </Link>
                <button 
                  onClick={() => handleLeave(group.id, group.name)}
                  className="px-4 py-3 text-slate-300 hover:text-red-500 transition-colors"
                  title="Leave Group"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800">Add Group</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-8">
              {/* Join Section */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Join Existing</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InputField 
                      placeholder="Enter Group ID" 
                      icon={<Hash size={18} />} 
                      value={joinId} 
                      onChange={(e) => setJoinId(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleJoin} 
                    disabled={isSubmitting || !joinId}
                    className="bg-slate-900 text-white h-14 rounded-2xl px-6 font-bold"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Join"}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-300 bg-white px-4 tracking-[0.2em]">OR</div>
              </div>

              {/* Create Section */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Create New</label>
                <InputField 
                  placeholder="e.g. VSU Dev Team" 
                  icon={<Plus size={18} />} 
                  value={newGroupName} 
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <Button 
                  onClick={handleCreate} 
                  disabled={isSubmitting || !newGroupName}
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-2xl font-bold shadow-lg shadow-orange-100"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Group"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}