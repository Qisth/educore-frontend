import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Educore_Logo_White.png";
import Button from "../components/Button";
import useTeacherProfile from "../hooks/useTeacherProfile";
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
  BookOpen
} from "lucide-react";

export default function ProfilGuru() {
  const navigate = useNavigate();
  const { profile = {} } = useTeacherProfile() || {};

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
                src={profile?.foto || Makima}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
            </div>
          </button>

          <h2 className="text-xl font-bold mb-2 text-center">
            {profile?.nama?.split(" ")[0] || "Guru"}
          </h2>
          <p className="text-sm text-blue-100 mb-8">Profil Guru</p>

          {/* MENU NAVIGATION - MATERI SUDAH DIHAPUS */}
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
              variant="menu-active"
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg bg-blue-700"
              icon={<User size={20} />}
            >
              Profil Guru
            </Button>
            {/* MENU MATERI SUDAH DIHAPUS */}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="mt-auto p-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Status Akun</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
              <Shield size={12} className="text-green-300" />
              <span className="text-xs text-green-300 font-medium">Aktif</span>
            </div>
          </div>
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
                <Home size={20} />
              </button>
              <img src={Logo} alt="Logo" className="h-8" />
            </div>
            
            <h1 className="text-lg font-semibold">Profil Guru</h1>
            
            <button
              onClick={() => navigate("/edit-profil-guru")}
              className="p-2"
            >
              <Edit3 size={20} />
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
                    Profil Guru
                  </h1>
                  <p className="text-gray-600">
                    Kelola informasi profil dan preferensi pengajaran Anda
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* PROFILE CARD */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-blue-500 h-16"></div>
                <div className="px-6 pb-6 relative">
                  <div className="flex flex-col md:flex-row md:items-start gap-6 -mt-8">
                    <div className="relative">
                      <img
                        src={profile?.foto || Makima}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                        alt="Profile"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            {profile?.nama || "Nama belum diisi"}
                          </h2>
                          <p className="text-gray-600 flex items-center gap-2">
                            <GraduationCap size={16} />
                            {profile?.mata_pelajaran || "Guru"}
                          </p>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          <Shield size={14} />
                          <span className="text-sm font-medium">Guru Aktif</span>
                        </div>
                      </div>

                      {/* CONTACT INFO */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone size={18} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Telepon</p>
                            <p className="font-medium">
                              {profile?.telepon || "-"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail size={18} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium">
                              {profile?.email || "-"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar size={18} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Bergabung Sejak</p>
                            <p className="font-medium">
                              {profile?.tanggal_bergabung || "-"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User size={18} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="font-medium">
                              {profile?.gender || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                  {/* PERSONAL ADDRESS */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <MapPin size={20} className="text-blue-500" />
                        Alamat Pribadi
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Provinsi
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">
                              {profile?.provinsi || "-"}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Kota/Kabupaten
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">
                              {profile?.kota || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Alamat Lengkap
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg min-h-[60px]">
                          <p className="font-medium">
                            {profile?.alamat || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SCHOOL INFO */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <School size={20} className="text-green-500" />
                        Informasi Sekolah
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building size={18} className="text-gray-500" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Nama Sekolah</p>
                          <p className="font-medium">
                            {profile?.namaSekolah || "-"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Map size={18} className="text-gray-500" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Lokasi Sekolah</p>
                          <p className="font-medium">
                            {profile?.sekolahKota || "-"}, {profile?.sekolahProvinsi || "-"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <GraduationCap size={18} className="text-gray-500" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Tingkat Pendidikan</p>
                          <p className="font-medium">
                            {profile?.tingkat || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EDIT PROFILE BUTTON - DI BAWAH */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Kelola Profil</h3>
                      <Edit3 size={20} className="text-blue-500" />
                    </div>
                    
                    <p className="text-gray-600 mb-6">
                      Perbarui informasi profil Anda untuk memastikan data selalu akurat
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => navigate("/edit-profil-guru")}
                        className="flex-1 flex items-center justify-center gap-2"
                        icon={<Edit3 size={18} />}
                      >
                        Edit Profil
                      </Button>
                      
                      <Button
                        variant="secondary"
                        className="flex-1 flex items-center justify-center gap-2"
                        icon={<Shield size={18} />}
                      >
                        Keamanan Akun
                      </Button>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                  {/* TEACHING STATS */}
                  <div className="bg-blue-500 rounded-lg shadow p-6 text-white">
                    <h3 className="text-lg font-bold mb-6">Statistik Mengajar</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-100">Total Kelas</p>
                          <p className="text-2xl font-bold">9</p>
                        </div>
                        <BookOpen size={24} className="text-blue-200" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-100">Mata Pelajaran</p>
                          <p className="text-2xl font-bold">9</p>
                        </div>
                        <GraduationCap size={24} className="text-blue-200" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-100">Siswa Aktif</p>
                          <p className="text-2xl font-bold">0</p>
                        </div>
                        <Users size={24} className="text-blue-200" />
                      </div>
                    </div>
                  </div>

                  {/* QUICK LINKS */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Tautan Cepat</h3>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => navigate("/beranda-guru")}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Home size={18} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">Dashboard</span>
                      </button>
                      
                      <button 
                        onClick={() => navigate("/data-siswa")}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users size={18} className="text-green-600" />
                        </div>
                        <span className="font-medium text-gray-700">Data Siswa</span>
                      </button>
                      
                      <button 
                        onClick={() => navigate("/manajemen-kelas")}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BookOpen size={18} className="text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-700">Manajemen Kelas</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}