import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/images/Educore_Logo_White.png";
import { loginGuru } from "../services/api";
import {
  Mail,
  Lock,
  LogIn,
  User,
  ArrowRight,
  Shield,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function LoginGuru() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
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

    if (!password.trim()) {
      setError("Harap isi kata sandi!");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi harus minimal 8 karakter!");
      return;
    }

    // Validasi kompleksitas password
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError(
        "Kata sandi harus mengandung huruf besar, huruf kecil, dan angka!"
      );
      return;
    }

    setLoading(true);
    try {
      await loginGuru(email, password);
      navigate("/beranda-guru");
    } catch (err) {
      setError(err.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
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
            <Link
              to="/register-guru"
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <User size={16} />
              Daftar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - INFO */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white hidden lg:flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Selamat Datang Kembali!
                </h2>
                <p className="text-blue-100 mb-8">
                  Masuk ke akun guru Anda untuk mengakses dashboard, materi, dan
                  manajemen kelas.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Dashboard Lengkap</p>
                      <p className="text-sm text-blue-200">
                        Pantau perkembangan siswa secara real-time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Manajemen Kelas</p>
                      <p className="text-sm text-blue-200">
                        Kelola materi dan tugas dengan mudah
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3"></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-blue-200">
                  Belum punya akun?{" "}
                  <Link
                    to="/register-guru"
                    className="text-white font-semibold underline hover:no-underline"
                  >
                    Daftar di sini
                  </Link>
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <LogIn className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Masuk ke Akun Guru
                  </h2>
                  <p className="text-gray-600">
                    Masukkan kredensial Anda untuk melanjutkan
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 flex items-center gap-2">
                    <Shield size={18} />
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
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
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="flex items-center gap-2">
                        <Lock size={16} />
                        Kata Sandi
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showPassword ? "Sembunyikan" : "Tampilkan"}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Ingat saya
                    </label>
                  </div>
                  <Link
                    to="/forgot-password-guru"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Masuk ke Dashboard
                    </>
                  )}
                </button>

                {/* REGISTER LINK */}
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Belum punya akun?{" "}
                    <Link
                      to="/register-guru"
                      className="text-blue-600 font-semibold hover:text-blue-700 hover:underline flex items-center gap-1 justify-center"
                    >
                      Daftar akun guru
                      <ArrowRight size={16} />
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EduCore. Hak cipta dilindungi.</p>
          <p className="mt-1">
            Portal Login Guru - Akses dashboard dan manajemen kelas
          </p>
        </div>
      </footer>
    </div>
  );
}
