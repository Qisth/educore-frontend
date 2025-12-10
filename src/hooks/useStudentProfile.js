import { useState, useEffect } from "react";
import { getProfilSiswa, updateProfilSiswa, getToken } from "../services/api";

export default function useStudentProfile() {
  const [profile, setProfile] = useState({
    nama: "",
    gender: "",
    telepon: "",
    provinsi: "",
    kota: "",
    alamat: "",
    sekolahProvinsi: "",
    sekolahKota: "",
    namaSekolah: "",
    tingkat: "",
    ortuNama: "",
    ortuTelepon: "",
    foto: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Jika tidak ada token, gunakan localStorage (fallback)
      if (!getToken()) {
        const saved = localStorage.getItem("studentProfile");
        if (saved) {
          setProfile(JSON.parse(saved));
        }
        setLoading(false);
        return;
      }

      try {
        const res = await getProfilSiswa();
        if (res.data) {
          const data = res.data;
          setProfile({
            nama: data.nama || "",
            gender: data.gender || "",
            telepon: data.telepon || "",
            provinsi: data.provinsi_alamat || "",
            kota: data.kota_alamat || "",
            alamat: data.alamat || "",
            sekolahProvinsi: data.provinsi_sekolah || "",
            sekolahKota: data.kota_sekolah || "",
            namaSekolah: data.nama_sekolah || "",
            tingkat: data.tingkat || "",
            ortuNama: data.ortu_wali || "",
            ortuTelepon: data.telp_ortu_wali || "",
            foto: data.foto_profil || "",
          });
          // Simpan juga ke localStorage sebagai cache
          localStorage.setItem("studentProfile", JSON.stringify(res.data));
        }
      } catch (err) {
        setError(err.message);
        // Fallback ke localStorage jika API gagal
        const saved = localStorage.getItem("studentProfile");
        if (saved) {
          setProfile(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async (data) => {
    // Simpan ke localStorage sebagai backup
    localStorage.setItem("studentProfile", JSON.stringify(data));
    setProfile(data);

    // Jika ada token, simpan juga ke server
    if (getToken()) {
      try {
        await updateProfilSiswa({
          nama: data.nama,
          provinsiAlamat: data.provinsi,
          kotaAlamat: data.kota,
          alamat: data.alamat,
          tingkat: data.tingkat,
          ortuWali: data.ortuNama,
          telpOrtuWali: data.ortuTelepon,
          provinsiSekolah: data.sekolahProvinsi,
          kotaSekolah: data.sekolahKota,
          namaSekolah: data.namaSekolah,
          fotoProfil: data.foto,
        });
      } catch (err) {
        console.error("Gagal menyimpan profil ke server:", err);
      }
    }
  };

  return { profile, saveProfile, loading, error };
}
