const express = require('express');
const router = express.Router();
const db = require('../models');

// Get all notes
router.get('/', async (req, res) => {
    const notes = await db.Note.findAll();
    res.json(notes);
});

// Create note
router.post('/', async (req, res) => {
    const note = await db.Note.create(req.body);
    res.json(note);
});

// Update note
router.put('/:id', async (req, res) => {
    const note = await db.Note.findByPk(req.params.id);
    if(note) {
        await note.update(req.body);
        res.json(note);
    } else {
        res.status(404).json({ error: "Note not found" });
    }
});

// Delete note
router.delete('/:id', async (req, res) => {
    const note = await db.Note.findByPk(req.params.id);
    if(note) {
        await note.destroy();
        res.json({ message: "Note deleted" });
    } else {
        res.status(404).json({ error: "Note not found" });
    }
});

module.exports = router;