const socket = io();

socket.on("connect", () => {
    console.log(`connected to server with ID = ${socket.id}`);
});

const DIMENSION = 40;
let WIDTH;
let OFFSET;
const board = [];

function setup() {
    WIDTH = Math.min(windowWidth, windowHeight);
    OFFSET = WIDTH / DIMENSION;

    createCanvas(WIDTH, WIDTH);
    background(0);
    cursor(CROSS);

    for (let i = 0; i < DIMENSION; i++) {
        board[i] = [];

        for (let j = 0; j < DIMENSION; j++) {
            board[i][j] = false;
        }
    }
}

function draw() {
    if (mouseIsPressed) {
        const j = Math.floor(mouseX / OFFSET);
        const i = Math.floor(mouseY / OFFSET);
        board[i][j] = true;
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
