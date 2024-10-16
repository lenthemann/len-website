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
let gameActive = true; // Spelstatus

// Toetsen status
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middenlijn
    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Scores tekenen
    ctx.font = "20px Arial";
    ctx.fillText("Speler 1: " + player1Score, 50, 30);
    ctx.fillText("Speler 2: " + player2Score, canvas.width - 150, 30);

    // Paddles tekenen
    ctx.fillStyle = "#333";
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight); // Speler 1
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight); // Speler 2

    // Bal tekenen
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
}

function update() {
    if (!gameActive) return; // Stop de update als het spel niet actief is

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Balsnelheid omkeren bij de boven- en onderkant van het canvas
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Bal afhandelen als hij een paddle raakt
    if (
        (ballX - ballRadius < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) ||
        (ballX + ballRadius > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Reset de bal en update score als hij buiten het canvas gaat
    if (ballX + ballRadius < 0) {
        player2Score++; // Speler 2 krijgt een punt
        resetBall();
    }
    if (ballX - ballRadius > canvas.width) {
        player1Score++; // Speler 1 krijgt een punt
        resetBall();
    }

    // Controleer op winnaar
    if (player1Score >= 15 || player2Score >= 15) {
        endGame();
    }

    // Paddle bewegingen
    if (keys.w && player1Y > 0) {
        player1Y -= 5; // Speler 1 omhoog
    }
    if (keys.s && player1Y < canvas.height - paddleHeight) {
        player1Y += 5; // Speler 1 omlaag
    }
    if (keys.ArrowUp && player2Y > 0) {
        player2Y -= 5; // Speler 2 omhoog
    }
    if (keys.ArrowDown && player2Y < canvas.height - paddleHeight) {
        player2Y += 5; // Speler 2 omlaag
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = Math.random() * (canvas.height - ballRadius * 2) + ballRadius; // Random Y position within bounds
    ballSpeedX = -ballSpeedX; // Omgekeerde richting
}

function endGame() {
    gameActive = false; // Stop het spel
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

// Toetsen indrukken en loslaten
document.addEventListener("keydown", function(event) {
    if (event.key === "w") keys.w = true; // Speler 1 omhoog
    if (event.key === "s") keys.s = true; // Speler 1 omlaag
    if (event.key === "ArrowUp") keys.ArrowUp = true; // Speler 2 omhoog
    if (event.key === "ArrowDown") keys.ArrowDown = true; // Speler 2 omlaag
});

document.addEventListener("keyup", function(event) {
    if (event.key === "w") keys.w = false; // Speler 1 omhoog
    if (event.key === "s") keys.s = false; // Speler 1 omlaag
    if (event.key === "ArrowUp") keys.ArrowUp = false; // Speler 2 omhoog
    if (event.key === "ArrowDown") keys.ArrowDown = false; // Speler 2 omlaag
});

// Herstart het spel
restartButton.addEventListener("click", function() {
    player1Score = 0;
    player2Score = 0;
    player1Y = (canvas.height - paddleHeight) / 2;
    player2Y = (canvas.height - paddleHeight) / 2;
    gameActive = true; // Zet het spel weer actief
    menu.classList.add("hidden");
    gameLoop();
});

// Start het spel
let animationId;
gameLoop();
