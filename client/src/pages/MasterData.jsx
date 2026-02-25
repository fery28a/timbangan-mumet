import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MasterData.css';

const MasterData = () => {
  const [activeTab, setActiveTab] = useState('item'); // 'item' atau 'jenis'
  const [items, setItems] = useState([]);
  const [jenis, setJenis] = useState([]);
  
  // State Form Item
  const [itemForm, setItemForm] = useState({ nama_item: '', kode_item: '', id_jenis: '', harga: '', foto: null });
  // State Form Jenis
  const [jenisForm, setJenisForm] = useState({ nama_jenis: '' });
  
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const resItem = await axios.get('http://10.10.10.100:5000/api/items');
    const resJenis = await axios.get('http://10.10.10.100:5000/api/jenis');
    setItems(resItem.data);
    setJenis(resJenis.data);
  };

  // --- LOGIKA ITEM ---
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(itemForm).forEach(key => data.append(key, itemForm[key]));
    
    if (editId) await axios.put(`http://10.10.10.100:5000/api/items/${editId}`, data);
    else await axios.post('http://10.10.10.100:5000/api/items', data);
    
    resetForm();
    fetchData();
  };

  // --- LOGIKA JENIS ---
  const handleJenisSubmit = async (e) => {
    e.preventDefault();
    if (editId) await axios.put(`http://10.10.10.100:5000/api/jenis/${editId}`, jenisForm);
    else await axios.post('http://10.10.10.100:5000/api/jenis', jenisForm);
    
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setItemForm({ nama_item: '', kode_item: '', id_jenis: '', harga: '', foto: null });
    setJenisForm({ nama_jenis: '' });
    setEditId(null);
  };

  const deleteData = async (type, id) => {
    if (window.confirm("Hapus data ini?")) {
      await axios.delete(`http://10.10.10.100:5000/api/${type}/${id}`);
      fetchData();
    }
  };

  return (
    <div className="master-full-layout">
      <div className="sidebar-tabs">
        <button className={activeTab === 'item' ? 'active' : ''} onClick={() => {setActiveTab('item'); resetForm();}}>Data Item</button>
        <button className={activeTab === 'jenis' ? 'active' : ''} onClick={() => {setActiveTab('jenis'); resetForm();}}>Data Jenis</button>
      </div>

      <div className="main-content">
        {activeTab === 'item' ? (
          <section className="section-data">
            <div className="form-container">
              <h3>{editId ? 'Edit Item' : 'Tambah Item'}</h3>
              <form onSubmit={handleItemSubmit} className="horizontal-form">
                <input type="text" placeholder="Nama" value={itemForm.nama_item} onChange={e => setItemForm({...itemForm, nama_item: e.target.value})} required />
                <input type="text" placeholder="Kode" value={itemForm.kode_item} onChange={e => setItemForm({...itemForm, kode_item: e.target.value})} maxLength="4" required />
                <select value={itemForm.id_jenis} onChange={e => setItemForm({...itemForm, id_jenis: e.target.value})} required>
                  <option value="">Pilih Jenis</option>
                  {jenis.map(j => <option key={j._id} value={j._id}>{j.nama_jenis}</option>)}
                </select>
                <input type="number" placeholder="Harga" value={itemForm.harga} onChange={e => setItemForm({...itemForm, harga: e.target.value})} required />
                <input type="file" onChange={e => setItemForm({...itemForm, foto: e.target.files[0]})} />
                <button type="submit" className="btn-save">Simpan</button>
              </form>
            </div>

            <table className="master-table">
              <thead>
                <tr><th>Foto</th><th>Kode</th><th>Nama</th><th>Jenis</th><th>Harga</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td><img src={`http://localhost:5000/${item.foto}`} className="img-table" alt=""/></td>
                    <td>{item.kode_item}</td>
                    <td>{item.nama_item}</td>
                    <td>{item.id_jenis?.nama_jenis}</td>
                    <td>{item.harga}</td>
                    <td>
                      <button onClick={() => {setEditId(item._id); setItemForm({nama_item: item.nama_item, kode_item: item.kode_item, id_jenis: item.id_jenis?._id, harga: item.harga})}}>Edit</button>
                      <button className="btn-del" onClick={() => deleteData('items', item._id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <section className="section-data">
            <div className="form-container">
              <h3>{editId ? 'Edit Jenis' : 'Tambah Jenis'}</h3>
              <form onSubmit={handleJenisSubmit} className="horizontal-form">
                <input type="text" placeholder="Nama Jenis" value={jenisForm.nama_jenis} onChange={e => setJenisForm({nama_jenis: e.target.value})} required />
                <button type="submit" className="btn-save">Simpan</button>
              </form>
            </div>

            <table className="master-table">
              <thead>
                <tr><th>Nama Jenis</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {jenis.map(j => (
                  <tr key={j._id}>
                    <td>{j.nama_jenis}</td>
                    <td>
                      <button onClick={() => {setEditId(j._id); setJenisForm({nama_jenis: j.nama_jenis})}}>Edit</button>
                      <button className="btn-del" onClick={() => deleteData('jenis', j._id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default MasterData;
