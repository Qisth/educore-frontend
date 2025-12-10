import { useParams, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Educore_Logo_White.png";
import Aki from "../assets/images/Ellipse_15.png";
import Button from "../components/Button";
import useStudentProfile from "../hooks/useStudentProfile";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  User,
  BookOpen,
  ChevronLeft,
  GraduationCap,
  Folder,
  FileText,
  Clock,
  CheckCircle,
  BarChart3,
  Search,
  Filter,
  Calendar,
  Target,
  Award
} from "lucide-react";

export default function DetailMataPelajaranSiswa() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { profile } = useStudentProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const kelasList = [
    { id: 1, name: "Kelas 1", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 2, name: "Kelas 2", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 3, name: "Kelas 3", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 4, name: "Kelas 4", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 5, name: "Kelas 5", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 6, name: "Kelas 6", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 7, name: "Kelas 7", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 8, name: "Kelas 8", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 9, name: "Kelas 9", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 10, name: "Kelas 10", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 11, name: "Kelas 11", totalMaterials: 0, completed: 0, upcomingExam: false },
    { id: 12, name: "Kelas 12", totalMaterials: 0, completed: 0, upcomingExam: false },
  ];

  const subjectStats = {
    totalClasses: kelasList.length,
    totalMaterials: 0,
    completedMaterials: 0,
    upcomingExams: 0
  };

  const filteredKelas = kelasList.filter(kelas =>
    kelas.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex">
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
            onClick={() => navigate("/profil-siswa")}
            className="focus:outline-none hover:opacity-90 mb-4"
          >
            <div className="relative">
              <img
                src={profile?.foto || Aki}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
            </div>
          </button>

          <h2 className="text-xl font-bold mb-2 text-center">
            {profile?.nama?.split(" ")[0] || "Siswa"}
          </h2>
          <p className="text-sm text-blue-100 mb-8">
            {decodeURIComponent(subject || "Mata Pelajaran")}
          </p>

          {/* MENU NAVIGATION */}
          <nav className="space-y-2 w-full">
            <Button
              variant="menu"
              onClick={() => navigate("/beranda-siswa")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg hover:bg-blue-700"
              icon={<Home size={20} />}
            >
              Dashboard
            </Button>
            
            <Button
              variant="menu"
              onClick={() => navigate("/profil-siswa")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg hover:bg-blue-700"
              icon={<User size={20} />}
            >
              Profil Siswa
            </Button>
            
           
          </nav>
        </div>

        {/* FOOTER */}
        <div className="mt-auto p-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Mata Pelajaran</p>
            <p className="text-xs text-blue-200">
              {decodeURIComponent(subject || "Belum dipilih")}
            </p>
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
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <img src={Logo} alt="Logo" className="h-8" />
            </div>
            
            <h1 className="text-lg font-semibold">
              {decodeURIComponent(subject || "Mata Pelajaran")}
            </h1>
            
            <button
              onClick={() => navigate("/beranda-siswa")}
              className="p-2"
            >
              <Home size={20} />
            </button>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {sidebarOpen && (
            <div className="bg-blue-700 px-4 py-3 space-y-2">
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/beranda-siswa");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-800"
                icon={<Home size={20} />}
              >
                Dashboard
              </Button>
              
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/profil-siswa");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-800"
                icon={<User size={20} />}
              >
                Profil Siswa
              </Button>
              
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/tugas-siswa");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-800"
                icon={<BookOpen size={20} />}
              >
                Tugas & Ujian
              </Button>
            </div>
          )}
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* HEADER SECTION */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => navigate("/beranda-siswa")}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="text-gray-600" size={20} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                      {decodeURIComponent(subject || "Mata Pelajaran")}
                    </h1>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <GraduationCap size={18} className="text-blue-500" />
                    Pilih kelas untuk mengakses materi pembelajaran
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Cari kelas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* SUBJECT STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border p-6 border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Kelas</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {subjectStats.totalClasses}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Tersedia untuk dipelajari
                      </p>
                    </div>
                    <BookOpen className="text-blue-500" size={28} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-6 border-l-4 border-green-500 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Materi Tersedia</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {subjectStats.totalMaterials}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Akan terisi otomatis
                      </p>
                    </div>
                    <Folder className="text-green-500" size={28} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-6 border-l-4 border-purple-500 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Materi Selesai</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {subjectStats.completedMaterials}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Akan terisi saat belajar
                      </p>
                    </div>
                    <CheckCircle className="text-purple-500" size={28} />
                  </div>
                </div>
                
                
              </div>
            </div>

            {/* CLASSES GRID */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Daftar Kelas</h2>
                <span className="text-sm text-gray-500">
                  {filteredKelas.length} kelas tersedia
                </span>
              </div>
              
              {filteredKelas.length === 0 ? (
                <div className="bg-white rounded-lg border p-12 text-center shadow-sm">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Kelas Tidak Ditemukan
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Tidak ada kelas yang sesuai dengan pencarian Anda. 
                    Coba kata kunci lain atau hapus pencarian.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Tampilkan semua kelas
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredKelas.map((kelas) => (
                    <div
                      key={kelas.id}
                      onClick={() => navigate(`/materi-siswa/${subject}/${kelas.id}`)}
                      className="bg-white rounded-lg border cursor-pointer hover:border-blue-300 transition shadow-sm"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {kelas.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {decodeURIComponent(subject || "Mata Pelajaran")}
                            </p>
                          </div>
                          {kelas.upcomingExam && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full">
                              <Target size={12} />
                              <span className="text-xs font-medium">Ujian</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Folder size={14} className="text-gray-400" />
                              <span className="text-gray-600">
                                {kelas.totalMaterials} materi
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-gray-400" />
                              <span className="text-gray-600">
                                {kelas.completed} selesai
                              </span>
                            </div>
                          </div>

                          {/* PROGRESS BAR */}
                          {kelas.totalMaterials > 0 && (
                            <div>
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{Math.round((kelas.completed / kelas.totalMaterials) * 100)}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${(kelas.completed / kelas.totalMaterials) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <span className="text-sm text-gray-500">
                            Klik untuk belajar
                          </span>
                          <ChevronLeft size={18} className="text-gray-400 rotate-180" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LEARNING GUIDE */}
            <div className="mt-8 bg-blue-500 rounded-lg p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">
                    Siap untuk Belajar {decodeURIComponent(subject || "Mata Pelajaran")}?
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Pilih kelas sesuai dengan tingkat pendidikan Anda untuk mengakses materi pembelajaran yang sesuai. 
                    Setiap kelas memiliki materi yang disesuaikan dengan kurikulum.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-300" />
                      <span className="text-sm">Materi terstruktur</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-300" />
                      <span className="text-sm">Belajar mandiri</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <GraduationCap className="w-20 h-20 text-white/80 mx-auto mb-4" />
                  <p className="text-3xl font-bold">{subjectStats.completedMaterials}</p>
                  <p className="text-sm text-blue-100">Materi akan diselesaikan</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} EduCore. Materi Pembelajaran.</p>
            <p className="mt-1">
              {decodeURIComponent(subject || "Mata Pelajaran")} • Pilih kelas untuk memulai belajar
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}