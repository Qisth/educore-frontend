import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Makima from "../assets/images/Ellipse_14.png";
import Logo from "../assets/images/Educore_Logo_White.png";
import useTeacherProfile from "../hooks/useTeacherProfile";
import { useState } from "react";

export default function DetailMataPelajaran() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { profile } = useTeacherProfile();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const kelasList = [
    { id: 1, name: "KELAS 1", status: "Tambah" },
    { id: 2, name: "KELAS 2", status: "Tambah" },
    { id: 3, name: "KELAS 3", status: "Tambah" },
    { id: 4, name: "KELAS 4", status: "Tambah" },
    { id: 5, name: "KELAS 5", status: "Tambah" },
    { id: 6, name: "KELAS 6", status: "Tambah" },
    { id: 7, name: "KELAS 7", status: "Tambah" },
    { id: 8, name: "KELAS 8", status: "Tambah" },
    { id: 9, name: "KELAS 9", status: "Tambah" },
    { id: 10, name: "KELAS 10", status: "Tambah" },
    { id: 11, name: "KELAS 11", status: "Tambah" },
    { id: 12, name: "KELAS 12", status: "Tambah" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <div
        className={`bg-[#27B4E3] text-white flex flex-col items-center pt-6
        fixed md:relative top-0 left-0 h-full w-[250px] z-50
        transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <img src={Logo} alt="EduCore Logo" className="h-20 md:h-28 mb-6" />

        <button
          onClick={() => navigate("/profil-guru")}
          className="focus:outline-none hover:opacity-80 transition"
        >
          <img
            src={profile.foto || Makima}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full mb-3 object-cover"
          />
        </button>

        <h2 className="text-lg md:text-2xl font-semibold mb-6">Halo, Guru!</h2>

        <div className="flex md:flex-col gap-3 mb-4 w-full px-4">
          <Button
            variant="menu"
            onClick={() => navigate("/beranda-guru")}
            className="w-full"
          >
            Dashboard
          </Button>

          <Button variant="menu" className="w-full">
            Data Siswa
          </Button>
        </div>
      </div>

      {/* BUTTON MENU MOBILE */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-4 left-4 bg-[#27B4E3] text-white px-3 py-2 rounded-md shadow-md z-50"
      >
        ☰
      </button>

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate("/beranda-guru")}
            variant="link"
            className="text-blue-700 font-semibold"
          >
            Kembali
          </Button>

          <h1 className="text-2xl sm:text-3xl font-bold">
            {subject?.toUpperCase()}
          </h1>
        </div>

        {/* Class List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {kelasList.map((kelas) => (
            <div
              key={kelas.id}
              className="bg-white rounded-xl shadow-md border p-4 flex flex-col justify-between hover:shadow-lg cursor-pointer transition"
              onClick={() => navigate(`/manajemen-kelas/${subject}`)}
            >
              <h3 className="text-lg font-bold">{kelas.name}</h3>

              <div className="flex justify-end mt-6">
                <Button className="bg-blue-600 text-white px-4 py-1 rounded-lg">
                  {kelas.status}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
