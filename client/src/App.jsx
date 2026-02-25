import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MasterData from './pages/MasterData';
import PrintBarcode from './pages/PrintBarcode';

function App() {
  return (
    <Router>
      <nav style={{ 
        padding: '15px', 
        background: '#222', 
        color: 'white', 
        display: 'flex', 
        gap: '20px',
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, color: '#4caf50' }}>UD. AMANAH</h2>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Cetak Barcode</Link>
        <Link to="/master" style={{ color: 'white', textDecoration: 'none' }}>Master Data</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PrintBarcode />} />
        <Route path="/master" element={<MasterData />} />
      </Routes>
    </Router>
  );
}

export default App;