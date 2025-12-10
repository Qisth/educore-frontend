import { useNavigate } from "react-router-dom";
import Makima from "../assets/images/Ellipse_14.png";
import Aki from "../assets/images/Ellipse_15.png";
import Logo from "../components/Logo";

export default function SelectAccount() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#27B4E3] to-[#0029A2] text-white p-6 flex flex-col items-center">
      <Logo />

      <div className="text-center mt-8 w-full max-w-xl animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-10 drop-shadow-lg">
          Pilih Tipe Akun
        </h2>

        {/* FLEX BOX BUTTON RESPONSIVE */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12 mt-4">
          {/* GURU */}
          <button
            onClick={() => navigate("/login-guru")}
            className="group w-48 h-48 sm:w-60 sm:h-60 bg-[#27B4E3]/70 backdrop-blur-md border border-white/20
                       rounded-2xl shadow-xl flex flex-col items-center justify-center
                       transition-all duration-300 hover:scale-105 hover:bg-[#27B4E3]
                       hover:border-white/40 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            <img
              src={Makima}
              alt="Guru"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mb-4 transition-all duration-300
                         group-hover:scale-110"
            />
            <span className="text-lg sm:text-xl font-semibold tracking-wide drop-shadow-lg">
              Untuk Guru
            </span>
          </button>

          {/* SISWA */}
          <button
            onClick={() => navigate("/login-siswa")}
            className="group w-48 h-48 sm:w-60 sm:h-60 bg-[#27B4E3]/70 backdrop-blur-md border border-white/20
                       rounded-2xl shadow-xl flex flex-col items-center justify-center
                       transition-all duration-300 hover:scale-105 hover:bg-[#27B4E3]
                       hover:border-white/40 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            <img
              src={Aki}
              alt="Siswa"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mb-4 transition-all duration-300
                         group-hover:scale-110"
            />
            <span className="text-lg sm:text-xl font-semibold tracking-wide drop-shadow-lg">
              Untuk Siswa
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
