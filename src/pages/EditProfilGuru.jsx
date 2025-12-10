import { useNavigate } from "react-router-dom";
import useTeacherProfile from "../hooks/useTeacherProfile";
import { useState } from "react";
import Makima from "../assets/images/Ellipse_14.png";
import {
  User,
  Home,
  Users,
  MapPin,
  School,
  Phone,
  Map,
  Building,
  GraduationCap,
  Edit3,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  Camera,
  Save,
  ChevronDown
} from "lucide-react";
import Logo from "../assets/images/Educore_Logo_White.png";
import Button from "../components/Button";

export default function EditProfilGuru() {
  const navigate = useNavigate();
  const { profile, saveProfile } = useTeacherProfile();

  const [form, setForm] = useState(profile || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, foto: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveProfile(form);
      setTimeout(() => {
        navigate("/profil-guru");
      }, 500);
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-600 text-white">
        <div className="p-6 flex flex-col items-center">
          <img 
            src={Logo} 
            alt="EduCore Logo" 
            className="h-10 mb-8" 
          />
          
          {/* PROFILE SECTION */}
          <button
            onClick={() => navigate("/profil-guru")}
            className="focus:outline-none hover:opacity-90 mb-4"
          >
            <div className="relative">
              <img
                src={form?.foto || Makima}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
            </div>
          </button>

          <h2 className="text-xl font-bold mb-2 text-center">
            {form?.nama?.split(" ")[0] || "Guru"}
          </h2>
          <p className="text-sm text-blue-100 mb-8">Edit Profil</p>

          {/* MENU NAVIGATION */}
          <nav className="space-y-2 w-full">
            <Button
              variant="menu"
              onClick={() => navigate("/beranda-guru")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg hover:bg-blue-700"
              icon={<Home size={20} />}
            >
              Dashboard
            </Button>
            
            <Button
              variant="menu"
              onClick={() => navigate("/data-siswa")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg hover:bg-blue-700"
              icon={<Users size={20} />}
            >
              Data Siswa
            </Button>
            
            <Button
              variant="menu"
              onClick={() => navigate("/profil-guru")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg hover:bg-blue-700"
              icon={<User size={20} />}
            >
              Profil Guru
            </Button>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-blue-600 text-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft size={20} />
              </button>
              <img src={Logo} alt="Logo" className="h-8" />
            </div>
            
            <h1 className="text-lg font-semibold">Edit Profil</h1>
            
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={20} />
              )}
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* HEADER SECTION */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Edit Profil Guru
                  </h1>
                  <p className="text-gray-600">
                    Perbarui informasi profil Anda
                  </p>
                </div>
                
                <button
                  onClick={() => navigate("/profil-guru")}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Kembali ke Profil
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* PROFILE IMAGE & BASIC INFO */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* PROFILE IMAGE */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={form?.foto || Makima}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                        alt="Profile"
                      />
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                        <Camera size={16} />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImage} 
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      Klik ikon kamera untuk mengganti foto
                    </p>
                  </div>

                  {/* BASIC INFO FORM */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <User size={16} />
                          Nama Lengkap
                        </span>
                      </label>
                      <input
                        name="nama"
                        value={form.nama || ""}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center gap-2">
                            <User size={16} />
                            Jenis Kelamin
                          </span>
                        </label>
                        <div className="relative">
                          <select
                            name="gender"
                            value={form.gender || ""}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                          >
                            <option value="">Pilih jenis kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center gap-2">
                            <Phone size={16} />
                            Nomor Telepon
                          </span>
                        </label>
                        <input
                          name="telepon"
                          value={form.telepon || ""}
                          onChange={handleChange}
                          placeholder="Masukkan nomor telepon"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <Mail size={16} />
                          Email
                        </span>
                      </label>
                      <input
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        placeholder="Masukkan email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PERSONAL ADDRESS */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin size={24} className="text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-800">Alamat Pribadi</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provinsi
                    </label>
                    <input
                      name="provinsi"
                      value={form.provinsi || ""}
                      onChange={handleChange}
                      placeholder="Masukkan provinsi"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kota/Kabupaten
                    </label>
                    <input
                      name="kota"
                      value={form.kota || ""}
                      onChange={handleChange}
                      placeholder="Masukkan kota/kabupaten"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      name="alamat"
                      value={form.alamat || ""}
                      onChange={handleChange}
                      placeholder="Masukkan alamat lengkap"
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SCHOOL INFO */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-6">
                  <School size={24} className="text-green-500" />
                  <h3 className="text-lg font-bold text-gray-800">Informasi Sekolah</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provinsi Sekolah
                    </label>
                    <input
                      name="sekolahProvinsi"
                      value={form.sekolahProvinsi || ""}
                      onChange={handleChange}
                      placeholder="Masukkan provinsi sekolah"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kota/Kabupaten Sekolah
                    </label>
                    <input
                      name="sekolahKota"
                      value={form.sekolahKota || ""}
                      onChange={handleChange}
                      placeholder="Masukkan kota/kabupaten sekolah"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Building size={16} />
                        Nama Sekolah
                      </span>
                    </label>
                    <input
                      name="namaSekolah"
                      value={form.namaSekolah || ""}
                      onChange={handleChange}
                      placeholder="Masukkan nama sekolah"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        Tingkat Pendidikan
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        name="tingkat"
                        value={form.tingkat || ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Pilih tingkat pendidikan</option>
                        <option value="SD">SD (Sekolah Dasar)</option>
                        <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                        <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                        <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                        <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mata Pelajaran
                    </label>
                    <input
                      name="mata_pelajaran"
                      value={form.mata_pelajaran || ""}
                      onChange={handleChange}
                      placeholder="Masukkan mata pelajaran"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col md:flex-row gap-4 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/profil-guru")}
                  className="flex items-center gap-2"
                >
                  Batal
                </Button>
                
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2"
                  icon={loading ? null : <Save size={18} />}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}