import "dotenv/config";
import http from "node:http";
import { parseJsonBody } from "./lib/parseJsonBody.js";
import { parse as parseQuery } from "node:querystring";

const PORT = process.env.PORT || 3000;
const database = new Map();

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname.slice(1);
    res.setHeader('Content-Type', 'application/json');

    if (!['GET', 'POST'].includes(req.method)) {
        res.statusCode = 405;
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }

    if (req.method === 'POST' && path === 'set') {
        const body = await parseJsonBody(req);
        if (body?.key && body?.value) {
            database.set(body.key, body.value);
            res.statusCode = 200;
            return res.end(JSON.stringify({ ok: true }));
        } else {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing "key" or "value"' }));
        }
    }

    if (req.method === 'GET' && path === 'get') {
        const { key } = parseQuery(url.searchParams.toString());
        if (key) {
            res.statusCode = 200;
            return res.end(JSON.stringify({ value: database.get(key) ?? null }));
        } else {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Missing "key" parameter' }));
        }
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});