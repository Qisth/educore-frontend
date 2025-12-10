import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/images/Educore_Logo_White.png";
import {
  Mail,
  Key,
  ArrowLeft,
  CheckCircle,
  Shield,
  Send
} from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Harap isi email!");
      return;
    }

    if (!email.includes("@")) {
      setError("Format email tidak valid!");
      return;
    }

    setLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        setStep(2);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login-siswa");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="EduCore Logo" className="h-10" />
              <div>
                <h1 className="text-xl font-bold">EduCore</h1>
                <p className="text-xs text-blue-100">Portal Guru</p>
              </div>
            </div>
            <button
              onClick={handleBackToLogin}
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Kembali ke Login
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* STEP INDICATOR */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === num 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : step > num 
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {step > num ? <CheckCircle size={16} /> : num}
                  </div>
                  {num < 3 && (
                    <div className={`w-16 h-1 ${
                      step > num ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Key className="text-blue-600" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {step === 1 && "Lupa Kata Sandi"}
                {step === 2 && "Verifikasi Kode"}
                {step === 3 && "Buat Kata Sandi Baru"}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {step === 1 && "Masukkan email Anda untuk menerima tautan reset kata sandi"}
                {step === 2 && "Masukkan kode verifikasi yang dikirim ke email Anda"}
                {step === 3 && "Buat kata sandi baru untuk akun Anda"}
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Tautan reset kata sandi telah dikirim ke email Anda!
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 flex items-center gap-2">
                  <Shield size={18} />
                  {error}
                </p>
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <form onSubmit={handleSubmitEmail} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Mail size={16} />
                      Alamat Email
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      required
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Kirim Tautan Reset
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Ingat kata sandi Anda?{" "}
                    <Link 
                      to="/login-siswa" 
                      className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                    >
                      Kembali ke Login
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* STEP 2: VERIFICATION CODE */}
            {step === 2 && (
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Verifikasi 6-digit
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <input
                        key={num}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Kode telah dikirim ke: <span className="font-medium">{email}</span>
                  </p>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Kirim ulang kode (00:30)
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
                  >
                    Verifikasi
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Ketik ulang kata sandi baru"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tips keamanan:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} />
                      Minimal 8 karakter
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} />
                      Kombinasi huruf dan angka
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={14} />
                      Gunakan karakter khusus jika memungkinkan
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    alert("Kata sandi berhasil diubah! Silakan login dengan kata sandi baru.");
                    navigate("/login-guru");
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Simpan Kata Sandi Baru
                </button>
              </form>
            )}

            {/* SECURITY INFO */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Keamanan Akun</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Kami akan mengirim tautan reset hanya ke email terdaftar. 
                    Pastikan Anda mengakses dari perangkat yang aman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EduCore. Hak cipta dilindungi.</p>
          <p className="mt-1">Reset Kata Sandi - Portal Guru</p>
        </div>
      </footer>
    </div>
  );
}