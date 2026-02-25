const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 5000;

// 1. CONFIGURASI CORS
// Izinkan akses dari IP Server Ubuntu Anda di Port 8080 (Frontend)
app.use(cors({
    origin: ["http://10.10.10.100:8080", "http://localhost:8080", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// 2. CONFIGURASI PENYIMPANAN FOTO (MULTER)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir); // Buat folder jika belum ada
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 3. DATABASE MODELS (MongoDB)
const JenisSchema = new mongoose.Schema({ nama_jenis: String });
const Jenis = mongoose.model('Jenis', JenisSchema);

const ItemSchema = new mongoose.Schema({
    nama_item: String,
    kode_item: String, // 4 Digit untuk Barcode
    id_jenis: { type: mongoose.Schema.Types.ObjectId, ref: 'Jenis' },
    harga: Number,
    foto: String
});
const Item = mongoose.model('Item', ItemSchema);

// 4. DATABASE CONNECTION
// Jika menggunakan MongoDB lokal di Ubuntu, pastikan service mongodb sudah running
mongoose.connect('mongodb://127.0.0.1:27017/db_timbangan', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Connection Error:", err));

// 5. STATIC FOLDER (Agar foto bisa diakses via browser)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. API ROUTES - JENIS
app.get('/api/jenis', async (req, res) => {
    const data = await Jenis.find();
    res.json(data);
});

app.post('/api/jenis', async (req, res) => {
    const newJenis = new Jenis(req.body);
    await newJenis.save();
    res.json(newJenis);
});

app.put('/api/jenis/:id', async (req, res) => {
    await Jenis.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Updated" });
});

app.delete('/api/jenis/:id', async (req, res) => {
    await Jenis.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// 7. API ROUTES - ITEMS
app.get('/api/items', async (req, res) => {
    const data = await Item.find().populate('id_jenis');
    res.json(data);
});

app.post('/api/items', upload.single('foto'), async (req, res) => {
    const newItem = new Item({
        ...req.body,
        foto: req.file ? `uploads/${req.file.filename}` : ''
    });
    await newItem.save();
    res.json(newItem);
});

app.put('/api/items/:id', upload.single('foto'), async (req, res) => {
    const updateData = { ...req.body };
    if (req.file) updateData.foto = `uploads/${req.file.filename}`;
    
    await Item.findByIdAndUpdate(req.params.id, updateData);
    res.json({ message: "Updated" });
});

app.delete('/api/items/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (item?.foto) {
        fs.unlinkSync(path.join(__dirname, item.foto)); // Hapus file fisik
    }
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// 8. START SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://10.10.10.100:${PORT}`);
});
