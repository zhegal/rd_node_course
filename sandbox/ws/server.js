const { WebSocketServer } = require('ws');

const port = 3000;
const wss = new WebSocketServer({ port });
const clients = new Set();

wss.on('connection', connection);

function connection(ws) {
    console.log('Client connected');
    clients.add(ws);

    const message = (msg) => {
        console.log(msg.toString());
        Array.from(clients)
            .filter(client => client !== ws)
            .forEach(client => {
                client.send('Broadcast: ' + msg);
            });
    }

    const close = () => {
        clients.delete(ws);
        console.log('closed');
    }

    ws.on('message', message);
    ws.on('close', close);
}