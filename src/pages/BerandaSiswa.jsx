import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import useStudentProfile from "../hooks/useStudentProfile";
import {
  Menu,
  X,
  Home,
  User,
  BookOpen,
  ChevronRight,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Award,
  Star,
  GraduationCap,
  Search
} from "lucide-react";

import Logo from "../assets/images/Educore_Logo_White.png";
import Aki from "../assets/images/Ellipse_15.png";
import mtk from "../assets/images/mtk.jpg";
import indo from "../assets/images/B.indo.jpg";
import inggris from "../assets/images/B.inggris.jpg";
import biologi from "../assets/images/biologi.jpg";
import kimia from "../assets/images/kimia.jpg";
import fisika from "../assets/images/fisika.jpg";
import geografi from "../assets/images/geografi.jpg";
import ekonomi from "../assets/images/ekonomi.jpg";
import sejarah from "../assets/images/sejarah.jpg";

export default function BerandaSiswa() {
  const navigate = useNavigate();
  const { profile } = useStudentProfile();
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const subjects = [
    { title: "Matematika", img: mtk, color: "from-blue-500 to-cyan-500" },
    { title: "Bahasa Indonesia", img: indo, color: "from-emerald-500 to-teal-500" },
    { title: "Bahasa Inggris", img: inggris, color: "from-purple-500 to-pink-500" },
    { title: "Biologi", img: biologi, color: "from-green-500 to-lime-500" },
    { title: "Kimia", img: kimia, color: "from-orange-500 to-amber-500" },
    { title: "Fisika", img: fisika, color: "from-red-500 to-rose-500" },
    { title: "Geografi", img: geografi, color: "from-indigo-500 to-blue-500" },
    { title: "Ekonomi", img: ekonomi, color: "from-yellow-500 to-orange-500" },
    { title: "Sejarah", img: sejarah, color: "from-gray-700 to-gray-900" },
  ];

  // Stats akan terisi otomatis setelah siswa mulai belajar
  const stats = {
    totalSubjects: subjects.length,
    completedSubjects: 0,
    assignmentsPending: 0,
    averageScore: 0
  };

  const recentActivity = [
    // Akan terisi ketika siswa mulai mengerjakan tugas atau materi
  ];

  const upcomingAssignments = [
    // Akan terisi ketika guru memberikan tugas
  ];

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (subjectTitle) => {
    navigate(`/mata-pelajaran-siswa/${subjectTitle.toLowerCase().replace(" ", "-")}`);
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
            Kelas {profile?.kelas || "-"} • {profile?.tingkat || "Siswa"}
          </p>

          {/* MENU NAVIGATION */}
          <nav className="space-y-2 w-full">
            <Button
              variant="menu-active"
              className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg bg-blue-700"
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
            <p className="text-sm text-blue-100 mb-1">Status Belajar</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
              <Star size={12} className="text-yellow-300" />
              <span className="text-xs text-yellow-300 font-medium">Siap Belajar</span>
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
                onClick={() => setOpenMenu(!openMenu)}
                className="p-2"
              >
                {openMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              <img src={Logo} alt="Logo" className="h-8" />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2">
                <Bell size={22} />
              </button>
              
              <button onClick={() => navigate("/profil-siswa")} className="focus:outline-none">
                <img
                  src={profile?.foto || Aki}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  alt="Profile"
                />
              </button>
            </div>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {openMenu && (
            <div className="bg-blue-700 px-4 py-3 space-y-2">
              <Button
                variant="menu-active"
                onClick={() => setOpenMenu(false)}
                className="w-full flex items-center gap-3 bg-blue-800"
                icon={<Home size={20} />}
              >
                Dashboard
              </Button>
              
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/profil-siswa");
                  setOpenMenu(false);
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
                  setOpenMenu(false);
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
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Dashboard Siswa
                  </h1>
                  <p className="text-gray-600">
                    Selamat belajar, <span className="font-semibold text-blue-600">{profile?.nama?.split(" ")[0] || "Siswa"}</span>!
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Cari mata pelajaran..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* STATS CARDS - KOSONG */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Mata Pelajaran</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {stats.totalSubjects}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Tersedia untuk dipelajari
                      </p>
                    </div>
                    <BookOpen className="text-blue-500" size={28} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Terselesaikan</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {stats.completedSubjects}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Akan terisi saat belajar
                      </p>
                    </div>
                    <CheckCircle className="text-green-500" size={28} />
                  </div>
                </div>
                
               
                
              </div>
            </div>

            {/* MATA PELAJARAN SECTION */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Mata Pelajaran</h2>
                <span className="text-sm text-gray-500">
                  {filteredSubjects.length} mata pelajaran tersedia
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleCardClick(item.title)}
                    className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md border border-gray-100"
                  >
                    <div className="relative overflow-hidden h-32">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-3">{item.title}</h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {stats.completedSubjects === 0 ? "Belum mulai belajar" : `${stats.completedSubjects}% selesai`}
                          </span>
                        </div>
                        <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          Klik untuk belajar
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          Belum ada progress
                        </span>
                        <ChevronRight size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WELCOME MESSAGE */}
            <div className="mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">
                    Siap untuk Mulai Belajar?
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Dashboard ini akan terisi otomatis ketika Anda mulai mengikuti mata pelajaran dan mengerjakan tugas. 
                    Setiap mata pelajaran sudah siap untuk dipelajari.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-300" />
                      <span className="text-sm">Materi siap diakses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-300" />
                      <span className="text-sm">Progress otomatis</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <GraduationCap className="w-20 h-20 text-white/80 mx-auto mb-4" />
                  <p className="text-3xl font-bold">{stats.completedSubjects}</p>
                  <p className="text-sm text-blue-100">Materi akan diselesaikan</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} EduCore. Dashboard Siswa.</p>
            <p className="mt-1">
              Data statistik akan terisi otomatis saat Anda mulai belajar
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}