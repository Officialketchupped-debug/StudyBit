"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, Clock, Users, BarChart3, LogOut } from "lucide-react";
import { logoutUser } from "@/lib/auth/auth-actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Highlight logic for the sidebar items
  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
      router.refresh();
    } catch (err) {
      alert("Failed to log out.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Matches your design */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <Flame className="w-6 h-6 text-orange-600 fill-current" />
          <span className="text-xl font-bold text-slate-800 tracking-tight">StudyBit</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link 
            href="/dashboard/timer"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive("/dashboard/timer") 
                ? "bg-orange-50 text-orange-600" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Clock size={20} /> Timer
          </Link>

          <Link 
            href="/dashboard/groups"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive("/dashboard/groups") 
                ? "bg-orange-50 text-orange-600" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Users size={20} /> Groups
          </Link>

          <Link 
            href="/dashboard/stats"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              isActive("/dashboard/stats") 
                ? "bg-orange-50 text-orange-600" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <BarChart3 size={20} /> Stats
          </Link>
        </nav>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition font-bold"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}