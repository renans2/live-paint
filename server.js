import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
    console.log(`client connected with id = ${socket.id}`);

    socket.on("client->server", data => {
        console.log(data);
    });
});

httpServer.listen(PORT, () => {
    console.log("Server ready...");
});
