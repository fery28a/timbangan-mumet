const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Item = require('../models/Item');

// Cek/Buat folder uploads secara otomatis
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// API: Simpan Item Baru (POST)
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { nama_item, kode_item, id_jenis, harga } = req.body;
    const newItem = new Item({
      nama_item,
      kode_item,
      id_jenis,
      harga,
      foto: req.file ? req.file.path : ''
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: "Gagal menyimpan: " + err.message });
  }
});

// API: Update Item (PUT)
router.put('/:id', upload.single('foto'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.foto = req.file.path;
    
    const updated = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Gagal update: " + err.message });
  }
});

// API: Ambil Semua Item (GET)
router.get('/', async (req, res) => {
  const items = await Item.find().populate('id_jenis');
  res.json(items);
});

// API: Hapus Item (DELETE)
router.delete('/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item dihapus" });
});

module.exports = router;