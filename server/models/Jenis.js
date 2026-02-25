const mongoose = require('mongoose');

const JenisSchema = new mongoose.Schema({
  nama_jenis: { type: String, required: true }
});

// Pastikan namanya 'Jenis' (Sesuai dengan yang di-populate nanti)
module.exports = mongoose.model('Jenis', JenisSchema);