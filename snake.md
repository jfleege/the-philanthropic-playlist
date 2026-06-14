---
layout: default
title: Secret
hide_feature: true
---

<section class="about-flow secret-game-flow">

  <div class="about-block align-left secret-game-card">
    <p class="about-kicker">You found the secret game...</p>
    <h2>Snake!</h2>
    <p>
      Use WASD to play. Collect the peach dots and avoid running into yourself.
    </p>

    <div class="snake-game-wrap">
      <canvas id="snakeGame" width="420" height="420"></canvas>

      <div class="snake-game-info">
        <p class="snake-score">Score: <span id="snakeScore">0</span></p>
        <button id="snakeRestart" class="snake-button">Restart</button>
      </div>
    </div>
  </div>

</section>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("snakeGame");
  const scoreEl = document.getElementById("snakeScore");
  const restartButton = document.getElementById("snakeRestart");

  if (!canvas || !scoreEl || !restartButton) return;

  const ctx = canvas.getContext("2d");
  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  let snake;
  let food;
  let dx;
  let dy;
  let nextDx;
  let nextDy;
  let score;
  let gameOver;
  let gameLoop;

  const colors = {
    background: "#fff7f2",
    snake: "#246783",
    snakeHead: "#17475f",
    food: "#f8bf72",
    grid: "rgba(36, 103, 131, 0.08)",
    text: "#17475f"
  };

  const resetGame = () => {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];

    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    score = 0;
    gameOver = false;
    scoreEl.textContent = score;

    placeFood();

    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, 115);
  };

  const placeFood = () => {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };

    const onSnake = snake.some((part) => part.x === food.x && part.y === food.y);

    if (onSnake) {
      placeFood();
    }
  };

  const drawRoundedSquare = (x, y, size, radius, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, radius);
    ctx.fill();
  };

  const drawGame = () => {
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;

    for (let i = 0; i <= tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }

    drawRoundedSquare(
      food.x * gridSize + 3,
      food.y * gridSize + 3,
      gridSize - 6,
      7,
      colors.food
    );

    snake.forEach((part, index) => {
      drawRoundedSquare(
        part.x * gridSize + 2,
        part.y * gridSize + 2,
        gridSize - 4,
        6,
        index === 0 ? colors.snakeHead : colors.snake
      );
    });

    if (gameOver) {
      ctx.fillStyle = "rgba(255, 247, 242, 0.82)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = colors.text;
      ctx.font = "900 38px Nunito, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 12);

      ctx.font = "800 18px Nunito, Arial, sans-serif";
      ctx.fillText("Click restart to play again", canvas.width / 2, canvas.height / 2 + 25);
    }
  };

  const updateGame = () => {
    dx = nextDx;
    dy = nextDy;

    const head = {
      x: snake[0].x + dx,
      y: snake[0].y + dy
    };

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= tileCount ||
      head.y >= tileCount ||
      snake.some((part) => part.x === head.x && part.y === head.y)
    ) {
      gameOver = true;
      clearInterval(gameLoop);
      drawGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 1;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }

    drawGame();
  };

  document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  const gameKeys = [
    "arrowup",
    "arrowdown",
    "arrowleft",
    "arrowright",
    "w",
    "a",
    "s",
    "d"
  ];

  if (gameKeys.includes(key)) {
    event.preventDefault();
  }

  if ((key === "arrowup" || key === "w") && dy !== 1) {
    nextDx = 0;
    nextDy = -1;
  }

  if ((key === "arrowdown" || key === "s") && dy !== -1) {
    nextDx = 0;
    nextDy = 1;
  }

  if ((key === "arrowleft" || key === "a") && dx !== 1) {
    nextDx = -1;
    nextDy = 0;
  }

  if ((key === "arrowright" || key === "d") && dx !== -1) {
    nextDx = 1;
    nextDy = 0;
  }
});

  restartButton.addEventListener("click", resetGame);

  resetGame();
});
</script>