import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import '../styles/PrintBarcode.css';

const PrintBarcode = () => {
  const [items, setItems] = useState([]);
  const [jenis, setJenis] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState(null);
  const [weight, setWeight] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/items').then(res => setItems(res.data));
    axios.get('http://localhost:5000/api/jenis').then(res => setJenis(res.data));
  }, []);

  useEffect(() => {
    if (selectedItem && weight.length > 0) {
      const paddedWeight = weight.padStart(6, '0');
      const barcodeValue = `20${selectedItem.kode_item}${paddedWeight}`;
      
      const barcodeOptions = {
        format: "EAN13",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 16,
        margin: 0,
        background: "#ffffff"
      };

      try {
        JsBarcode("#barcode-preview", barcodeValue, barcodeOptions);
        JsBarcode("#barcode-print", barcodeValue, barcodeOptions);
      } catch (err) {
        console.error("Barcode Error:", err);
      }
    }
  }, [selectedItem, weight]);

  const filteredItems = selectedJenis === 'Semua' 
    ? items 
    : items.filter(item => item.id_jenis?.nama_jenis === selectedJenis);

  return (
    <div className="print-main-layout">
      {/* --- UI INTERFACE (NO-PRINT) --- */}
      <div className="ui-container no-print">
        {/* Kolom 1: Katalog Produk */}
        <div className="col-products">
          <div className="category-filter">
            <button className={selectedJenis === 'Semua' ? 'active' : ''} onClick={() => setSelectedJenis('Semua')}>Semua</button>
            {jenis.map(j => (
              <button key={j._id} className={selectedJenis === j.nama_jenis ? 'active' : ''} onClick={() => setSelectedJenis(j.nama_jenis)}>{j.nama_jenis}</button>
            ))}
          </div>
          <div className="product-grid">
            {filteredItems.map(item => (
              <div key={item._id} className={`product-card ${selectedItem?._id === item._id ? 'active' : ''}`} onClick={() => setSelectedItem(item)}>
                <img src={`http://localhost:5000/${item.foto}`} alt={item.nama_item} />
                <div className="card-details">
                   <p className="item-name-card">{item.nama_item}</p>
                   <span className="item-price-card">Rp {item.harga.toLocaleString()}/kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 2: Keypad */}
        <div className="col-keypad">
          <div className="display-weight">{weight || '0'} <small>gr</small></div>
          <div className="keypad-grid">
            {[1,2,3,4,5,6,7,8,9,0,'C'].map(num => (
              <button key={num} onClick={() => num === 'C' ? setWeight('') : setWeight(prev => prev + num)}>{num}</button>
            ))}
          </div>
        </div>

        {/* Kolom 3: Preview Barcode */}
        <div className="col-preview">
          <h3 className="preview-title">PRATINJAU LABEL</h3>
          <div className="label-preview-box">
            <div className="label-content">
              <h2 className="item-name-preview">{selectedItem?.nama_item || "PILIH BARANG"}</h2>
              <div className="info-row">
                <span>{(weight/1000).toFixed(3)} kg</span>
                <span>Rp {selectedItem?.harga.toLocaleString()}/kg</span>
              </div>
              <div className="barcode-wrapper">
                <svg id="barcode-preview"></svg>
              </div>
            </div>
          </div>
          <div className="total-preview-screen">
             Total: Rp {selectedItem ? Math.round((selectedItem.harga * weight) / 1000).toLocaleString() : 0}
          </div>
          <button className="btn-print-now" onClick={() => window.print()} disabled={!selectedItem || !weight}>
            CETAK LABEL
          </button>
        </div>
      </div>

      {/* --- AREA KHUSUS CETAK (HIDDEN ON SCREEN) --- */}
      <div id="print-area">
        <div className="print-label-thermal">
          <h2 className="p-item-name">{selectedItem?.nama_item}</h2>
          <div className="p-info-row">
            <span>{(weight/1000).toFixed(3)}kg</span>
            <span>Rp {selectedItem?.harga.toLocaleString()}/kg</span>
          </div>
          <div className="p-barcode-wrapper">
            <svg id="barcode-print"></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintBarcode;