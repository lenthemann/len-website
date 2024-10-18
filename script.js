const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const winnerMessage = document.getElementById("winnerMessage");
const restartButton = document.getElementById("restartButton");

let paddleWidth = 10, paddleHeight = 80;
let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 4, ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
let gameActive = true;

const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw scores
    ctx.font = "20px Arial";
    ctx.fillText("Speler 1: " + player1Score, 50, 30);
    ctx.fillText("Speler 2: " + player2Score, canvas.width - 150, 30);

    // Draw paddles
    ctx.fillStyle = "#333";
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight); // Player 1
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight); // Player 2

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

function update() {
    if (!gameActive) return; // Stop the update if the game is not active

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Reverse ball speed if it hits the top or bottom of the canvas
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Handle ball collision with paddles
    if (
        (ballX - ballRadius < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) ||
        (ballX + ballRadius > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;

        // Add a random factor to the ball's vertical speed
        let randomFactor = (Math.random() - 0.5) * 2; // Random value between -1 and 1
        ballSpeedY += randomFactor; // Add a bit of randomness to the Y speed

        // Limit ball's vertical speed so it doesn't get too slow or too fast
        if (Math.abs(ballSpeedY) < 2) {
            ballSpeedY = 2 * Math.sign(ballSpeedY); // Ensure a minimum speed in the Y direction
        }
        if (Math.abs(ballSpeedY) > 6) {
            ballSpeedY = 6 * Math.sign(ballSpeedY); // Cap the maximum speed in the Y direction
        }
    }

    // Reset the ball and update score if it goes out of bounds
    if (ballX + ballRadius < 0) {
        player2Score++; // Player 2 gets a point
        resetBall();
    }
    if (ballX - ballRadius > canvas.width) {
        player1Score++; // Player 1 gets a point
        resetBall();
    }

    // Check for winner
    if (player1Score >= 15 || player2Score >= 15) {
        endGame();
    }

    // Paddle movements
    if (keys.w && player1Y > 0) {
        player1Y -= 5; // Player 1 moves up
    }
    if (keys.s && player1Y < canvas.height - paddleHeight) {
        player1Y += 5; // Player 1 moves down
    }
    if (keys.ArrowUp && player2Y > 0) {
        player2Y -= 5; // Player 2 moves up
    }
    if (keys.ArrowDown && player2Y < canvas.height - paddleHeight) {
        player2Y += 5; // Player 2 moves down
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = Math.random() * (canvas.height - ballRadius * 2) + ballRadius; // Random Y position within bounds
    ballSpeedX = -ballSpeedX; // Reverse direction
}

function endGame() {
    gameActive = false; // Stop the game
    if (player1Score >= 15) {
        winnerMessage.textContent = "Speler 1 heeft gewonnen!";
    } else {
        winnerMessage.textContent = "Speler 2 heeft gewonnen!";
    }
    menu.classList.remove("hidden");
    cancelAnimationFrame(animationId);
}

function gameLoop() {
    draw();
    update();
    animationId = requestAnimationFrame(gameLoop);
}

// Handle key down events
document.addEventListener("keydown", function(event) {
    if (event.key === "w") keys.w = true; // Player 1 moves up
    if (event.key === "s") keys.s = true; // Player 1 moves down
    if (event.key === "ArrowUp") keys.ArrowUp = true; // Player 2 moves up
    if (event.key === "ArrowDown") keys.ArrowDown = true; // Player 2 moves down
});

// Handle key up events
document.addEventListener("keyup", function(event) {
    if (event.key === "w") keys.w = false; // Player 1 stops moving up
    if (event.key === "s") keys.s = false; // Player 1 stops moving down
    if (event.key === "ArrowUp") keys.ArrowUp = false; // Player 2 stops moving up
    if (event.key === "ArrowDown") keys.ArrowDown = false; // Player 2 stops moving down
});

// Restart the game
restartButton.addEventListener("click", function() {
    player1Score = 0;
    player2Score = 0;
    player1Y = (canvas.height - paddleHeight) / 2;
    player2Y = (canvas.height - paddleHeight) / 2;
    gameActive = true; // Set the game active again
    menu.classList.add("hidden");
    gameLoop();
});

// Start the game
let animationId;
gameLoop();
