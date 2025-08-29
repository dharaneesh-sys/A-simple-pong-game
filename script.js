const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 15;
const paddleSpeed = 7;
const aiSpeed = 4;

// Game objects
let leftPaddle = {
    x: 0,
    y: canvas.height/2 - paddleHeight/2
};

let rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height/2 - paddleHeight/2
};

let ball = {
    x: canvas.width/2 - ballSize/2,
    y: canvas.height/2 - ballSize/2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 5 * (Math.random() > 0.5 ? 1 : -1)
};

// Scores
let leftScore = 0;
let rightScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - paddleHeight/2;

    // Clamp to canvas
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + paddleHeight > canvas.height) leftPaddle.y = canvas.height - paddleHeight;
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top/bottom walls
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.vy *= -1;
    }

    // Ball collision with left paddle
    if (
        ball.x <= leftPaddle.x + paddleWidth &&
        ball.y + ballSize >= leftPaddle.y &&
        ball.y <= leftPaddle.y + paddleHeight
    ) {
        ball.x = leftPaddle.x + paddleWidth;
        ball.vx *= -1.1; // Increase speed after bounce
        ball.vy += ((ball.y + ballSize/2) - (leftPaddle.y + paddleHeight/2)) * 0.1;
    }

    // Ball collision with right paddle
    if (
        ball.x + ballSize >= rightPaddle.x &&
        ball.y + ballSize >= rightPaddle.y &&
        ball.y <= rightPaddle.y + paddleHeight
    ) {
        ball.x = rightPaddle.x - ballSize;
        ball.vx *= -1.1; // Increase speed after bounce
        ball.vy += ((ball.y + ballSize/2) - (rightPaddle.y + paddleHeight/2)) * 0.1;
    }

    // Score and reset ball
    if (ball.x < 0) {
        rightScore++;
        resetBall();
    } else if (ball.x + ballSize > canvas.width) {
        leftScore++;
        resetBall();
    }

    // AI paddle follows ball
    if (ball.y + ballSize/2 > rightPaddle.y + paddleHeight/2) {
        rightPaddle.y += aiSpeed;
    } else if (ball.y + ballSize/2 < rightPaddle.y + paddleHeight/2) {
        rightPaddle.y -= aiSpeed;
    }
    // Clamp AI paddle
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + paddleHeight > canvas.height) rightPaddle.y = canvas.height - paddleHeight;
}

function resetBall() {
    ball.x = canvas.width/2 - ballSize/2;
    ball.y = canvas.height/2 - ballSize/2;
    ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#09f";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
    ctx.fillStyle = "#f90";
    ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = "#fff";
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);

    // Draw scores
    ctx.font = "40px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(leftScore, canvas.width/2 - 60, 50);
    ctx.fillText(rightScore, canvas.width/2 + 30, 50);
}

// Start game
gameLoop();