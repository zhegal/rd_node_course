const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Content-type', 'text/plain');
    if (req.url === '/') {
        res.statusCode = 200;
        res.end('Home page!!!');
    } else {
        res.statusCode = 404;
        res.end('Error!');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`It works on ${PORT} port.`);
});