import React from 'react';

const FormInput = ({ form, setForm, handleSimpan, ruangan, editingId, setEditingId, resetForm }) => {
  return (
    <div style={{ marginBottom: '40px', padding: '25px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' }}>
      <h3 style={{ marginTop: 0, color: '#34495e' }}>{editingId ? "📝 Edit Peminjaman" : "➕ Tambah Peminjaman Baru"}</h3>
      <form onSubmit={handleSimpan} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <input 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: '1', minWidth: '200px' }}
          type="text" placeholder="Nama Peminjam" value={form.namaPeminjam} 
          onChange={e => setForm({...form, namaPeminjam: e.target.value})} required 
        />
        
        <select 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: '1', minWidth: '200px' }}
          value={editingId ? form.namaRuangan : form.ruangId} 
          onChange={e => {
              if (editingId) setForm({...form, namaRuangan: e.target.value});
              else setForm({...form, ruangId: e.target.value});
          }} required
        >
          <option value="">-- Pilih Ruangan --</option>
          {ruangan.map(r => (
              <option key={r.id} value={editingId ? r.namaRuangan : r.id}>
                  {r.namaRuangan} {!editingId && `(ID: ${r.id})`}
              </option>
          ))}
        </select>

        <input 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: '1', minWidth: '200px' }}
          type="datetime-local" 
          value={form.tanggal} 
          onChange={e => setForm({...form, tanggal: e.target.value})} required 
        />

        {editingId && (
          <select 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: '1', minWidth: '150px' }}
              value={form.status} 
              onChange={e => setForm({...form, status: e.target.value})}
          >
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
          </select>
        )}

        <button type="submit" style={{ backgroundColor: editingId ? '#2196F3' : '#4CAF50', color: 'white', border: 'none', padding: '12px 25px', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }}>
          {editingId ? "Update" : "Simpan"}
        </button>
        {editingId && <button type="button" onClick={() => {setEditingId(null); resetForm();}} style={{ marginLeft: '10px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}>Batal</button>}
      </form>
    </div>
  );
};

export default FormInput;