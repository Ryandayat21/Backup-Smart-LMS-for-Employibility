import React from 'react';
import { BarChart3, Sparkles, ArrowRight } from 'lucide-react';

const Dashboard = ({ userStats, runAiAnalysis }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="font-bold mb-6 flex items-center gap-2"><BarChart3 size={18}/> Skill Proficiency</h3>
        <div className="space-y-4">
        {Object.entries(userStats.skills).map(([skill, val], i) => {
            // Array warna agar tiap bar beda warna
            const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500'];
            return (
            <div key={skill} className="space-y-1">
                <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-600 capitalize">
                    {skill.replace(/([A-Z])/g, ' $1').trim()} {/* Agar ProblemSolving jadi Problem Solving */}
                </span>
                <span className="font-bold text-slate-900">{val}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${colors[i % colors.length]} transition-all duration-1000`} style={{ width: `${val}%` }}></div>
                </div>
            </div>
            );
            })}
        </div>
      </div>
      <button onClick={runAiAnalysis} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2">
        Cek Rekomendasi Karir AI <Sparkles size={18}/>
      </button>
    </div>
  );
};

export default Dashboard;