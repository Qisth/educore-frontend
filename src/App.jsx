// App.jsx - PASTIKAN ROUTE BERANDA SISWA ADA
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import semua halaman
import SelectAccount from "./components/SelectAccount";
import LoginSiswa from "./pages/LoginSiswa";
import LoginGuru from "./pages/LoginGuru";
import RegisterSiswa from "./pages/RegisterSiswa";
import RegisterGuru from "./pages/RegisterGuru";
import BerandaSiswa from "./pages/BerandaSiswa";
import BerandaGuru from "./pages/BerandaGuru";
import DetailMataPelajaran from "./pages/DetailMataPelajaran";
import DetailMataPelajaranSiswa from "./pages/DetailMataPelajaranSiswa";
import ManajemenKelas from "./pages/ManajemenKelas";
import MateriSayaSiswa from "./pages/MateriSayaSiswa";
import Belajar from "./pages/Belajar";
import ProfilSiswa from "./pages/ProfilSiswa";
import EditProfilSiswa from "./pages/EditProfilSiswa";
import ProfilGuru from "./pages/ProfilGuru";
import EditProfilGuru from "./pages/EditProfilGuru";
import ProgressSiswa from "./pages/ProgressSiswa";
import Datasiswa from "./pages/Datasiswa";
import ForgotPasswordSiswa from "./pages/ForgotPasswordSiswa";
import ForgotPasswordGuru from "./pages/ForgotPasswordGuru";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SelectAccount />} />

          {/* LOGIN */}
          <Route path="/login-siswa" element={<LoginSiswa />} />
          <Route path="/login-guru" element={<LoginGuru />} />

          {/* REGISTER */}
          <Route path="/register-siswa" element={<RegisterSiswa />} />
          <Route path="/register-guru" element={<RegisterGuru />} />

          {/* BERANDA - PASTIKAN ADA */}
          <Route path="/beranda-siswa" element={<BerandaSiswa />} />
          <Route path="/beranda-guru" element={<BerandaGuru />} />

          {/* DETAIL MATA PELAJARAN */}
          <Route
            path="/mata-pelajaran/:subject"
            element={<DetailMataPelajaran />}
          />
          <Route
            path="/mata-pelajaran-siswa/:subject"
            element={<DetailMataPelajaranSiswa />}
          />
          {/* manajemen kelas */}
          <Route path="/manajemen-kelas/:matpel" element={<ManajemenKelas />} />

          {/* materi siswa */}
          <Route
            path="/materi-siswa/:subject/:kelasId"
            element={<MateriSayaSiswa />}
          />
          <Route path="/belajar/:subject/:materiId" element={<Belajar />} />
          <Route
            path="/progress/:subject/:kelasId"
            element={<ProgressSiswa />}
          />

          {/* profil siswa*/}
          <Route path="/profil-siswa" element={<ProfilSiswa />} />
          <Route path="/edit-profil-siswa" element={<EditProfilSiswa />} />

          {/* profil guru*/}
          <Route path="/profil-guru" element={<ProfilGuru />} />
          <Route path="/edit-profil-guru" element={<EditProfilGuru />} />
          <Route path="/data-siswa" element={<Datasiswa />} />

          <Route path="/forgot-password-siswa" element={<ForgotPasswordSiswa />} />
          <Route path="/forgot-password-guru" element={<ForgotPasswordGuru />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}
