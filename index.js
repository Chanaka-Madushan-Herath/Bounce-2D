const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
const scoreBoardHeight = 30;
const paddleHeight = 10;
const paddleWidth = 75;
const boxWidth = 75;
const boxHeight = 20;
const boxPadding = 10;
const boxOffsetTop = 35;
const boxOffsetLeft = 30;
const brickColumnCount = 5;
const boxRowCount = 3;
const ballColor = "#ffa229";
const paddleColor = "#0d0d0d";
const strokeColor = "#FFFFFF";
const boxColor = "#6e1b33";
const scoreBoardColor = "#edc0cd";
const scoreColor = "#1c07db";
const livesColor = "#059c16";
const livesColorD = "#dd0000";
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;
let paddleX = (canvas.width - paddleWidth) / 2;
let boxCount = 0;
let score = 0;
let lives = 3;
let boxes = [];

const getHigherScore = () => {
    let name = "Higher_Score=";
    let string = document.cookie.split(';');
    for (let i = 0; i < string.length; i++) {
        let c = string[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "0";
}

let highScore = getHigherScore();

for (let row = 0; row < boxRowCount; row++) {
    boxes[row] = [];
    for (let col = 0; col < brickColumnCount; col++) {
        if (col % 2 === 0) {
            boxes[row][col] = {x: 0, y: 0, status: 1};
        } else {
            boxes[row][col] = {x: 0, y: 0, status: 0};
        }
    }
}

for (let row = 0; row < boxRowCount; row++) {
    for (let col = 0; col < brickColumnCount; col++) {
        let box = boxes[row][col];
        if (box.status === 1) {
            boxCount++;
        }
    }
}

const createBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

const createPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

const createBoxes = () => {
    for (let row = 0; row < boxRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            if (boxes[row][col].status === 1) {
                let box_X = (col * (boxWidth + boxPadding)) + boxOffsetLeft;
                let box_Y = (row * (boxHeight + boxPadding)) + boxOffsetTop;
                boxes[row][col].x = box_X;
                boxes[row][col].y = box_Y;
                ctx.beginPath();
                ctx.rect(box_X, box_Y, boxWidth, boxHeight);
                ctx.fillStyle = boxColor;
                ctx.strokeStyle = strokeColor;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

const createScoreBoard = () => {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, scoreBoardHeight);
    ctx.fillStyle = scoreBoardColor;
    ctx.fill();
    ctx.closePath();
}

const displayScore = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = scoreColor;
    ctx.fillText("Score: " + score, 8, 20);
}

const displayHigherScore = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = scoreColor;
    ctx.fillText("Higher Score: " + highScore, 100, 20);
}

const displayLives = () => {
    ctx.font = "16px Arial";
    if (lives > 1) {
        ctx.fillStyle = livesColor;
    } else {
        ctx.fillStyle = livesColorD;
    }
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}


const mouseMoveHandler = (e) => {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

document.addEventListener("mousemove", mouseMoveHandler);

const collisionDetector = () => {
    for (let row = 0; row < boxRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            let box = boxes[row][col];
            if (box.status === 1) {
                if (x > box.x && x < box.x + boxWidth && y > box.y && y < box.y + boxHeight) {
                    dy = -dy;
                    box.status = 0;
                    score++;
                    if (score > highScore) {
                        document.cookie = "Higher_Score=" + score + "; path=/";
                    }
                    if (score === boxCount) {
                        alert("CONGRATULATIONS!! YOU WON THE GAME");
                        document.location.reload();
                    }
                }
            }
        }
    }
}


const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createScoreBoard();
    createBoxes();
    createBall();
    createPaddle();
    displayScore();
    displayHigherScore();
    displayLives();
    collisionDetector();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius + scoreBoardHeight) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER!!");
                document.location.reload();
            } else {
                dx = 5;
                dy = -5;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();