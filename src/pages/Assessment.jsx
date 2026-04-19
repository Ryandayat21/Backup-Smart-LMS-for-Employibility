import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { CheckCircle2, ArrowRight, ClipboardList } from 'lucide-react';

  // --- BANK SOAL (Contoh 10 Soal mewakili 10 Aspek) ---
const questionBank = [
  {
    id: 1,
    question: "Bagaimana cara Anda menangani data yang hilang dalam sebuah dataset?",
    options: ["Dihapus saja", "Dibiarkan", "Imputasi dengan Mean/Median", "Tanya teman"],
    answer: "Imputasi dengan Mean/Median",
    category: "technical",
    impact: { "data-analyst": 1.5, "marketing": 0.5 }
  },
  {
    id: 2,
    question: "Jika klien marah karena hasil laporan terlambat, apa tindakan Anda?",
    options: ["Minta maaf & beri solusi", "Diamkan", "Salahkan tim lain", "Blokir nomornya"],
    answer: "Minta maaf & beri solusi",
    category: "communication",
    impact: { "front-office": 1.8, "data-analyst": 0.7 }
  },
  {
    id: 3,
    question: "Apa yang Anda lakukan ketika menemukan bug kritis di production tepat sebelum jam pulang?",
    options: ["Langsung perbaiki & laporkan", "Pulang dulu, besok diperbaiki", "Pura-pura tidak tahu", "Salahkan rekan kerja"],
    answer: "Langsung perbaiki & laporkan",
    category: "technical",
    impact: { "backend-developer": 1.8, "frontend-developer": 1.5, "data-analyst": 0.8 }
  },
  {
    id: 4,
    question: "Bagaimana cara Anda memprioritaskan pekerjaan ketika memiliki banyak tugas dengan deadline yang sama?",
    options: ["Kerjakan semua sekaligus", "Buat prioritas berdasarkan urgensi & dampak", "Pilih yang termudah dulu", "Minta perpanjangan semua deadline"],
    answer: "Buat prioritas berdasarkan urgensi & dampak",
    category: "problemSolving",
    impact: { "project-manager": 1.8, "front-office": 1.5, "backend-developer": 1.2 }
  },
  {
    id: 5,
    question: "Anda diminta presentasi mendadak di depan klien penting tanpa persiapan. Apa yang Anda lakukan?",
    options: ["Tolak karena tidak siap", "Sampaikan dengan percaya diri menggunakan data yang ada", "Minta orang lain menggantikan", "Diam saja"],
    answer: "Sampaikan dengan percaya diri menggunakan data yang ada",
    category: "communication",
    impact: { "front-office": 1.8, "marketing": 1.6, "project-manager": 1.4 }
  },
  {
    id: 6,
    question: "Manakah query SQL yang tepat untuk mengambil 5 data teratas berdasarkan nilai tertinggi?",
    options: ["SELECT * FROM table LIMIT 5", "SELECT * FROM table ORDER BY nilai DESC LIMIT 5", "SELECT TOP 5 FROM table", "SELECT * FROM table WHERE nilai = MAX(nilai)"],
    answer: "SELECT * FROM table ORDER BY nilai DESC LIMIT 5",
    category: "technical",
    impact: { "data-analyst": 1.8, "backend-developer": 1.5, "marketing": 0.3 }
  },
  {
    id: 7,
    question: "Rekan kerja Anda terus-menerus mengambil kredit atas pekerjaan Anda. Apa yang Anda lakukan?",
    options: ["Diam saja agar tidak konflik", "Bicarakan langsung secara profesional", "Balas dengan hal yang sama", "Langsung lapor ke atasan tanpa diskusi"],
    answer: "Bicarakan langsung secara profesional",
    category: "communication",
    impact: { "front-office": 1.6, "project-manager": 1.5, "backend-developer": 1.0 }
  },
  {
    id: 8,
    question: "Apa yang dimaksud dengan A/B Testing dalam konteks marketing digital?",
    options: ["Membandingkan dua versi konten untuk melihat mana yang lebih efektif", "Teknik backup data", "Metode enkripsi data", "Cara menghitung ROI"],
    answer: "Membandingkan dua versi konten untuk melihat mana yang lebih efektif",
    category: "technical",
    impact: { "marketing": 1.8, "data-analyst": 1.4, "front-office": 0.5 }
  },
  {
    id: 9,
    question: "Tim Anda sedang mengerjakan proyek namun ada anggota yang tidak berkontribusi. Sebagai ketua, apa tindakan Anda?",
    options: ["Kerjakan sendiri saja", "Tegur secara personal & cari tahu kendala yang dihadapi", "Langsung keluarkan dari tim", "Biarkan saja asal selesai"],
    answer: "Tegur secara personal & cari tahu kendala yang dihadapi",
    category: "problemSolving",
    impact: { "project-manager": 1.9, "front-office": 1.3, "marketing": 1.2 }
  },
  {
    id: 10,
    question: "Apa pendekatan terbaik dalam merancang UI yang ramah pengguna (user-friendly)?",
    options: ["Tambahkan sebanyak mungkin fitur", "Fokus pada kemudahan navigasi & konsistensi desain", "Gunakan warna sebanyak mungkin", "Ikuti tren desain terkini tanpa riset"],
    answer: "Fokus pada kemudahan navigasi & konsistensi desain",
    category: "technical",
    impact: { "frontend-developer": 1.9, "marketing": 1.3, "project-manager": 1.0 }
  }
];

const Assessment = ({ user }) => {
  const questions = questionBank;
  const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Quiz, 2: Finished
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    technical: 0, digitalLiteracy: 0, communication: 0,
    leadership: 0, teamwork: 0, emotionalIntel: 0,
    problemSolving: 0, criticalThinking: 0,
    attentionDetail: 0, workEthic: 0
  });

const handleAnswer = (selectedIdx) => {
    const question = questions[currentQuestion];
    const selectedOption = question.options[selectedIdx];
    
    // Cek apakah teks pilihan yang dipilih sama dengan teks di field 'answer'
    if (selectedOption === question.answer) {
      // Ambil multiplier berdasarkan targetJob user (default 1.0)
      const multiplier = question.impact[user.targetJob] || 1.0;
      const addedScore = 10 * multiplier;
      
      setScores(prev => ({
        ...prev,
        [question.category]: prev[question.category] + addedScore
      }));
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = async () => {
    setCurrentStep(2);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        skills: scores // Kirim hasil skor ke Firestore
      });
    } catch (error) {
      console.error("Gagal update skor:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 1. START SCREEN */}
      {currentStep === 0 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Career Assessment</h2>
          <p className="text-slate-500 mb-6">Penilaian ini akan mengukur 10 aspek kompetensi Anda untuk posisi <span className="font-bold text-indigo-600">{user.targetJob}</span>.</p>
          <button onClick={() => setCurrentStep(1)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto">
            Mulai Tes <ArrowRight size={18}/>
          </button>
        </div>
      )}

      {/* 2. QUIZ SCREEN */}
      {currentStep === 1 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
            <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all" style={{width: `${((currentQuestion+1)/questions.length)*100}%`}}></div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-8">{questions[currentQuestion].question}</h3>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full p-4 text-left border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. FINISHED SCREEN */}
      {currentStep === 2 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Tes Selesai!</h2>
          <p className="text-slate-500 mb-6">Skor Anda telah dihitung dan disesuaikan dengan profil karir Anda. Silakan cek dashboard untuk melihat hasilnya.</p>
          <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">
            Lihat Hasil di Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Assessment;