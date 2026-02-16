import React from 'react';

const TabelRiwayat = ({ filteredData, setSelectedDetail, handleEdit, handleHapus }) => {
  return (
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
          {filteredData.length > 0 ? filteredData.map((item) => (
            <tr key={item.id} style={{ textAlign: 'center', borderBottom: '1px solid #edf2f7' }}>
              <td style={{ padding: '15px' }}>{item.id}</td>
              <td style={{ fontWeight: '500' }}>{item.namaPeminjam}</td>
              <td><span style={{ backgroundColor: '#edf2f7', padding: '4px 10px', borderRadius: '15px', fontSize: '13px' }}>{item.namaRuangan}</span></td>
              <td>{new Date(item.tanggal).toLocaleString('id-ID')}</td>
              <td>
                <span style={{ 
                  backgroundColor: item.status === 'Disetujui' ? '#c6f6d5' : (item.status === 'Ditolak' ? '#fed7d7' : '#feebc8'), 
                  color: item.status === 'Disetujui' ? '#22543d' : (item.status === 'Ditolak' ? '#822727' : '#744210'), 
                  padding: '4px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' 
                }}>
                  {item.status || 'Menunggu'}
                </span>
              </td>
              <td style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '10px' }}>
                <button onClick={() => setSelectedDetail(item)} style={{ background: '#ebf8ff', color: '#3182ce', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Detail</button>
                <button onClick={() => handleEdit(item)} style={{ background: '#fffaf0', color: '#dd6b20', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                <button onClick={() => handleHapus(item.id)} style={{ background: '#fff5f5', color: '#e53e3e', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Hapus</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ padding: '20px', color: '#718096' }}>Data tidak ditemukan...</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabelRiwayat;