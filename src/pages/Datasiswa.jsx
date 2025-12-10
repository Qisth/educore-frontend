import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { getSiswaSelesai, getToken } from "../services/api";
import useTeacherProfile from "../hooks/useTeacherProfile";
import Makima from "../assets/images/Ellipse_14.png";
import Logo from "../assets/images/Educore_Logo_White.png";
import { 
  ArrowLeft, 
  RefreshCw, 
  User, 
  Home, 
  Users,
  Menu,
  X,
  CheckCircle,
  BookOpen,
  GraduationCap 
} from "lucide-react";

export default function Datasiswa() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useTeacherProfile();
  const [openMenu, setOpenMenu] = useState(false);

  const load = async () => {
    if (!getToken()) return;
    setLoading(true);
    try {
      const res = await getSiswaSelesai();
      if (res && res.data) setData(res.data);
    } catch (err) {
      console.error("Gagal memuat data siswa selesai", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR - DESKTOP */}
      <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-500 to-cyan-600 text-white">
        <div className="p-6 flex flex-col items-center">
          <img 
            src={Logo} 
            alt="EduCore Logo" 
            className="h-12 mb-8" 
          />
          
          {/* PROFILE SECTION */}
          <button
            onClick={() => navigate("/profil-guru")}
            className="focus:outline-none hover:opacity-90 transition-all duration-200 mb-4"
          >
            <div className="relative">
              <img
                src={profile.foto || Makima}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
                alt="Profile"
              />
              <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
          </button>

          <h2 className="text-lg font-semibold mb-8 text-center">
            Halo, <span className="text-yellow-200">{(profile?.nama || "Guru").split(" ")[0]}</span>
          </h2>

          {/* MENU NAVIGATION */}
          <div className="space-y-2 w-full">
            <Button
              variant="menu"
              onClick={() => navigate("/beranda-guru")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3"
              icon={<Home size={20} />}
            >
              Dashboard
            </Button>
            
            <Button
              variant="menu-active"
              className="w-full flex items-center justify-start gap-3 px-4 py-3"
              icon={<Users size={20} />}
            >
              Data Siswa
            </Button>
            
            <Button
              variant="menu"
              onClick={() => navigate("/profil-guru")}
              className="w-full flex items-center justify-start gap-3 px-4 py-3"
              icon={<User size={20} />}
            >
              Profil Guru
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                {openMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              <img src={Logo} alt="Logo" className="h-8" />
            </div>
            
            <button
              onClick={() => navigate("/profil-guru")}
              className="focus:outline-none"
            >
              <img
                src={profile.foto || Makima}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                alt="Profile"
              />
            </button>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {openMenu && (
            <div className="bg-blue-600 px-4 py-3 space-y-2 animate-slideDown">
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/beranda-guru");
                  setOpenMenu(false);
                }}
                className="w-full flex items-center gap-3"
                icon={<Home size={20} />}
              >
                Dashboard
              </Button>
              
              <Button
                variant="menu-active"
                className="w-full flex items-center gap-3"
                icon={<Users size={20} />}
              >
                Data Siswa
              </Button>
            </div>
          )}
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ArrowLeft className="text-gray-600" size={20} />
                  </button>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Data Siswa
                  </h1>
                </div>
                <p className="text-gray-600 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={18} />
                  Siswa yang telah menyelesaikan materi pembelajaran
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={load}
                  variant="secondary"
                  className="flex items-center gap-2"
                  icon={<RefreshCw size={18} />}
                  disabled={loading}
                >
                  {loading ? "Memuat..." : "Refresh"}
                </Button>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Siswa Selesai</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {data.length}
                    </p>
                  </div>
                  <GraduationCap className="text-green-500" size={32} />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Mata Pelajaran</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {[...new Set(data.map(item => item.nama_matpel))].length}
                    </p>
                  </div>
                  <BookOpen className="text-blue-500" size={32} />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Kelas Terlibat</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {[...new Set(data.map(item => item.kelas))].length}
                    </p>
                  </div>
                  <Users className="text-purple-500" size={32} />
                </div>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  Daftar Siswa Selesai Materi
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nama Siswa
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Mata Pelajaran
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Kelas
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-gray-600">Memuat data siswa...</p>
                          </div>
                        </td>
                      </tr>
                    ) : data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Users size={48} className="mb-4" />
                            <p className="text-lg font-medium">Belum ada siswa yang selesai</p>
                            <p className="text-sm">Siswa yang menyelesaikan materi akan muncul di sini</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.map((r, index) => (
                        <tr 
                          key={r.pembelajaran_id} 
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6 text-gray-500 font-medium">
                            {index + 1}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User size={16} className="text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-800">
                                {r.nama_siswa}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {r.nama_matpel}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-gray-700">
                              {r.kelas}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              <CheckCircle size={14} />
                              Selesai
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DEBUG SECTION - Hanya muncul di development */}
            {process.env.NODE_ENV === 'development' && data.length > 0 && (
              <div className="mt-8 bg-gray-900 rounded-xl shadow overflow-hidden">
                <div className="px-4 py-2 bg-gray-800">
                  <p className="text-sm font-mono text-gray-300">
                    Debug Data (Development Only)
                  </p>
                </div>
                <pre className="p-4 text-xs text-gray-300 overflow-auto max-h-60">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}