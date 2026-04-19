import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
  const loginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Cek apakah user sudah ada di Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Jika benar-benar baru, buatkan dokumen kosong dengan role 'user'
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          role: "user", // Default role
          targetJob: "", // Akan diisi di SetupProfile
          skills: {
            technical: 0, digitalLiteracy: 0, communication: 0,
            leadership: 0, teamwork: 0, emotionalIntel: 0,
            problemSolving: 0, criticalThinking: 0,
            attentionDetail: 0, workEthic: 0
          }
        });
      }
    } catch (error) {
      console.error("Login Gagal:", error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-indigo-600">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-6 text-slate-800">Smart LMS UNNES</h1>
        <p className="text-slate-500 mb-8">Masuk untuk memulai Career Assessment</p>
        <button 
          onClick={loginGoogle}
          className="bg-white border border-slate-300 px-6 py-3 rounded-lg font-bold flex items-center gap-3 hover:bg-slate-50 transition-all mx-auto"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5" />
          Masuk dengan Google
        </button>
      </div>
    </div>
  );
};

export default Login;