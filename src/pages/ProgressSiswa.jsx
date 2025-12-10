import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../assets/images/Educore_Logo_White.png";
import Aki from "../assets/images/Ellipse_15.png";
import useStudentProfile from "../hooks/useStudentProfile";
import { tandaiMateriSelesai, getMateriBySubject, getToken } from "../services/api";
import {
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
  Calendar,
  Target,
  Award,
  Check,
  XCircle,
  Clock as ClockIcon,
  TrendingUp,
  ArrowRight,
  Download,
  Eye,
  Bookmark
} from "lucide-react";

export default function ProgressSiswa() {
  const navigate = useNavigate();
  const { subject, kelasId } = useParams();
  const { profile } = useStudentProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState({
    totalMateri: 0,
    selesai: 0,
    persentasi: 0,
    rataWaktu: 0,
    estimasiSelesai: "",
  });

  useEffect(() => {
    loadMateriList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, kelasId]);

  const loadMateriList = async () => {
    setLoading(true);
    try {
      // HARUS load dari API untuk mendapat ID database yang benar
      if (getToken()) {
        console.log("Loading materi - subject:", subject, "kelasId:", kelasId);
        const res = await getMateriBySubject(subject, `kelas-${kelasId}`);
        console.log("API Response full object:", res);
        console.log("API Response data:", res.data);
        console.log("API Response data type:", typeof res.data);
        console.log("API Response data length:", res.data?.length);
        
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          console.log("✅ Materi loaded from API:", res.data);
          setMateriList(res.data);
          calculateProgress(res.data);
          setLoading(false);
          return;
        } else {
          console.warn("⚠️ API returned empty or invalid data:", res);
        }
      } else {
        console.warn("No token found, cannot load from API");
      }
      
      // Jika API gagal atau kosong, coba fallback ke localStorage untuk backward compatibility
      console.log("Trying fallback to localStorage...");
      const storageKey = `materi_${subject}_kelas${kelasId}`;
      const storedMateri = JSON.parse(localStorage.getItem(storageKey) || "[]");
      console.log("Materi from localStorage:", storedMateri);
      
      if (storedMateri.length > 0) {
        // localStorage materi ada, tapi tidak punya ID database yang valid
        // Tampilkan warning
        console.warn("⚠️ WARNING: Using localStorage data - IDs may not be valid for database operations!");
        setMateriList(storedMateri);
        calculateProgress(storedMateri);
      } else {
        console.log("No materi found anywhere, showing empty state");
        setMateriList([]);
        calculateProgress([]);
      }
    } catch (error) {
      console.error("Error loading materi from API:", error);
      // Fallback ke localStorage jika API error
      const storageKey = `materi_${subject}_kelas${kelasId}`;
      const storedMateri = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (storedMateri.length > 0) {
        console.warn("⚠️ Using localStorage fallback due to API error");
        setMateriList(storedMateri);
        calculateProgress(storedMateri);
      } else {
        setMateriList([]);
        calculateProgress([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (materiData = materiList) => {
    if (!Array.isArray(materiData)) {
      console.error("materiData is not an array:", materiData);
      materiData = [];
    }
    
    // Load dari localStorage atau API
    const progressKey = `progress_${subject}_kelas${kelasId}`;
    const completedList = JSON.parse(localStorage.getItem(progressKey) || "[]");

    const total = materiData.length;
    const completed = completedList.filter((m) =>
      materiData.some((mat) => mat.id === m)
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate average time based on completed items
    const rataWaktu = completed > 0 ? Math.floor(Math.random() * 45) + 15 : 0; // Mock data 15-60 minutes
    
    // Calculate estimated completion date
    const today = new Date();
    const remaining = total - completed;
    const estimasiHari = remaining * 3; // Assuming 3 days per remaining item
    today.setDate(today.getDate() + estimasiHari);
    const estimasiSelesai = today.toLocaleDateString("id-ID", {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setProgress({
      totalMateri: total,
      selesai: completed,
      persentasi: percentage,
      rataWaktu,
      estimasiSelesai,
    });
  };

  const handleMarkComplete = async (materiId) => {
    console.log("=== TANDAI SELESAI ===");
    console.log("materiId:", materiId, "type:", typeof materiId);
    
    // Validasi: pastikan ID adalah integer yang valid (bukan timestamp localStorage)
    if (!materiId || materiId > 2147483647) {
      alert("⚠️ Error: ID materi tidak valid!\n\nMateri ini mungkin dari localStorage lama. Silakan:\n1. Minta guru upload ulang materi\n2. Refresh halaman ini\n3. Coba lagi");
      console.error("Invalid materiId - too large for database integer:", materiId);
      return;
    }
    
    const progressKey = `progress_${subject}_kelas${kelasId}`;
    const completedList = JSON.parse(localStorage.getItem(progressKey) || "[]");
    if (!completedList.includes(materiId)) {
      completedList.push(materiId);
      localStorage.setItem(progressKey, JSON.stringify(completedList));
      
      // Kirim ke backend
      try {
        console.log("Mengirim ke backend, idMateri:", materiId);
        const response = await tandaiMateriSelesai(materiId);
        console.log("Response dari backend:", response);
        alert("✅ Berhasil menandai materi selesai!");
      } catch (error) {
        console.error("ERROR menandai materi selesai:", error);
        alert("❌ Gagal menyimpan ke database: " + error.message + "\n\nData tetap tersimpan di browser Anda.");
        // Tetap simpan di localStorage meskipun gagal ke database
      }
      
      calculateProgress();
    }
  };

  const handleMarkIncomplete = (materiId) => {
    const progressKey = `progress_${subject}_kelas${kelasId}`;
    const completedList = JSON.parse(localStorage.getItem(progressKey) || "[]");
    const filtered = completedList.filter((id) => id !== materiId);
    localStorage.setItem(progressKey, JSON.stringify(filtered));
    calculateProgress();
    
    // Note: Backend belum ada endpoint untuk unmark/batalkan selesai
    // Jadi sementara hanya update localStorage saja
  };

  const completedList = JSON.parse(
    localStorage.getItem(`progress_${subject}_kelas${kelasId}`) || "[]"
  );

  const filteredMateriList = materiList.filter(materi =>
    materi.folderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materi.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompletionStatus = (percentage) => {
    if (percentage === 0) return { color: "text-gray-500", bg: "bg-gray-100", label: "Belum Dimulai" };
    if (percentage < 30) return { color: "text-red-500", bg: "bg-red-100", label: "Perlu Perhatian" };
    if (percentage < 70) return { color: "text-yellow-500", bg: "bg-yellow-100", label: "Sedang Berjalan" };
    if (percentage < 100) return { color: "text-blue-500", bg: "bg-blue-100", label: "Hampir Selesai" };
    return { color: "text-green-500", bg: "bg-green-100", label: "Selesai" };
  };

  const status = getCompletionStatus(progress.persentasi);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
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
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg"
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
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/50 rounded-full mb-8">
            <BarChart3 size={14} />
            <span className="text-sm">Progress Belajar</span>
          </div>

          {/* MENU NAVIGATION */}
          <nav className="space-y-2 w-full">
            <Button
              variant="menu"
              onClick={() => navigate("/beranda-siswa")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg hover:bg-blue-500/50 transition-colors"
              icon={<Home size={20} />}
            >
              Dashboard
            </Button>
            
            <Button
              variant="menu"
              onClick={() => navigate(`/materi-siswa/${subject}/${kelasId}`)}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg hover:bg-blue-500/50 transition-colors"
              icon={<BookOpen size={20} />}
            >
              Materi
            </Button>
            
          
          </nav>
        </div>

        {/* CURRENT SUBJECT INFO */}
        <div className="mt-auto p-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Mata Pelajaran</p>
            <p className="text-lg font-bold mb-2">{subject?.toUpperCase()}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
              <GraduationCap size={14} />
              <span>Kelas {kelasId}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-blue-500/30 rounded-lg transition-colors"
              >
                <BarChart3 size={24} />
              </button>
              <img src={Logo} alt="Logo" className="h-8" />
            </div>
            
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-semibold">Progress</h1>
              <p className="text-xs text-blue-100">{subject?.toUpperCase()}</p>
            </div>
            
            <button
              onClick={() => navigate("/beranda-siswa")}
              className="p-2 hover:bg-blue-500/30 rounded-lg transition-colors"
            >
              <Home size={20} />
            </button>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {sidebarOpen && (
            <div className="bg-blue-700 px-4 py-3 space-y-2">
              <div className="flex items-center gap-3 p-3 border-b border-blue-600/50">
                <img
                  src={profile?.foto || Aki}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                  alt="Profile"
                />
                <div>
                  <p className="font-semibold">{profile?.nama?.split(" ")[0] || "Siswa"}</p>
                  <p className="text-sm text-blue-100">Kelas {kelasId}</p>
                </div>
              </div>
              
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/beranda-siswa");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-600 py-3 rounded-lg"
                icon={<Home size={20} />}
              >
                Dashboard
              </Button>
              
              <Button
                variant="menu"
                onClick={() => {
                  navigate(`/materi-siswa/${subject}/${kelasId}`);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-600 py-3 rounded-lg"
                icon={<BookOpen size={20} />}
              >
                Materi
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
                      onClick={() => navigate(`/materi-siswa/${subject}/${kelasId}`)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={20} />
                      Kembali ke Materi
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Progress Pembelajaran
                      </h1>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          <BookOpen size={14} />
                          {subject?.toUpperCase()} - Kelas {kelasId}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 ${status.bg} ${status.color} rounded-full text-sm font-medium`}>
                          {progress.persentasi}% {status.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Cari materi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* MAIN PROGRESS CARD */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Ringkasan Progress
                    </h2>
                    <p className="text-gray-600">
                      Pantau perkembangan belajar Anda dalam mata pelajaran {subject?.toUpperCase()}. 
                      Tandai materi yang sudah selesai untuk melacak kemajuan Anda.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={calculateProgress}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <ClockIcon size={16} />
                      Refresh Data
                    </button>
                    <button
                      onClick={() => navigate(`/materi-siswa/${subject}/${kelasId}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <ArrowRight size={16} />
                      Lanjut Belajar
                    </button>
                  </div>
                </div>

                {/* Progress Visualization */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-semibold text-gray-700">
                        Penyelesaian Materi
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${status.bg.replace('bg-', 'bg-')}`}></div>
                        <span className="text-sm text-gray-500">{status.label}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-blue-600">
                        {progress.persentasi}%
                      </span>
                      <p className="text-sm text-gray-500">
                        {progress.selesai} dari {progress.totalMateri} materi
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress.persentasi}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Materi</p>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                          {progress.totalMateri}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Folder className="text-blue-500" size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Selesai</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          {progress.selesai}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="text-green-500" size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Belum Selesai</p>
                        <p className="text-2xl font-bold text-orange-600 mt-2">
                          {progress.totalMateri - progress.selesai}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="text-orange-500" size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Rata-rata Waktu</p>
                        <p className="text-2xl font-bold text-purple-600 mt-2">
                          {progress.rataWaktu}m
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Target className="text-purple-500" size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion Info */}
                {progress.totalMateri > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Award className="text-blue-500" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Estimasi Penyelesaian</p>
                          <p className="text-sm text-gray-600">
                            Jika belajar 1 materi setiap 3 hari, Anda akan menyelesaikan semua materi pada:
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{progress.estimasiSelesai}</p>
                        <p className="text-sm text-gray-500">
                          {Math.ceil((progress.totalMateri - progress.selesai) * 3)} hari lagi
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Materi List Section */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Detail Materi</h2>
                      <p className="text-gray-600 mt-1">
                        {filteredMateriList.length} dari {materiList.length} materi
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Selesai</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>Belum Selesai</span>
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data materi...</p>
                  </div>
                ) : filteredMateriList.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {searchTerm ? "Materi tidak ditemukan" : "Belum Ada Materi"}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchTerm 
                        ? `Tidak ada materi yang sesuai dengan pencarian "${searchTerm}".`
                        : `Guru akan segera mengupload materi pembelajaran untuk ${subject} Kelas ${kelasId}.`
                      }
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Tampilkan semua materi
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredMateriList.map((materi, index) => {
                      const isCompleted = completedList.includes(materi.id);
                      const completedFiles = isCompleted ? (materi.files?.length || 0) : 0;
                      const totalFiles = materi.files?.length || 0;
                      
                      return (
                        <div
                          key={materi.id}
                          className={`p-6 transition-all ${isCompleted ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-4">
                                <div className="relative">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${isCompleted ? 'bg-green-100 border border-green-200' : 'bg-orange-100 border border-orange-200'}`}>
                                    {isCompleted ? (
                                      <CheckCircle className="text-green-600" size={24} />
                                    ) : (
                                      <BookOpen className="text-orange-600" size={24} />
                                    )}
                                  </div>
                                  <div className={`absolute -top-2 -right-2 w-6 h-6 ${isCompleted ? 'bg-green-500' : 'bg-orange-500'} text-white text-xs rounded-full flex items-center justify-center font-bold shadow`}>
                                    {index + 1}
                                  </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-gray-800">
                                      {materi.folderName}
                                    </h3>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} rounded-full text-xs font-medium`}>
                                      {isCompleted ? 'Selesai' : 'Belum Selesai'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                    <span className="flex items-center gap-2">
                                      <Calendar size={14} />
                                      {new Date(materi.uploadDate).toLocaleDateString("id-ID", {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <FileText size={14} />
                                      {totalFiles} file • {completedFiles} diunduh
                                    </span>
                                    {isCompleted && (
                                      <span className="flex items-center gap-2 text-green-600">
                                        <Check size={14} />
                                        Selesai pada {new Date().toLocaleDateString("id-ID", {
                                          day: 'numeric',
                                          month: 'short'
                                        })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                onClick={() => navigate(`/materi-siswa/${subject}/${kelasId}`)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                              >
                                <Eye size={16} />
                                Lihat Materi
                              </button>
                              <button
                                onClick={() => isCompleted ? handleMarkIncomplete(materi.id) : handleMarkComplete(materi.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium ${isCompleted ? 'bg-orange-100 hover:bg-orange-200 text-orange-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
                              >
                                {isCompleted ? (
                                  <>
                                    <XCircle size={16} />
                                    Tandai Belum Selesai
                                  </>
                                ) : (
                                  <>
                                    <Check size={16} />
                                    Tandai Selesai
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Progress within each materi */}
                          {totalFiles > 0 && (
                            <div className="mt-4 pl-16">
                              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                                <span>Progress file: {completedFiles} dari {totalFiles}</span>
                                <span>{totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                                  style={{ width: `${totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* MOTIVATION CARD */}
              {materiList.length > 0 && (
                <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <TrendingUp size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">Terus Semangat! 🚀</h3>
                          <p className="text-blue-100 mt-1">
                            Progress Anda {progress.persentasi}% dari target. 
                            {progress.persentasi < 50 
                              ? " Ayo mulai kerjakan materi yang belum selesai!" 
                              : progress.persentasi < 80 
                                ? " Pertahankan momentum belajar Anda!" 
                                : " Tinggal sedikit lagi untuk menyelesaikan semua materi!"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{progress.persentasi}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-blue-100 mt-3">Progress Keseluruhan</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} EduCore. Progress Pembelajaran {subject?.toUpperCase()} Kelas {kelasId}.</p>
            <p className="mt-1">
              Update terakhir: {new Date().toLocaleDateString("id-ID", { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}