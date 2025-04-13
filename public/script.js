const DIMENSION = 40;
let WIDTH;
let OFFSET;
let board;
const socket = io();

socket.on("connect", () => {
    console.log(`connected to server with ID = ${socket.id}`);
});

socket.on("board-to-client", serverBoard => {
    board = serverBoard;
});

socket.on("change-pixel-to-client", coords => {
    const { i, j } = coords;
    board[i][j] = true;
});

function setup() {
    WIDTH = Math.min(windowWidth, windowHeight) * 0.9;
    OFFSET = WIDTH / DIMENSION;

    createCanvas(WIDTH, WIDTH);
    background(0);
    cursor(CROSS);
}

function draw() {
    if (mouseIsPressed) {
        const j = Math.floor(mouseX / OFFSET);
        const i = Math.floor(mouseY / OFFSET);
        
        if (0 <= i && i <= DIMENSION && 0 <= j && j <= DIMENSION) {
            board[i][j] = true;
            socket.emit("change-pixel-to-server", { i, j });
        }
    }

    for (let i = 0; i < DIMENSION; i++) {
        for (let j = 0; j < DIMENSION; j++) {
            let color;
            if(board[i][j])
                color = 0;
            else
                color = 255;
            
            const x = j * OFFSET;
            const y = i * OFFSET;
            fill(color);
            square(x, y, OFFSET);
        }
    }
}
