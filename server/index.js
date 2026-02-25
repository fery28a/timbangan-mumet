// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Untuk akses foto

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ud_amanah')
  .then(() => console.log('Terhubung ke MongoDB'))
  .catch(err => console.error(err));

// Impor Routes (Akan dibuat di langkah berikutnya)
const itemRoutes = require('./routes/itemRoutes');
const jenisRoutes = require('./routes/jenisRoutes');

app.use('/api/items', itemRoutes);
app.use('/api/jenis', jenisRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));