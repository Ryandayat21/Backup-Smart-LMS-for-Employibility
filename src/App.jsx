import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Pastikan auth sudah diekspor di firebase.js
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Import Pages
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Analytics from './pages/Analytics';
import SetupProfile from './pages/SetupProfile';
import Login from './pages/Login'; 

const App = () => {
  // --- STATE UTAMA ---
  const [user, setUser] = useState(null); // Data user dari Firebase (termasuk role & targetJob)
  const [loading, setLoading] = useState(true); // Status loading saat cek login
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiResult, setAiResult] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);

  // --- 1. MONITOR STATUS LOGIN (AUTH) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Jika ada yang login, cari datanya di Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Gabungkan data Auth (email/uid) dengan data Firestore (role/job/skills)
          setUser({ uid: currentUser.uid, ...docSnap.data() });
        } else {
          // Jika login berhasil tapi data di Firestore belum ada (user baru)
          setUser({ 
            uid: currentUser.uid, 
            name: currentUser.displayName || "User Baru", 
            isNew: true 
          });
        }
      } else {
        setUser(null); // Tidak ada yang login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. FUNGSI AI (UPDATE TERBARU) ---
  const runAiAnalysis = async () => {
    if (!user || !user.skills) return;
    
    setIsAnalysing(true);
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    const systemInstructions = "Anda adalah AI Career Expert dari Smart LMS UNNES. Analisis 10 aspek kompetensi mahasiswa sesuai target pekerjaan mereka.";

    const userQuery = `
      Nama: ${user.name}
      Target Pekerjaan: ${user.targetJob || "Belum ditentukan"}
      
      Skor Aspek:
      - Technical: ${user.skills.technical}%
      - Communication: ${user.skills.communication}%
      - Problem Solving: ${user.skills.problemSolving}%
      - Leadership: ${user.skills.leadership}%
      - Teamwork: ${user.skills.teamwork || 0}%
      - Emotional Intel: ${user.skills.emotionalIntel || 0}%
      - Digital Literacy: ${user.skills.digitalLiteracy || 0}%
      - Critical Thinking: ${user.skills.criticalThinking || 0}%
      - Attention to Detail: ${user.skills.attentionDetail || 0}%
      - Work Ethic: ${user.skills.workEthic || 0}%

      Berikan analisis kecocokan untuk posisi ${user.targetJob} dan 1 saran perbaikan.
    `;

    const models = [
      "nvidia/nemotron-3-nano-30b-a3b:free",
      "arcee-ai/trinity-large-preview:free",
      "minimax/minimax-m2.5:free"
    ];

    // ... (Fungsi attemptFetch tetap sama seperti sebelumnya)
    const attemptFetch = async (modelName) => {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: systemInstructions },
              { role: "user", content: userQuery }
            ]
          })
        });
        if (!response.ok) throw new Error("Gagal");
        return await response.json();
    };

    let success = false;
    for (const model of models) {
      if (success) break;
      try {
        const data = await attemptFetch(model);
        const aiText = data.choices?.[0]?.message?.content;
        if (aiText) {
          setAiResult(aiText);
          success = true;
        }
      } catch (e) { console.warn(e.message); }
    }
    setIsAnalysing(false);
  };

  // --- 3. LOGIKA TAMPILAN (RENDERING) ---
  
  // A. Jika masih loading cek login
  if (loading) return <div className="flex h-screen items-center justify-center">Memuat Smart LMS...</div>;

  // B. Jika belum login (Nanti kita buat pages/Login.jsx)
  if (!user) return <Login />;

  // C. Jika user baru (Belum isi data diri/target job)
  if (user.isNew === true || !user.targetJob) {
    return <SetupProfile user={user} />;
  }

  // D. Tampilan Utama (Sudah Login & Punya Data)
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={user.role} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider">Halaman</p>
            <h2 className="text-3xl font-extrabold capitalize text-slate-800">{activeTab}</h2>
          </div>
          <div className="text-right bg-white p-3 rounded-xl shadow-sm border border-slate-100">
            <p className="font-bold text-slate-700">{user.name}</p>
            <p className="text-xs text-indigo-600 font-medium">{user.role?.toUpperCase()} | {user.targetJob}</p>
          </div>
        </div>
        
        {/* Konten Berdasarkan Tab */}
        {activeTab === 'dashboard' && 
          <Dashboard 
          user={user} 
          runAiAnalysis={runAiAnalysis} 
        />}
        {activeTab === 'assessment' && <Assessment user={user} />}
        {activeTab === 'analytics' && (
          <Analytics 
            user={user}
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