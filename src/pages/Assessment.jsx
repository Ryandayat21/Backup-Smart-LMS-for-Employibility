import React from 'react';
import { Target, Trophy, ClipboardCheck, ArrowRight } from 'lucide-react';

const Assessment = () => {
  const testTypes = [
    { 
      title: "Placement Test: Frontend", 
      desc: "Ukur level skill React & Tailwind kamu.",
      icon: <Target className="text-blue-600" />,
      tag: "DIAGNOSTIC"
    },
    { 
      title: "Sertifikasi: UI Design", 
      desc: "Dapatkan e-certificate internal UNNES.",
      icon: <Trophy className="text-amber-600" />,
      tag: "CERTIFICATION"
    },
    { 
      title: "Career Mapping: DevOp", 
      desc: "Analisis kecocokanmu di bidang infrastruktur.",
      icon: <ClipboardCheck className="text-emerald-600" />,
      tag: "CAREER MAP"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-8 text-center">
        <h3 className="text-indigo-900 font-bold text-lg mb-2">Layer 2: Direct Assessment Mode</h3>
        <p className="text-indigo-700 text-sm italic">"Ujian kompetensi langsung tanpa harus mengikuti course."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testTypes.map((test, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-500 transition-all group cursor-pointer">
            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {test.icon}
            </div>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{test.tag}</span>
            <h4 className="font-bold text-slate-800 mt-1 mb-2">{test.title}</h4>
            <p className="text-xs text-slate-500 mb-6">{test.desc}</p>
            <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-600">
              Mulai Ujian <ArrowRight size={14}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assessment;