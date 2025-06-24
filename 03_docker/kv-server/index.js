import "dotenv/config";
import express from 'express';

const app = express();
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL;

app.get('/kv/:key', async (req, res) => {
    const { key } = req.params;
    const url = `${REDIS_URL}/get?key=${encodeURIComponent(key)}`;
    try {
        const response = await fetch(url);
        const json = await response.json();
        res.json(json);
    } catch {
        res.status(500).json({ error: 'Failed to connect to redis-like' });
    }
});

app.post('/kv', async (req, res) => {
    try {
        const response = await fetch(`${REDIS_URL}/set`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const json = await response.json();
        res.json(json);
    } catch {
        res.status(500).json({ error: 'Failed to connect to redis-like' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`KV-server listening on port ${PORT}`);
});