import Polos from "../components/Polos";

export default function Lupasandi_siswa() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#27B4E3] to-[#0029A2] text-white px-6">
      <Polos />
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-4">
          Lupa kata sandi?
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col text-left">
            <label className="text-blue-700 font-medium mb-1">
              Nama pengguna or Email
            </label>
            <input
              type="email"
              className="rounded-lg bg-blue-100  text-blue-900 placeholder-blue-400 px-4 py-2 focus:ring-2 focus:ring-blue-700"
              placeholder="Masukkan nama pengguna atau email"
            />
          </div>

          {/* Button */}
          <div className="flex flex-col text-left">
            <p className="text-blue-700 text-center mb-2">
              Link verifikasi akan dikirkim ke email kamu!
            </p>
            <button className="bg-[#27B4E3] hover:bg-[#BAD6EB] text-white font-bold py-2 rounded-lg transition">
              Kirim ke Email
            </button>
          </div>
        </form>

        {/* Back to login */}
        <p className="text-center text-blue-700 mt-4">
          <a href="/login-siswa" className="text-blue-700 hover:underline">
            Kembali ke Login
          </a>
        </p>
      </div>
    </div>
  );
}
