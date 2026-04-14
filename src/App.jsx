import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LMS from './pages/LMS';
import Assessment from './pages/Assessment';
import Analytics from './pages/Analytics';
// Import yang lain nanti di sini...

const App = () => {
  const [aiResult, setAiResult] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userStats] = useState({
    name: "Kelompok SmartLMS",
    skills: { technical: 35, communication: 30, problemSolving: 40, leadership: 30 },
  });

  const runAiAnalysis = async() => {
    setIsAnalysing(true);
    // Ambil API key dari .env
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log("API Key:", apiKey);

    const systemIntructions = "Anda adalah AI Career Expert dari Smart LMS UNNES. Analisis data mahasiswa dan berikan jawaban dalam Bahasa Indonesia yang profesional. Format jawaban: 1 paragraf analisis kecocokan karir dan 1 poin saran pengembangan diri.";

    const userQuery = `
    Analisis data user berikut:
    Nama: ${userStats.name}
    Skor Technical: ${userStats.skills.technical}%
    Skor Communication: ${userStats.skills.communication}%
    Skor Problem Solving: ${userStats.skills.problemSolving}%
    Skor Leadership: ${userStats.skills.leadership}%
    
    Berdasarkan data di atas, apa rekomendasi peran karir IT yang paling cocok (Software Engineer/Data Analyst/UI UX/DS) dan apa satu skill yang paling mendesak untuk ditingkatkan?
    `;
    
    // Model AI yang digunakan
    const models = [
      "nvidia/nemotron-3-nano-30b-a3b:free",
      "arcee-ai/trinity-large-preview:free",
      "minimax/minimax-m2.5:free"
    ];

    // Fungsi helper untuk mencoba model secara berurutan jika terjadi error
    const attemptFetch = async (modelName) => {
      console.log(`Mencoba menggunakan model: ${modelName}`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemIntructions },
            { role: "user", content: userQuery }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Model ${modelName} gagal (Status: ${response.status})`);
      }

      return await response.json();
    };

    // Logic Perulangan dengan fallback model
    let success = false;
    for (const model of models) {
      if (success) break;

      try {
        const data = await attemptFetch(model);
        const aiText = data.choices?.[0]?.message?.content;

        if (aiText) {
          setAiResult(aiText);
          console.log(`Berhasil dengan model: ${model}`);
          success = true;
        }
      } catch (error) {
        console.warn(error.message);
        // Jika model terakhir juga gagal, set hasil default
        if (model === models[models.length - 1]) {
          setAiResult("Semua AI Engine sedang sibuk. Silakan coba beberapa saat lagi.");
        }
      }
    }
    setIsAnalysing(false);
  };

  // Tambahkan ini di dalam komponen App, sebelum return
  useEffect(() => {
    const testFirebase = async () => {
      try {
        const docRef = await addDoc(collection(db, "test"), {
          pesan: "Halo dari Smart LMS!",
          waktu: new Date()
        });
        console.log("✅ Firebase terhubung! Doc ID:", docRef.id);
      } catch (error) {
        console.error("❌ Firebase gagal:", error);
      }
    };

    testFirebase();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h2>
        
        {activeTab === 'dashboard' && <Dashboard userStats={userStats} runAiAnalysis={runAiAnalysis} />}
        {activeTab === 'lms' && <LMS />}
        {activeTab === 'assessment' && <Assessment />}
        {activeTab === 'analytics' && (
          <Analytics 
            aiResult={aiResult}
            isAnalysing={isAnalysing}
            runAiAnalysis={runAiAnalysis}
          />
        )}
      </main>
    </div>
  );
};

export default App;