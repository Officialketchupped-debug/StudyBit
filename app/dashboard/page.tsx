'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Flame, Play, CheckCircle2, Users, BarChart } from 'lucide-react';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isStudying, setIsStudying] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // 1. Fetch User Data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    };
    getUser();
  }, []);

  // 2. Timer Logic (Simplified)
  useEffect(() => {
    let interval: any;
    if (isStudying) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-xl font-bold text-indigo-600 mb-8">StudyBit</h1>
        <nav className="space-y-4 flex-1">
          <button className="flex items-center gap-3 text-indigo-600 font-semibold w-full">
            <Timer size={20} /> Dashboard
          </button>
          <button className="flex items-center gap-3 text-gray-500 hover:text-indigo-600 w-full">
            <Users size={20} /> Groups
          </button>
          <button className="flex items-center gap-3 text-gray-500 hover:text-indigo-600 w-full">
            <BarChart size={20} /> Statistics
          </button>
        </nav>
        
        {userProfile && (
          <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
            <img src={userProfile.avatar_url} className="w-10 h-10 rounded-full" alt="Profile" />
            <div className="truncate">
              <p className="text-sm font-bold truncate">{userProfile.username}</p>
              <p className="text-xs text-gray-500">Scholar</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">Welcome back!</h2>
              <p className="text-gray-500">You need 30 minutes today to keep the streak alive.</p>
            </div>
            <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full flex items-center gap-2 font-bold">
              <Flame size={20} /> 12 Day Streak
            </div>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Timer Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-600" 
                    strokeDasharray={553} strokeDashoffset={553 - (553 * (seconds / 1800))} strokeLinecap="round" />
                </svg>
                <span className="text-4xl font-mono font-bold">{formatTime(seconds)}</span>
              </div>
              
              <button 
                onClick={() => setIsStudying(!isStudying)}
                className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 ${
                  isStudying ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 shadow-lg'
                }`}
              >
                {isStudying ? 'Stop Session' : <><Play size={20} fill="currentColor" /> Start Studying</>}
              </button>
              <p className="text-xs text-gray-400 font-medium tracking-wide">MINIMUM: 30 MINUTES</p>
            </div>

            {/* Group Streak Progress */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users size={18} className="text-indigo-600" /> VSU Dev Team
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Jonei', status: 'done', time: '45m' },
                  { name: 'Lourennz', status: 'studying', time: '12m' },
                  { name: 'You', status: 'pending', time: '0m' }
                ].map((member) => (
                  <div key={member.name} className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                    <span className="font-medium">{member.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{member.time}</span>
                      {member.status === 'done' ? (
                        <CheckCircle2 className="text-green-500" size={18} />
                      ) : member.status === 'studying' ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 italic">"If everyone hits 30m, the flame stays alive!"</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}