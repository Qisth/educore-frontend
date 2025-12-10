import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import {
  tandaiMateriSelesai,
  cekStatusMateri,
  getToken,
  getDetailMateri,
} from "../services/api";

export default function Belajar() {
  const { subject, materiId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [kelas, setKelas] = useState("1");
  const [isTeacher, setIsTeacher] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiMateri, setApiMateri] = useState(null);
  const TOTAL_MATERI = 3; // used for percent calculations (dummy)

  // dummy content - replace with API data later
  const materiData = {
    1: {
      judul: "Aljabar Dasar",
      durasi: "30 menit",
      sections: [
        { id: 1, title: "Pengantar Aljabar", text: "Konsep variabel dan konstanta. Contoh soal sederhana." },
        { id: 2, title: "Operasi Aljabar", text: "Penjumlahan, pengurangan, perkalian, pembagian aljabar." },
      ],
    },
    2: {
      judul: "Geometri Bangun Datar",
      durasi: "45 menit",
      sections: [
        { id: 1, title: "Persegi & Persegi Panjang", text: "Rumus luas dan keliling, contoh soal." },
        { id: 2, title: "Lingkaran", text: "Rumus phi, diameter, jari-jari, luas." },
      ],
    },
    3: {
      judul: "Trigonometri",
      durasi: "60 menit",
      sections: [
        { id: 1, title: "Sinus, Cosinus", text: "Definisi dasar dan hubungan pada segitiga siku-siku." },
        { id: 2, title: "Praktik Soal", text: "Contoh soal dan penyelesaian." },
      ],
    },
  };

  const id = Number(materiId);
  const mFromDummy = materiData[id] || { judul: `Materi ${materiId}`, durasi: "-", sections: [{ id: 1, title: "-", text: "Konten belum tersedia." }] };
  const m = apiMateri
    ? {
        judul: apiMateri.nama || mFromDummy.judul,
        durasi: apiMateri.durasi || mFromDummy.durasi,
        sections: apiMateri.isi
          ? [{ id: 1, title: apiMateri.nama, text: apiMateri.deskripsi || apiMateri.isi }]
          : mFromDummy.sections,
      }
    : mFromDummy;

  const handleNext = () => {
    const nextId = id + 1;
    // naive next logic: if next exists, go to it, else back to materi list
    if (materiData[nextId]) navigate(`/belajar/${subject}/${nextId}`);
    else navigate(`/materi-siswa/${subject}`);
  };

  useEffect(() => {
    // role can be passed as ?role=guru or stored in localStorage
    const qs = new URLSearchParams(location.search);
    const role = qs.get("role") || localStorage.getItem("role");
    setIsTeacher(role === "guru");
    
    // Cek status materi
    checkCompletionStatus();
    // Jika user terhubung ke backend, coba ambil detail materi dari API
    (async () => {
      if (!getToken()) return;
      try {
        const res = await getDetailMateri(subject, materiId);
        if (res && res.data) setApiMateri(res.data);
      } catch (err) {
        // tetap gunakan konten dummy jika API gagal
        console.log("Tidak dapat memuat materi dari API, gunakan fallback");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, materiId, kelas]);

  const checkCompletionStatus = async () => {
    if (getToken()) {
      try {
        const res = await cekStatusMateri(materiId);
        setIsCompleted(res.selesai || false);
        return;
      } catch (err) {
        console.log("Fallback ke localStorage untuk status");
      }
    }
    // Fallback ke localStorage
    setIsCompleted(isCompletedForClass(subject, kelas, materiId));
  };

  const storageKey = (subject, kelas) => `completed::${subject || "unknown"}::kelas-${kelas}`;

  function isCompletedForClass(subject, kelas, materiId) {
    try {
      const raw = localStorage.getItem(storageKey(subject, kelas));
      if (!raw) return false;
      const arr = JSON.parse(raw);
      return arr.includes(Number(materiId));
    } catch (e) {
      return false;
    }
  }

  async function markCompleted(subject, kelas, materiIdToMark) {
    setLoading(true);
    
    // Coba simpan ke API jika ada token
    if (getToken()) {
      try {
        const res = await tandaiMateriSelesai(materiIdToMark);
        console.log("tandaiMateriSelesai response:", res);
        if (res && res.status === "success") {
          setIsCompleted(true);
          setLoading(false);
          alert("Tersimpan di server: Materi ditandai selesai.");
          return true;
        } else {
          // unexpected but show response
          alert("Server merespon: " + (res.message || JSON.stringify(res)));
          setLoading(false);
          return false;
        }
      } catch (err) {
        console.error("API error saat tandaiMateriSelesai:", err);
        alert("Gagal menyimpan ke server: " + (err.message || err));
      }
    }

    // Fallback ke localStorage
    try {
      const key = storageKey(subject, kelas);
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      const idNum = Number(materiIdToMark);
      if (!arr.includes(idNum)) arr.push(idNum);
      localStorage.setItem(key, JSON.stringify(arr));
      setIsCompleted(true);
      setLoading(false);
      return true;
    } catch (e) {
      setLoading(false);
      return false;
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Button variant="link" onClick={() => navigate(-1)}>Kembali</Button>
          <div>
            <h1 style={styles.title}>{m.judul}</h1>
            <div style={styles.meta}>{m.durasi} • {subject ? subject.toUpperCase() : ""}</div>
          </div>
        </div>

        <div style={styles.main}>
          <div style={styles.videoColumn}>
            <div style={styles.videoPlaceholder}>Video / Slide Placeholder</div>
            <div style={styles.controls}>
              <Button onClick={() => alert("Mulai/Resume")}>Putar</Button>
              <Button variant="menu" onClick={() => alert("Catatan")}>Catatan</Button>
            </div>

            {/* teacher controls: upload materi, create exam, view learners */}
            {isTeacher && (
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <input type="file" style={{ display: "none" }} onChange={(e) => alert(`Upload: ${e.target.files?.[0]?.name || ''}`)} />
                  <Button onClick={() => document.querySelector('input[type=file]')?.click()}>Upload Materi</Button>
                </label>
                <Button variant="menu" onClick={() => alert("Buat Ujian (modal)")}>Buat Ujian</Button>
                <Button variant="menu" onClick={() => {
                  const key = storageKey(subject, kelas);
                  const raw = localStorage.getItem(key);
                  const arr = raw ? JSON.parse(raw) : [];
                  alert(`Siswa yang sudah menyelesaikan (kelas ${kelas}):\n` + (arr.length ? arr.join(', ') : 'Belum ada'));
                }}>Lihat yang sudah belajar</Button>
              </div>
            )}

          </div>

          <div style={styles.contentColumn}>
            {m.sections.map((s) => (
              <section key={s.id} style={styles.section}>
                <h3 style={styles.sectionTitle}>{s.title}</h3>
                <p style={styles.sectionText}>{s.text}</p>
              </section>
            ))}

            <div style={styles.nextRow}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: 14, color: '#666' }}>Pilih Kelas:</label>
                  <select value={kelas} onChange={(e) => setKelas(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6 }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={i + 1}>{`KELAS ${i + 1}`}</option>
                    ))}
                  </select>
                </div>

                <Button onClick={async () => {
                  const ok = await markCompleted(subject, kelas, id);
                  if (ok) alert('Tersimpan: Materi ditandai selesai untuk ' + `KELAS ${kelas}`);
                }} style={{ width: 180 }} disabled={loading || isCompleted}>
                  {isCompleted ? "✓ Sudah Selesai" : (loading ? "Menyimpan..." : "Tandai Selesai")}
                </Button>

                <Button onClick={handleNext}>{materiData[id + 1] ? "Selanjutnya" : "Selesai"}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 20, fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" },
  container: { maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 18 },
  title: { margin: 0, fontSize: 24, fontWeight: 700, color: "#003cbd" },
  meta: { color: "#666", fontSize: 13 },
  main: { display: "flex", gap: 24 },
  videoColumn: { flex: 1, minWidth: 360 },
  videoPlaceholder: { background: "#00000008", height: 260, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#666", marginBottom: 12 },
  controls: { display: "flex", gap: 12 },
  contentColumn: { flex: 1.2, background: "white", padding: 18, borderRadius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
  section: { marginBottom: 14 },
  sectionTitle: { margin: "6px 0", fontSize: 18, color: "#000" },
  sectionText: { color: "#333", lineHeight: 1.6 },
  nextRow: { display: "flex", justifyContent: "flex-end", marginTop: 12 },
};

