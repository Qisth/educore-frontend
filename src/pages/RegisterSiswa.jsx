import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerSiswa } from "../services/api";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Users,
  Phone,
  Check,
  ArrowRight,
  UserPlus,
  Shield,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import Logo from "../assets/images/Educore_Logo_White.png";

export default function RegisterSiswa() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nama: "",
    tingkat: "SD",
    ortuWali: "",
    telpOrtuWali: "",
    sekolah: "",
    kelas: "",
    alamat: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (!formData.nama.trim()) {
      setError("Nama lengkap wajib diisi!");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email wajib diisi!");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Format email tidak valid!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Kata sandi minimal 8 karakter!");
      return;
    }

    // Validasi kompleksitas password
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError(
        "Kata sandi harus mengandung huruf besar, huruf kecil, dan angka!"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Kata sandi tidak cocok!");
      return;
    }

    if (!formData.ortuWali.trim()) {
      setError("Nama orang tua/wali wajib diisi!");
      return;
    }

    if (!agreed) {
      setError("Anda harus menyetujui syarat dan ketentuan!");
      return;
    }

    setLoading(true);
    try {
      await registerSiswa({
        email: formData.email,
        password: formData.password,
        nama: formData.nama,
        tingkat: formData.tingkat,
        ortuWali: formData.ortuWali,
        telpOrtuWali: formData.telpOrtuWali,
        sekolah: formData.sekolah,
        kelas: formData.kelas,
        alamat: formData.alamat,
      });
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login-siswa");
    } catch (err) {
      setError(err.message || "Registrasi gagal. Coba lagi nanti.");
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
                <p className="text-xs text-blue-100">Portal Siswa</p>
              </div>
            </div>
            <Link
              to="/login-siswa"
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <ArrowRight size={16} />
              Masuk
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - INFO */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white hidden lg:flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Bergabung dengan EduCore
                </h2>
                <p className="text-blue-100 mb-8">
                  Daftarkan akun siswa Anda dan mulai perjalanan belajar yang
                  menyenangkan bersama guru-guru terbaik.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Materi Lengkap</p>
                      <p className="text-sm text-blue-200">
                        Akses semua materi pelajaran
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Belajar Interaktif</p>
                      <p className="text-sm text-blue-200">
                        Diskusi dengan teman sekelas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Aman untuk Anak</p>
                      <p className="text-sm text-blue-200">
                        Pengawasan orang tua/wali
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-blue-200">
                  Sudah punya akun?{" "}
                  <Link
                    to="/login-siswa"
                    className="text-white font-semibold underline hover:no-underline"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <UserPlus className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Daftar Akun Siswa
                  </h2>
                  <p className="text-gray-600">Isi data siswa dengan lengkap</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle
                    className="text-red-500 mt-0.5 flex-shrink-0"
                    size={20}
                  />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* BASIC INFO */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <User size={16} />
                        Nama Lengkap Siswa
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap siswa"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <Mail size={16} />
                          Email Siswa
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@contoh.com"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <GraduationCap size={16} />
                          Tingkat Pendidikan
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <select
                        name="tingkat"
                        value={formData.tingkat}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="SD">SD (Sekolah Dasar)</option>
                        <option value="SMP">
                          SMP (Sekolah Menengah Pertama)
                        </option>
                        <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                        <option value="SMK">
                          SMK (Sekolah Menengah Kejuruan)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sekolah
                      </label>
                      <input
                        type="text"
                        name="sekolah"
                        value={formData.sekolah}
                        onChange={handleChange}
                        placeholder="Nama sekolah"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kelas
                      </label>
                      <input
                        type="text"
                        name="kelas"
                        value={formData.kelas}
                        onChange={handleChange}
                        placeholder="Contoh: 7A, 10 IPA 1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <Lock size={16} />
                          Kata Sandi
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimal 8 karakter"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <Lock size={16} />
                          Ulang Kata Sandi
                          <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Ketik ulang kata sandi"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* PARENT/GUARDIAN INFO */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-green-500" />
                    Informasi Orang Tua/Wali
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-red-500">*</span> Nama Orang
                        Tua/Wali
                      </label>
                      <input
                        type="text"
                        name="ortuWali"
                        value={formData.ortuWali}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap orang tua/wali"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center gap-2">
                            <Phone size={16} />
                            Telepon Orang Tua/Wali
                            <span className="text-red-500">*</span>
                          </span>
                        </label>
                        <input
                          type="tel"
                          name="telpOrtuWali"
                          value={formData.telpOrtuWali}
                          onChange={handleChange}
                          placeholder="08xxxxxxxxxx"
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hubungan
                        </label>
                        <select
                          name="hubungan"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih hubungan</option>
                          <option value="ayah">Ayah</option>
                          <option value="ibu">Ibu</option>
                          <option value="wali">Wali</option>
                          <option value="saudara">Saudara</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Siswa
                      </label>
                      <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        placeholder="Masukkan alamat tempat tinggal siswa"
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* TERMS */}
                <div className="pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-6">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                    </div>
                    <div className="text-sm">
                      <label
                        htmlFor="terms"
                        className="font-medium text-gray-700 cursor-pointer"
                      >
                        Saya sebagai orang tua/wali menyetujui Syarat dan
                        Ketentuan serta Kebijakan Privasi EduCore
                      </label>
                      <p className="text-gray-500 mt-1">
                        Dengan mendaftarkan anak/ward, saya menyetujui semua
                        ketentuan penggunaan platform untuk pembelajaran anak.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
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
                      <Check size={20} />
                      Daftarkan Akun Siswa
                    </>
                  )}
                </button>

                {/* LOGIN LINK */}
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Sudah punya akun?{" "}
                    <Link
                      to="/login-siswa"
                      className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                    >
                      Masuk di sini
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
            Platform Pembelajaran Digital untuk Siswa - Daftar Akun Baru
          </p>
        </div>
      </footer>
    </div>
  );
}
