// src/services/api.js
const API_BASE_URL = "https://educore-sigma.vercel.app/api";

// Helper untuk menyimpan dan mengambil token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// Helper untuk request dengan auth header
const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: token }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan");
  }

  return data;
};

// ================== AUTH ==================
export const loginSiswa = async (email, password) => {
  const res = await authFetch("/login-siswa", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res.data?.token) {
    setToken(res.data.token);
    localStorage.setItem("role", "siswa");
    if (res.data?.id_userProfil) {
      localStorage.setItem("id_userProfil", res.data.id_userProfil);
    }
  }
  return res;
};

export const loginGuru = async (email, password) => {
  const res = await authFetch("/login-guru", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res.data?.token) {
    setToken(res.data.token);
    localStorage.setItem("role", "guru");
    if (res.data?.id_userProfil) {
      localStorage.setItem("id_userProfil", res.data.id_userProfil);
    }
  }
  return res;
};

export const registerSiswa = async (data) => {
  return authFetch("/register-siswa", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const registerGuru = async (data) => {
  return authFetch("/register-guru", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const logout = () => {
  removeToken();
  localStorage.removeItem("role");
  localStorage.removeItem("id_userProfil");
  localStorage.removeItem("studentProfile");
  localStorage.removeItem("teacherProfile");
};

// ================== PROFIL ==================
export const getProfilSiswa = async () => {
  return authFetch("/profil-siswa");
};

export const updateProfilSiswa = async (data) => {
  return authFetch("/edit-profil-siswa", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getProfilGuru = async () => {
  return authFetch("/profil-guru");
};

export const updateProfilGuru = async (data) => {
  return authFetch("/edit-profil-guru", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ================== MATA PELAJARAN ==================
export const getMatpel = async () => {
  return authFetch("/matpel");
};

// ================== MATERI ==================
export const getKelasMapelSiswa = async (subject) => {
  return authFetch(`/materi-siswa/${subject}/kelas`);
};

export const getMateriBySubject = async (subject, kelasId) => {
  return authFetch(`/materi-siswa/${subject}/materi?kelas=${kelasId}`);
};

export const getDetailMateri = async (subject, materiId) => {
  return authFetch(`/belajar/${subject}/${materiId}`);
};

// GURU: CRUD Materi
export const createMateri = async (data) => {
  return authFetch("/materi", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateMateri = async (id, data) => {
  return authFetch(`/materi/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteMateri = async (id) => {
  return authFetch(`/materi/${id}`, {
    method: "DELETE",
  });
};

// ================== PEMBELAJARAN ==================
export const tandaiMateriSelesai = async (idMateri) => {
  return authFetch("/materi/selesai", {
    method: "POST",
    body: JSON.stringify({ idMateri }),
  });
};

export const cekStatusMateri = async (idMateri) => {
  return authFetch(`/materi/${idMateri}/selesai`);
};

// GURU: ambil siswa yang telah menandai materi selesai (sidebar)
export const getSiswaSelesai = async () => {
  return authFetch(`/guru/selesai`);
};
