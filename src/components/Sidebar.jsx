import React from 'react';
import { LayoutDashboard, BookOpen, Target, BarChart3, BrainCircuit } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const NavItem = ({ icon: Icon, label, id }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
        activeTab === id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 h-screen sticky top-0">
      <div className="flex items-center gap-2 text-indigo-600">
        <BrainCircuit size={28} />
        <h1 className="text-xl font-bold tracking-tight">SmartLMS</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
        <NavItem icon={BookOpen} label="Course Mode" id="lms" />
        <NavItem icon={Target} label="Direct Assessment" id="assessment" />
        <NavItem icon={BarChart3} label="Analytics AI" id="analytics" />
      </nav>
    </aside>
  );
};

export default Sidebar;