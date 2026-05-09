"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { 
  Timer, 
  Users, 
  BarChart3, 
  User, 
  LogOut, 
  Flame 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Redirect to login after signing out
  };

  const navLinks = [
    { name: "Timer", href: "/dashboard/timer", icon: Timer },
    { name: "Groups", href: "/dashboard/groups", icon: Users },
    { name: "Stats", href: "/dashboard/stats", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 shadow-sm">
        {/* Branding */}
        <div className="mb-10 flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <Flame size={18} className="text-white fill-current" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter">StudyBit</h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                  isActive
                    ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-100"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Account Section (Pinned to Bottom) */}
        <div className="pt-6 border-t border-slate-50 mt-auto">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">
            Account
          </p>
          
          {/* Profile Link */}
          <Link 
            href="/dashboard/profile"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all group ${
              pathname === "/dashboard/profile" 
                ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-100" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden border transition-colors ${
              pathname === "/dashboard/profile" ? "bg-white border-orange-200" : "bg-slate-100 border-slate-200"
            }`}>
              <User size={16} />
            </div>
            <span className="text-sm">My Profile</span>
          </Link>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all mt-1"
          >
            <LogOut size={20} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}