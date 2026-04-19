import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const SetupProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    fullName: user.name || "",
    targetJob: "",
    bio: ""
  });
  const [issubmitting, setIsSubmitting] = useState(false);

  const jobs = [
    { id: "frontend", label: "Front Office / Customer Service", cat: "FO" },
    { id: "marketing", label: "Marketing & Sales", cat: "FO" },
    { id: "uiux", label: "UI/UX Designer", cat: "FO" },
    { id: "software-eng", label: "Software Engineer", cat: "BO" },
    { id: "data-analyst", label: "Data Analyst", cat: "BO" },
    { id: "admin", label: "Administrative Assistant", cat: "BO" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetJob) return alert("Pilih pekerjaan impianmu dulu!");

    setIsSubmitting(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        name: formData.fullName,
        targetJob: formData.targetJob,
        bio: formData.bio,
        isNew: false // Tandai bahwa user sudah selesai setup
      });
      
      // Refresh halaman agar App.jsx mendeteksi perubahan data user
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Lengkapi Profilmu</h2>
          <p className="text-slate-500 text-sm">Data ini diperlukan untuk personalisasi assessment AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          {/* Target Job */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan yang Diinginkan</label>
            <select 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.targetJob}
              onChange={(e) => setFormData({...formData, targetJob: e.target.value})}
            >
              <option value="">-- Pilih Pekerjaan --</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.label}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">*Penilaian akan disesuaikan dengan standar posisi ini</p>
          </div>

          {/* Bio Singkat */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tentang Kamu (Bio)</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              rows="3"
              placeholder="Ceritakan sedikit tentang latar belakangmu..."
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={issubmitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:bg-slate-400"
          >
            {issubmitting ? "Menyimpan..." : "Simpan & Lanjut ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupProfile;