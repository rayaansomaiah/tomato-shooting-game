const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Score = require('./models/Score');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// API Routes
app.post('/api/scores', async (req, res) => {
    try {
        const { value } = req.body;
        const newScore = new Score({ value });
        await newScore.save();
        res.status(201).json({ message: 'Score saved!' });
    } catch (err) {
        console.error('❌ Failed to save score:', err);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

app.get('/api/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ value: -1 }).limit(10);
        res.json(scores);
    } catch (err) {
        console.error('❌ Failed to fetch scores:', err);
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

// Serve Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
