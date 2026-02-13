import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const API_URL = "http://localhost:5092/api/Peminjaman";

  // Fungsi untuk ambil data dari Backend ASP.NET
  const refreshData = () => {
    axios.get(API_URL)
      .then(res => setData(res.data))
      .catch(err => console.error("Cek apakah Backend sudah jalan?", err));
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Sistem Peminjaman Ruangan Kampus</h1>
      <hr />
      
      <h3>Daftar Riwayat Peminjaman</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th>ID</th>
            <th>Nama Peminjam</th>
            <th>Ruangan</th>
            <th>Tanggal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} style={{ textAlign: 'center' }}>
              <td>{item.id}</td>
              <td>{item.namaPeminjam}</td>
              <td>{item.namaRuangan}</td>
              <td>{new Date(item.tanggal).toLocaleString()}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;