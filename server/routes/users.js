const express = require('express');
const router = express.Router();
const db = require('../models');

// Register
router.post('/register', async (req, res) => {
    try {
        const user = await db.User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;