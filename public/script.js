const DIMENSION = 40;
let WIDTH;
let OFFSET;
let board;
let currentColor = {r: 0, g: 0, b: 0};
let grid = true;
const socket = io();

socket.on("connect", () => {
    console.log(`connected to server with ID = ${socket.id}`);

    socket.on("board-to-client", serverBoard => {
        board = serverBoard;
    });
    
    socket.on("change-pixel-to-client", (coords, color) => {
        const { i, j } = coords;
        board[i][j] = color;
    });
});

// Color input
const color = document.getElementById("color");
color.addEventListener("change", () => {
    const hexColor = color.value;
    currentColor.r = parseInt(hexColor.substr(1, 2), 16);
    currentColor.g = parseInt(hexColor.substr(3, 2), 16);
    currentColor.b = parseInt(hexColor.substr(5, 2), 16);
});

// Clear button
const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", () => {
    socket.emit("clear-board-to-server");
});

// Grid checkbox
const gridCheckBox = document.getElementById("grid");
gridCheckBox.addEventListener("change", () => {
    grid = gridCheckBox.checked;
});

function setup() {
    WIDTH = Math.min(windowWidth, windowHeight) * 0.9;
    OFFSET = WIDTH / DIMENSION;

    createCanvas(WIDTH, WIDTH);
    background(0);
    cursor(CROSS);
}

function draw() {
    if (!board) return;
    
    // Check if user is pressing the mouse
    if (mouseIsPressed) {
        const j = Math.floor(mouseX / OFFSET);
        const i = Math.floor(mouseY / OFFSET);

        // if mouse is inside canvas, 
        // send message with coords and color to server
        if (0 <= i && i <= DIMENSION && 
            0 <= j && j <= DIMENSION && 
            JSON.stringify(board[i][j]) !== JSON.stringify(currentColor)) {
                board[i][j] = {...currentColor};
                socket.emit("change-pixel-to-server", { i, j }, currentColor);
        }
    }

    strokeWeight(grid ? 1 : 0);

    for (let i = 0; i < DIMENSION; i++) {
        for (let j = 0; j < DIMENSION; j++) {
            const color = board[i][j];
            fill(color.r, color.g, color.b);

            const x = j * OFFSET;
            const y = i * OFFSET;
            square(x, y, OFFSET);
        }
    }
}
