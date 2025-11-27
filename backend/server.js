const WebSocket = require("ws");
const port = 3001;

const wss = new WebSocket.Server({ port });

const clients = new Set();

wss.on('connection', (ws) => {
    console.log("WebSocket connected.");
    clients.add(ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());

        for (const client of clients) {
            if (client.readyState === 1) {
                client.send(JSON.stringify(data));
            }
        }

    });

    ws.on('error', (error) => {
        console.log(error);
        clients.delete(ws);
    });

    ws.on('close', () => {
        console.log("WebSocket disconnected.");
        clients.delete(ws);
    });
});

console.log(`WebSocket server is running on port ${port}`);
