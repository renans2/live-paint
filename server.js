import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup server
const PORT = 8000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

// Init board
const DIMENSION = 40;
const board = [];
for (let i = 0; i < DIMENSION; i++) {
    board[i] = [];

    for (let j = 0; j < DIMENSION; j++) {
        board[i][j] = false;
    }
}

// Make the public folder available
app.use(express.static(path.join(__dirname, "public")));

// Provide index.html to client
app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Establish socket connection with client
io.on("connection", (socket) => {
    console.log(`client connected with id = ${socket.id}`);

    // Send current board to client
    socket.emit("board-to-client", board);

    // Receive pixel change from client's board
    socket.on("change-pixel-to-server", coords => {
        const { i, j } = coords;
        board[i][j] = true;
        
        // Send that change to all other clients
        socket.broadcast.emit("change-pixel-to-client", coords);
    });
});

httpServer.listen(PORT, () => {
    console.log("Server ready...");
});
