import React from 'react';
import { BrainCircuit, Sparkles, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

// WAJIB: Tambahkan props di dalam kurung ini agar data AI masuk
const Analytics = ({ aiResult, isAnalysing, runAiAnalysis }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Map Placeholder */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-75">
          <TrendingUp size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-400 font-medium italic text-center">
            [ Visualisasi Grafik Radar Skill Karir ]
          </p>
          <p className="text-[10px] text-slate-300 mt-2 italic text-center text-wrap px-4">
            Grafik akan otomatis ter-update berdasarkan performa belajar di Layer 1 & 2.
          </p>
        </div>

        {/* AI Interpretation */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                  <BrainCircuit className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold">Smart Analysis Insight</h3>
              </div>
              {/* Tombol Refresh AI */}
              <button 
                onClick={runAiAnalysis}
                disabled={isAnalysing}
                className="p-2 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
              >
                {isAnalysing ? <Loader2 className="animate-spin text-indigo-400" size={20}/> : <Sparkles className="text-indigo-400" size={20}/>}
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Box Hasil AI */}
              <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 min-h-37.5">
                <div className="mt-1">
                  <Sparkles className="text-amber-400 shrink-0" size={20} />
                </div>
                
                {isAnalysing ? (
                  <div className="flex flex-col gap-2 w-full animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                    <p className="text-xs text-indigo-400 mt-2 italic text-center font-black">Saya sedang meracik saran karirmu...</p>
                  </div>
                ) : (
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {aiResult || "Belum ada analisis. Klik ikon bintang di pojok kanan atas untuk memulai analisis AI berdasarkan data belajarmu."}
                  </div>
                )}
              </div>

              {/* Box Info Tambahan */}
              {!isAnalysing && aiResult && (
                <div className="flex gap-4 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <AlertCircle className="text-indigo-400 shrink-0" size={20} />
                  <p className="text-xs text-slate-300 italic">
                    Analisis ini bersifat rekomendasi berbasis data objektif.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50" disabled={isAnalysing}>
            Download Career Roadmap (.pdf)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;