import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Makima from "../assets/images/Ellipse_14.png";
import Logo from "../assets/images/Educore_Logo_White.png";
import useTeacherProfile from "../hooks/useTeacherProfile";
import {
  getMateriBySubject,
  createMateri,
  deleteMateri as deleteMateriAPI,
  getToken,
} from "../services/api";
import {
  User,
  Home,
  Users,
  BookOpen,
  ChevronLeft,
  FolderPlus,
  Trash2,
  FileText,
  Calendar,
  Folder,
  Upload,
  X,
  ChevronDown
} from "lucide-react";

export default function ManajemenKelas() {
  const navigate = useNavigate();
  const { matpel } = useParams();
  const { profile } = useTeacherProfile();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [loading, setLoading] = useState(false);
  const [deskripsi, setDeskripsi] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const kelasList = [
    { id: 1, name: "Kelas 1" },
    { id: 2, name: "Kelas 2" },
    { id: 3, name: "Kelas 3" },
    { id: 4, name: "Kelas 4" },
    { id: 5, name: "Kelas 5" },
    { id: 6, name: "Kelas 6" },
    { id: 7, name: "Kelas 7" },
    { id: 8, name: "Kelas 8" },
    { id: 9, name: "Kelas 9" },
    { id: 10, name: "Kelas 10" },
    { id: 11, name: "Kelas 11" },
    { id: 12, name: "Kelas 12" },
  ];

  useEffect(() => {
    loadMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matpel]);

  const loadMaterials = async () => {
    // Coba load dari API jika ada token
    if (getToken()) {
      try {
        let allMaterials = [];
        for (let i = 1; i <= 12; i++) {
          const res = await getMateriBySubject(matpel, `kelas-${i}`);
          if (res.data && res.data.length > 0) {
            allMaterials = [
              ...allMaterials,
              ...res.data.map((m) => ({ ...m, kelas: i })),
            ];
          }
        }
        if (allMaterials.length > 0) {
          setSavedMaterials(allMaterials);
          return;
        }
      } catch (err) {
        console.log("Fallback ke localStorage");
      }
    }

    // Fallback ke localStorage
    let allMaterials = [];
    for (let i = 1; i <= 12; i++) {
      const materials = JSON.parse(
        localStorage.getItem(`materi_${matpel}_kelas${i}`) || "[]"
      );
      allMaterials = [
        ...allMaterials,
        ...materials.map((m) => ({ ...m, kelas: i })),
      ];
    }
    setSavedMaterials(allMaterials);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const firstFilePath = files[0].webkitRelativePath || files[0].name;
      let extractedFolderName;

      if (files[0].webkitRelativePath) {
        extractedFolderName = firstFilePath.split("/")[0];
      } else {
        extractedFolderName = `Upload ${new Date().toLocaleDateString("id-ID")}`;
      }

      setFolderName(extractedFolderName);

      const fileDetails = files.map((file) => ({
        name: file.name,
        path: file.webkitRelativePath || file.name,
        size: file.size,
        type: file.type,
        file: file,
      }));

      setUploadedFiles(fileDetails);
    }
  };

  const handleSaveMateri = async () => {
    if (uploadedFiles.length === 0) {
      alert("Silakan pilih file atau folder terlebih dahulu!");
      return;
    }

    if (!selectedKelas) {
      alert("Silakan pilih kelas terlebih dahulu!");
      return;
    }

    // Generate default folder name if not provided
    const materiName = folderName.trim() || `Materi ${matpel} - ${new Date().toLocaleDateString('id-ID')}`;

    setLoading(true);

    const newMaterial = {
      id: Date.now(),
      folderName: materiName,
      kelas: selectedKelas,
      uploadDate: new Date().toISOString(),
      fileCount: uploadedFiles.length,
      files: uploadedFiles.map((f) => ({
        name: f.name,
        path: f.path,
        size: f.size,
        type: f.type,
      })),
    };

    if (getToken()) {
      try {
        console.log("=== SAVING MATERI TO DATABASE ===");
        console.log("Data being sent:", {
          matpel: matpel,
          kelas: `kelas-${selectedKelas}`,
          judul: materiName,
          deskripsi: deskripsi || `Materi ${materiName}`,
        });
        
        const response = await createMateri({
          matpel: matpel,
          kelas: `kelas-${selectedKelas}`,
          judul: materiName,
          deskripsi: deskripsi || `Materi ${materiName}`,
          files: newMaterial.files,
        });
        
        console.log("✅ Materi saved to database:", response);

        alert(
          `✅ Berhasil menyimpan "${materiName}" untuk Kelas ${selectedKelas} dengan ${uploadedFiles.length} file ke database!`
        );
        setShowUploadModal(false);
        setUploadedFiles([]);
        setFolderName("");
        setSelectedKelas("");
        setDeskripsi("");
        loadMaterials();
        setLoading(false);
        return;
      } catch (err) {
        console.error("❌ API error:", err);
        alert(`Gagal menyimpan ke database: ${err.message}\n\nMateri akan disimpan ke localStorage saja.`);
      }
    }

    // Fallback ke localStorage
    const storageKey = `materi_${matpel}_kelas${selectedKelas}`;
    const existingMaterials = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    existingMaterials.push(newMaterial);
    localStorage.setItem(storageKey, JSON.stringify(existingMaterials));

    alert(
      `Berhasil mengupload "${folderName}" untuk Kelas ${selectedKelas} dengan ${uploadedFiles.length} file!`
    );
    setShowUploadModal(false);
    setUploadedFiles([]);
    setFolderName("");
    setSelectedKelas("");
    setDeskripsi("");
    loadMaterials();
    setLoading(false);
  };

  const handleDeleteMateri = async (id, kelas) => {
    if (confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
      if (getToken()) {
        try {
          await deleteMateriAPI(id);
          loadMaterials();
          alert("Materi berhasil dihapus!");
          return;
        } catch (err) {
          console.log("API error, fallback ke localStorage:", err);
        }
      }

      const storageKey = `materi_${matpel}_kelas${kelas}`;
      const materials = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const updatedMaterials = materials.filter((m) => m.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updatedMaterials));
      loadMaterials();
      alert("Materi berhasil dihapus!");
    }
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setUploadedFiles([]);
    setFolderName("");
    setSelectedKelas("");
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
          <p className="text-sm text-blue-100 mb-8">
            {decodeURIComponent(matpel || "Mata Pelajaran")}
          </p>

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

        <div className="mt-auto p-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Manajemen Kelas</p>
            <p className="text-xs text-blue-200">
              {decodeURIComponent(matpel || "Mata Pelajaran")}
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
                onClick={() => setOpenMenu(!openMenu)}
                className="p-2"
              >
                {openMenu ? <X size={24} /> : <BookOpen size={24} />}
              </button>
              <img src={Logo} alt="Logo" className="h-8" />
            </div>
            
            <h1 className="text-lg font-semibold">
              {decodeURIComponent(matpel || "Mata Pelajaran")}
            </h1>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-2"
            >
              <FolderPlus size={20} />
            </button>
          </div>

          {openMenu && (
            <div className="bg-blue-700 px-4 py-3 space-y-2">
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/beranda-guru");
                  setOpenMenu(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-800"
                icon={<Home size={20} />}
              >
                Dashboard
              </Button>
              
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/data-siswa");
                  setOpenMenu(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-800"
                icon={<Users size={20} />}
              >
                Data Siswa
              </Button>
              
              <Button
                variant="menu"
                onClick={() => {
                  navigate("/profil-guru");
                  setOpenMenu(false);
                }}
                className="w-full flex items-center gap-3 hover:bg-blue-800"
                icon={<User size={20} />}
              >
                Profil Guru
              </Button>
            </div>
          )}
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* HEADER SECTION */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => navigate(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronLeft className="text-gray-600" size={20} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                      Manajemen Kelas
                    </h1>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-500" />
                    Mata Pelajaran: <strong>{decodeURIComponent(matpel || "Mata Pelajaran")}</strong>
                  </p>
                </div>
                
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2"
                  icon={<FolderPlus size={18} />}
                >
                  Tambah Materi
                </Button>
              </div>

              {/* WELCOME CARD */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Selamat datang di Manajemen Kelas!
                    </h2>
                    <p className="text-gray-600">
                      Kelola materi pembelajaran untuk mata pelajaran{" "}
                      <strong>{decodeURIComponent(matpel || "Mata Pelajaran")}</strong>.
                      Upload file, buat folder, dan organisasi materi dengan mudah.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MATERI SECTION */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Materi yang Tersimpan
                </h2>
                <span className="text-sm text-gray-500">
                  {savedMaterials.length} materi
                </span>
              </div>

              {savedMaterials.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Belum Ada Materi
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Upload materi pertama Anda untuk memulai pembelajaran.
                    Klik tombol "Tambah Materi" di atas.
                  </p>
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 mx-auto"
                    icon={<FolderPlus size={20} />}
                  >
                    Upload Materi Pertama
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedMaterials.map((material) => (
                    <div key={material.id} className="bg-white rounded-lg shadow border border-gray-100 hover:shadow-md transition">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Folder size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 line-clamp-1">
                                {material.folderName}
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <BookOpen size={12} />
                                Kelas {material.kelas}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMateri(material.id, material.kelas)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Hapus materi"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-1">
                              <FileText size={14} />
                              {material.fileCount} file
                            </span>
                            <span className="text-gray-500 flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(material.uploadDate).toLocaleDateString("id-ID")}
                            </span>
                          </div>

                          {material.files && material.files.length > 0 && (
                            <details className="border-t pt-3">
                              <summary className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                                Lihat daftar file ({material.files.length})
                              </summary>
                              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                                {material.files.map((file, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs p-2 hover:bg-gray-50 rounded">
                                    <span className="text-gray-600 truncate">
                                      📄 {file.name}
                                    </span>
                                    <span className="text-gray-500">
                                      {(file.size / 1024).toFixed(0)} KB
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>

                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Upload size={24} className="text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-800">Upload Materi</h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* KELAS SELECTION */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Kelas
                  </label>
                  <div className="relative">
                    <select
                      value={selectedKelas}
                      onChange={(e) => setSelectedKelas(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {kelasList.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>
                          {kelas.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* FOLDER UPLOAD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Folder
                  </label>
                  <label htmlFor="folderInput" className="cursor-pointer block">
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition">
                      <Upload size={40} className="text-blue-400 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium">
                        {uploadedFiles.length === 0
                          ? "Klik untuk memilih folder"
                          : `${uploadedFiles.length} file dipilih${folderName ? ` dari "${folderName}"` : ''}`}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Drag & drop folder atau klik untuk memilih
                      </p>
                    </div>
                    <input
                      id="folderInput"
                      type="file"
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* OR DIVIDER */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">ATAU</span>
                  </div>
                </div>

                {/* FILE UPLOAD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File Individual
                  </label>
                  <label htmlFor="fileInput" className="cursor-pointer block">
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 hover:bg-green-50 transition">
                      <FileText size={40} className="text-green-400 mx-auto mb-3" />
                      <p className="text-gray-700 font-medium">
                        Klik untuk memilih file individual
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        PDF, Word, PPT, Excel, Gambar, Video, dll.
                      </p>
                    </div>
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="*/*"
                    />
                  </label>
                </div>

                {/* FILES LIST */}
                {uploadedFiles.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-3">
                      File yang akan diupload ({uploadedFiles.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uploadedFiles.slice(0, 10).map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded">
                          <span className="text-gray-600 truncate">
                            📄 {file.path}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      ))}
                      {uploadedFiles.length > 10 && (
                        <p className="text-gray-500 text-sm text-center">
                          ... dan {uploadedFiles.length - 10} file lainnya
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleSaveMateri}
                    disabled={loading || uploadedFiles.length === 0 || !selectedKelas}
                    className="flex-1"
                    icon={loading ? null : <Upload size={18} />}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Mengupload...
                      </>
                    ) : (
                      "Simpan Materi"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}