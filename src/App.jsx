import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // --- 1. STATE MANAGEMENT ---
  const [data, setData] = useState([]);
  const [ruangan, setRuangan] = useState([]);
  const [form, setForm] = useState({ namaPeminjam: '', namaRuangan: '', tanggal: new Date().toISOString(), status: 'Menunggu' });
  const [editingId, setEditingId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const API_URL = "http://localhost:5092/api/Peminjaman";
  const RUANG_URL = "http://localhost:5092/api/Ruang";

  // --- 2. FETCH DATA ---
  const refreshData = () => {
    axios.get(API_URL)
      .then(res => setData(res.data))
      .catch(err => console.error("Gagal ambil data peminjaman:", err));
  };

  const refreshRuang = () => {
    axios.get(RUANG_URL)
      .then(res => setRuangan(res.data))
      .catch(err => console.error("Gagal ambil data ruangan:", err));
  };

  useEffect(() => { 
    refreshData(); 
    refreshRuang(); 
  }, []);

  // --- 3. LOGIKA CRUD ---
  const handleSimpan = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`${API_URL}/${editingId}`, form).then(() => {
        alert("Data Berhasil Diperbarui!");
        setEditingId(null);
        refreshData();
        resetForm();
      });
    } else {
      axios.post(API_URL, form).then(() => {
        alert("Data Berhasil Ditambah!");
        refreshData();
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setForm({ namaPeminjam: '', namaRuangan: '', tanggal: new Date().toISOString(), status: 'Menunggu' });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ 
      namaPeminjam: item.namaPeminjam, 
      namaRuangan: item.namaRuangan, 
      tanggal: item.tanggal, 
      status: item.status 
    });
  };

  const handleHapus = (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      axios.delete(`${API_URL}/${id}`).then(() => {
        refreshData();
      });
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: 'auto', backgroundColor: '#fcfcfc' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>Dashboard Peminjaman Ruangan PENS</h1>
      <hr style={{ marginBottom: '30px', opacity: '0.3' }} />

      {/* --- 4. MODAL DETAIL --- */}
      {selectedDetail && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: 0 }}>🔍 Detail Peminjaman</h3>
            <div style={{ lineHeight: '1.8' }}>
                <p><strong>ID:</strong> {selectedDetail.id}</p>
                <p><strong>Peminjam:</strong> {selectedDetail.namaPeminjam}</p>
                <p><strong>Ruangan:</strong> {selectedDetail.namaRuangan}</p>
                <p><strong>Tanggal:</strong> {new Date(selectedDetail.tanggal).toLocaleString('id-ID')}</p>
                <p><strong>Status:</strong> <span style={{ color: selectedDetail.status === 'Disetujui' ? '#2ecc71' : '#f39c12', fontWeight: 'bold' }}>{selectedDetail.status || 'Menunggu'}</span></p>
            </div>
            <button onClick={() => setSelectedDetail(null)} style={{ marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Tutup</button>
          </div>
        </div>
      )}

      {/* --- 5. FORM INPUT --- */}
      <div style={{ marginBottom: '40px', padding: '25px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' }}>
        <h3 style={{ marginTop: 0, color: '#34495e' }}>{editingId ? "📝 Edit Data Peminjaman" : "➕ Tambah Peminjaman Baru"}</h3>
        <form onSubmit={handleSimpan} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: '1' }}
            type="text" placeholder="Nama Peminjam" value={form.namaPeminjam} 
            onChange={e => setForm({...form, namaPeminjam: e.target.value})} required 
          />
          <select 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: '1' }}
            value={form.namaRuangan} 
            onChange={e => setForm({...form, namaRuangan: e.target.value})} 
            required
          >
            <option value="">-- Pilih Ruangan --</option>
            {ruangan.map(r => (
              <option key={r.id} value={r.namaRuangan}>{r.namaRuangan}</option>
            ))}
          </select>
          <button type="submit" style={{ backgroundColor: editingId ? '#2196F3' : '#4CAF50', color: 'white', border: 'none', padding: '12px 25px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }}>
            {editingId ? "Update Data" : "Simpan Data"}
          </button>
        </form>
      </div>

      {/* --- 6. TABEL RIWAYAT (6 KOLOM TERMASUK TANGGAL) --- */}
      <h3 style={{ color: '#34495e' }}>📋 Riwayat Peminjaman</h3>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #edf2f7' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th>Peminjam</th>
              <th>Ruangan</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ textAlign: 'center', borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '15px' }}>{item.id}</td>
                <td style={{ fontWeight: '500' }}>{item.namaPeminjam}</td>
                <td><span style={{ backgroundColor: '#edf2f7', padding: '4px 10px', borderRadius: '15px', fontSize: '13px' }}>{item.namaRuangan}</span></td>
                <td>{new Date(item.tanggal).toLocaleString('id-ID')}</td>
                <td>
                  <span style={{ 
                    backgroundColor: item.status === 'Disetujui' ? '#c6f6d5' : '#feebc8', 
                    color: item.status === 'Disetujui' ? '#22543d' : '#744210', 
                    padding: '4px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' 
                  }}>
                    {item.status || 'Menunggu'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '10px' }}>
                  <button onClick={() => setSelectedDetail(item)} style={{ background: '#ebf8ff', color: '#3182ce', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Detail</button>
                  <button onClick={() => handleEdit(item)} style={{ background: '#fffaf0', color: '#dd6b20', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Edit</button>
                  <button onClick={() => handleHapus(item.id)} style={{ background: '#fff5f5', color: '#e53e3e', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- 7. DAFTAR RUANGAN --- */}
      <h3 style={{ marginTop: '50px', color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🏢 Daftar Ruangan Tersedia</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginTop: '20px' }}>
        {ruangan.map((r) => (
          <div key={r.id} style={{ backgroundColor: '#ffffff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eef2f7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: '#2d3748', fontSize: '19px' }}>{r.namaRuangan}</h4>
              <span style={{ backgroundColor: '#ebf8ff', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: '#3182ce', fontWeight: 'bold' }}>ID: {r.id}</span>
            </div>
            <p style={{ margin: '8px 0', color: '#4a5568', fontSize: '14px' }}><strong>👥 Kapasitas:</strong> {r.kapasitas} Orang</p>
            <p style={{ margin: '8px 0', color: '#4a5568', fontSize: '14px' }}><strong>📍 Lokasi:</strong> {r.lokasi || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;