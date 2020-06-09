const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const scoreNew = document.getElementById("score-new");
const ctx = canvas.getContext("2d");

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 4,
  speed: 4,
  dx: 4,
  dy: -4,
};

// Paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 15,
  speed: 18,
  dx: 0,
};

// Brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// Add bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Add ball to the canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

// Add paddle to the canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "black" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function drawScore() {
  //   ctx.font = "20px Arial";
  //   ctx.fillText(`Score: ${score}`, canvas.width - 11100, 30);
}

// Paddle move
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //   Collision detection
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }
  // Collision with the paddle
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //   Collision with bricks
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  //   Bottom wall collision
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
    scoreNew.innerText = `Score:${score}`;
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

function increaseScore() {
  score++;
  scoreNew.innerText = `Score:${score}`;
  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

// Draw function
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle();
  drawBall();
  drawScore();
  drawBricks();
}

// Update animations
function update() {
  movePaddle();
  moveBall();

  // Draw
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "d" ||
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.key === "a"
  ) {
    paddle.dx = 0;
  }
}

// Keybinds
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Rules and close event handler
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
