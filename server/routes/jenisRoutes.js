const express = require('express');
const router = express.Router();
const Jenis = require('../models/Jenis');

// Get All Jenis
router.get('/', async (req, res) => {
    try {
        const data = await Jenis.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Jenis
router.post('/', async (req, res) => {
    const jenis = new Jenis({ nama_jenis: req.body.nama_jenis });
    try {
        const newJenis = await jenis.save();
        res.status(201).json(newJenis);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Jenis
router.delete('/:id', async (req, res) => {
    try {
        await Jenis.findByIdAndDelete(req.params.id);
        res.json({ message: 'Jenis berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;