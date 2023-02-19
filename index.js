
let canvas = document.getElementById('snakeCanvas');
let ctx = canvas.getContext("2d");
let size = 30;
let cellSize = 600 / size;
let fps = 5;
let gameOver = false;
let score = 0;

function fillRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawRect(x, y, w, h, color) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = color;
    ctx.rect(x, y, w, h);
    ctx.stroke();
}

function randomBetween(min, max) {
    const rndInt = Math.floor(Math.random() * max) + min
    return rndInt;
}

function clearCanvas(debug = false) {
    fillRect(0, 0, canvas.width, canvas.height, "cyan");
    if (debug) {
        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 30; j++) {
                drawRect(i * cellSize, j * cellSize, cellSize, cellSize, "gray");
            }
        }
    }
}


class Food {
    constructor(x, y, width, height, color = "pink") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        fillRect(this.x * this.width, this.y * this.height, this.width, this.height, this.color);
    }

    reappear() {
        this.x = randomBetween(1, 29);
        this.y = randomBetween(1, 29);
    }
}

class Snake {

    constructor(x, y, width, height, color = "black") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.tail = [
            {
                x: this.x,
                y: this.y
            }
        ];
        this.direction = { x: 0, y: 0 };
    }

    draw() {
        this.tail.forEach(cell => {
            fillRect(cell.x * this.width, cell.y * this.height, this.width, this.height, this.color);
        });
    }

    setDirection(keyName) {
        switch (keyName) {
            case "ArrowUp":
                if (this.direction.y === 1 && this.direction.x === 0) {
                    return;
                } else {
                    this.direction = { x: 0, y: -1 };
                }
                break;
            case "ArrowDown":
                if (this.direction.y === -1 && this.direction.x === 0) {
                    return;
                } else {
                    this.direction = { x: 0, y: 1 };
                }
                break;
            case "ArrowLeft":
                if (this.direction.y === 0 && this.direction.x === 1) {
                    return;
                } else {
                    this.direction = { x: -1, y: 0 };
                }
                break;
            case "ArrowRight":
                if (this.direction.y === 0 && this.direction.x === -1) {
                    return;
                } else {
                    this.direction = { x: 1, y: 0 };
                }
                break;
        }
    }

    move(food) {
        if (this.direction.x !== 0 || this.direction.y !== 0) {
            const head = this.tail[this.tail.length - 1];
            this.x = head.x + this.direction.x;
            this.y = head.y + this.direction.y;

            const body = this.tail.slice(0, this.tail.length - 1);
            const didCollide = body.some(segment => segment.x === this.x && segment.y === this.y) || this.x > size - 1 || this.x < 0 || this.y > size - 1 || this.y < 0;
            if (didCollide) {
                console.log("Game over");
                gameOver = true;
            }
            if (this.x !== food.x || this.y !== food.y) {
                this.tail.shift();
            } else {
                food.reappear();
                score += 1;
                fps += .1;
            }
            this.tail.push({
                x: this.x,
                y: this.y
            });
        }
    }
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "gray";
    ctx.fillText(`Score: ${score}`, 480, 20);
}

function drawGameover() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`GAME OVER`, 300, 300);
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText('Press enter to restart', 300, 328);
    ctx.textAlign = "start";
}

let snake = null, food = null;

function restart() {
    gameOver = false;
    delete snake, food;
    snake = new Snake(10, 10, cellSize, cellSize);
    food = new Food(randomBetween(1, 29), randomBetween(1, 29), cellSize, cellSize);
    fps = 5;
    score = 0;
}


function update() {
    snake.move(food);
}

function draw() {
    clearCanvas();
    snake.draw();
    food.draw();
    drawScore();
}

function gameLoop() {
    restart();
    setInterval(() => {
        if (!gameOver) {
            update();
            draw();
        } else {
            clearCanvas();
            drawGameover();
        }
    }, 1000 / fps);
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName === 'Enter' && gameOver) {
        gameOver = false;
        restart();
    }
    snake.setDirection(keyName);
});

gameLoop();