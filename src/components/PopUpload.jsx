import React, { useState } from "react";

export default function PopupUpload({ visible, onClose, onUpload }) {
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState(null);

  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!folderName || !file) return alert("Lengkapi data!");
    onUpload(folderName, file);
    setFolderName("");
    setFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Tambah Materi</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-sm">Nama Folder</label>
            <input
              className="border rounded w-full px-2 py-1"
              placeholder="Contoh: Materi Bab 1"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold text-sm">File</label>
            <input
              type="file"
              className="border rounded w-full"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
