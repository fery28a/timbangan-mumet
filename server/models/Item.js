const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  nama_item: { type: String, required: true },
  kode_item: { type: String, required: true, unique: true },
  id_jenis: { type: mongoose.Schema.Types.ObjectId, ref: 'Jenis' }, // Harus sama dengan model Jenis
  harga: { type: Number, required: true },
  foto: { type: String }
});

module.exports = mongoose.model('Item', ItemSchema);