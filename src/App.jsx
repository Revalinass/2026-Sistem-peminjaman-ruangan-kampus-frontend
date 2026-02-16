import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FormInput from './components/FormInput';
import TabelRiwayat from './components/TabelRiwayat';
import './index.css';

function App() {
  const [data, setData] = useState([]);
  const [ruangan, setRuangan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ 
    namaPeminjam: '', 
    ruangId: '', 
    tanggal: new Date().toISOString().substring(0, 16) 
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const API_URL = "http://localhost:5092/api/Peminjaman";
  const RUANG_URL = "http://localhost:5092/api/Ruang";

  const refreshData = () => axios.get(API_URL).then(res => setData(res.data));
  const refreshRuang = () => axios.get(RUANG_URL).then(res => setRuangan(res.data));

  useEffect(() => { refreshData(); refreshRuang(); }, []);

  const handleSimpan = (e) => {
    e.preventDefault();
    const payload = editingId ? form : { ...form, ruangId: parseInt(form.ruangId) };
    const action = editingId 
      ? axios.put(`${API_URL}/${editingId}`, payload) 
      : axios.post(API_URL, payload);

    action.then(() => {
      alert(editingId ? "Data Berhasil Diperbarui!" : "Data Berhasil Ditambah!");
      setEditingId(null);
      refreshData();
      setForm({ namaPeminjam: '', ruangId: '', tanggal: new Date().toISOString().substring(0, 16) });
    }).catch(err => alert("Gagal: " + (err.response?.data || err.message)));
  };

  const filteredData = data.filter(i => 
    i.namaPeminjam?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.namaRuangan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <header className="header-bar">
        <h1>Dashboard Peminjaman Ruangan</h1>
      </header>

      {/* FORM INPUT SECTION */}
      <section className="card-section">
        <FormInput 
          form={form} 
          setForm={setForm} 
          handleSimpan={handleSimpan} 
          ruangan={ruangan} 
          editingId={editingId} 
          setEditingId={setEditingId} 
          resetForm={() => setForm({ namaPeminjam: '', ruangId: '', tanggal: new Date().toISOString().substring(0, 16) })} 
        />
      </section>

      {/* TABEL RIWAYAT SECTION */}
      <section className="card-section">
        <div className="section-header">
          <h3>📋 Riwayat Peminjaman</h3>
          <input 
            type="text" 
            className="search-bar" 
            placeholder="🔍 Cari Peminjam atau Ruangan..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TabelRiwayat 
          filteredData={filteredData} 
          setSelectedDetail={setSelectedDetail} 
          handleEdit={(i) => { 
            setEditingId(i.id); 
            setForm({ ...i, tanggal: i.tanggal.substring(0,16) }); 
          }} 
          handleHapus={(id) => {
            if (window.confirm("Yakin ingin menghapus?")) {
              axios.delete(`${API_URL}/${id}`).then(refreshData);
            }
          }} 
        />
      </section>

      {/* DAFTAR RUANGAN SECTION */}
      <section className="card-section">
        <h3 className="section-title">🏢 Daftar Ruangan Tersedia</h3>
        
        <div className="room-grid">
          {ruangan.map((r) => (
            <div key={r.id} className="room-card">
              <div className="room-header">
                <h4>{r.namaRuangan}</h4>
                <span className="room-id-badge">ID: {r.id}</span>
              </div>
              <div className="room-info">
                <p><strong>👤 Kapasitas:</strong> {r.kapasitas} Orang</p>
                <p><strong>📍 Lokasi:</strong> {r.lokasi || 'Gedung D4'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL DETAIL */}
      {selectedDetail && (
        <div className="modal-overlay" onClick={() => setSelectedDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">🔍 Rincian Peminjaman</h3>
            <div className="modal-body">
              <p><strong>Peminjam:</strong> {selectedDetail.namaPeminjam}</p>
              <p><strong>Ruangan:</strong> {selectedDetail.namaRuangan}</p>
              <p><strong>Tanggal:</strong> {new Date(selectedDetail.tanggal).toLocaleString('id-ID')}</p>
              <p><strong>Status:</strong> {selectedDetail.status}</p>
            </div>
            <button className="btn-close" onClick={() => setSelectedDetail(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;