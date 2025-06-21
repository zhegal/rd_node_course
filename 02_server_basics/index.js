import 'dotenv/config';
import * as http from "node:http";

const server = http.createServer((req, res) => {
    res.end('Hello world!!!');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});