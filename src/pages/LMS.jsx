import React from 'react';
import { PlayCircle } from 'lucide-react';

const LMS = () => {
  const courses = [
    { title: "React Dasar", progress: 80, modules: 12 },
    { title: "UI/UX Design", progress: 30, modules: 8 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course, i) => (
        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <PlayCircle className="text-indigo-600 mb-4" size={32} />
          <h4 className="font-bold text-slate-800 mb-2">{course.title}</h4>
          <p className="text-xs text-slate-500 mb-4">{course.modules} Modules</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600" style={{ width: `${course.progress}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LMS;