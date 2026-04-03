const express = require("express");
const router = express.Router();
const { Note } = require("../models");
const authMiddleware = require("./authMiddleware");

// Protect all routes with JWT
router.use(authMiddleware);

// Create a note
router.post("/", async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.userId;

    const note = await Note.create({ title, content, tags, userId });
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all notes for logged-in user
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const notes = await Note.findAll({ where: { userId } });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get note by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const note = await Note.findOne({ where: { id: req.params.id, userId } });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update note
router.put("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content, tags } = req.body;

    const note = await Note.findOne({ where: { id: req.params.id, userId } });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = title;
    note.content = content;
    note.tags = tags || [];
    await note.save();

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const note = await Note.findOne({ where: { id: req.params.id, userId } });
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.destroy();
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;