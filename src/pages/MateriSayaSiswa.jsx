import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../assets/images/Educore_Logo_White.png";
import Aki from "../assets/images/Ellipse_15.png";
import useStudentProfile from "../hooks/useStudentProfile";
import { getMateriBySubject, getToken } from "../services/api";
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
  Filter,
  Calendar,
  Target,
  Award,
  Download,
  File,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  FileText as FileTextIcon,
  Image,
  Video,
  FileSpreadsheet,
  Presentation,
  X,
} from "lucide-react";

export default function MateriSayaSiswa() {
  const navigate = useNavigate();
  const { subject, kelasId } = useParams();

  const { profile } = useStudentProfile();
  const [materiList, setMateriList] = useState([]);
  const [expandedMateri, setExpandedMateri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadMateri();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, kelasId]);

  const loadMateri = async () => {
    setLoading(true);

    // Coba load dari API jika ada token
    if (getToken()) {
      try {
        const res = await getMateriBySubject(subject, `kelas-${kelasId}`);
        if (res.data && res.data.length > 0) {
          setMateriList(res.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log("Fallback ke localStorage:", err);
      }
    }

    // Fallback ke localStorage
    const storageKey = `materi_${subject}_kelas${kelasId}`;
    const loadedMaterials = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    // Normalize file paths to "folderName/filename" format
    const normalized = loadedMaterials.map((m) => {
      if (m.files && Array.isArray(m.files)) {
        return {
          ...m,
          files: m.files.map((f) => {
            // If path doesn't contain "/" or looks malformed, reconstruct it
            if (!f.path || !f.path.includes("/")) {
              return { ...f, path: `${m.folderName}/${f.name}` };
            }
            return f;
          }),
        };
      }
      return m;
    });
    setMateriList(normalized);
    setLoading(false);
  };

  const toggleExpand = (materiId) => {
    setExpandedMateri(expandedMateri === materiId ? null : materiId);
  };

  const downloadFile = async (file) => {
    try {
      // parse file.path as "folderName/filename"
      const pathParts = (file.path || "").split("/");
      if (pathParts.length < 2) {
        throw new Error("Invalid file path format");
      }
      const folder = pathParts.slice(0, -1).join("/"); // all but last
      const filename = pathParts[pathParts.length - 1]; // last part
      const base = "http://localhost:5000/api/uploads"; // backend uploads base
      const url = `${base}/download/${encodeURIComponent(
        folder
      )}/${encodeURIComponent(filename)}`;
      const headers = {};
      const token = getToken();
      if (token) headers.Authorization = token;

      const res = await fetch(url, { headers });
      if (!res.ok)
        throw new Error(`Download failed: ${res.status} ${res.statusText}`);

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      alert("File berhasil diunduh!");
    } catch (err) {
      console.error("Download error:", err);
      alert("Gagal mengunduh file. Cek console untuk detail.");
    }
  };

  const handleSelesai = () => {
    navigate(`/progress/${subject}/${kelasId}`);
  };

  const getFileIcon = (fileType, fileName) => {
    if (fileType?.includes("pdf") || fileName?.endsWith(".pdf"))
      return {
        icon: <FileTextIcon size={20} className="text-red-500" />,
        color: "bg-red-50 border-red-100",
      };
    if (
      fileType?.includes("word") ||
      fileName?.endsWith(".doc") ||
      fileName?.endsWith(".docx")
    )
      return {
        icon: <FileText size={20} className="text-blue-500" />,
        color: "bg-blue-50 border-blue-100",
      };
    if (
      fileType?.includes("sheet") ||
      fileName?.endsWith(".xls") ||
      fileName?.endsWith(".xlsx")
    )
      return {
        icon: <FileSpreadsheet size={20} className="text-green-500" />,
        color: "bg-green-50 border-green-100",
      };
    if (
      fileType?.includes("presentation") ||
      fileName?.endsWith(".ppt") ||
      fileName?.endsWith(".pptx")
    )
      return {
        icon: <Presentation size={20} className="text-orange-500" />,
        color: "bg-orange-50 border-orange-100",
      };
    if (fileType?.includes("image"))
      return {
        icon: <Image size={20} className="text-purple-500" />,
        color: "bg-purple-50 border-purple-100",
      };
    if (fileType?.includes("video"))
      return {
        icon: <Video size={20} className="text-pink-500" />,
        color: "bg-pink-50 border-pink-100",
      };
    return {
      icon: <File size={20} className="text-gray-500" />,
      color: "bg-gray-50 border-gray-100",
    };
  };

  const filteredMateriList = materiList.filter(
    (materi) =>
      materi.folderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (materi.description &&
        materi.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate statistics
  const totalFiles = materiList.reduce(
    (acc, curr) => acc + (curr.files?.length || 0),
    0
  );
  const totalFileSizeMB = (
    materiList.reduce((acc, curr) => {
      const filesSize =
        curr.files?.reduce((sum, file) => sum + (file.size || 0), 0) || 0;
      return acc + filesSize;
    }, 0) /
    (1024 * 1024)
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="p-6 flex flex-col items-center">
          <img src={Logo} alt="EduCore Logo" className="h-10 mb-8" />

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
            <GraduationCap size={14} />
            <span className="text-sm">Kelas {kelasId}</span>
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
              onClick={() => navigate("/profil-siswa")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg hover:bg-blue-500/50 transition-colors"
              icon={<User size={20} />}
            >
              Profil Siswa
            </Button>
          </nav>
        </div>

        {/* CURRENT SUBJECT INFO */}
        <div className="mt-auto p-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Mata Pelajaran</p>
            <p className="text-lg font-bold mb-2">{subject?.toUpperCase()}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
              <FolderOpen size={14} />
              <span>{materiList.length} Materi</span>
              <span>•</span>
              <span>{totalFiles} File</span>
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
                {sidebarOpen ? <X size={24} /> : <BookOpen size={24} />}
              </button>
              <img src={Logo} alt="Logo" className="h-8" />
            </div>

            <div className="flex flex-col items-center">
              <h1 className="text-lg font-semibold">
                {subject?.toUpperCase()}
              </h1>
              <p className="text-xs text-blue-100">Kelas {kelasId}</p>
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
                  <p className="font-semibold">
                    {profile?.nama?.split(" ")[0] || "Siswa"}
                  </p>
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
                  navigate("/profil-siswa");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-600 py-3 rounded-lg"
                icon={<User size={20} />}
              >
                Profil Siswa
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
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={20} />
                      Kembali
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen size={24} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Materi {subject?.toUpperCase()}
                      </h1>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          <GraduationCap size={14} />
                          Kelas {kelasId}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">
                          {materiList.length} Materi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Cari materi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                    />
                  </div>
                  <button
                    onClick={handleSelesai}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <BarChart3 size={20} />
                    Lihat Progress
                  </button>
                </div>
              </div>

              {/* STATS SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Materi</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {materiList.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Folder className="text-blue-500" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total File</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {totalFiles}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <FileText className="text-green-500" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Ukuran</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {totalFileSizeMB} MB
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <FolderOpen className="text-purple-500" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Terakhir Diupdate</p>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {materiList.length > 0
                          ? new Date(
                              materiList[materiList.length - 1].uploadDate
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                      <Calendar className="text-amber-500" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WELCOME CARD */}
            <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white rounded-2xl p-6 mb-8 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <GraduationCap size={28} />
                      </div>
                      <h2 className="text-2xl font-bold">
                        Selamat Belajar! 🎓
                      </h2>
                    </div>
                    <p className="text-white/90 max-w-2xl">
                      Jelajahi semua materi pembelajaran{" "}
                      <strong>{subject}</strong> untuk Kelas {kelasId}. Setiap
                      file dapat diunduh untuk dipelajari secara offline.
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{materiList.length}</p>
                      <p className="text-sm text-white/80">Materi</p>
                    </div>
                    <div className="h-12 w-px bg-white/30"></div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{totalFiles}</p>
                      <p className="text-sm text-white/80">File</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MATERI LIST */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Daftar Materi
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {filteredMateriList.length} dari {materiList.length}{" "}
                      materi ditemukan
                    </p>
                  </div>

                  {materiList.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">
                        File aktif: {expandedMateri ? "1" : "0"} dibuka
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">Memuat materi...</p>
                </div>
              ) : filteredMateriList.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <FolderOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchTerm ? "Materi tidak ditemukan" : "Belum Ada Materi"}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    {searchTerm
                      ? `Tidak ada materi yang sesuai dengan pencarian "${searchTerm}".`
                      : `Guru akan segera mengupload materi pembelajaran untuk ${subject} Kelas ${kelasId}.`}
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
                  {filteredMateriList.map((materi, index) => (
                    <div
                      key={materi.id}
                      className="p-6 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-md">
                                <Folder className="text-white" size={24} />
                              </div>
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
                                {index + 1}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-800 break-words">
                                  {materi.folderName}
                                </h3>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                  <Folder size={12} />
                                  {materi.files?.length || 0} file
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                <span className="flex items-center gap-2">
                                  <Calendar size={14} />
                                  {new Date(
                                    materi.uploadDate
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                                <span className="flex items-center gap-2">
                                  <Clock size={14} />
                                  {new Date(
                                    materi.uploadDate
                                  ).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>

                              {materi.description && (
                                <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                                  {materi.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleExpand(materi.id)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-300 min-w-[120px] justify-center"
                        >
                          {expandedMateri === materi.id
                            ? "Tutup"
                            : "Lihat File"}
                          {expandedMateri === materi.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </div>

                      {/* Expanded File List */}
                      {expandedMateri === materi.id &&
                        materi.files &&
                        materi.files.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FileText size={20} className="text-blue-500" />
                                Daftar File ({materi.files.length})
                              </h4>
                              <span className="text-sm text-gray-500">
                                Klik unduh untuk menyimpan file
                              </span>
                            </div>

                            <div className="grid gap-3">
                              {materi.files.map((file, idx) => {
                                const fileIcon = getFileIcon(
                                  file.type,
                                  file.name
                                );

                                return (
                                  <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border hover:border-gray-300 hover:bg-white transition-all group/file"
                                  >
                                    <div className="flex items-center gap-4 flex-1 min-w-0 mb-3 sm:mb-0">
                                      <div
                                        className={`w-12 h-12 rounded-xl border ${fileIcon.color} flex items-center justify-center flex-shrink-0`}
                                      >
                                        {fileIcon.icon}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate group-hover/file:text-blue-700 transition-colors">
                                          {file.name}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                                          <span className="truncate max-w-xs">
                                            {file.path}
                                          </span>
                                          <span>•</span>
                                          <span>
                                            {(file.size / 1024).toFixed(1)} KB
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => downloadFile(file)}
                                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-300 sm:w-auto w-full justify-center"
                                    >
                                      <Download size={16} />
                                      Unduh
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LEARNING TIPS */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-xl flex items-center justify-center">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Tips Belajar Efektif
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Unduh materi dan pelajari secara berurutan. Luangkan waktu
                      30 menit setiap hari untuk hasil terbaik.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {expandedMateri ? 1 : 0}
                    </p>
                    <p className="text-xs text-gray-500">Materi dibuka</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {totalFiles}
                    </p>
                    <p className="text-xs text-gray-500">File tersedia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} EduCore. Materi Pembelajaran{" "}
              {subject?.toUpperCase()} Kelas {kelasId}.
            </p>
            <p className="mt-1">
              {materiList.length} Materi • {totalFiles} File • {totalFileSizeMB}{" "}
              MB Total
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
